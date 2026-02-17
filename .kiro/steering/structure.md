# Project Structure

## Monorepo Layout

```
twist-toast/
├── example/           # example use of this library
├── packages/           # Workspace packages
│   ├── twist-toast/   # Core library (main deliverable)
│   ├── eslint-config/ # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
├── .kiro/             # Kiro IDE configuration
│   └── steering/      # AI assistant guidance documents
├── .turbo/            # Turborepo cache and daemon logs
└── node_modules/      # Shared dependencies
```

## Package Organization

### twist-toast (Core Library)

```
packages/twist-toast/
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

- `@repo/eslint-config/base` - Base rules
- `@repo/eslint-config/next-js` - Next.js specific
- `@repo/eslint-config/react-internal` - React library rules

### typescript-config

Shared TypeScript configurations:

- `base.json` - Base config with strict mode
- `nextjs.json` - Next.js specific
- `react-library.json` - React library specific

## Naming Conventions

- **Packages**: kebab-case (`twist-toast`, `eslint-config`)
- **Internal packages**: `@repo/` scope for shared configs
- **Files**: kebab-case for configs, PascalCase for React components
- **Exports**: Named exports preferred, default exports for components

## Workspace Dependencies

Packages reference shared configs via workspace protocol:

```json
"@repo/eslint-config": "workspace:*"
"@repo/typescript-config": "workspace:*"
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
