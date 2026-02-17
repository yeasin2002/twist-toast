# Factory Pattern and TypeScript Generics

## Introduction

This is where twist-toast's developer experience really shines. We're going to build a factory function that takes your component map and returns a fully-typed toast instance. The magic is that TypeScript will infer all the types automatically - you won't need to write any type annotations when using the library.

## The Goal

We want developers to write this:

```typescript
const toast = createToast({
  success: SuccessToast,
  error: ErrorToast,
});

// TypeScript knows these exist and what props they accept
toast.success({ title: "Saved!" });
toast.error({ message: "Failed!" });

// TypeScript error: 'warning' doesn't exist
toast.warning({ text: "Oops" });
```

The challenge: how do we make TypeScript understand that the methods on `toast` should match the keys in the component map, and that each method should accept props matching its component's prop type?

## Understanding TypeScript Generics

Generics are like variables for types. Just as you can write a function that works with any value:

```typescript
function identity(value) {
  return value;
}
```

You can write a type that works with any type:

```typescript
function identity<T>(value: T): T {
  return value;
}
```

The `<T>` is a type parameter. When you call `identity(5)`, TypeScript infers `T = number`. When you call `identity("hello")`, it infers `T = string`.

For our factory, we need to capture the type of the component map and use it to generate the return type.

## Component Type Definitions

First, let's define what a toast component looks like:

```typescript
// The props that every toast component receives
export interface ToastComponentProps<TPayload = any> {
  // User's custom data
  ...TPayload;

  // Injected by the library
  dismiss: () => void;
  toastId: string;
}

// A toast component is a React component that accepts ToastComponentProps
export type ToastComponent<TPayload = any> = React.ComponentType<
  ToastComponentProps<TPayload>
>;
```

**Why the generic `TPayload`?**

Different toast types have different data. A success toast might have `{ title: string; description?: string }`, while an error toast might have `{ message: string; code?: number }`. The generic lets us capture this.

## Extracting Prop Types from Components

Here's a key TypeScript utility: given a component type, how do we extract its prop type?

```typescript
type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;
```

This is a **conditional type**. Let's break it down:

- `T extends React.ComponentType<infer P>`: "If T is a component type..."
- `infer P`: "...extract its prop type and call it P..."
- `? P : never`: "...then return P, otherwise return never"

Example:

```typescript
const SuccessToast: React.FC<{ title: string }> = ({ title }) => <div>{title}</div>;

type SuccessProps = PropsOf<typeof SuccessToast>;
// Result: { title: string }
```

## Mapped Types for Method Generation

Now we need to convert a component map into a method map. Given:

```typescript
{
  success: SuccessToast,
  error: ErrorToast,
}
```

We want to generate:

```typescript
{
  success: (payload: SuccessPayload) => string,
  error: (payload: ErrorPayload) => string,
}
```

This is done with a **mapped type**:

```typescript
type ToastMethods<TComponents> = {
  [K in keyof TComponents]: (
    payload: ExtractPayload<TComponents[K]>,
    options?: ToastOptions,
  ) => string;
};
```

Let's break this down:

- `[K in keyof TComponents]`: "For each key K in TComponents..."
- `TComponents[K]`: "...get the component type at that key..."
- `ExtractPayload<TComponents[K]>`: "...extract its payload type..."
- `(payload: ...) => string`: "...create a method that accepts that payload and returns a toast ID"

## Extracting the Payload Type

Remember, our components receive `ToastComponentProps<TPayload>`, which includes both the user's payload and our injected props (`dismiss`, `toastId`). We need to extract just the payload part:

```typescript
type ExtractPayload<TComponent> =
  TComponent extends React.ComponentType<infer P>
    ? Omit<P, "dismiss" | "toastId">
    : never;
```

This says: "Extract the props, then remove `dismiss` and `toastId` to get just the user's payload."

Example:

```typescript
const SuccessToast: React.FC<ToastComponentProps<{ title: string }>> = (props) => <div>{props.title}</div>;

type Payload = ExtractPayload<typeof SuccessToast>;
// Result: { title: string }
```

## The Factory Function Signature

Now we can write the factory:

```typescript
export function createToast<TComponents extends Record<string, ToastComponent>>(
  components: TComponents,
  options?: CreateToastOptions,
): ToastInstance<TComponents> {
  // Implementation...
}
```

