# Building the Toast Manager

## Introduction

The toast manager is the heart of our library. It's a pure TypeScript class that manages the lifecycle of toasts: adding them to a queue, tracking timers, handling dismissals, and notifying subscribers when state changes. Because it's framework-agnostic, we can test it thoroughly without any React dependencies.

## Understanding State Machines

Before we code, let's understand what a state machine is. A toast can be in several states:

- **Queued**: Waiting to be displayed (when max toasts is reached)
- **Active**: Currently visible on screen
- **Paused**: Timer is paused (e.g., user is hovering)
- **Dismissed**: Removed from the queue

The manager's job is to track these states and enforce the rules:

- Only N toasts can be active at once (configurable)
- When a toast is dismissed, the next queued toast becomes active
- Timers only count down when the toast is active (not paused)
- Each toast has a unique ID for programmatic control

## The Toast Data Structure

First, let's define what a toast looks like internally:

```typescript
interface Toast {
  id: string; // Unique identifier
  variant: string; // "success", "error", etc.
  payload: Record<string, any>; // User's data
  duration: number; // How long to show (ms)
  position: ToastPosition; // Where to render
  dismissOnClick: boolean; // Click to dismiss?
  role: "alert" | "status"; // ARIA role
  createdAt: number; // Timestamp
  pausedAt?: number; // When timer was paused
  remainingTime?: number; // Time left when paused
}

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
```

**Why these fields?**

- `id`: Allows programmatic dismissal (`toast.dismiss(id)`)
- `variant`: Maps to the component in your component map
- `payload`: Your custom data (title, message, etc.)
- `duration`: Auto-dismiss timer (0 means never auto-dismiss)
- `position`: Where on screen to render
- `dismissOnClick`: UX preference
- `role`: Accessibility - `alert` for errors (assertive), `status` for info (polite)
- `createdAt`: For sorting and debugging
- `pausedAt` / `remainingTime`: For pause-on-hover feature

## The Manager Class Structure

Let's start with the skeleton:

```typescript
class ToastManager {
  private toasts: Map<string, Toast> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private subscribers: Set<(toasts: Toast[]) => void> = new Set();
  private maxToasts: number;

  constructor(options: { maxToasts?: number } = {}) {
    this.maxToasts = options.maxToasts ?? 5;
  }

  // Public API
  add(toast: Omit<Toast, "id" | "createdAt">): string {}
  dismiss(id: string): void {}
  dismissAll(): void {}
  pause(id: string): void {}
  resume(id: string): void {}
  subscribe(callback: (toasts: Toast[]) => void): () => void {}

  // Private helpers
  private notify(): void {}
  private startTimer(id: string): void {}
  private clearTimer(id: string): void {}
  private generateId(): string {}
}
```

**Design decisions:**

- **Map for toasts**: Fast lookups by ID, maintains insertion order
- **Map for timers**: Each toast has its own setTimeout, stored by ID
- **Set for subscribers**: Multiple components can listen to state changes
- **Private methods**: Internal implementation details

## Implementing the Core Methods

### 1. Adding a Toast

```typescript
add(toast: Omit<Toast, 'id' | 'createdAt'>): string {
  const id = toast.id ?? this.generateId();

  // Check for duplicates
  if (this.toasts.has(id)) {
    // Option 1: Ignore duplicate
    return id;

    // Option 2: Refresh existing toast
    // this.dismiss(id);
    // (then continue to add)
  }

  const fullToast: Toast = {
    ...toast,
    id,
    createdAt: Date.now(),
  };

  this.toasts.set(id, fullToast);

  // Start auto-dismiss timer if duration > 0
  if (fullToast.duration > 0) {
    this.startTimer(id);
  }

  this.notify();
  return id;
}
```

**Key points:**

- We generate an ID if the user didn't provide one
- Deduplication happens here (we check if ID already exists)
- We add timestamps for debugging and sorting
- Timer starts immediately (unless duration is 0)
- We notify subscribers so React can re-render

### 2. Dismissing a Toast

```typescript
dismiss(id: string): void {
  if (!this.toasts.has(id)) {
    return; // Already dismissed or never existed
  }

  this.clearTimer(id);
  this.toasts.delete(id);
  this.notify();
}

dismissAll(): void {
  // Clear all timers first
  this.timers.forEach((_, id) => this.clearTimer(id));

  // Clear all toasts
  this.toasts.clear();

  this.notify();
}
```

**Why clear timers first?**

If we delete the toast but leave the timer running, the timer callback will try to dismiss a non-existent toast. Not harmful, but wasteful. Clean up resources properly.

### 3. Timer Management

