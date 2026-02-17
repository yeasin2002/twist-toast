# Tech Stack

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

- **ESLint Config** (`@repo/eslint-config`): Shared linting rules with TypeScript ESLint, React, and Prettier integration
- **TypeScript Config** (`@repo/typescript-config`): Base configs for NodeNext module resolution, strict mode, ES2022 target

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
cd packages/twist-toast && pnpm build

# Watch mode for twist-toast
cd packages/twist-toast && pnpm dev
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
