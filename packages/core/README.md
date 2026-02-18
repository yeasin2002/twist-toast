# @twist-toast/core

Framework-agnostic core primitives for the twist-toast project.

This package is the non-React foundation layer. It should contain pure toast logic (state, queueing, timers, dedupe, lifecycle) that other adapters can build on.

## Scope

- No React-specific code
- Core logic and shared types only
- Intended to be consumed by framework adapters (for example `@twist-toast/react`)

## Current Status

The package is in early scaffold stage.

### Current Export

```ts
import { fn } from "@twist-toast/core";

console.log(fn()); // "Hello, tsdown!"
```

## Build

From repository root:

```bash
pnpm --filter @twist-toast/core build
```

Watch mode:

```bash
pnpm --filter @twist-toast/core dev
```

## Notes

When the toast manager is implemented, this package should remain framework-agnostic and expose reusable core APIs for adapters.
