# React Provider and Portals

## Introduction

Now we need to connect our framework-agnostic manager to React. The provider will subscribe to toast state changes and render toasts using React portals. This tutorial covers React Context, portals, and the subscription pattern in React.

## Understanding React Portals

Normally, React components render into their parent's DOM node:

```jsx
<div id="app">
  <Header>
    <Button>Click me</Button>
  </Header>
</div>
```

The button renders inside the header, which renders inside the app div. But what if you want to render something outside this hierarchy? That's what portals are for.

```jsx
ReactDOM.createPortal(<div>I render somewhere else!</div>, document.body);
```

**Why use portals for toasts?**

1. **Z-index issues**: If a toast renders inside a component with `z-index: 1`, and another component has `z-index: 2`, the toast will be hidden. Portals let you render at the document root, above everything.

2. **Overflow clipping**: If a parent has `overflow: hidden`, children are clipped. Portals escape this.

3. **Positioning**: Toasts need to be positioned relative to the viewport, not their parent. Portals make this natural.

4. **Event bubbling**: Even though the portal renders elsewhere in the DOM, React events still bubble through the React tree. This means context, event handlers, and state all work normally.

## The Provider Component

Let's start with the basic structure:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      {/* Portal will go here */}
    </>
  );
};
```

**Design decision**: The provider doesn't take any props (no component map, no config). All configuration happens in `createToast()`. This keeps the provider simple and the component tree clean.

## Connecting to the Manager

But wait - how does the provider know which manager to subscribe to? We need a way to register managers with the provider.

### Approach 1: Context-Based Registration

We can use React Context to let toast instances register themselves:

```typescript
interface ToastContextValue {
  registerManager: (manager: ToastManager, components: Record<string, ToastComponent>) => void;
  unregisterManager: (manager: ToastManager) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [managers, setManagers] = useState<Map<ToastManager, Record<string, ToastComponent>>>(
    new Map()
  );

  const registerManager = (manager: ToastManager, components: Record<string, ToastComponent>) => {
    setManagers(prev => new Map(prev).set(manager, components));
  };

  const unregisterManager = (manager: ToastManager) => {
    setManagers(prev => {
      const next = new Map(prev);
      next.delete(manager);
      return next;
    });
  };

  return (
    <ToastContext.Provider value={{ registerManager, unregisterManager }}>
      {children}
      {/* Render toasts for each manager */}
    </ToastContext.Provider>
  );
};
```

Then, in `createToast()`, we register the manager:

```typescript
export function createToast<TComponents extends Record<string, ToastComponent>>(
  components: TComponents,
  options: CreateToastOptions = {},
): ToastInstance<TComponents> {
  const manager = new ToastManager({ maxToasts: options.maxToasts ?? 5 });

  // ... create methods ...

  const instance = {
    ...methods,
    dismiss: (id: string) => manager.dismiss(id),
    dismissAll: () => manager.dismissAll(),
  };

  // Store manager info for provider
  managerRegistry.set(instance, { manager, components });

  return instance;
}
```

But there's a problem: `createToast()` is called outside React (in a config file), so it can't access context. We need a different approach.

### Approach 2: Auto-Registration Hook

Instead of registering in `createToast()`, we can create a hook that registers when the toast instance is used:

```typescript
function useToastRegistration(instance: ToastInstance<any>) {
  const context = useContext(ToastContext);

  useEffect(() => {
    if (!context) {
      console.warn("ToastProvider not found. Toasts will not render.");
      return;
    }

    const info = getManagerInfo(instance);
    if (!info) {
      return;
    }

    context.registerManager(info.manager, info.components);

    return () => {
      context.unregisterManager(info.manager);
    };
  }, [instance, context]);
}
```

But this requires users to call the hook, which defeats the purpose of our simple API.

### Approach 3: Module-Level Registry (Simplest)

The simplest approach: use a module-level registry that the provider reads from:

```typescript
// registry.ts
const globalRegistry = new Map<ToastManager, Record<string, ToastComponent>>();

