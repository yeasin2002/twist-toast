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

### `packages/core`

Main deliverable - the core toast notification library:

- `createToast()` factory with full TypeScript inference
- `ToastProvider` component for React integration
- Queue management, deduplication, and lifecycle control
- Zero runtime dependencies beyond React
- Complete behavior management (state, timing, accessibility)

### `tooling/eslint-config`

Shared ESLint configurations:

- `@twist-toast/eslint-config/base` - Base rules
- `@twist-toast/eslint-config/next-js` - Next.js specific
- `@twist-toast/eslint-config/react-internal` - React library rules

### `tooling/typescript-config`

Shared TypeScript configurations:

- `base.json` - Base config with strict mode
- `nextjs.json` - Next.js specific
- `react-library.json` - React library specific

### `apps/www`

Documentation and landing page (Next.js):

- Product showcase and feature highlights
- API documentation and usage guides
- Interactive examples and demos

## Repository Layout

```text
twist-toast/
├── apps/
│   └── www/              # Documentation site
├── packages/
│   └── core/             # Main library
├── tooling/
│   ├── eslint-config/    # Shared linting
│   └── typescript-config/# Shared TS configs
├── tutorials/            # Guides and tutorials
├── AGENTS.md             # AI assistant guidance
└── .turbo/               # Turborepo cache
```

## Current Status

This repository is currently under active development.  
`packages/core` is the main deliverable containing the complete React toast library with TypeScript-first design.

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
pnpm --filter twist-toast build
pnpm --filter @twist-toast/www build
```

### Quality checks

```bash
pnpm lint
pnpm format
pnpm check-types
```

## Using Workspace Packages

```bash
# Add core library to your app
pnpm add twist-toast@workspace:*

# Add shared configs to packages
pnpm add -D @twist-toast/eslint-config@workspace:*
pnpm add -D @twist-toast/typescript-config@workspace:*
```

## Roadmap

- **Phase 1 (Current)**: React 17+ support with TypeScript generics, comprehensive testing, and npm publication
- **Phase 2**: CLI tooling for scaffolding and component generation
- **Phase 3+**: Multi-framework support (Vue, Angular, Svelte)

## Reference

- AI assistant guidance and project structure: `AGENTS.md`
- Tutorials and guides: `tutorials/`

## License

MIT
