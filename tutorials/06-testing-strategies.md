# Testing Strategies

## Introduction

Testing a library is different from testing an application. We need to ensure our API works correctly, types are inferred properly, and the library behaves predictably in various scenarios. This tutorial covers unit testing, integration testing, and type testing for twist-toast.

## Testing Stack

For our library, we'll use:

- **Vitest**: Fast, modern test runner with great TypeScript support
- **React Testing Library**: For testing React components
- **@testing-library/user-event**: For simulating user interactions
- **tsd**: For testing TypeScript types
- **jsdom**: For DOM simulation in Node.js

## Setting Up Vitest

First, install dependencies:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/",
      ],
    },
  },
});
```

Create `src/test/setup.ts`:

```typescript
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Testing the Toast Manager

The manager is pure TypeScript, so it's easy to test without React:

```typescript
// src/manager.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ToastManager } from "./manager";

describe("ToastManager", () => {
  let manager: ToastManager;

  beforeEach(() => {
    manager = new ToastManager();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("add", () => {
    it("should add a toast and notify subscribers", () => {
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      const id = manager.add({
        variant: "success",
        payload: { message: "Hello" },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      expect(subscriber).toHaveBeenCalledTimes(2); // Initial + after add
      expect(subscriber).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id,
            variant: "success",
            payload: { message: "Hello" },
          }),
        ]),
      );
    });

    it("should generate an ID if not provided", () => {
      const id = manager.add({
        variant: "success",
        payload: {},
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      expect(id).toMatch(/^toast-\d+-[a-z0-9]+$/);
    });

    it("should use provided ID", () => {
      const id = manager.add({
        variant: "success",
        payload: {},
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
        id: "custom-id",
      });

      expect(id).toBe("custom-id");
    });

    it("should ignore duplicate IDs", () => {
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      manager.add({
        variant: "success",
        payload: { message: "First" },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
        id: "duplicate",
      });

      manager.add({
        variant: "error",
        payload: { message: "Second" },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "alert",
        id: "duplicate",
      });

      // Should only have one toast
      const toasts = subscriber.mock.calls[subscriber.mock.calls.length - 1][0];
      expect(toasts).toHaveLength(1);
      expect(toasts[0].payload.message).toBe("First");
    });

    it("should auto-dismiss after duration", () => {
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      manager.add({
        variant: "success",
        payload: {},
        duration: 3000,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      expect(subscriber).toHaveBeenLastCalledWith(
        expect.arrayContaining([expect.any(Object)]),
      );

      vi.advanceTimersByTime(3000);

      expect(subscriber).toHaveBeenLastCalledWith([]);
    });
  });

  describe("dismiss", () => {
    it("should remove a toast and notify subscribers", () => {
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      const id = manager.add({
        variant: "success",
        payload: {},
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      manager.dismiss(id);

      expect(subscriber).toHaveBeenLastCalledWith([]);
    });

    it("should handle dismissing non-existent toast", () => {
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      manager.dismiss("non-existent");

      // Should not crash or notify
      expect(subscriber).toHaveBeenCalledTimes(1); // Only initial call
    });

    it("should activate next queued toast", () => {
      const manager = new ToastManager({ maxToasts: 2 });
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      // Add 3 toasts (2 active, 1 queued)
      const id1 = manager.add({
        variant: "success",
        payload: { n: 1 },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      manager.add({
        variant: "success",
        payload: { n: 2 },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      manager.add({
        variant: "success",
        payload: { n: 3 },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      // Dismiss first toast
      manager.dismiss(id1);

      // Should still have 2 toasts (second and third)
      const toasts = subscriber.mock.calls[subscriber.mock.calls.length - 1][0];
      expect(toasts).toHaveLength(2);
      expect(toasts[0].payload.n).toBe(2);
      expect(toasts[1].payload.n).toBe(3);
    });
  });

  describe("dismissAll", () => {
    it("should remove all toasts", () => {
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      manager.add({
        variant: "success",
        payload: {},
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      manager.add({
        variant: "error",
        payload: {},
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "alert",
      });

      manager.dismissAll();

      expect(subscriber).toHaveBeenLastCalledWith([]);
    });
  });

  describe("pause and resume", () => {
    it("should pause and resume timer", () => {
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      const id = manager.add({
        variant: "success",
        payload: {},
        duration: 3000,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      // Advance 1 second
      vi.advanceTimersByTime(1000);

      // Pause
      manager.pause(id);

      // Advance 5 seconds (should not dismiss)
      vi.advanceTimersByTime(5000);

      const toasts = subscriber.mock.calls[subscriber.mock.calls.length - 1][0];
      expect(toasts).toHaveLength(1);

      // Resume
      manager.resume(id);

      // Advance remaining 2 seconds
      vi.advanceTimersByTime(2000);

      expect(subscriber).toHaveBeenLastCalledWith([]);
    });

    it("should handle pausing already paused toast", () => {
      const id = manager.add({
        variant: "success",
        payload: {},
        duration: 3000,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      manager.pause(id);
      manager.pause(id); // Should not crash

      expect(() => manager.pause(id)).not.toThrow();
    });
  });

  describe("subscribe", () => {
    it("should call subscriber immediately with current state", () => {
      manager.add({
        variant: "success",
        payload: {},
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Object)]),
      );
    });

    it("should return unsubscribe function", () => {
      const subscriber = vi.fn();
      const unsubscribe = manager.subscribe(subscriber);

      manager.add({
        variant: "success",
        payload: {},
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      expect(subscriber).toHaveBeenCalledTimes(2);

      unsubscribe();

      manager.add({
        variant: "error",
        payload: {},
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "alert",
      });

      // Should not be called again
      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });

  describe("queue management", () => {
    it("should respect maxToasts limit", () => {
      const manager = new ToastManager({ maxToasts: 2 });
      const subscriber = vi.fn();
      manager.subscribe(subscriber);

      manager.add({
        variant: "success",
        payload: { n: 1 },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      manager.add({
        variant: "success",
        payload: { n: 2 },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      manager.add({
        variant: "success",
        payload: { n: 3 },
        duration: 0,
        position: "top-right",
        dismissOnClick: true,
        role: "status",
      });

      // All 3 should be in the manager, but only 2 active
      const toasts = subscriber.mock.calls[subscriber.mock.calls.length - 1][0];
      expect(toasts).toHaveLength(3);
    });
  });
});
```

