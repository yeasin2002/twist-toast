# Complete Implementation Guide

## Introduction

This tutorial brings everything together. We'll create the complete file structure, implement all the pieces we've discussed, and build a working library that you can test locally.

## Project Structure

Here's the complete structure for `packages/twist-toast/src/`:

```
packages/twist-toast/
├── src/
│   ├── core/
│   │   ├── manager.ts          # Toast manager (state machine)
│   │   ├── registry.ts         # Global manager registry
│   │   └── types.ts            # Core type definitions
│   ├── react/
│   │   ├── ToastProvider.tsx   # React provider component
│   │   ├── ToastRenderer.tsx   # Renders toasts for one manager
│   │   ├── ToastPortal.tsx     # Portal for single toast
│   │   └── utils.ts            # React-specific utilities
│   ├── factory/
│   │   ├── createToast.ts      # Factory function
│   │   └── types.ts            # Factory type definitions
│   ├── index.ts                # Main entry point
│   └── styles.css              # Optional default styles
├── tsdown.config.ts
├── package.json
└── README.md
```

## Step 1: Core Types

Create `src/core/types.ts`:

```typescript
import type React from 'react';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Toast {
  id: string;
  variant: string;
  payload: Record<string, any>;
  duration: number;
  position: ToastPosition;
  dismissOnClick: boolean;
  role: 'alert' | 'status';
  createdAt: number;
  pausedAt?: number;
  remainingTime?: number;
}

export interface ToastComponentProps<TPayload = any> extends TPayload {
  dismiss: () => void;
  toastId: string;
}

export type ToastComponent<TPayload = any> = React.ComponentType<
  ToastComponentProps<TPayload>
>;

export interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  dismissOnClick?: boolean;
  role?: 'alert' | 'status';
  id?: string;
}
```

## Step 2: Toast Manager

Create `src/core/manager.ts`:

```typescript
import type { Toast, ToastPosition } from './types';

type ToastSubscriber = (toasts: Toast[]) => void;

export interface ToastManagerOptions {
  maxToasts?: number;
  animationDuration?: number;
}

export class ToastManager {
  private toasts: Map<string, Toast> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private subscribers: Set<ToastSubscriber> = new Set();
  private maxToasts: number;
  private animationDuration: number;

  constructor(options: ToastManagerOptions = {}) {
    this.maxToasts = options.maxToasts ?? 5;
    this.animationDuration = options.animationDuration ?? 300;
  }

  add(toast: Omit<Toast, 'id' | 'createdAt'> & { id?: string }): string {
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
      if (nextToast && nextToast.duration > 0) {
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

  subscribe(callback: ToastSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.getToasts());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  getAnimationDuration(): number {
    return this.animationDuration;
  }

  private notify(): void {
    const toasts = this.getToasts();
    this.subscribers.forEach((callback) => callback(toasts));
  }

  private getToasts(): Toast[] {
    return Array.from(this.toasts.values()).sort(
      (a, b) => a.createdAt - b.createdAt
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

## Step 3: Registry

Create `src/core/registry.ts`:

```typescript
import type { ToastManager } from './manager';
import type { ToastComponent } from './types';

type RegistryListener = () => void;

const globalRegistry = new Map<
  ToastManager,
  Record<string, ToastComponent>
>();
const listeners = new Set<RegistryListener>();

export function registerManager(
  manager: ToastManager,
  components: Record<string, ToastComponent>
): void {
  globalRegistry.set(manager, components);
  notifyListeners();
}

export function unregisterManager(manager: ToastManager): void {
  globalRegistry.delete(manager);
  notifyListeners();
}

export function getManagers(): Array<
  [ToastManager, Record<string, ToastComponent>]
> {
  return Array.from(globalRegistry.entries());
}

export function subscribeToRegistry(listener: RegistryListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}
```

## Step 4: Factory Types

Create `src/factory/types.ts`:

```typescript
import type { ToastComponent, ToastComponentProps, ToastOptions } from '../core/types';

// Extract payload type from component
type ExtractPayload<TComponent> = TComponent extends React.ComponentType<
  infer P