**Key points:**

- `<TComponents extends Record<string, ToastComponent>>`: The generic captures the exact type of the component map
- `components: TComponents`: The parameter uses the generic, so TypeScript knows the exact keys and component types
- `ToastInstance<TComponents>`: The return type is computed from the component map

## The ToastInstance Type

```typescript
export type ToastInstance<TComponents> = ToastMethods<TComponents> & {
  dismiss: (id: string) => void;
  dismissAll: () => void;
};
```

This combines the generated methods with the utility methods.

## Factory Implementation

Here's the implementation:

```typescript
export function createToast<TComponents extends Record<string, ToastComponent>>(
  components: TComponents,
  options: CreateToastOptions = {},
): ToastInstance<TComponents> {
  // Create the manager
  const manager = new ToastManager({
    maxToasts: options.maxToasts ?? 5,
  });

  // Default options
  const defaults = {
    duration: options.defaultDuration ?? 4000,
    position: options.defaultPosition ?? "top-right",
    dismissOnClick: options.dismissOnClick ?? true,
    role: "status" as const,
  };

  // Generate methods for each variant
  const methods = {} as ToastMethods<TComponents>;

  for (const variant in components) {
    methods[variant] = (payload: any, opts?: ToastOptions) => {
      return manager.add({
        variant,
        payload,
        duration: opts?.duration ?? defaults.duration,
        position: opts?.position ?? defaults.position,
        dismissOnClick: opts?.dismissOnClick ?? defaults.dismissOnClick,
        role: opts?.role ?? defaults.role,
      });
    };
  }

  // Add utility methods
  return {
    ...methods,
    dismiss: (id: string) => manager.dismiss(id),
    dismissAll: () => manager.dismissAll(),
  };
}
```

**What's happening here?**

1. We create a manager instance with the provided options
2. We loop through the component map and create a method for each variant
3. Each method calls `manager.add()` with the variant name and payload
4. We merge the generated methods with the utility methods

**Why `as ToastMethods<TComponents>`?**

TypeScript can't infer the exact type from the loop, so we assert it. This is safe because we're iterating over the exact keys of `components`.

## Type Inference in Action

Let's see how TypeScript infers types:

```typescript
// User's components
const SuccessToast: React.FC<ToastComponentProps<{ title: string; description?: string }>> = (props) => (
  <div>
    <h3>{props.title}</h3>
    {props.description && <p>{props.description}</p>}
  </div>
);

const ErrorToast: React.FC<ToastComponentProps<{ message: string }>> = (props) => (
  <div>{props.message}</div>
);

// Create toast instance
const toast = createToast({
  success: SuccessToast,
  error: ErrorToast,
});

// TypeScript infers:
// toast.success: (payload: { title: string; description?: string }, options?: ToastOptions) => string
// toast.error: (payload: { message: string }, options?: ToastOptions) => string

// Valid calls
toast.success({ title: "Saved!" });
toast.success({ title: "Saved!", description: "Your changes were saved." });
toast.error({ message: "Failed!" });

// TypeScript errors
toast.success({ message: "Wrong prop" }); // Error: 'message' doesn't exist on success payload
toast.error({ title: "Wrong prop" }); // Error: 'title' doesn't exist on error payload
toast.warning({ text: "Oops" }); // Error: 'warning' doesn't exist on toast instance
```

## Advanced: Handling Optional Props

What if a component has all optional props?

```typescript
const InfoToast: React.FC<ToastComponentProps<{ message?: string }>> = (props) => (
  <div>{props.message ?? "Info"}</div>
);

const toast = createToast({
  info: InfoToast,
});

// Should this be valid?
toast.info();
```

Currently, TypeScript requires you to pass an object, even if it's empty: `toast.info({})`. To make the payload optional when all props are optional, we need a more complex type:

```typescript
type ToastMethods<TComponents> = {
  [K in keyof TComponents]: ExtractPayload<TComponents[K]> extends Record<
    string,
    never
  >
    ? (options?: ToastOptions) => string
    : {} extends ExtractPayload<TComponents[K]>
      ? (
          payload?: ExtractPayload<TComponents[K]>,
          options?: ToastOptions,
        ) => string
      : (
          payload: ExtractPayload<TComponents[K]>,
          options?: ToastOptions,
        ) => string;
};
```

