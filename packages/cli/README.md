# @twist-toast/cli

CLI for `twist-toast`.

This package provides the user-facing command used to initialize `twist-toast` config and add toast components to a project.

## Commands

### `init`

Initialize `twist-toast` config for the current project.

Options:

- `-y, --yes`: Skip prompts and use defaults

Example:

```bash
twist-toast init
twist-toast init --yes
```

### `add [components...]`

Add one or more `twist-toast` components.

Options:

- `-a, --all`: Add all available components

Current scaffold component names:

- `toast-provider`
- `toast-root`
- `toast-title`
- `toast-description`
- `toast-action`
- `toast-close`
- `toast-viewport`

Examples:

```bash
twist-toast add toast-root toast-title
twist-toast add --all
```

## Current Status

The CLI currently includes the command structure and prompts. Project file generation and component installation logic will be added next.

## Local Development

From the repo root:

```bash
pnpm --filter @twist-toast/cli check-types
pnpm --filter @twist-toast/cli build
node packages/cli/dist/index.mjs --help
```
