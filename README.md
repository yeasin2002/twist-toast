# twist-toast

Design-system-first toast notifications.

`twist-toast` is an open-source library focused on one principle: you own every pixel of the toast UI, while the library manages behavior (state, queueing, timing, lifecycle, and accessibility).

## Why twist-toast

Most toast libraries bundle UI opinions that are hard to align with product design systems.  
`twist-toast` separates concerns:

- Your components define presentation
- The library handles behavior and orchestration
- TypeScript infers payload types from your component map

## Product Direction

The primary integration model is:

1. Define your toast components
2. Call `createToast(components, options?)`
3. Use a zero-config `<ToastProvider>` in your app root

This keeps configuration close to your component definitions and gives strongly typed `toast.success(...)`, `toast.error(...)`, and custom variant methods.

## Target Capabilities (Phase 1)

- `createToast()` factory with type inference
- Queue management with configurable max visible toasts
- Deduplication by toast `id` (ignore/refresh behavior)
- Programmatic dismissal: `dismiss(id)` and `dismissAll()`
- Per-toast options: `duration`, `position`, `dismissOnClick`, `id`, `role`
- Accessibility defaults (`alert`/`status`, non-focus-stealing behavior)
- Multiple isolated toast instances in a single app

## Monorepo Packages

### `@twist-toast/core`

Framework-agnostic core logic:

- state machine and queue orchestration
- timer lifecycle and dismissal flow
- dedupe behavior and internal events
- shared types used by adapters

### `@twist-toast/react`

React adapter layer:

- provider/context wiring
- portal-based rendering
- React-facing APIs built on top of `@twist-toast/core`

## Repository Layout

```text
twist-toast/
├── packages/
│   ├── core/
│   └── react/
├── examples/
├── tooling/
└── PROJECT-BRD.md
```

## Current Status

This repository is currently under active development.  
`@twist-toast/core` and `@twist-toast/react` are scaffolded and being implemented toward the BRD goals.

## Local Development

### Requirements

- Node.js 18+
- pnpm 10+

### Install

```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Package-specific build

```bash
pnpm --filter @twist-toast/core build
pnpm --filter @twist-toast/react build
```

### Quality checks

```bash
pnpm lint
pnpm format
pnpm check-types
```

## Using Workspace Packages in Examples

```bash
pnpm --filter ./examples/vite-react add @twist-toast/core@workspace:*
pnpm --filter ./examples/vite-react add @twist-toast/react@workspace:*
```

## Roadmap

- **Phase 1 (v1.0 target)**: core manager, typed `createToast()`, React provider, test suite, npm-ready docs
- **Phase 2**: CLI scaffolding support
- **Phase 3+**: additional framework adapters (Vue/Svelte) and plugin-style extension points

## Reference

- Business requirements and architecture intent: `PROJECT-BRD.md`

## License

MIT
