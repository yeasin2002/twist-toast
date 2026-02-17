# Creating an Example App

## Introduction

The best way to test your library locally is to create an example app in your monorepo. This tutorial shows you how to set up a Next.js app that uses your twist-toast library, allowing you to test features and demonstrate usage.

## Why an Example App?

1. **Local testing**: Test your library without publishing to npm
2. **Documentation**: Show real-world usage examples
3. **Development**: Quickly iterate on features
4. **Debugging**: Easier to debug issues in a real app context

## Setting Up the Example App

### Step 1: Create Next.js App

In your monorepo root:

```bash
pnpm create next-app@latest apps/example --typescript --tailwind --app --no-src-dir
```

Answer the prompts:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- Import alias: No

### Step 2: Update Workspace Configuration

Your `pnpm-workspace.yaml` should already include `apps/*`:

```yaml
packages:
  - apps/*
  - packages/*
```

### Step 3: Link the Library

In `apps/example/package.json`, add your library as a dependency:

```json
{
  "name": "example",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "twist-toast": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10.0.1"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Run `pnpm install` from the root to link the packages.

### Step 4: Create Toast Configuration

Create `apps/example/lib/toast.ts`:

```typescript
import { createToast } from 'twist-toast';
import { SuccessToast, ErrorToast, InfoToast, WarningToast } from '@/components/toasts';

export const toast = createToast(
  {
    success: SuccessToast,
    error: ErrorToast,
    info: InfoToast,
    warning: WarningToast,
  },
  {
    defaultDuration: 4000,
    defaultPosition: 'top-right',
    maxToasts: 5,
  }
);
```

### Step 5: Create Toast Components

Create `apps/example/components/toasts.tsx`:

```typescript
import type { ToastComponentProps } from 'twist-toast';

