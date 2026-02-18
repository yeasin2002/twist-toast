# @twist-toast/react

React adapter package for the twist-toast project.

This package should contain React-specific integration such as providers, hooks, and rendering utilities that sit on top of `@twist-toast/core`.

## Scope

- React-only code
- UI integration layer for the core package
- Should not duplicate framework-agnostic business logic from `@twist-toast/core`

## Current Status

The package is currently scaffolded and exports a sample component.

### Current Export

```tsx
import { MyButton } from "@twist-toast/react";

export function App() {
  return <MyButton type="primary" />;
}
```

## Peer Dependencies

- `react`
- `react-dom`

## Build

From repository root:

```bash
pnpm --filter @twist-toast/react build
```

Watch mode:

```bash
pnpm --filter @twist-toast/react dev
```

## Notes

As the project evolves, this package should become the official React integration layer for twist-toast, while relying on `@twist-toast/core` for toast behavior/state logic.
