# Building the Toast Manager (Functional Approach)

## Introduction

In tutorial 02, we built the manager with a class. In this version, we will build the same behavior using a **functional factory** (`createToastManager`) with closures and pure helper functions.

This style works very well for `twist-toast` because:

- We avoid `this` and class binding edge cases
- State transitions can stay small and testable
- We keep the core framework-agnostic for future adapters

The goal is the same: queue, timers, pause/resume, dedupe, dismissal, and subscriptions.

## State Model

We keep one ordered source of truth and derive active/queued toasts from it.

```typescript
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastRole = "alert" | "status";

export interface ToastInput {
  id?: string;
  variant: string;
  payload: Record<string, unknown>;
  duration: number;
  position: ToastPosition;
  dismissOnClick: boolean;
  role: ToastRole;
}

export interface ToastRecord extends Omit<ToastInput, "id" | "duration"> {
  id: string;
  duration: number;
  createdAt: number;
  remainingMs: number;
  paused: boolean;
}

export interface ToastState {
  all: ToastRecord[];
  active: ToastRecord[];
  queued: ToastRecord[];
}
```

Why store `remainingMs`?

- It makes pause/resume deterministic
- Timer math becomes independent from render timing
- Queued toasts can wait without losing time

## Manager API

```typescript
export interface CreateToastManagerOptions {
  maxToasts?: number;
  dedupe?: "ignore" | "refresh";
}

export interface ToastManager {
  add(input: ToastInput): string;
  dismiss(id: string): void;
  dismissAll(): void;
  pause(id: string): void;
  resume(id: string): void;
  subscribe(listener: (state: ToastState) => void): () => void;
  getState(): ToastState;
  destroy(): void;
}
```

This shape maps directly to later layers (`createToast` and `ToastProvider`).

## Internal Helpers (Pure Functions)

The manager keeps internal state in a closure. State transitions are handled by pure helpers.

```typescript
interface InternalState {
  order: string[];
  byId: Map<string, ToastRecord>;
}

function addToast(state: InternalState, toast: ToastRecord): InternalState {
  const byId = new Map(state.byId);
  byId.set(toast.id, toast);

  return {
    byId,
    order: [...state.order, toast.id],
  };
}

function removeToast(state: InternalState, id: string): InternalState {
  if (!state.byId.has(id)) {
    return state;
  }

  const byId = new Map(state.byId);
  byId.delete(id);

  return {
    byId,
    order: state.order.filter((item) => item !== id),
  };
}

function updateToast(
  state: InternalState,
  id: string,
  patch: Partial<ToastRecord>,
): InternalState {
  const toast = state.byId.get(id);
  if (!toast) {
    return state;
  }

  const byId = new Map(state.byId);
  byId.set(id, { ...toast, ...patch });

  return {
    byId,
    order: state.order,
  };
}

function toOrderedToasts(state: InternalState): ToastRecord[] {
  const toasts: ToastRecord[] = [];

  for (const id of state.order) {
    const toast = state.byId.get(id);
    if (toast) {
      toasts.push(toast);
    }
  }

  return toasts;
}

function buildSnapshot(state: InternalState, maxToasts: number): ToastState {
  const all = toOrderedToasts(state);

  return {
    all,
    active: all.slice(0, maxToasts),
    queued: all.slice(maxToasts),
  };
}

function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
```

## Functional Manager Implementation

```typescript
type TimerHandle = ReturnType<typeof setTimeout>;

interface TimerEntry {
  handle: TimerHandle;
  startedAt: number;
}

export function createToastManager(
  options: CreateToastManagerOptions = {},
): ToastManager {
  const maxToasts = Math.max(1, options.maxToasts ?? 5);
  const dedupe = options.dedupe ?? "ignore";

  let state: InternalState = {
    order: [],
    byId: new Map(),
  };

  const timers = new Map<string, TimerEntry>();
  const subscribers = new Set<(snapshot: ToastState) => void>();

  function getState(): ToastState {
    return buildSnapshot(state, maxToasts);
  }

  function notify(): void {
    const snapshot = getState();
    for (const subscriber of subscribers) {
      subscriber(snapshot);
    }
  }

  function clearTimer(id: string): void {
    const timer = timers.get(id);
    if (!timer) {
      return;
    }

    clearTimeout(timer.handle);
    timers.delete(id);
  }

  function syncTimers(): void {
    const { active } = getState();
    const activeIds = new Set(active.map((toast) => toast.id));

    for (const id of Array.from(timers.keys())) {
      const toast = state.byId.get(id);
      const shouldStop =
        !toast ||
        !activeIds.has(id) ||
        toast.paused ||
        toast.remainingMs <= 0 ||
        toast.duration <= 0;

      if (shouldStop) {
        clearTimer(id);
      }
    }

    for (const toast of active) {
      if (
        toast.paused ||
        toast.remainingMs <= 0 ||
        toast.duration <= 0 ||
        timers.has(toast.id)
      ) {
        continue;
      }

      const startedAt = Date.now();
      const handle = setTimeout(() => {
        dismiss(toast.id);
      }, toast.remainingMs);

      timers.set(toast.id, { handle, startedAt });
    }
  }

  function add(input: ToastInput): string {
    const id = input.id ?? generateToastId();
    const existing = state.byId.get(id);

    if (existing) {
      if (dedupe === "ignore") {
        return id;
      }

      clearTimer(id);
      state = removeToast(state, id);
    }

    const duration = Math.max(0, input.duration);

    const toast: ToastRecord = {
      ...input,
      id,
      duration,
      remainingMs: duration,
      createdAt: Date.now(),
      paused: false,
    };

    state = addToast(state, toast);
    syncTimers();
    notify();

    return id;
  }

  function dismiss(id: string): void {
    if (!state.byId.has(id)) {
      return;
    }

    clearTimer(id);
    state = removeToast(state, id);
    syncTimers();
    notify();
  }

  function dismissAll(): void {
    for (const id of Array.from(timers.keys())) {
      clearTimer(id);
    }

    state = {
      order: [],
      byId: new Map(),
    };

    notify();
  }

  function pause(id: string): void {
    const toast = state.byId.get(id);
    if (!toast || toast.paused || toast.duration <= 0) {
      return;
    }

    let remainingMs = toast.remainingMs;

    const timer = timers.get(id);
    if (timer) {
      const elapsed = Date.now() - timer.startedAt;
      remainingMs = Math.max(0, toast.remainingMs - elapsed);
      clearTimer(id);
    }

    state = updateToast(state, id, {
      paused: true,
      remainingMs,
    });

    syncTimers();
    notify();
  }

  function resume(id: string): void {
    const toast = state.byId.get(id);
    if (!toast || !toast.paused) {
      return;
    }

    state = updateToast(state, id, {
      paused: false,
    });

    syncTimers();
    notify();
  }

  function subscribe(listener: (snapshot: ToastState) => void): () => void {
    subscribers.add(listener);
    listener(getState());

    return () => {
      subscribers.delete(listener);
    };
  }

  function destroy(): void {
    for (const id of Array.from(timers.keys())) {
      clearTimer(id);
    }

    subscribers.clear();

    state = {
      order: [],
      byId: new Map(),
    };
  }

  return {
    add,
    dismiss,
    dismissAll,
    pause,
    resume,
    subscribe,
    getState,
    destroy,
  };
}
```

