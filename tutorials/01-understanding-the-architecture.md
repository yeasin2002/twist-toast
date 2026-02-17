# Understanding the Architecture

## Introduction

Before we write a single line of code, it's crucial to understand the architectural decisions behind twist-toast. This library is designed around a specific philosophy: **separation of concerns between behavior and presentation**. Most toast libraries tightly couple these two aspects, which is why developers end up fighting with CSS overrides and style conflicts.

## The Core Problem We're Solving

When you use a traditional toast library like react-toastify or react-hot-toast, you get a complete package: the state management, the UI components, and the styling. This seems convenient at first, but it creates a fundamental problem:

**Your design system has its own components, colors, spacing, and accessibility patterns.** When you bring in a third-party toast library with its own UI, you now have two sources of truth for how notifications should look. You end up writing CSS overrides, fighting specificity battles, and still not getting pixel-perfect alignment with your design system.

twist-toast solves this by inverting the relationship: **you own the components, we manage the behavior**.

## Architectural Layers

Our library is structured in four distinct layers, each with a specific responsibility:

### Layer 1: Toast Manager (Framework-Agnostic Core)

This is the brain of the operation. The toast manager is a pure TypeScript class that knows nothing about React. It handles:

- **Queue management**: Maintaining an ordered list of active toasts
- **Timer logic**: Tracking when each toast should auto-dismiss
- **Deduplication**: Preventing duplicate toasts with the same ID
- **Event emission**: Notifying subscribers when the toast state changes

Why make it framework-agnostic? Two reasons:

1. **Testability**: Pure TypeScript is easier to test than React components
2. **Future-proofing**: In Phase 2, we can adapt this same core for Vue, Svelte, or Angular

The manager uses an event-driven architecture. When you call `toast.success()`, the manager doesn't directly render anything. Instead, it:

1. Adds the toast to its internal queue
2. Starts a timer for auto-dismissal
3. Emits a "state changed" event
4. Lets the React layer handle the rendering

### Layer 2: Factory Pattern (`createToast`)

This is where TypeScript's type system really shines. The `createToast()` function is a factory that:

1. **Accepts a component map**: An object where keys are variant names (like "success", "error") and values are React components
2. **Returns a typed toast instance**: An object with methods that match your variant names
3. **Captures type information**: TypeScript infers the prop types from your components

Here's the magic: when you write this:

```typescript
const toast = createToast({
  success: SuccessToast,
  error: ErrorToast,
});
```

TypeScript automatically knows that:

- `toast.success()` exists and accepts props matching `SuccessToast`'s prop type
- `toast.error()` exists and accepts props matching `ErrorToast`'s prop type
- `toast.warning()` does NOT exist (because you didn't register it)

This is achieved through **mapped types** and **generics**. We'll dive deep into the implementation in a later tutorial, but the key insight is: **the type system is doing work at compile time that would otherwise require runtime validation**.

### Layer 3: React Adapter (`<ToastProvider>`)

The provider is the bridge between the framework-agnostic manager and React's rendering system. It:

1. **Creates a React context**: This allows any component in the tree to access the toast manager
2. **Subscribes to manager events**: When the manager's state changes, the provider re-renders
3. **Renders a portal**: Uses `ReactDOM.createPortal()` to render toasts outside the normal DOM hierarchy

Why use a portal? Consider this component tree:

```
<App>
  <Header>
    <Button onClick={() => toast.success()}>Save</Button>
  </Header>
  <Main style={{ overflow: 'hidden' }}>
    <Content />
  </Main>
</App>
```

If we rendered the toast inside `<Button>`, it would be clipped by the `overflow: hidden` on `<Main>`. Portals solve this by rendering the toast at the document root level, outside the normal hierarchy, while still maintaining the React component relationship (so context, events, and state all work normally).

### Layer 4: Component Resolver

When a toast is triggered, the resolver:

1. **Looks up the variant**: Finds the component registered for "success", "error", etc.
2. **Injects control props**: Adds `dismiss()` function and `toastId` to the user's payload
3. **Renders the component**: Passes all props to the user's component

The resolver is what allows you to write a component like this:

```typescript
const SuccessToast = ({ title, description, dismiss }) => (
  <div onClick={dismiss}>
    <strong>{title}</strong>
    <p>{description}</p>
  </div>
);
```

And call it like this:

```typescript
toast.success({ title: "Saved!", description: "Your changes were saved." });
```

The resolver merges your payload (`title`, `description`) with the control props (`dismiss`, `toastId`) before rendering.

## Data Flow

Let's trace what happens when you call `toast.success({ title: "Hello" })`:

1. **User code calls the method**: `toast.success({ title: "Hello" })`
2. **Factory forwards to manager**: The `success` method on the toast instance calls `manager.add({ variant: 'success', payload: { title: "Hello" } })`
3. **Manager updates state**: Adds the toast to the queue, generates an ID, starts a timer
4. **Manager emits event**: Notifies all subscribers that state changed
5. **Provider receives event**: The `<ToastProvider>` is subscribed, so it re-renders
6. **Resolver maps variant to component**: Looks up `components.success` → finds `SuccessToast`
7. **Portal renders component**: `ReactDOM.createPortal(<SuccessToast title="Hello" dismiss={...} />, document.body)`
8. **User sees toast**: The component appears on screen with your custom styling

## Why This Architecture?

This layered approach gives us several benefits:

### 1. Type Safety Without Runtime Cost

By using TypeScript generics and mapped types, we get full autocomplete and type checking at development time, but the compiled JavaScript is just regular function calls. There's no runtime type checking overhead.

### 2. Testability

Each layer can be tested independently:

- Manager: Pure TypeScript, easy to unit test
- Factory: Test that it creates the right method signatures
- Provider: Test that it subscribes and renders correctly
- Resolver: Test that it maps variants to components

### 3. Flexibility

Because the manager is framework-agnostic, we can create adapters for other frameworks without rewriting the core logic. The React adapter is just one possible implementation.

### 4. Performance

The manager uses a subscription pattern, so only components that care about toast state will re-render. The rest of your app is unaffected.

### 5. Developer Experience

The factory pattern means configuration lives in one place (your `toast.config.ts` file), not scattered throughout your component tree. You import the `toast` instance and use it anywhere, without prop drilling or context consumers.

## Comparison to Other Approaches

### Approach 1: Component-Based (react-toastify)

```typescript
<ToastContainer />
// Later...
toast.success("Message");
```

**Problem**: The library owns the UI. You're stuck with their components and styling.

### Approach 2: Hook-Based (react-hot-toast)

```typescript
const { toast } = useToast();
toast.success("Message");
```

**Problem**: You need to call a hook in every component that wants to show toasts. Can't use outside React components.

### Approach 3: Our Factory Pattern

```typescript
// toast.config.ts
export const toast = createToast({ success: YourComponent });

// anywhere.ts
toast.success({ your: "props" });
```

**Solution**: Configuration is centralized, usage is simple, and you own the UI completely.

## Next Steps

Now that you understand the architecture, we'll start building it piece by piece:

1. **Tutorial 02**: Building the toast manager (the core state machine)
2. **Tutorial 03**: Implementing the factory pattern with TypeScript generics
3. **Tutorial 04**: Creating the React provider and portal
4. **Tutorial 05**: Building the component resolver
5. **Tutorial 06**: Adding advanced features (queue limits, deduplication, pause on hover)
6. **Tutorial 07**: TypeScript deep dive (mapped types, conditional types, utility types)
7. **Tutorial 08**: Testing strategies for each layer

Each tutorial will be hands-on, with detailed explanations of not just _what_ we're building, but _why_ we're making each decision.
