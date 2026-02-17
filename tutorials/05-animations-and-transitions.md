# Animations and Transitions

## Introduction

Right now, toasts appear and disappear instantly, which feels jarring. We want smooth enter/exit animations. However, we face a challenge: **we don't want to force users to use a specific animation library**. Some teams use CSS transitions, others use Framer Motion, and some might use React Spring.

Our solution: provide the hooks and lifecycle events, but let users implement the animations themselves.

## The Animation Challenge

When a toast is dismissed, we can't just remove it from the DOM immediately. We need to:

1. Mark it as "exiting"
2. Wait for the exit animation to complete
3. Then remove it from the DOM

This is tricky because React wants to unmount components immediately when they're removed from the render tree.

## Approach 1: CSS Transitions with State

The simplest approach: add a state to track whether the toast is entering or exiting.

```typescript
const ToastPortal: React.FC<ToastPortalProps> = ({ toast, components, manager }) => {
  const [state, setState] = useState<'entering' | 'active' | 'exiting'>('entering');

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => {
      setState('active');
    }, 10); // Small delay to ensure CSS transition triggers

    return () => clearTimeout(timer);
  }, []);

  // ... rest of component

  const handleDismiss = () => {
    setState('exiting');

    // Wait for animation, then actually dismiss
    setTimeout(() => {
      manager.dismiss(toast.id);
    }, 300); // Match your CSS transition duration
  };

  const content = (
    <div
      data-state={state}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toast.dismissOnClick ? handleDismiss : undefined}
    >
      <Component {...toast.payload} dismiss={handleDismiss} toastId={toast.id} />
    </div>
  );

  return ReactDOM.createPortal(content, container);
};
```

Then users can style based on the state:

```css
[data-state="entering"] {
  opacity: 0;
  transform: translateY(-100%);
}

[data-state="active"] {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 300ms,
    transform 300ms;
}

[data-state="exiting"] {
  opacity: 0;
  transform: translateY(-100%);
  transition:
    opacity 300ms,
    transform 300ms;
}
```

**Problem**: The animation duration is hardcoded in JavaScript (300ms). If users change their CSS, they need to update the JS too.

## Approach 2: Listening to transitionend

We can listen for the `transitionend` event instead of using a timeout:

```typescript
const handleDismiss = () => {
  setState("exiting");
};

useEffect(() => {
  if (state !== "exiting") {
    return;
  }

  const handleTransitionEnd = () => {
    manager.dismiss(toast.id);
  };

  container.addEventListener("transitionend", handleTransitionEnd);

  return () => {
    container.removeEventListener("transitionend", handleTransitionEnd);
  };
}, [state, container, manager, toast.id]);
```

**Problem**: `transitionend` fires for every CSS property that transitions. If you transition both `opacity` and `transform`, it fires twice. We need to filter:

```typescript
const handleTransitionEnd = (event: TransitionEvent) => {
  // Only dismiss when the opacity transition ends
  if (event.propertyName === "opacity") {
    manager.dismiss(toast.id);
  }
};
```

## Approach 3: Configurable Animation Duration

Let's make the animation duration configurable:

```typescript
export interface CreateToastOptions {
  defaultDuration?: number;
  defaultPosition?: ToastPosition;
  dismissOnClick?: boolean;
  maxToasts?: number;
  animationDuration?: number; // NEW
}
```

Store it in the manager:

```typescript {}) {
    this.maxToasts = options.maxToasts ?? 5;
    this.animationDuration = options.animationDuration ?? 300;
  }

  getAnimationDuration(): number {
    return this.animationDuration;
  }
}
```

Use it in the portal:

```typescript
const ToastPortal: React.FC<ToastPortalProps> = ({
  toast,
  components,
  manager,
}) => {
  const [state, setState] = useState<"entering" | "active" | "exiting">(
    "entering",
  );
  const animationDuration = manager.getAnimationDuration();

  // ... enter animation

  const handleDismiss = () => {
    setState("exiting");
    setTimeout(() => {
      manager.dismiss(toast.id);
    }, animationDuration);
  };

  // ...
};
```

Users can now configure it:

```typescript
const toast = createToast(
  { success: SuccessToast },
  { animationDuration: 500 },
);
```

And use CSS variables:

```css
[data-state="active"],
[data-state="exiting"] {
  transition:
    opacity var(--toast-animation-duration, 300ms),
    transform var(--toast-animation-duration, 300ms);
}
```

## Approach 4: Render Prop for Custom Animations

For maximum flexibility, we can provide a render prop that gives users full control:

```typescript
export interface CreateToastOptions {
  // ... other options
  renderToast?: (props: RenderToastProps) => React.ReactNode;
}

export interface RenderToastProps {
  toast: Toast;
  Component: ToastComponent;
  dismiss: () => void;
  state: "entering" | "active" | "exiting";
}
```

Then in the portal:

```typescript
const ToastPortal: React.FC<ToastPortalProps> = ({ toast, components, manager, renderToast }) => {
  const [state, setState] = useState<'entering' | 'active' | 'exiting'>('entering');

  // ... lifecycle logic

  const Component = components[toast.variant];
  if (!Component) {
    return null;
  }

  const handleDismiss = () => {
    setState('exiting');
    setTimeout(() => {
      manager.dismiss(toast.id);
    }, manager.getAnimationDuration());
  };

  const content = renderToast ? (
    renderToast({
      toast,
      Component,
      dismiss: handleDismiss,
      state,
    })
  ) : (
    <div data-state={state}>
      <Component {...toast.payload} dismiss={handleDismiss} toastId={toast.id} />
    </div>
  );

  return ReactDOM.createPortal(content, container);
};
```

