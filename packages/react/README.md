# @twist-toast/react

React adapter for `@twist-toast/core`.

This package provides:

- `createToast()` for typed variant APIs
- `ToastProvider` for rendering scoped toasts via portal
- React-facing types (`ToastComponentProps`, `ToastInstance`, etc.)

## Usage

```tsx
import {
  createToast,
  ToastProvider,
  type ToastComponentProps,
} from "@twist-toast/react";

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

## Build

```bash
pnpm --filter @twist-toast/react build
pnpm --filter @twist-toast/react check-types
```