>
  ? Omit<P, 'dismiss' | 'toastId'>
  : never;

// Generate methods from component map
export type ToastMethods<TComponents extends Record<string, ToastComponent>> =
  {
    [K in keyof TComponents]: (
      payload: ExtractPayload<TComponents[K]>,
      options?: ToastOptions
    ) => string;
  };

// Toast instance type
export type ToastInstance<TComponents extends Record<string, ToastComponent>> =
  ToastMethods<TComponents> & {
    dismiss: (id: string) => void;
    dismissAll: () => void;
  };

export interface CreateToastOptions {
  defaultDuration?: number;
  defaultPosition?: ToastPosition;
  dismissOnClick?: boolean;
  maxToasts?: number;
  animationDuration?: number;
}
```

## Step 5: Factory Implementation

Create `src/factory/createToast.ts`:

```typescript
import { ToastManager } from '../core/manager';
import { registerManager } from '../core/registry';
import type { ToastComponent, ToastOptions } from '../core/types';
import type { CreateToastOptions, ToastInstance, ToastMethods } from './types';

export function createToast<
  TComponents extends Record<string, ToastComponent>
>(
  components: TComponents,
  options: CreateToastOptions = {}
): ToastInstance<TComponents> {
  const manager = new ToastManager({
    maxToasts: options.maxToasts ?? 5,
    animationDuration: options.animationDuration ?? 300,
  });

  const defaults = {
    duration: options.defaultDuration ?? 4000,
    position: options.defaultPosition ?? ('top-right' as const),
    dismissOnClick: options.dismissOnClick ?? true,
    role: 'status' as const,
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
        id: opts?.id,
      });
    };
  }

  const instance = {
    ...methods,
    dismiss: (id: string) => manager.dismiss(id),
    dismissAll: () => manager.dismissAll(),
  };

  registerManager(manager, components);

  return instance;
}
```

## Step 6: React Components

Create `src/react/utils.ts`:

```typescript
import type { ToastManager } from '../core/manager';
import type { ToastPosition } from '../core/types';

const managerKeys = new WeakMap<ToastManager, string>();
let keyCounter = 0;

export function getManagerKey(manager: ToastManager): string {
  let key = managerKeys.get(manager);
  if (!key) {
    key = `manager-${keyCounter++}`;
    managerKeys.set(manager, key);
  }
  return key;
}

const positionContainers = new Map<ToastPosition, HTMLElement>();