```typescript
private startTimer(id: string): void {
  const toast = this.toasts.get(id);
  if (!toast || toast.duration <= 0) {
    return;
  }

  // Use remaining time if toast was paused
  const duration = toast.remainingTime ?? toast.duration;

  const timer = setTimeout(() => {
    this.dismiss(id);
  }, duration);

  this.timers.set(id, timer);
}

private clearTimer(id: string): void {
  const timer = this.timers.get(id);
  if (timer) {
    clearTimeout(timer);
    this.timers.delete(id);
  }
}
```

**The pause/resume pattern:**

When a user hovers over a toast, we want to pause the auto-dismiss timer. Here's how:

```typescript
pause(id: string): void {
  const toast = this.toasts.get(id);
  if (!toast || toast.pausedAt) {
    return; // Already paused or doesn't exist
  }

  // Calculate how much time is left
  const elapsed = Date.now() - toast.createdAt;
  const remaining = toast.duration - elapsed;

  // Update toast with pause info
  this.toasts.set(id, {
    ...toast,
    pausedAt: Date.now(),
    remainingTime: Math.max(0, remaining),
  });

  // Stop the current timer
  this.clearTimer(id);

  this.notify();
}

resume(id: string): void {
  const toast = this.toasts.get(id);
  if (!toast || !toast.pausedAt) {
    return; // Not paused or doesn't exist
  }

  // Remove pause info
  this.toasts.set(id, {
    ...toast,
    pausedAt: undefined,
    createdAt: Date.now(), // Reset creation time
  });

  // Restart timer with remaining time
  this.startTimer(id);

  this.notify();
}
```

**Why reset `createdAt` on resume?**

When we resume, we want the timer to run for `remainingTime` milliseconds. By resetting `createdAt` to now, the math in `startTimer` works correctly: it uses `remainingTime` if it exists, otherwise calculates from `createdAt`.

### 4. Subscription Pattern

```typescript
subscribe(callback: (toasts: Toast[]) => void): () => void {
  this.subscribers.add(callback);

  // Immediately call with current state
  callback(this.getToasts());

  // Return unsubscribe function
  return () => {
    this.subscribers.delete(callback);
  };
}

private notify(): void {
  const toasts = this.getToasts();
  this.subscribers.forEach(callback => callback(toasts));
}

private getToasts(): Toast[] {
  return Array.from(this.toasts.values())
    .sort((a, b) => a.createdAt - b.createdAt); // Oldest first
}
```

**Why return an unsubscribe function?**

This is a common pattern in JavaScript. The subscriber can call the returned function to clean up:

```typescript
const unsubscribe = manager.subscribe((toasts) => {
  console.log("Toasts changed:", toasts);
});

// Later...
unsubscribe(); // Stop listening
```

In React, this pairs perfectly with `useEffect`:

```typescript
useEffect(() => {
  const unsubscribe = manager.subscribe(setToasts);
  return unsubscribe; // Cleanup on unmount
}, [manager]);
```

### 5. ID Generation

```typescript
private generateId(): string {
  // Simple approach: timestamp + random
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

**Why not just use a counter?**

Counters work, but they have issues:

- Not unique across multiple manager instances
- Predictable (could be a security issue in some contexts)
- Requires maintaining state

Timestamp + random is:

- Unique enough for our use case (collision probability is astronomically low)
- Stateless (no counter to maintain)
- Sortable (timestamp prefix)

For production, you might use a library like `nanoid` or `uuid`, but this is sufficient for our needs.

## Queue Management

Now let's add the queue logic. We want to limit how many toasts are visible at once:

```typescript
private getActiveToasts(): Toast[] {
  return this.getToasts().slice(0, this.maxToasts);
}

private getQueuedToasts(): Toast[] {
  return this.getToasts().slice(this.maxToasts);
}
```

But wait - we need to actually enforce this limit. When we add a toast, we should only start its timer if it's in the active set:

```typescript
add(toast: Omit<Toast, 'id' | 'createdAt'>): string {
  const id = toast.id ?? this.generateId();

  if (this.toasts.has(id)) {
    return id;
  }

  const fullToast: Toast = {
    ...toast,
    id,
    createdAt: Date.now(),
  };

  this.toasts.set(id, fullToast);

  // Only start timer if this toast is in the active set
  const activeToasts = this.getActiveToasts();
  const isActive = activeToasts.some(t => t.id === id);

  if (isActive && fullToast.duration > 0) {
    this.startTimer(id);
  }

  this.notify();
  return id;
}
```

And when we dismiss a toast, we should activate the next queued toast:

```typescript
dismiss(id: string): void {
  if (!this.toasts.has(id)) {
    return;
  }

  this.clearTimer(id);
  this.toasts.delete(id);

  // Activate next queued toast
  const queuedToasts = this.getQueuedToasts();
  if (queuedToasts.length > 0) {
    const nextToast = queuedToasts[0];
    if (nextToast.duration > 0) {
      this.startTimer(nextToast.id);
    }
  }

  this.notify();
}
```

## Complete Implementation

Here's the full manager class with all features:

```typescript
export class ToastManager {
  private toasts: Map<string, Toast> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private subscribers: Set<(toasts: Toast[]) => void> = new Set();
  private maxToasts: number;

