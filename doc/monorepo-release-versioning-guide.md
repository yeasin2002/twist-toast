# Monorepo Versioning and Multi-Package Release Guide (twist-toast)

**Published:** February 27, 2026  
**Audience:** You (and future maintainers) building `twist-toast` as a Turborepo + pnpm monorepo with both publishable and private packages.

---

## Why this guide exists

You are building a monorepo where:

- Some packages are internal only.
- Some packages are published individually to npm.
- More framework adapters may be added later (`react`, `vue`, `angular`, `svelte`).

That requires a release system that handles:

- Mixed visibility (`private` + public packages).
- Dependency version updates between internal workspace packages.
- Changelogs and release notes.
- Safe CI/CD publishing.

This guide gives you:

- A full map of practical alternatives.
- The tradeoffs for each.
- A recommended approach for your current repo.
- Concrete setup patterns you can copy.

---

## Your current repo state (important context)

From your repo today:

- Monorepo with `pnpm` workspaces and `turbo`.
- Packages include `packages/core` and `packages/react`.
- `@twist-toast/core` is currently `"private": true`.
- `@twist-toast/react` is publish-oriented (`publishConfig.access: "public"`).

That is already a valid starting point for mixed publishability.

---

## First principles: decisions you must make once

Before choosing tooling, lock these policies:

1. **Package publishability policy**
   - Public package: must have `name`, `version`, `files`, `exports`, and usually `publishConfig.access`.
   - Internal-only package: set `"private": true`.

2. **Versioning policy**
   - Independent versioning: each package bumps separately.
   - Fixed/lockstep versioning: all (or a group of) packages share one version line.
   - Hybrid: independent by default, but selected packages stay in sync.

3. **Release source of truth**
   - Human-authored change files (Changesets, Rush, Beachball).
   - Commit-message driven automation (semantic-release, Auto).
   - PR-label/manifest automation (Release Please).

4. **Publish security policy**
   - Prefer trusted publishing (OIDC) where possible.
   - If using tokens, use automation tokens and scoped permissions.

---

## Major alternatives (as of February 2026)

This is the practical ecosystem map for JavaScript/TypeScript monorepo package releases.

| Tool | Versioning model | Publishes npm packages | Changelog generation | Monorepo ergonomics | Complexity |
| --- | --- | --- | --- | --- | --- |
| Changesets | Independent, fixed, linked, ignore | Yes | Yes | Excellent | Low-Medium |
| Lerna (`version` + `publish`) | Fixed or independent | Yes | Yes | Good | Medium |
| Nx Release | Independent or fixed; release groups | Yes | Yes | Excellent in Nx repos | Medium |
| Rush + change files | Lockstep + policies + groups | Yes | Yes | Enterprise-grade | High |
| Beachball | Change-file based | Yes | Yes | Good | Medium |
| semantic-release (+ monorepo plugin) | Commit-driven | Yes | Yes | Works, but plugin-based | Medium-High |
| Release Please | Versioning + release PR/tagging | No (by default) | Yes | Good with manifest mode | Medium |
| Intuit Auto | Commit/label-driven | Yes | Yes | Good | Medium |
| Manual scripts (`pnpm -r publish`) | Whatever you script | Yes | No (manual) | Basic | Low start, high maintenance |

---

## Recommendation for twist-toast

For your repo, the best default is:

- **`Changesets` + `pnpm` + GitHub Actions**
- Keep **independent versions** now.
- Use **linked/fixed groups later** if adapter packages must share versions.
- Keep internal tooling/config packages **`private: true`**.

Why this fits:

- Works naturally with Turborepo and pnpm.
- Designed for exactly your "some packages publish, some do not" case.
- Handles multiple npm packages from one monorepo cleanly.
- Easy to understand while still production-grade.

Turborepo documentation itself points to Changesets as the common path for library publishing.

---

## Deep dive on each alternative

### 1) Changesets (recommended baseline)

Best when:

- You want explicit, reviewable release intent.
- You have mixed private/public workspace packages.
- You want predictable version bumps and changelogs.

Key capabilities:

- `changeset add`, `changeset version`, `changeset publish`.
- Supports `fixed`, `linked`, `ignore`, and private package behaviors.
- Works with GitHub Action to create/update release PR and publish.