export function registerManager(
  manager: ToastManager,
  components: Record<string, ToastComponent>,
) {
  globalRegistry.set(manager, components);
}

export function getManagers() {
  return Array.from(globalRegistry.entries());
}
```

In `createToast()`:

```typescript
export function createToast<TComponents extends Record<string, ToastComponent>>(
  components: TComponents,
  options: CreateToastOptions = {},
): ToastInstance<TComponents> {
  const manager = new ToastManager({ maxToasts: options.maxToasts ?? 5 });

  // ... create methods ...

  // Register globally
  registerManager(manager, components);

  return instance;
}
```

In the provider:

```typescript
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Re-render when managers change
    const interval = setInterval(() => {
      forceUpdate({});
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const managers = getManagers();

  return (
    <>
      {children}
      {managers.map(([manager, components]) => (
        <ToastRenderer key={manager} manager={manager} components={components} />
      ))}
    </>
  );
};
```

**Wait, polling?** This is not ideal. Let's use a better approach: event-based registration.

### Approach 4: Event-Based Registration (Best)

```typescript
// registry.ts
type RegistryListener = () => void;

const globalRegistry = new Map<ToastManager, Record<string, ToastComponent>>();
const listeners = new Set<RegistryListener>();

export function registerManager(
  manager: ToastManager,
  components: Record<string, ToastComponent>,
) {
  globalRegistry.set(manager, components);
  notifyListeners();
}

export function unregisterManager(manager: ToastManager) {
  globalRegistry.delete(manager);
  notifyListeners();
}

export function getManagers() {
  return Array.from(globalRegistry.entries());
}

export function subscribeToRegistry(listener: RegistryListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}
```

In the provider:

```typescript
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    return subscribeToRegistry(() => {
      forceUpdate({});
    });
  }, []);

  const managers = getManagers();

  return (
    <>
      {children}
      {managers.map(([manager, components]) => (
        <ToastRenderer key={/* need stable key */} manager={manager} components={components} />
      ))}
    </>
  );
};
```

**Problem**: We need a stable key for each manager. Let's use a WeakMap:

```typescript
const managerKeys = new WeakMap<ToastManager, string>();
let keyCounter = 0;

function getManagerKey(manager: ToastManager): string {
  let key = managerKeys.get(manager);
  if (!key) {
    key = `manager-${keyCounter++}`;
    managerKeys.set(manager, key);
  }
  return key;
}
```

Now:

```typescript
{managers.map(([manager, components]) => (
  <ToastRenderer key={getManagerKey(manager)} manager={manager} components={components} />
))}
```

## The ToastRenderer Component

This component subscribes to a single manager and renders its toasts:

```typescript
interface ToastRendererProps {
  manager: ToastManager;
  components: Record<string, ToastComponent>;
}

const ToastRenderer: React.FC<ToastRendererProps> = ({ manager, components }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return manager.subscribe(setToasts);
  }, [manager]);

  return (
    <>
      {toasts.map(toast => (
        <ToastPortal key={toast.id} toast={toast} components={components} manager={manager} />
      ))}
    </>
  );
};
```

**Why separate ToastRenderer from ToastProvider?**

- Each manager has its own subscription
- Keeps the provider simple
- Easier to test

## The ToastPortal Component

This component renders a single toast using a portal:

```typescript
interface ToastPortalProps {
  toast: Toast;
  components: Record<string, ToastComponent>;
  manager: ToastManager;
}