## Why `syncTimers()` Is the Important Part

Instead of starting/stopping timers in many places with duplicated logic, we centralize it in one function.

After **every state change**:

1. Stop timers that no longer should run (dismissed, queued, paused)
2. Start timers for active toasts that are eligible

This guarantees queue transitions are always correct:

- If an active toast is dismissed, the next queued toast becomes active and gets a timer
- If `maxToasts` is reached, queued toasts wait without counting down
- If paused, timer progress is preserved through `remainingMs`

## Dedupe Behavior

`dedupe: "ignore"`:

- If `id` already exists, manager keeps the current toast

`dedupe: "refresh"`:

- Existing toast with same `id` is replaced with a fresh one
- Useful for patterns like “upload in progress” toast updates

## Usage Example

```typescript
const manager = createToastManager({
  maxToasts: 3,
  dedupe: "refresh",
});

const unsubscribe = manager.subscribe((state) => {
  console.log("active", state.active.map((t) => t.id));
  console.log("queued", state.queued.map((t) => t.id));
});

const id = manager.add({
  variant: "success",
  payload: { title: "Saved" },
  duration: 4000,
  position: "top-right",
  dismissOnClick: true,
  role: "status",
});

manager.pause(id);
manager.resume(id);
manager.dismiss(id);
unsubscribe();
manager.destroy();
```

## Testing the Functional Manager

Because this is pure TypeScript, tests stay fast and deterministic.

```typescript
import { describe, expect, it, vi } from "vitest";
import { createToastManager } from "./toast-manager";

describe("createToastManager", () => {
  it("queues beyond maxToasts", () => {
    const manager = createToastManager({ maxToasts: 2 });

    manager.add({
      variant: "success",
      payload: {},
      duration: 0,
      position: "top-right",
      dismissOnClick: true,
      role: "status",
    });

    manager.add({
      variant: "success",
      payload: {},
      duration: 0,
      position: "top-right",
      dismissOnClick: true,
      role: "status",
    });

    manager.add({
      variant: "success",
      payload: {},
      duration: 0,
      position: "top-right",
      dismissOnClick: true,
      role: "status",
    });

    const state = manager.getState();
    expect(state.active).toHaveLength(2);
    expect(state.queued).toHaveLength(1);
  });

  it("pauses and resumes countdown", () => {
    vi.useFakeTimers();

    const manager = createToastManager();
    const id = manager.add({
      variant: "info",
      payload: { message: "hello" },
      duration: 1000,
      position: "top-right",
      dismissOnClick: true,
      role: "status",
    });

    vi.advanceTimersByTime(400);
    manager.pause(id);
    vi.advanceTimersByTime(2000);

    expect(manager.getState().all).toHaveLength(1);

    manager.resume(id);
    vi.advanceTimersByTime(600);

    expect(manager.getState().all).toHaveLength(0);

    vi.useRealTimers();
  });
});
```

## How This Fits the BRD Direction

This manager is still framework-agnostic and ready for the next steps in your BRD:

- `createToast(components)` will call this manager under the hood
- `ToastProvider` stays thin and only subscribes/renders
- Multiple isolated instances are natural (each `createToastManager()` call has isolated closure state)

## Next Steps

In tutorial 03, we will connect this manager to the `createToast()` factory so each variant method (`toast.success`, `toast.error`, etc.) is generated with full TypeScript inference from your component map.