This says:

- If the payload is empty (`Record<string, never>`), don't require it
- If the payload is optional (all props optional), make the parameter optional
- Otherwise, require the payload

This is advanced and can be added later. For Phase 1, requiring an empty object is acceptable.

## Connecting to React

The factory creates the toast instance, but how does React know about it? We need to store the manager and component map somewhere that the provider can access.

One approach: use a WeakMap to associate managers with component maps:

```typescript
const managerRegistry = new WeakMap<
  ToastInstance<any>,
  {
    manager: ToastManager;
    components: Record<string, ToastComponent>;
  }
>();

export function createToast<TComponents extends Record<string, ToastComponent>>(
  components: TComponents,
  options: CreateToastOptions = {},
): ToastInstance<TComponents> {
  const manager = new ToastManager({
    maxToasts: options.maxToasts ?? 5,
  });

  const defaults = {
    duration: options.defaultDuration ?? 4000,
    position: options.defaultPosition ?? "top-right",
    dismissOnClick: options.dismissOnClick ?? true,
    role: "status" as const,
  };

  const methods = {} as ToastMethods<TComponents>;

  for (const variant in components) {
    methods[variant] = (payload: any, opts?: ToastOptions) => {
      return manager.add({
        variant,
        payload,
        duration: opts?.duration ?? defaults.duration,
        position: opts?.position ?? defaults.position,
        dismissOnClick: opts?.dismissOnClick ?? defaults.dismissOnClick,
        role: opts?.role ?? defaults.role,
      });
    };
  }

  const instance = {
    ...methods,
    dismiss: (id: string) => manager.dismiss(id),
    dismissAll: () => manager.dismissAll(),
  };

  // Register for provider lookup
  managerRegistry.set(instance, { manager, components });

  return instance;
}

// Helper for provider
export function getManagerInfo(instance: ToastInstance<any>) {
  return managerRegistry.get(instance);
}
```

**Why WeakMap?**

- Doesn't prevent garbage collection (if the instance is no longer referenced, it can be cleaned up)
- Fast lookups
- Private (not exported, so users can't mess with it)

## Complete Type Definitions

Here's the full type system:

```typescript
// Component types
export interface ToastComponentProps<TPayload = any> extends TPayload {
  dismiss: () => void;
  toastId: string;
}

export type ToastComponent<TPayload = any> = React.ComponentType<
  ToastComponentProps<TPayload>
>;

// Extract payload from component
type ExtractPayload<TComponent> =
  TComponent extends React.ComponentType<infer P>
    ? Omit<P, "dismiss" | "toastId">
    : never;

// Generate methods from component map
type ToastMethods<TComponents> = {
  [K in keyof TComponents]: (
    payload: ExtractPayload<TComponents[K]>,
    options?: ToastOptions,
  ) => string;
};

// Toast instance type
export type ToastInstance<TComponents> = ToastMethods<TComponents> & {
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

// Options
export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  dismissOnClick?: boolean;
  role?: "alert" | "status";
  id?: string;
}

export interface CreateToastOptions {
  defaultDuration?: number;
  defaultPosition?: ToastPosition;
  dismissOnClick?: boolean;
  maxToasts?: number;
}

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
```

## Testing Type Inference

You can test that types are inferred correctly using TypeScript's type testing utilities:

```typescript
import { expectType } from "tsd";

const toast = createToast({
  success: SuccessToast,
  error: ErrorToast,
});

// Test that methods exist
expectType<
  (
    payload: { title: string; description?: string },
    options?: ToastOptions,
  ) => string
>(toast.success);

expectType<(payload: { message: string }, options?: ToastOptions) => string>(
  toast.error,
);

// Test that invalid methods don't exist
// @ts-expect-error
toast.warning;
```

## Next Steps

We now have a fully-typed factory that creates toast instances! In the next tutorial, we'll build the React provider that subscribes to the manager and renders toasts using portals.

**Key takeaways:**

- Generics capture the exact type of the component map
- Mapped types generate methods from the map
- Conditional types extract payload types from components
- Type inference happens automatically - users don't write type annotations
- WeakMap connects the instance to its manager and components