const ToastPortal: React.FC<ToastPortalProps> = ({ toast, components, manager }) => {
  const [container] = useState(() => {
    const div = document.createElement('div');
    div.setAttribute('data-toast-id', toast.id);
    div.setAttribute('data-toast-position', toast.position);
    return div;
  });

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  const Component = components[toast.variant];
  if (!Component) {
    console.warn(`No component registered for variant: ${toast.variant}`);
    return null;
  }

  const handleDismiss = () => {
    manager.dismiss(toast.id);
  };

  const handleMouseEnter = () => {
    manager.pause(toast.id);
  };

  const handleMouseLeave = () => {
    manager.resume(toast.id);
  };

  const content = (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toast.dismissOnClick ? handleDismiss : undefined}
      role={toast.role}
      aria-live={toast.role === 'alert' ? 'assertive' : 'polite'}
    >
      <Component
        {...toast.payload}
        dismiss={handleDismiss}
        toastId={toast.id}
      />
    </div>
  );

  return ReactDOM.createPortal(content, container);
};
```

**Key points:**

1. **Container creation**: We create a div for each toast and append it to the body
2. **Cleanup**: We remove the div when the component unmounts
3. **Data attributes**: We add `data-toast-id` and `data-toast-position` for CSS targeting
4. **Event handlers**: Pause on hover, dismiss on click (if enabled)
5. **Accessibility**: We set `role` and `aria-live` for screen readers
6. **Component rendering**: We spread the payload and inject control props

## Positioning Toasts

We need CSS to position toasts based on their position prop. We can use data attributes:

```css
[data-toast-position="top-left"] {
  position: fixed;
  top: 1rem;
  left: 1rem;
}

[data-toast-position="top-center"] {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

[data-toast-position="top-right"] {
  position: fixed;
  top: 1rem;
  right: 1rem;
}

/* ... other positions ... */
```

But we don't want to force users to include our CSS. Instead, we can inject styles:

```typescript
const ToastPortal: React.FC<ToastPortalProps> = ({
  toast,
  components,
  manager,
}) => {
  const [container] = useState(() => {
    const div = document.createElement("div");
    div.setAttribute("data-toast-id", toast.id);
    div.setAttribute("data-toast-position", toast.position);

    // Apply positioning styles
    div.style.position = "fixed";
    div.style.zIndex = "9999";

    switch (toast.position) {
      case "top-left":
        div.style.top = "1rem";
        div.style.left = "1rem";
        break;
      case "top-center":
        div.style.top = "1rem";
        div.style.left = "50%";
        div.style.transform = "translateX(-50%)";
        break;
      case "top-right":
        div.style.top = "1rem";
        div.style.right = "1rem";
        break;
      case "bottom-left":
        div.style.bottom = "1rem";
        div.style.left = "1rem";
        break;
      case "bottom-center":
        div.style.bottom = "1rem";
        div.style.left = "50%";
        div.style.transform = "translateX(-50%)";
        break;
      case "bottom-right":
        div.style.bottom = "1rem";
        div.style.right = "1rem";
        break;
    }

    return div;
  });

  // ... rest of component
};
```

**Alternative**: Provide a CSS file that users can optionally import, or use CSS-in-JS.

## Stacking Toasts

When multiple toasts have the same position, they should stack. We can use flexbox:

```typescript
// Create a container for each position
const positionContainers = new Map<ToastPosition, HTMLElement>();

function getPositionContainer(position: ToastPosition): HTMLElement {
  let container = positionContainers.get(position);

  if (!container) {
    container = document.createElement("div");
    container.setAttribute("data-toast-container", position);
    container.style.position = "fixed";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "0.5rem";
    container.style.pointerEvents = "none"; // Let clicks pass through

    // Position the container
    switch (position) {
      case "top-left":
        container.style.top = "1rem";
        container.style.left = "1rem";
        break;
      // ... other positions
    }

    document.body.appendChild(container);
    positionContainers.set(position, container);
  }

  return container;
}
```

Then in ToastPortal:

```typescript
const [container] = useState(() => {
  const div = document.createElement("div");
  div.style.pointerEvents = "auto"; // Re-enable clicks for this toast
  return div;
});

useEffect(() => {
  const positionContainer = getPositionContainer(toast.position);
  positionContainer.appendChild(container);

  return () => {
    positionContainer.removeChild(container);

    // Clean up empty containers
    if (positionContainer.children.length === 0) {
      document.body.removeChild(positionContainer);
      positionContainers.delete(toast.position);
    }
  };
}, [container, toast.position]);
```

## Complete Provider Implementation

Here's the full implementation:

```typescript
// ToastProvider.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { getManagers, subscribeToRegistry } from './registry';
import type { Toast, ToastComponent, ToastManager } from './types';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    return subscribeToRegistry(() => {
      forceUpdate({});
    });
  }, []);

  const managers = getManagers();

  return (
    <>
      {children}
      {managers.map(([manager, components]) => (
        <ToastRenderer
          key={getManagerKey(manager)}
          manager={manager}
          components={components}
        />
      ))}
    </>
  );
};