export const SuccessToast = ({
  title,
  description,
  dismiss,
}: ToastComponentProps<{ title: string; description?: string }>) => {
  return (
    <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
        </div>
        <button
          onClick={dismiss}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export const ErrorToast = ({
  title,
  description,
  dismiss,
}: ToastComponentProps<{ title: string; description?: string }>) => {
  return (
    <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
        </div>
        <button
          onClick={dismiss}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export const InfoToast = ({
  message,
  dismiss,
}: ToastComponentProps<{ message: string }>) => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]">
      <div className="flex items-start justify-between">
        <p className="flex-1">{message}</p>
        <button
          onClick={dismiss}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export const WarningToast = ({
  message,
  action,
  dismiss,
}: ToastComponentProps<{ message: string; action?: { label: string; onClick: () => void } }>) => {
  return (
    <div className="bg-yellow-500 text-gray-900 p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p>{message}</p>
          {action && (
            <button
              onClick={() => {
                action.onClick();
                dismiss();
              }}
              className="mt-2 text-sm font-semibold underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          className="ml-4 text-gray-900 hover:text-gray-700 transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
```

### Step 6: Add Provider to Layout

Update `apps/example/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from 'twist-toast';
import 'twist-toast/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'twist-toast Example',
  description: 'Example app demonstrating twist-toast library',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

### Step 7: Create Demo Page

Update `apps/example/app/page.tsx`:

```typescript
'use client';

import { toast } from '@/lib/toast';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">twist-toast Demo</h1>

        <div className="space-y-4">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Basic Toasts</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  toast.success({
                    title: 'Success!',
                    description: 'Your action was completed successfully.',
                  })
                }
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Show Success
              </button>

              <button
                onClick={() =>
                  toast.error({
                    title: 'Error!',
                    description: 'Something went wrong. Please try again.',
                  })
                }
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Show Error
              </button>

              <button
                onClick={() =>
                  toast.info({
                    message: 'This is an informational message.',
                  })
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Show Info
              </button>

              <button
                onClick={() =>
                  toast.warning({
                    message: 'This action cannot be undone.',
                    action: {
                      label: 'Undo',
                      onClick: () => console.log('Undo clicked'),
                    },
                  })
                }
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600"
              >
                Show Warning
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Positions</h2>
            <div className="flex flex-wrap gap-4">
              {[
                'top-left',
                'top-center',
                'top-right',
                'bottom-left',
                'bottom-center',
                'bottom-right',
              ].map((position) => (
                <button
                  key={position}
                  onClick={() =>
                    toast.info(
                      { message: `Toast at ${position}` },
                      { position: position as any }
                    )
                  }
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {position}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Durations</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  toast.info(
                    { message: 'Short duration (1s)' },
                    { duration: 1000 }
                  )
                }
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                1 second
              </button>

              <button
                onClick={() =>
                  toast.info(
                    { message: 'Long duration (10s)' },
                    { duration: 10000 }
                  )
                }
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                10 seconds
              </button>

              <button
                onClick={() =>
                  toast.info(
                    { message: 'No auto-dismiss (hover to see pause)' },
                    { duration: 0 }
                  )
                }
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                No auto-dismiss
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Queue Management</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  for (let i = 1; i <= 10; i++) {
                    toast.info({ message: `Toast ${i}` });
                  }
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Show 10 Toasts (queued)
              </button>

              <button
                onClick={() => toast.dismissAll()}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Dismiss All
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Programmatic Control</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const id = toast.info(
                    { message: 'Loading...' },
                    { duration: 0 }
                  );

                  setTimeout(() => {
                    toast.dismiss(id);
                    toast.success({
                      title: 'Complete!',
                      description: 'The operation finished successfully.',
                    });
                  }, 2000);
                }}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Loading → Success
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  toast.error(
                    {
                      title: 'Critical Error',
                      description: 'This is an assertive alert.',
                    },
                    { role: 'alert' }
                  )
                }
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                Alert Role (Assertive)
              </button>

              <button
                onClick={() =>
                  toast.info(
                    { message: 'This is a polite status update.' },
                    { role: 'status' }
                  )
                }
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Status Role (Polite)
              </button>
            </div>
          </section>
        </div>

        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Tips</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Hover over toasts to pause auto-dismiss</li>
            <li>Click toasts to dismiss them (if dismissOnClick is enabled)</li>
            <li>Try triggering multiple toasts to see queue management</li>
            <li>Test different positions to see portal rendering</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
```

### Step 8: Run the Example

From the monorepo root:

```bash
# Build the library first
pnpm build

# Start the example app
cd apps/example
pnpm dev
```

Open http://localhost:3000 to see your example app!

## Testing Workflow

When developing the library:

1. Make changes to `packages/twist-toast/src/`
2. Rebuild: `cd packages/twist-toast && pnpm build`
3. The example app will hot-reload with the changes
4. Test the feature in the example app

For faster iteration, use watch mode:

```bash
# Terminal 1: Watch library
cd packages/twist-toast
pnpm dev

# Terminal 2: Run example
cd apps/example
pnpm dev
```

## Adding More Examples

Create additional pages to demonstrate specific features:

```typescript
// apps/example/app/advanced/page.tsx
'use client';

import { createToast } from 'twist-toast';
import { CustomToast } from '@/components/toasts';

// Create a second toast instance for this page
const pageToast = createToast(
  {
    custom: CustomToast,
  },
  {
    defaultPosition: 'bottom-center',
    maxToasts: 3,
  }
);

export default function AdvancedPage() {
  return (
    <div>
      <h1>Advanced Examples</h1>
      <button onClick={() => pageToast.custom({ data: 'test' })}>
        Show Custom Toast
      </button>
    </div>
  );
}
```

## Debugging Tips

1. **Check the console**: Look for warnings about missing components
2. **Inspect the DOM**: Use browser DevTools to see portal containers
3. **React DevTools**: Install React DevTools to inspect component tree
4. **Network tab**: Ensure the library is being loaded correctly
5. **TypeScript errors**: Check that types are being inferred correctly

## Next Steps

You now have a fully functional example app! Use it to:
- Test new features before publishing
- Create documentation screenshots
- Demonstrate usage patterns
- Debug issues in a real-world context

**Key takeaways:**
- Example apps are essential for library development
- Use workspace protocol to link local packages
- Create comprehensive demos for all features
- Watch mode enables fast iteration
- Multiple toast instances can coexist
