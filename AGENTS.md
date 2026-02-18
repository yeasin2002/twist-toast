<!-- Product -->
# 1. Product Overview

twist-toast is a React toast notification library that solves design lock-in by letting developers own every pixel of the UI while the library manages behavior.

## Core Value Proposition

- Developers define their own toast components with full design control
- Library handles state management, queuing, timing, and accessibility
- Zero runtime dependencies beyond React
- TypeScript-first with full type inference from component definitions

## Key Features

- `createToast()` factory pattern for typed toast instances
- Zero-config `<ToastProvider>` wrapper
- Queue management with configurable limits
- Deduplication and programmatic dismissal
- Pause on hover, keyboard accessible
- Support for custom variants (success, error, warning, info, custom)
- Multiple isolated toast instances per app

## Target Users

- React developers who need toast notifications aligned with their design system
- Design system teams requiring brand consistency
- Teams that want minimal integration overhead (install → configure → use in under 5 minutes)

## Phase 1 Scope

React 17+ support with TypeScript generics, comprehensive testing, and npm publication. Future phases will add CLI tooling and multi-framework support.




<!-- Structure -->
# 2. Project Structure

## Monorepo Layout

```
twist-toast/
├── example/           # example use of this library (Not available now, will be added in future after core library is ready)
├── packages/           # Workspace packages
│   ├── core/   # Core library (main deliverable)
│   ├── react/ # React-specific utilities or providers (if needed in future)
│   ├── [others] # in future I will add other framework specific packages like Vue, Angular, Svelte, etc. support, (If needed). not now. 
│
├── tooling/           # Workspace tooling packages
│   ├── eslint-config/ # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
├── AGENTS.md/             # shared AI assistant guidance documents/Rules
├── tutorials/             # Guides and tutorials for building and  using the library
├── .turbo/            # Turborepo cache and daemon logs
```

## Package Organization

### twist-toast (Core Library- initially, will be changed based on project needs  )

```
packages/core/
├── src/
│   └── index.ts       # Main entry point
├── dist/              # Build output (generated)
├── package.json       # Package manifest
├── tsdown.config.ts   # Build configuration
└── README.md
```

**Conventions**:

- Source files in `src/`
- Single entry point at `src/index.ts`
- Build outputs to `dist/` (gitignored)
- ESM-first with `.mjs` extensions

### eslint-config

Shared ESLint configurations exported as:

- `@twist-toast/eslint-config/base` - Base rules
- `@twist-toast/eslint-config/next-js` - Next.js specific
- `@twist-toast/eslint-config/react-internal` - React library rules

### typescript-config

Shared TypeScript configurations:

- `base.json` - Base config with strict mode
- `nextjs.json` - Next.js specific
- `react-library.json` - React library specific

## Naming Conventions

- **Packages**: kebab-case (`twist-toast`, `eslint-config`)
- **Internal packages**: `@twist-toast/` scope for shared configs
- **Files**: kebab-case for configs, PascalCase for React components
- **Exports**: Named exports preferred, default exports for components

## Workspace Dependencies

Packages reference shared configs via workspace protocol:

```json
"@twist-toast/eslint-config": "workspace:*"
"@twist-toast/typescript-config": "workspace:*"
```

## Build Artifacts

- All packages output to `dist/` directory
- Turborepo caches builds in `.turbo/cache/`
- Type declarations co-located with build outputs
- Source maps generated for debugging

## Configuration Files

- **Root level**: Workspace-wide settings (turbo.json, pnpm-workspace.yaml)
- **Package level**: Package-specific configs (tsconfig.json, package.json)
- **Shared configs**: Centralized in config packages for reuse

<!-- tech -->
# 3. Tech Stack

## Build System

- **Monorepo Manager**: Turborepo with pnpm workspaces
- **Package Manager**: pnpm 10.29.2
- **Node Version**: ≥18

## Core Library (twist-toast)

- **Build Tool**: tsdown (TypeScript bundler)
- **Language**: TypeScript 5.9.2 (strict mode)
- **Framework**: React 17+ (peer dependency)
- **Module Formats**: ESM (primary), CJS (compatibility)
- **Bundle Target**: ≤5 KB gzipped, tree-shakeable

## Shared Packages

- **ESLint Config** (`@twist-toast/eslint-config`): Shared linting rules with TypeScript ESLint, React, and Prettier integration
- **TypeScript Config** (`@twist-toast/typescript-config`): Base configs for NodeNext module resolution, strict mode, ES2022 target

## Development Tools

- **Linting**: ESLint 9 with typescript-eslint, react-hooks, and prettier
- **Formatting**: Prettier 3.7.4
- **Type Checking**: TypeScript compiler

## Common Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode (watch)
pnpm dev

# Lint all packages
pnpm lint

# Format code
pnpm format

# Type check all packages
pnpm check-types
```

## Package-Specific Commands

```bash
# Build twist-toast
cd packages/core && pnpm build

# Watch mode for twist-toast
cd packages/core && pnpm dev
```

## TypeScript Configuration

- Module system: NodeNext (ESM-first)
- Target: ES2022
- Strict mode enabled with `noUncheckedIndexedAccess`
- Declaration files generated for all packages

## Build Outputs

- **ESM**: `dist/index.mjs` (primary)
- **Types**: `dist/index.d.mts`
- All packages output to `dist/` directory