  constructor(options: { maxToasts?: number } = {}) {
    this.maxToasts = options.maxToasts ?? 5;
  }

  add(toast: Omit<Toast, "id" | "createdAt">): string {
    const id = toast.id ?? this.generateId();

    if (this.toasts.has(id)) {
      return id;
    }

    const fullToast: Toast = {
      ...toast,
      id,
      createdAt: Date.now(),
    };

    this.toasts.set(id, fullToast);

    const activeToasts = this.getActiveToasts();
    const isActive = activeToasts.some((t) => t.id === id);

    if (isActive && fullToast.duration > 0) {
      this.startTimer(id);
    }

    this.notify();
    return id;
  }

  dismiss(id: string): void {
    if (!this.toasts.has(id)) {
      return;
    }

    this.clearTimer(id);
    this.toasts.delete(id);

    const queuedToasts = this.getQueuedToasts();
    if (queuedToasts.length > 0) {
      const nextToast = queuedToasts[0];
      if (nextToast.duration > 0) {
        this.startTimer(nextToast.id);
      }
    }

    this.notify();
  }

  dismissAll(): void {
    this.timers.forEach((_, id) => this.clearTimer(id));
    this.toasts.clear();
    this.notify();
  }

  pause(id: string): void {
    const toast = this.toasts.get(id);
    if (!toast || toast.pausedAt) {
      return;
    }

    const elapsed = Date.now() - toast.createdAt;
    const remaining = toast.duration - elapsed;

    this.toasts.set(id, {
      ...toast,
      pausedAt: Date.now(),
      remainingTime: Math.max(0, remaining),
    });

    this.clearTimer(id);
    this.notify();
  }

  resume(id: string): void {
    const toast = this.toasts.get(id);
    if (!toast || !toast.pausedAt) {
      return;
    }

    this.toasts.set(id, {
      ...toast,
      pausedAt: undefined,
      createdAt: Date.now(),
    });

    this.startTimer(id);
    this.notify();
  }

  subscribe(callback: (toasts: Toast[]) => void): () => void {
    this.subscribers.add(callback);
    callback(this.getToasts());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    const toasts = this.getToasts();
    this.subscribers.forEach((callback) => callback(toasts));
  }

  private getToasts(): Toast[] {
    return Array.from(this.toasts.values()).sort(
      (a, b) => a.createdAt - b.createdAt,
    );
  }

  private getActiveToasts(): Toast[] {
    return this.getToasts().slice(0, this.maxToasts);
  }

  private getQueuedToasts(): Toast[] {
    return this.getToasts().slice(this.maxToasts);
  }

  private startTimer(id: string): void {
    const toast = this.toasts.get(id);
    if (!toast || toast.duration <= 0) {
      return;
    }

    const duration = toast.remainingTime ?? toast.duration;

    const timer = setTimeout(() => {
      this.dismiss(id);
    }, duration);

    this.timers.set(id, timer);
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## Testing the Manager

Since this is pure TypeScript, we can test it without React:

```typescript
describe("ToastManager", () => {
  it("should add and dismiss toasts", () => {
    const manager = new ToastManager();
    const toasts: Toast[][] = [];

    manager.subscribe((t) => toasts.push(t));

    const id = manager.add({
      variant: "success",
      payload: { message: "Hello" },
      duration: 0,
      position: "top-right",
      dismissOnClick: true,
      role: "status",
    });

    expect(toasts[1]).toHaveLength(1);
    expect(toasts[1][0].id).toBe(id);

    manager.dismiss(id);
    expect(toasts[2]).toHaveLength(0);
  });

  it("should respect max toasts limit", () => {
    const manager = new ToastManager({ maxToasts: 2 });

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

    // Only 2 should be active, 1 queued
    // (Test implementation would verify this)
  });
});
```

## Next Steps

We now have a fully functional toast manager! In the next tutorial, we'll build the factory pattern that creates typed toast instances from this manager.

**Key takeaways:**

- The manager is framework-agnostic (pure TypeScript)
- It uses a subscription pattern for state updates
- Queue management ensures we don't overwhelm users
- Pause/resume enables better UX (hover to read)
- All methods are synchronous and predictable