Tradeoffs:

- Requires contributors to add a changeset file for release-worthy changes.
- Slightly more process than pure commit-message automation.

### 2) Lerna

Best when:

- You prefer classic monorepo release workflows.
- You want `lerna version` + `lerna publish` orchestration.

Key capabilities:

- Independent or fixed mode.
- Can filter packages and manage release flow.

Tradeoffs:

- More moving parts than Changesets-only approach.
- Many teams now pair Lerna with other tooling, so the stack can grow quickly.

### 3) Nx Release

Best when:

- Your repo is already Nx-centric.
- You want release groups, independent/fixed modes, and first-class CI integration.

Key capabilities:

- Release groups.
- Independent releases.
- Versioning + changelog automation.

Tradeoffs:

- Most valuable when Nx is central; less compelling in a non-Nx Turborepo.

### 4) Rush

Best when:

- Very large enterprise monorepo.
- Strict policies, controlled branching, and deterministic release governance.

Key capabilities:

- Version policies.
- Change files and orchestrated publish flow.

Tradeoffs:

- Heavier mental model and setup overhead.
- Often overkill for early-stage library monorepos.

### 5) Beachball

Best when:

- You like change-file workflows (similar spirit to Changesets).
- You want a mature Microsoft-maintained option.

Tradeoffs:

- Smaller ecosystem mindshare than Changesets in OSS library monorepos.

### 6) semantic-release (+ monorepo plugin)

Best when:

- You want full commit-convention automation and zero manual change files.

Key capabilities:

- Automatically infers version bump from conventional commits.
- Creates releases and can publish to npm.

Tradeoffs:

- Monorepo support depends on plugins/integration strategy.
- Debugging release logic can be harder than explicit change files.

### 7) Release Please

Best when:

- You want Google-style release PR automation from commits/manifest.
- You are okay separating "version/tag/release notes" from npm publishing.

Key capability:

- Excellent release PR management in monorepos (manifest mode).

Important caveat:

- Release Please does **not** publish to npm by itself. You need a second step/tool.

### 8) Intuit Auto

Best when:

- You want automated release pipelines driven by labels/commits.

Tradeoffs:

- Adds another system to learn; less common than Changesets in pnpm+Turbo library repos.

### 9) Manual scripts only

Best when:

- Very small scope and low release frequency.

Tradeoffs:

- High long-term risk (missed changelogs, accidental version drift, human error).

---

## Version strategy: what to pick for your packages

For `@twist-toast/*`, start with:

- **Independent versioning**.

Why:

- `core`, `react`, and future adapters will likely evolve at different speeds.
- You avoid unnecessary bumps on untouched packages.

When to switch certain packages to shared versions:

- If adapter packages must always align with one API generation, use a linked/fixed group for those packages.

Practical hybrid pattern:

- Independent by default.
- Group only the packages that truly need synchronized versions.

---

## How to treat private vs publishable packages

### Internal-only package

Use:

```json
{
  "name": "@twist-toast/eslint-config",
  "version": "0.0.0",
  "private": true
}
```

### Publishable package

Use:

```json
{
  "name": "@twist-toast/react",
  "version": "0.1.0",
  "private": false,
  "publishConfig": {
    "access": "public"
  }
}
```

Notes:

- For scoped packages, `publishConfig.access` is commonly used to enforce public publish behavior.
- Keep root monorepo package `"private": true`.

---

## Dependency pinning strategy (what “pin versions” should mean)

Use three levels:

1. **Internal workspace dependencies**
   - Use `workspace:^` for publishable relationships.
   - Example: `@twist-toast/react` depends on `@twist-toast/core` as `"workspace:^"`.
   - pnpm converts workspace references to regular semver ranges when publishing.

2. **Shared direct third-party dependencies**
   - Use pnpm `catalog` in `pnpm-workspace.yaml`.
   - Reference with `"catalog:"` in package manifests.
   - This gives one source of truth across packages.

3. **Transitive hotfixes/security constraints**
   - Use pnpm `overrides` in `pnpm-workspace.yaml`.
   - This is for forcing dependency resolutions globally.

Example `pnpm-workspace.yaml` pattern:

```yaml
packages:
  - apps/*
  - packages/*
  - tooling/*

catalog:
  react: ^19.2.0
  react-dom: ^19.2.0
  typescript: ^5.9.3

overrides:
  minimist: ^1.2.8
```

---

## Recommended implementation plan (Changesets + pnpm)

### Step 1: Add Changesets

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

### Step 2: Configure `.changeset/config.json`

Example:

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
  "ignore": [
    "@twist-toast/eslint-config",
    "@twist-toast/typescript-config"
  ]
}
```

### Step 3: Add root scripts

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  }
}
```

### Step 4: Contributor workflow

For each change that should affect consumers:

1. Run `pnpm changeset`.
2. Select impacted package(s).
3. Pick bump type (`patch`, `minor`, `major`).
4. Write summary text for changelog.

### Step 5: CI release workflow (GitHub Actions)

Typical flow:

- On push to `main`, Changesets Action:
  - Opens/updates a release PR when pending changesets exist.
  - Publishes packages when release PR is merged and versioned.

Minimal pattern:

```yaml
name: Release

on:
  push:
    branches: [main]

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
      - uses: changesets/action@v1
        with:
          version: pnpm changeset version
          publish: pnpm changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Security note:

- Prefer npm trusted publishing (OIDC) when possible, then reduce token usage.

---

## Release channels and pre-releases

For experimental releases, use prerelease mode (for example `next`, `beta`, `rc`) before stable tags. This is useful for adapter packages where ecosystem compatibility may need testing first.

Pattern:

- Stable channel: `latest`.
- Prerelease channel: `next`.
- Promote to stable after validation.

---

## Common mistakes to avoid

- Publishing internal tooling packages by accident.
- Using `workspace:*` everywhere without thinking about consumer-facing semver behavior.
- No release notes discipline.
- Mixing multiple release tools at the same time without clear ownership.
- Skipping CI publish safeguards (lockfile install + deterministic build).

---

## Migration path if your needs change

Start here:

- Changesets + pnpm + GitHub Actions.

If monorepo becomes very large with strict governance:

- Evaluate Rush.

If repo becomes Nx-centric:

- Evaluate Nx Release.

If you want fully commit-driven automation:

- Evaluate semantic-release (and monorepo plugin strategy).

If you only want release PR orchestration and already have a publisher:

- Evaluate Release Please.

---

## Suggested policy for twist-toast (ready-to-adopt)

1. Keep root package private.
2. Mark non-publishable workspace packages `private: true`.
3. Publish only packages under `packages/*` that are intended for npm.
4. Use independent versioning now.
5. Use Changesets as the single release source of truth.
6. Use `workspace:^` for internal package relationships.
7. Use `catalog` for shared direct dependency version pinning.
8. Use `overrides` only for enforced transitive fixes.
9. Use CI-based publish, not local `pnpm publish` from developer machines.
10. Add prerelease channel for upcoming framework adapters.

---

## Sources

- Turborepo publishing guide: https://turborepo.com/docs/guides/publishing-libraries
- Changesets docs (intro/config):  
  https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md  
  https://github.com/changesets/changesets/blob/main/docs/config-file-options.md
- Changesets GitHub Action: https://github.com/changesets/action
- pnpm workspaces: https://pnpm.io/workspaces
- pnpm catalogs: https://pnpm.io/catalogs
- pnpm settings (overrides): https://pnpm.io/settings#overrides
- pnpm publish command: https://pnpm.io/cli/publish
- npm package.json docs (`private`, `publishConfig`, `workspaces`): https://docs.npmjs.com/cli/v11/configuring-npm/package-json
- npm trusted publishing (OIDC): https://docs.npmjs.com/trusted-publishers
- Lerna version and publish docs: https://lerna.js.org/docs/features/version-and-publish
- Nx release docs: https://nx.dev/docs/features/manage-releases
- Rush versioning/publishing docs: https://rushjs.io/pages/maintainer/version_policies/ and https://rushjs.io/pages/maintainer/publishing/
- Beachball docs: https://microsoft.github.io/beachball/
- semantic-release docs: https://semantic-release.gitbook.io/semantic-release
- semantic-release-monorepo plugin: https://github.com/pmowrer/semantic-release-monorepo
- Release Please docs: https://github.com/googleapis/release-please and https://github.com/googleapis/release-please-action

