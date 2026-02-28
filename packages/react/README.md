# twist-toast

Design-system-first toast notifications for React.

This package provides complete toast notification functionality:

- `createToast()` for typed variant APIs with full TypeScript inference
- `ToastProvider` for rendering scoped toasts via portal
- Queue management, deduplication, and lifecycle control
- Zero runtime dependencies beyond React
- Full design control - you own every pixel of the UI

## Installation

```bash
npm install twist-toast
# or
pnpm add twist-toast
# or
yarn add twist-toast
```

## Usage

```tsx
import {
  createToast,
  ToastProvider,
  type ToastComponentProps,
} from "twist-toast";

type SuccessPayload = { title: string; description?: string };

function SuccessToast({
  title,
  description,
  dismiss,
}: ToastComponentProps<SuccessPayload>) {
  return (
    <article>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      <button onClick={dismiss}>Dismiss</button>
    </article>
  );
}

export const toast = createToast(
  { success: SuccessToast },
  { scope: "global", maxToasts: 5, defaultPosition: "top-right" },
);

export function App({ children }: { children: React.ReactNode }) {
  return <ToastProvider scope="global">{children}</ToastProvider>;
}
```

Triggering:

```ts
toast.success({ title: "Saved" });
toast.success(
  { title: "Syncing" },
  { id: "job-1", duration: 7000, dismissOnClick: true },
);
toast.dismiss("job-1");
toast.dismissAll();
```

## Features

- **Full Design Control**: Define your own toast components with complete styling freedom
- **TypeScript-First**: Automatic type inference from your component definitions
- **Zero Dependencies**: No runtime dependencies beyond React 17+
- **Queue Management**: Configurable max visible toasts with smart queuing
- **Deduplication**: Prevent duplicate toasts by ID
- **Flexible Positioning**: Per-toast or global position configuration
- **Accessibility**: Built-in ARIA roles and keyboard support
- **Multiple Scopes**: Isolated toast instances for different app sections

## Scope Rules

- Toast instances are created with one `scope` (`default` if omitted).
- A provider only renders toasts from the same scope.
- One provider per scope is the supported behavior.

## Motion Overrides

`ToastProvider` includes a default smooth enter transition at wrapper level.
You can override motion with CSS variables or selectors:

```css
/* Target all wrappers */
[data-twist-toast-item] {
  --twist-toast-enter-duration: 260ms;
  --twist-toast-enter-easing: cubic-bezier(0.16, 1, 0.3, 1);
  --twist-toast-enter-scale: 0.96;
}

/* Optional global directional override */
:root {
  --twist-toast-enter-distance: 14px;
}
```

Available variables:

- `--twist-toast-enter-duration`
- `--twist-toast-enter-easing`
- `--twist-toast-enter-scale`
- `--twist-toast-enter-distance`
- `--twist-toast-transition-duration`
- `--twist-toast-transition-easing`

## API Reference

### `createToast(components, options?)`

Creates a typed toast instance with methods for each variant.

**Parameters:**

- `components`: Object mapping variant names to React components
- `options`: Optional configuration
  - `scope`: String identifier for this toast instance (default: `"default"`)
  - `maxToasts`: Maximum visible toasts (default: `5`)
  - `defaultPosition`: Default position for toasts (default: `"top-right"`)
  - `defaultDuration`: Default duration in ms (default: `4000`)

**Returns:** Toast instance with methods for each variant plus `dismiss()` and `dismissAll()`

### `<ToastProvider>`

Renders toasts for a specific scope.

**Props:**

- `scope`: String matching the scope from `createToast()` (default: `"default"`)
- `children`: React children to wrap

### `ToastComponentProps<TPayload>`

Props passed to your toast components:

- `...payload`: Spread of your payload properties
- `dismiss`: Function to dismiss this toast
- `id`: Unique toast identifier
- `position`: Current position of this toast

## Development

### Build

```bash
pnpm --filter twist-toast build
pnpm --filter twist-toast check-types
```

### Watch Mode

```bash
pnpm --filter twist-toast dev
```

## Requirements

- React 17+
- TypeScript 5+ (for best type inference)

## License

MIT

## Build