export function getPositionContainer(position: ToastPosition): HTMLElement {
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

export function cleanupPositionContainer(position: ToastPosition): void {
  const container = positionContainers.get(position);
  if (container && container.children.length === 0) {
    document.body.removeChild(container);
    positionContainers.delete(position);
  }
}
```

Create `src/react/ToastPortal.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import type { Toast, ToastComponent } from '../core/types';
import type { ToastManager } from '../core/manager';
import { getPositionContainer, cleanupPositionContainer } from './utils';

interface ToastPortalProps {
  toast: Toast;
  components: Record<string, ToastComponent>;
  manager: ToastManager;
}

export const ToastPortal: React.FC<ToastPortalProps> = ({
  toast,
  components,
  manager,
}) => {
  const [state, setState] = useState<'entering' | 'active' | 'exiting'>(
    'entering'
  );
  const [container] = useState(() => {
    const div = document.createElement('div');
    div.style.pointerEvents = 'auto';
    return div;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setState('active');
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const positionContainer = getPositionContainer(toast.position);
    positionContainer.appendChild(container);

    return () => {
      positionContainer.removeChild(container);
      cleanupPositionContainer(toast.position);
    };
  }, [container, toast.position]);

  const Component = components[toast.variant];
  if (!Component) {
    console.warn(`No component registered for variant: ${toast.variant}`);
    return null;
  }

  const handleDismiss = () => {
    if (state === 'exiting') {
      return;
    }

    setState('exiting');

    setTimeout(() => {
      manager.dismiss(toast.id);
    }, manager.getAnimationDuration());
  };

  const handleMouseEnter = () => {
    if (state === 'active') {
      manager.pause(toast.id);
    }
  };

  const handleMouseLeave = () => {
    if (state === 'active') {
      manager.resume(toast.id);
    }
  };

  const content = (
    <div
      data-state={state}
      data-toast-id={toast.id}
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

Create `src/react/ToastRenderer.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import type { Toast, ToastComponent } from '../core/types';
import type { ToastManager } from '../core/manager';
import { ToastPortal } from './ToastPortal';

interface ToastRendererProps {
  manager: ToastManager;
  components: Record<string, ToastComponent>;
}

export const ToastRenderer: React.FC<ToastRendererProps> = ({
  manager,
  components,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return manager.subscribe(setToasts);
  }, [manager]);

  return (
    <>
      {toasts.map((toast) => (
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
```

Create `src/react/ToastProvider.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { getManagers, subscribeToRegistry } from '../core/registry';
import { ToastRenderer } from './ToastRenderer';
import { getManagerKey } from './utils';

interface ToastProviderProps {
  children: React.ReactNode;
}

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
        <ToastRenderer
          key={getManagerKey(manager)}
          manager={manager}
          components={components}
        />
      ))}
    </>
  );
};
```

## Step 7: Main Entry Point

Create `src/index.ts`:

```typescript
// Core exports
export { ToastManager } from './core/manager';
export type {
  Toast,
  ToastPosition,
  ToastComponent,
  ToastComponentProps,
  ToastOptions,
} from './core/types';

// Factory exports
export { createToast } from './factory/createToast';
export type {
  CreateToastOptions,
  ToastInstance,
  ToastMethods,
} from './factory/types';

// React exports
export { ToastProvider } from './react/ToastProvider';
```

## Step 8: Optional Styles

Create `src/styles.css`:

```css
[data-state="entering"] {
  opacity: 0;
  transform: translateY(-1rem);
}

[data-state="active"] {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms ease-out, transform 300ms ease-out;
}

[data-state="exiting"] {
  opacity: 0;
  transform: translateY(-1rem);
  transition: opacity 300ms ease-in, transform 300ms ease-in;
}

[data-toast-container="bottom-left"] [data-state="entering"],
[data-toast-container="bottom-center"] [data-state="entering"],
[data-toast-container="bottom-right"] [data-state="entering"] {
  transform: translateY(1rem);
}

[data-toast-container="bottom-left"] [data-state="exiting"],
[data-toast-container="bottom-center"] [data-state="exiting"],
[data-toast-container="bottom-right"] [data-state="exiting"] {
  transform: translateY(1rem);
}

@media (prefers-reduced-motion: reduce) {
  [data-state="entering"],
  [data-state="active"],
  [data-state="exiting"] {
    transition: none;
    animation: none;
  }
}
```

## Step 9: Build Configuration

Update `tsdown.config.ts`:

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: false,
  sourcemap: true,
});
```

## Step 10: Package Configuration

Update `package.json`:

```json
{
  "name": "twist-toast",
  "version": "1.0.0",
  "description": "A React toast notification library with full design control",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tsdown": "^0.18.1",
    "typescript": "^5.9.3",
    "vitest": "^1.0.0"
  },
  "keywords": [
    "react",
    "toast",
    "notification",
    "typescript",
    "headless"
  ]
}
```

## Step 11: Build and Test Locally

Build the library:

```bash
cd packages/twist-toast
pnpm build
```

You should see output in `dist/`:
- `index.mjs` (ESM)
- `index.cjs` (CommonJS)
- `index.d.ts` (TypeScript types)
- `styles.css` (optional styles)

## Step 12: Local Testing with pnpm link

To test in another project:

```bash
# In twist-toast package
cd packages/twist-toast
pnpm link --global

# In your test project
pnpm link --global twist-toast
```

Or use the example app in your monorepo (we'll cover this in the next tutorial).

## Next Steps

You now have a complete, working library! In the next tutorial, we'll create an example app to demonstrate usage and test the library locally.

**Key takeaways:**
- Organize code by concern (core, factory, react)
- Export only what users need
- Provide both ESM and CJS builds
- Include TypeScript declarations
- Optional styles give users a starting point
