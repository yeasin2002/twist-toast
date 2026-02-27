# Changesets + pnpm Operations Guide

**Published:** February 27, 2026  
**Scope:** Practical maintainer guide for versioning, git tags, and releases for a multi-package monorepo.

---

## 1. Goal and Operating Model

You selected **Changesets + pnpm** for a monorepo where:

- Some packages are published to npm.
- Some packages stay internal (`"private": true`).
- Versions may evolve independently per package.

This guide defines how to:

- Maintain multiple package versions safely.
- Create and manage GitHub tags/releases.
- Publish from CI with predictable, auditable behavior.

---

## 2. Architecture: Who Does What

- **Changesets**: decides version bumps and writes changelogs.
- **pnpm**: installs/builds/publishes packages in workspace context.
- **GitHub Actions**: automates release PR + publish flow.
- **npm registry**: source of truth for published versions and dist-tags.

Rule of thumb:

- `changeset add` during feature work.
- `changeset version` when preparing release commit/PR.
- `changeset publish` in CI on main.

---

## 3. Versioning Strategy for Multiple Packages

### Default strategy

Use **independent versioning**:

- `@twist-toast/core` and `@twist-toast/react` bump only when needed.
- Future `@twist-toast/vue` can release on its own timeline.

### When to sync versions

Use Changesets config groups only when necessary:

- `fixed`: bump/publish selected packages together.
- `linked`: keep selected packages on the same version line.

These are monorepo options in `.changeset/config.json`.

---

## 4. Required Baseline Setup

Install and initialize:

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

Add root scripts:

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  }
}
```

Recommended `.changeset/config.json` baseline:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "privatePackages": {
    "version": true,
    "tag": false
  }
}
```

Notes:

- Keep true internal packages as `"private": true` in each `package.json`.
- `ignore` is for temporary skip behavior, not permanent package privacy.

---

## 5. Day-to-Day Workflow

### Step A: Contributor adds a changeset

```bash
pnpm changeset
```

This creates `.changeset/*.md` with:

- package(s) impacted
- bump type (`patch`/`minor`/`major`)
- human changelog summary

### Step B: Merge normal feature PRs

Feature PRs contain code + changeset files.

### Step C: Release PR is created/updated automatically

Release workflow on `main` runs Changesets Action:

- If unreleased changesets exist, action opens/updates release PR.
- Release PR applies `changeset version` output (versions + changelogs).

### Step D: Merge release PR

After merge:

- workflow runs again
- now no pending changesets remain
- publish step runs `changeset publish`

---

## 6. Git Tags and GitHub Releases (Important)

### Tag format in multi-package monorepos

For non-root multi-package repos, Changesets creates tags as:

- `@scope/package@x.y.z`

Inference from Changesets CLI source:

- Tag command and publish command both construct tags as `${name}@${newVersion}` for non-root mode.
- In root/single-package mode, it uses `v${version}`.

### GitHub Releases behavior

With `changesets/action`, `createGithubReleases` defaults to `true`.

Result:

- Published packages can also get GitHub Releases generated from release metadata.

### Practical implication

In your repo, expect tags like:

- `@twist-toast/react@0.1.0`
- later `@twist-toast/core@0.2.0` independently

This is exactly how you maintain multiple package versions without a lockstep global tag.

---

## 7. CI Workflow (Recommended)

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

permissions:
  contents: write
  pull-requests: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: https://registry.npmjs.org

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Create Release PR or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          version: pnpm changeset version
          publish: pnpm changeset publish
          createGithubReleases: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Optional post-step:

```yaml
- name: Print published packages
  if: steps.changesets.outputs.published == 'true'
  run: echo '${{ steps.changesets.outputs.publishedPackages }}'
```

---

## 8. Dist-Tags and Release Channels

Default publish tag is `latest`.

For prereleases, use Changesets pre mode:

```bash
pnpm changeset pre enter next
# ... add/merge changesets
pnpm changeset version
pnpm changeset publish
pnpm changeset pre exit
```

Details:

- In pre mode, publish uses pre tag behavior.
- Changesets blocks custom `--tag` override while in pre mode.