## Testing the Factory

Testing the factory involves checking that it creates the correct methods and types:

```typescript
// src/factory.test.ts
import { describe, it, expect, vi } from "vitest";
import { createToast } from "./factory";
import type { ToastComponentProps } from "./types";

const MockSuccessComponent = (props: ToastComponentProps<{ title: string }>) =>
  null;
const MockErrorComponent = (props: ToastComponentProps<{ message: string }>) =>
  null;

describe("createToast", () => {
  it("should create methods for each variant", () => {
    const toast = createToast({
      success: MockSuccessComponent,
      error: MockErrorComponent,
    });

    expect(toast.success).toBeTypeOf("function");
    expect(toast.error).toBeTypeOf("function");
    expect(toast.dismiss).toBeTypeOf("function");
    expect(toast.dismissAll).toBeTypeOf("function");
  });

  it("should call manager.add when variant method is called", () => {
    const toast = createToast({
      success: MockSuccessComponent,
    });

    const id = toast.success({ title: "Hello" });

    expect(id).toMatch(/^toast-\d+-[a-z0-9]+$/);
  });

  it("should merge default options with call options", () => {
    const toast = createToast(
      {
        success: MockSuccessComponent,
      },
      {
        defaultDuration: 5000,
        defaultPosition: "bottom-right",
      },
    );

    // This is hard to test without exposing internals
    // We'd need to subscribe to the manager to verify
    toast.success({ title: "Hello" });
  });

  it("should allow overriding defaults per call", () => {
    const toast = createToast(
      {
        success: MockSuccessComponent,
      },
      {
        defaultDuration: 5000,
      },
    );

    toast.success({ title: "Hello" }, { duration: 1000 });
  });
});
```

## Testing React Components

Testing the provider and portal components:

```typescript
// src/ToastProvider.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastProvider } from './ToastProvider';
import { createToast } from './factory';
import type { ToastComponentProps } from './types';

const TestToast = ({ title, dismiss }: ToastComponentProps<{ title: string }>) => (
  <div>
    <span>{title}</span>
    <button onClick={dismiss}>Dismiss</button>
  </div>
);

describe('ToastProvider', () => {
  beforeEach(() => {
    // Clean up any existing toast containers
    document.body.innerHTML = '';
  });

  it('should render children', () => {
    render(
      <ToastProvider>
        <div>Child content</div>
      </ToastProvider>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should render toasts when triggered', async () => {
    const toast = createToast({
      success: TestToast,
    });

    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>
    );

    toast.success({ title: 'Success!' });

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });

  it('should dismiss toast when dismiss button is clicked', async () => {
    const toast = createToast({
      success: TestToast,
    });

    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>
    );

    toast.success({ title: 'Success!' });

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    const dismissButton = screen.getByText('Dismiss');
    dismissButton.click();

    await waitFor(() => {
      expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    });
  });

  it('should render multiple toasts', async () => {
    const toast = createToast({
      success: TestToast,
    });

    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>
    );

    toast.success({ title: 'First' });
    toast.success({ title: 'Second' });

    await waitFor(() => {
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });
});
```

## Testing TypeScript Types

Use `tsd` to test that types are inferred correctly:

```bash
pnpm add -D tsd
```

Create `src/types.test-d.ts`:

```typescript
import { expectType, expectError } from "tsd";
import { createToast } from "./factory";
import type { ToastComponentProps } from "./types";

const SuccessToast = (
  props: ToastComponentProps<{ title: string; description?: string }>,
) => null;
const ErrorToast = (props: ToastComponentProps<{ message: string }>) => null;

const toast = createToast({
  success: SuccessToast,
  error: ErrorToast,
});

// Should infer correct payload types
expectType<string>(toast.success({ title: "Hello" }));

expectType<string>(toast.success({ title: "Hello", description: "World" }));

expectType<string>(toast.error({ message: "Error" }));

// Should error on wrong props
expectError(toast.success({ message: "Wrong" }));

expectError(toast.error({ title: "Wrong" }));

// Should error on non-existent variant
expectError(toast.warning({ text: "Oops" }));

// Should have utility methods
expectType<(id: string) => void>(toast.dismiss);
expectType<() => void>(toast.dismissAll);
```

Run with:

```bash
pnpm tsd
```

## Integration Tests

Test the full flow from factory to rendering:

```typescript
// src/integration.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from './ToastProvider';
import { createToast } from './factory';
import type { ToastComponentProps } from './types';

describe('Integration: Factory + Provider', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show and auto-dismiss toast', async () => {
    const TestToast = ({ message }: ToastComponentProps<{ message: string }>) => (
      <div>{message}</div>
    );

    const toast = createToast(
      {
        info: TestToast,
      },
      {
        defaultDuration: 3000,
      }
    );

    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>
    );

    toast.info({ message: 'Auto-dismiss' });

    await waitFor(() => {
      expect(screen.getByText('Auto-dismiss')).toBeInTheDocument();
    });

    vi.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.queryByText('Auto-dismiss')).not.toBeInTheDocument();
    });
  });

  it('should pause on hover and resume on leave', async () => {
    const user = userEvent.setup({ delay: null });

    const TestToast = ({ message }: ToastComponentProps<{ message: string }>) => (
      <div>{message}</div>
    );

    const toast = createToast(
      {
        info: TestToast,
      },
      {
        defaultDuration: 3000,
      }
    );

    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>
    );

    toast.info({ message: 'Hover me' });

    const toastElement = await screen.findByText('Hover me');

    // Advance 1 second
    vi.advanceTimersByTime(1000);

    // Hover
    await user.hover(toastElement.parentElement!);

    // Advance 5 seconds (should not dismiss)
    vi.advanceTimersByTime(5000);

    expect(screen.getByText('Hover me')).toBeInTheDocument();

    // Unhover
    await user.unhover(toastElement.parentElement!);

    // Advance remaining 2 seconds
    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.queryByText('Hover me')).not.toBeInTheDocument();
    });
  });
});
```

## Coverage Goals

Aim for:

- **Manager**: 100% coverage (it's pure logic)
- **Factory**: 90%+ coverage
- **Provider/Portal**: 80%+ coverage (some edge cases are hard to test)
- **Overall**: 90%+ coverage

Run coverage:

```bash
pnpm vitest --coverage
```

## Next Steps

With comprehensive tests in place, we can confidently refactor and add features. In the next tutorial, we'll cover the complete file structure and how to organize the codebase.

**Key takeaways:**

- Test each layer independently
- Use fake timers for time-based logic
- Test TypeScript types with tsd
- Integration tests verify the full flow
- Aim for high coverage on core logic