const ToastRenderer: React.FC<{
  manager: ToastManager;
  components: Record<string, ToastComponent>;
}> = ({ manager, components }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return manager.subscribe(setToasts);
  }, [manager]);

  return (
    <>
      {toasts.map(toast => (
        <ToastPortal
          key={toast.id}
          toast={toast}
          components={components}
          manager={manager}
        />
      ))}
    </>
  );
};

const ToastPortal: React.FC<{
  toast: Toast;
  components: Record<string, ToastComponent>;
  manager: ToastManager;
}> = ({ toast, components, manager }) => {
  const [container] = useState(() => {
    const div = document.createElement('div');
    div.style.pointerEvents = 'auto';
    return div;
  });

  useEffect(() => {
    const positionContainer = getPositionContainer(toast.position);
    positionContainer.appendChild(container);

    return () => {
      positionContainer.removeChild(container);

      if (positionContainer.children.length === 0) {
        document.body.removeChild(positionContainer);
        positionContainers.delete(toast.position);
      }
    };
  }, [container, toast.position]);

  const Component = components[toast.variant];
  if (!Component) {
    console.warn(`No component registered for variant: ${toast.variant}`);
    return null;
  }

  const handleDismiss = () => manager.dismiss(toast.id);
  const handleMouseEnter = () => manager.pause(toast.id);
  const handleMouseLeave = () => manager.resume(toast.id);

  const content = (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toast.dismissOnClick ? handleDismiss : undefined}
      role={toast.role}
      aria-live={toast.role === 'alert' ? 'assertive' : 'polite'}
    >
      <Component {...toast.payload} dismiss={handleDismiss} toastId={toast.id} />
    </div>
  );

  return ReactDOM.createPortal(content, container);
};

// Helper functions
const managerKeys = new WeakMap<ToastManager, string>();
let keyCounter = 0;

function getManagerKey(manager: ToastManager): string {
  let key = managerKeys.get(manager);
  if (!key) {
    key = `manager-${keyCounter++}`;
    managerKeys.set(manager, key);
  }
  return key;
}

const positionContainers = new Map<string, HTMLElement>();

function getPositionContainer(position: string): HTMLElement {
  let container = positionContainers.get(position);

  if (!container) {
    container = document.createElement('div');
    container.setAttribute('data-toast-container', position);
    container.style.position = 'fixed';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';
    container.style.pointerEvents = 'none';

    // Position the container
    const [vertical, horizontal] = position.split('-');
    if (vertical === 'top') {
      container.style.top = '1rem';
    } else {
      container.style.bottom = '1rem';
    }

    if (horizontal === 'left') {
      container.style.left = '1rem';
    } else if (horizontal === 'right') {
      container.style.right = '1rem';
    } else {
      container.style.left = '50%';
      container.style.transform = 'translateX(-50%)';
    }

    document.body.appendChild(container);
    positionContainers.set(position, container);
  }

  return container;
}
```

## Next Steps

We now have a complete React integration! In the next tutorial, we'll add animations and transitions to make toasts appear and disappear smoothly.

**Key takeaways:**

- Portals render outside the normal DOM hierarchy
- Event-based registration connects the factory to the provider
- Position containers stack toasts naturally
- Pause/resume on hover improves UX
- Accessibility is built-in with ARIA attributes