---

## 9. Internal Dependency Version Maintenance

For workspace package relations:

- use `workspace:^` for internal deps where possible.

Changesets config:

- `updateInternalDependencies: "patch"` updates dependent ranges more aggressively.
- `"minor"` updates ranges less frequently.

Use `patch` if you want consumers to pull newer internal versions quickly.
Use `minor` if you want looser coupling and easier dedup for consumers.

---

## 10. Catalog + Release Compatibility

Your repo already uses pnpm catalog references.

Publishing compatibility:

- pnpm replaces `catalog:` ranges at publish/pack time.
- pnpm also replaces `workspace:` protocol ranges on publish.

So external consumers get normal semver ranges, not pnpm-specific protocols.

---

## 11. Security Model for Publishing

Preferred:

- npm **trusted publishing** (OIDC) from GitHub Actions.

If token-based publishing:

- use granular automation token (`NPM_TOKEN`).
- keep least privilege.
- rotate/revoke as needed.

Baseline workflow permission required for OIDC:

- `id-token: write`

---

## 12. Maintenance Checklist Per Release

1. Ensure each user-facing PR has a valid changeset.
2. Confirm release PR bump types are correct.
3. Review generated changelog entries.
4. Verify private packages are not unintentionally publishable.
5. Merge release PR.
6. Confirm workflow published expected packages.
7. Validate npm dist-tags (`latest` or prerelease tag).
8. Verify Git tags exist for published packages.
9. Verify GitHub Releases (if enabled).

---

## 13. Common Failure Cases and Fixes

### A) “No unpublished projects to publish”

Cause:

- release PR merged but versions were already published, or no effective bump remained.

Check:

- npm package version already exists?
- accidental re-run?

### B) Publish blocked by ignored package mixed in changeset

Cause:

- a single changeset references both ignored and non-ignored packages.

Fix:

- split changesets or remove temporary ignore entry.

### C) Tag exists but npm publish failed

Cause:

- partial publish/tag race or manual rerun issues.

Fix:

- inspect workflow logs and npm registry state first.
- avoid force-retagging unless absolutely necessary.

### D) Pre mode confusion

Cause:

- still in pre mode while trying to do normal stable release.

Fix:

```bash
pnpm changeset pre exit
```

---

## 14. Manual Commands (Emergency/Local Only)

Use locally only if CI is unavailable:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm changeset version
pnpm changeset publish
```

For OTP-based npm accounts:

```bash
pnpm changeset publish --otp=<code>
```

For non-default dist-tag:

```bash
pnpm changeset publish --tag next
```

Avoid regular local publish from developer machines in normal operations.

---

## 15. Recommended Team Policy (Short Form)

1. Every consumer-facing change includes a changeset.
2. Only CI publishes packages.
3. Keep internal-only packages `private: true`.
4. Use independent versioning by default.
5. Use `fixed`/`linked` only for intentional coupling.
6. Prefer OIDC trusted publishing over long-lived tokens.
7. Treat release PR review as mandatory quality gate.

---

## Sources

- Changesets intro: https://raw.githubusercontent.com/changesets/changesets/main/docs/intro-to-using-changesets.md
- Changesets CLI options: https://raw.githubusercontent.com/changesets/changesets/main/docs/command-line-options.md
- Changesets config options: https://raw.githubusercontent.com/changesets/changesets/main/docs/config-file-options.md
- Changesets Action README: https://github.com/changesets/action
- Changesets tag command source (tag format behavior): https://raw.githubusercontent.com/changesets/changesets/main/packages/cli/src/commands/tag/index.ts
- Changesets publish command source (tag creation and pre-tag behavior): https://raw.githubusercontent.com/changesets/changesets/main/packages/cli/src/commands/publish/index.ts
- pnpm catalogs: https://pnpm.io/catalogs
- pnpm workspaces: https://pnpm.io/workspaces
- pnpm publish command: https://pnpm.io/cli/publish
- GitHub releases docs: https://docs.github.com/github/administering-a-repository/managing-releases-in-a-repository
- npm trusted publishing: https://docs.npmjs.com/trusted-publishers

