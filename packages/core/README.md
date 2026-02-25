# @twist-toast/core

Framework-agnostic toast behavior engine for `twist-toast`.

`@twist-toast/core` handles toast lifecycle and state only. It does not render UI.  
Adapter packages like `@twist-toast/react` consume this manager and decide how to render.

## Why Use Core Directly

Use `@twist-toast/core` when you want:

- a minimal, dependency-free toast state manager
- your own renderer (React, Vue, CLI, native shell, custom DOM layer)
- deterministic queue/timer logic shared across multiple UI adapters
- full control over toast component design and transitions

## Installation

```bash
pnpm add @twist-toast/core
```

## Quick Start

```ts
import { createToastManager } from "@twist-toast/core";

const manager = createToastManager({
  defaultDuration: 4000,
  defaultPosition: "top-right",
  maxToasts: 3,
  dedupe: "refresh",
  scope: "global",
});

const unsubscribe = manager.subscribe((snapshot) => {
  console.log("visible", snapshot.visible);
  console.log("queued", snapshot.queued);
});

const id = manager.trigger("success", { title: "Saved profile" });

manager.dismiss(id);
unsubscribe();
manager.destroy();
```

## Behavior Model

`@twist-toast/core` owns:

- queue management with `maxToasts`
- trigger and dismiss lifecycle
- dedupe strategy by toast `id` (`refresh` or `ignore`)
- timer state and pause/resume by `position`
- immutable snapshots for subscribers
- cleanup through `destroy()`

### Defaults

- `defaultDuration`: `4000`
- `defaultPosition`: `"top-right"`
- `maxToasts`: `5`
- `dedupe`: `"refresh"`
- `scope`: `"default"`
- per-toast `role`: `"status"`
- per-toast `dismissOnClick`: `false`

## API

### `createToastManager(options?)`

Creates an isolated manager instance.

```ts
type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

type ToastRole = "alert" | "status";
type ToastDeduplication = "refresh" | "ignore";

interface ToastCallOptions {
  id?: string;
  duration?: number;
  position?: ToastPosition;
  dismissOnClick?: boolean;
  role?: ToastRole;
}

interface CreateToastOptions {
  defaultDuration?: number;
  defaultPosition?: ToastPosition;
  maxToasts?: number;
  dedupe?: ToastDeduplication;
  scope?: string;
}
```

### Manager methods

- `trigger(variant, payload, options?) => string`
  - creates a toast and returns the final `id`
  - if duplicate `id` exists:
    - `dedupe: "ignore"` keeps existing toast
    - `dedupe: "refresh"` updates existing toast and resets its timer
- `dismiss(id)`
  - removes one toast from `visible` or `queued`
- `dismissAll()`
  - clears both visible and queued toasts
- `pauseByPosition(position)`
  - pauses visible toast timers for one position group
- `resumeByPosition(position)`
  - resumes paused timers for one position group
- `getSnapshot()`
  - returns `{ visible, queued }`
- `subscribe(listener) => unsubscribe`
  - emits immediately with current snapshot, then on every change
- `destroy()`
  - clears timers/state and removes subscriptions

## Core Use Cases

### 1) Build your own renderer adapter

Use `subscribe()` to connect manager state to any rendering layer.

```ts
const manager = createToastManager();

manager.subscribe(({ visible }) => {
  // map to UI framework state, store, or custom DOM update
  renderToastViewport(visible);
});
```

### 2) Job progress dedupe by stable ID

Use one `id` per domain event (`upload:42`, `sync:user:12`) and set `dedupe: "refresh"`:

```ts
const manager = createToastManager({ dedupe: "refresh" });

manager.trigger(
  "info",
  { message: "Uploading file..." },
  { id: "upload:42", duration: 10000 },
);
```

Each new trigger for `upload:42` updates the same toast instead of stacking duplicates.

### 3) Queue throttling for noisy systems

Keep UI calm in bursty flows by limiting visible toasts:

```ts
const manager = createToastManager({ maxToasts: 2 });
```

Extra triggers go to `queued` and are promoted automatically as visible toasts are dismissed.

### 4) Scope isolation in large apps

Create separate managers for `global`, `modal`, or `dashboard` contexts:

```ts
const globalToasts = createToastManager({ scope: "global" });
const modalToasts = createToastManager({ scope: "modal" });
```

This prevents cross-context noise and keeps lifecycle independent per UI zone.

## Notes

- `scope` is metadata on each toast record and is useful for adapter-level routing.
- `duration` is clamped to `>= 0`.
- `trigger()` accepts any `payload`; type-safe payload inference is added by adapter packages.

## Development

From workspace root:

```bash
pnpm --filter @twist-toast/core build
pnpm --filter @twist-toast/core lint
pnpm --filter @twist-toast/core check-types
```