Users can now use Framer Motion:

```typescript
import { motion, AnimatePresence } from 'framer-motion';

const toast = createToast(
  { success: SuccessToast },
  {
    renderToast: ({ Component, toast, dismiss, state }) => (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <Component {...toast.payload} dismiss={dismiss} toastId={toast.id} />
      </motion.div>
    ),
  }
);
```

**Problem**: This is complex and most users won't need it. Let's keep it simple for Phase 1.

## Recommended Approach for Phase 1

For Phase 1, we'll use Approach 3 (configurable duration with CSS transitions). It's simple, flexible, and doesn't require users to learn a new API.

Here's the implementation:

```typescript
// In ToastManager
class ToastManager {
  private animationDuration: number;

  constructor(options: { maxToasts?: number; animationDuration?: number } = {}) {
    this.maxToasts = options.maxToasts ?? 5;
    this.animationDuration = options.animationDuration ?? 300;
  }

  getAnimationDuration(): number {
    return this.animationDuration;
  }
}

// In ToastPortal
const ToastPortal: React.FC<ToastPortalProps> = ({ toast, components, manager }) => {
  const [state, setState] = useState<'entering' | 'active' | 'exiting'>('entering');
  const animationDuration = manager.getAnimationDuration();

  useEffect(() => {
    // Trigger enter animation after a small delay
    const timer = setTimeout(() => {
      setState('active');
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const Component = components[toast.variant];
  if (!Component) {
    console.warn(`No component registered for variant: ${toast.variant}`);
    return null;
  }

  const handleDismiss = () => {
    if (state === 'exiting') {
      return; //Duration);
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
      style={{
        pointerEvents: 'auto',
      }}
    >
      <Component {...toast.payload} dismiss={handleDismiss} toastId={toast.id} />
    </div>
  );

  return ReactDOM.createPortal(content, container);
};
```

## Providing Default Styles

We can provide an optional CSS file that users can import:

```css
/* toast.css */
[data-state="entering"] {
  opacity: 0;
  transform: translateY(-1rem);
}

[data-state="active"] {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 300ms ease-out,
    transform 300ms ease-out;
}

[data-state="exiting"] {
  opacity: 0;
  transform: translateY(-1rem);
  transition:
    opacity 300ms ease-in,
    transform 300ms ease-in;
}

/* Position-specific animations */
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
```

Users can import it:

```typescript
import "twist-toast/styles.css";
```

Or write their own styles targeting the same data attributes.

## Advanced: Staggered Animations

When multiple toasts appear at once, we can stagger their animations:

```typescript
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
      {toasts.map((toast, index) => (
        <ToastPortal
          key={toast.id}
          toast={toast}
          components={components}
          manager={manager}
          delay={index * 50} // Stagger by 50ms
        />
      ))}
    </>
  );
};

const ToastPortal: React.FC<ToastPortalProps & { delay?: number }> = ({
  toast,
  components,
  manager,
  delay = 0,
}) => {
  const [state, setState] = useState<'entering' | 'active' | 'exiting'>('entering');

  useEffect(() => {
    const timer = setTimeout(() => {
      setState('active');
    }, 10 + delay); // Add delay

    return () => clearTimeout(timer);
  }, [delay]);

  // ... rest of component
};
```

## Accessibility Considerations

Animations should respect the user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  [data-state="entering"],
  [data-state="active"],
  [data-state="exiting"] {
    transition: none;
    animation: none;
  }
}
```

We can also check this in JavaScript:

```typescript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const animationDuration = prefersReducedMotion
  ? 0
  : manager.getAnimationDuration();
```

## Testing Animations

Testing animations is tricky. We can use Jest's fake timers:

```typescript
describe('ToastPortal animations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should transition from entering to active', () => {
    const { container } = render(<ToastPortal {...props} />);

    expect(ccontainer, getByRole } = render(<ToastPortal {...props} />);

    jest.advanceTimersByTime(10); // Enter

    const toast = getByRole('status');
    fireEvent.click(toast);

    expect(container.querySelector('[data-state="exiting"]')).toBeInTheDocument();

    jest.advanceTimersByTime(300); // Exit animation

    expect(mockManager.dismiss).toHaveBeenCalledWith(props.toast.id);
  });
});
```

## Next Steps

We now have smooth animations! In the next tutorial, we'll add advanced features like toast updates, progress bars, and custom positions.

**Key takeaways:**

- Use CSS transitions for simple, performant animations
- Make animation duration conontainer.querySelector('[data-state="entering"]')).toBeInTheDocument();

  jest.advanceTimersByTime(10);

  expect(container.querySelector('[data-state="active"]')).toBeInTheDocument();

});

it('should transition to exiting when dismissed', () => {
const { Already exiting
}

    setState('exiting');

    setTimeout(() => {
      manager.dismiss(toast.id);
    }, animation

class ToastManager {
private animationDuration: number;

constructor(options: { maxToasts?: number; animationDuration?: number } =

```

```
