import Link from "next/link";

import {
  AlarmClock,
  Layers2,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  SquareStack,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const valueProps = [
  {
    icon: Type,
    title: "Your design system, not ours",
    description:
      "Ship toast UI that feels native to your product while twist-toast handles behavior.",
  },
  {
    icon: SquareStack,
    title: "Typed from your component map",
    description:
      "Infer payload types from variants so `toast.success(...)` is always compile-time safe.",
  },
  {
    icon: Layers2,
    title: "Queueing + dedupe built in",
    description:
      "Control visibility limits, refresh duplicate IDs, and dismiss programmatically.",
  },
];

const behaviorChips = [
  "createToast() factory",
  "<ToastProvider />",
  "pause on hover",
  "dedupe by id",
  "multiple scopes",
  "zero runtime deps",
];

const installCommand = "pnpm add @twist-toast/react @twist-toast/core";

const createToastCode = `import { createToast } from "@twist-toast/react";
import type { ToastComponentProps } from "@twist-toast/react";

type MessageToast = { title: string; description?: string };

function SuccessToast({
  title,
  description,
  dismiss,
}: ToastComponentProps<MessageToast>) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="font-semibold text-emerald-700">{title}</p>
      {description ? <p className="mt-1 text-sm">{description}</p> : null}
      <button onClick={dismiss}>Close</button>
    </article>
  );
}

export const toast = createToast(
  {
    success: SuccessToast,
    error: SuccessToast,
    warning: SuccessToast,
  },
  {
    defaultDuration: 4200,
    defaultPosition: "top-right",
    maxToasts: 5,
    dedupe: "refresh",
  },
);`;

const providerCode = `import { ToastProvider } from "@twist-toast/react";
import { toast } from "./toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}

toast.success(
  { title: "Draft saved", description: "All changes synced." },
  { id: "draft-save", duration: 3000 },
);`;

const createOptions = [
  {
    option: "defaultDuration",
    type: "number",
    defaultValue: "4000",
    description: "Fallback lifetime in milliseconds for each toast.",
  },
  {
    option: "defaultPosition",
    type: "ToastPosition",
    defaultValue: '"top-right"',
    description: "Viewport anchor used when a call does not pass a position.",
  },
  {
    option: "maxToasts",
    type: "number",
    defaultValue: "5",
    description: "Maximum visible items before new toasts enter the queue.",
  },
  {
    option: "dedupe",
    type: '"refresh" | "ignore"',
    defaultValue: '"refresh"',
    description:
      "Controls what happens when a toast is triggered with same ID.",
  },
  {
    option: "scope",
    type: "string",
    defaultValue: '"default"',
    description: "Isolation key for multiple independent toast systems.",
  },
];

const callOptions = [
  {
    option: "id",
    type: "string",
    description: "Stable identifier used for dedupe and targeted dismissal.",
  },
  {
    option: "duration",
    type: "number",
    description: "Override duration for this single toast call.",
  },
  {
    option: "position",
    type: "ToastPosition",
    description: "Per-toast anchor: top/bottom + left/center/right.",
  },
  {
    option: "dismissOnClick",
    type: "boolean",
    description: "Allows click-to-close interaction for a toast instance.",
  },
  {
    option: "role",
    type: '"status" | "alert"',
    description: "ARIA live region mode for accessibility semantics.",
  },
];

const methods = [
  {
    method: "toast.variant(payload, options?)",
    description: "Typed shortcut generated from each variant key.",
  },
  {
    method: "toast.show(variant, payload, options?)",
    description: "Dynamic variant trigger.",
  },
  { method: "toast.dismiss(id)", description: "Dismiss a single toast by ID." },
  {
    method: "toast.dismissAll()",
    description: "Flush visible and queued toasts.",
  },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="tt-code-block">
      <code>{code}</code>
    </pre>
  );
}

function HeaderRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 max-w-3xl md:mb-10">
      <p className="tt-kicker">{subtitle}</p>
      <h2 className="mt-3 text-3xl leading-tight tracking-tight md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

export function TwistToastPage() {
  return (
    <div className="pb-16 md:pb-24">
      <section className="relative container pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="tt-grid-glow" aria-hidden="true" />
        <div className="relative grid gap-14 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="tt-kicker">Design-system-first notifications</p>
            <h1 className="mt-4 max-w-4xl text-5xl leading-[0.95] tracking-tight text-balance md:text-7xl">
              twist-toast gives you total UI freedom with reliable toast
              behavior.
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
              Keep your own components. twist-toast handles queueing, timing,
              accessibility, dedupe, and provider orchestration with strict
              TypeScript inference.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="#docs">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="https://github.com/yeasin2002/twist-toast"
                  rel="noreferrer"
                  target="_blank"
                >
                  View GitHub
                </a>
              </Button>
              <span className="border-border/80 bg-background/70 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase">
                MIT Licensed
              </span>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {valueProps.map((item) => (
                <article key={item.title} className="tt-panel">
                  <item.icon className="text-primary size-5" />
                  <h2 className="mt-4 text-lg leading-tight font-semibold">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="tt-panel h-fit md:sticky md:top-28">
            <p className="tt-kicker">Quick install</p>
            <CodeBlock code={installCommand} />

            <div className="mt-6 space-y-3">
              {behaviorChips.map((chip) => (
                <div
                  key={chip}
                  className="border-border/70 bg-background/80 flex items-center justify-between rounded-xl border px-3 py-2"
                >
                  <span className="text-sm">{chip}</span>
                  <Sparkles className="text-primary/70 size-4" />
                </div>
              ))}
            </div>

            <p className="text-muted-foreground mt-5 text-xs leading-relaxed">
              Works with multiple isolated scopes, custom variants, and
              programmatic control without forcing a design opinion.
            </p>
          </aside>
        </div>
      </section>

      <section id="playground" className="container pb-20 md:pb-28">
        <HeaderRow
          title="Examples and Builder"
          subtitle="Configure behavior without sacrificing branding"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <article className="tt-panel">
            <h3 className="text-xl font-semibold">Toast recipes</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Model variants around your system tokens and trigger them through
              the generated API.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["success", "error", "warning", "info", "custom"].map(
                (variant) => (
                  <span key={variant} className="tt-chip">
                    {variant}
                  </span>
                ),
              )}
            </div>
            <div className="mt-6 space-y-3">
              <div className="tt-list-item">
                <ShieldCheck className="size-4" />
                <span>Deduplicate by ID with refresh or ignore strategy.</span>
              </div>
              <div className="tt-list-item">
                <AlarmClock className="size-4" />
                <span>
                  Pause on hover, resume timers per viewport position.
                </span>
              </div>
              <div className="tt-list-item">
                <MousePointerClick className="size-4" />
                <span>Optional click-to-dismiss for actionable toasts.</span>
              </div>
            </div>
          </article>

          <article className="tt-panel">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Builder preview</h3>
              <span className="tt-chip">top-right</span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              This mirrors runtime behavior: max visible stack + queued entries.
            </p>

            <div className="mt-6 space-y-3">
              <div className="tt-toast-item border-emerald-400/45">
                <p className="font-semibold">Profile updated</p>
                <p className="text-muted-foreground text-sm">
                  Avatar, bio, and links are now live.
                </p>
              </div>
              <div className="tt-toast-item border-amber-400/45">
                <p className="font-semibold">Deployment still running</p>
                <p className="text-muted-foreground text-sm">
                  Auto-close delayed while background job is active.
                </p>
              </div>
              <div className="tt-toast-item border-red-400/45">
                <p className="font-semibold">Publish failed</p>
                <p className="text-muted-foreground text-sm">
                  Reusing ID will refresh this toast instead of duplicating it.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="border-border/70 bg-background/80 rounded-xl border p-3">
                <p className="tt-label">maxToasts</p>
                <p className="mt-1 text-2xl font-semibold">5</p>
              </div>
              <div className="border-border/70 bg-background/80 rounded-xl border p-3">
                <p className="tt-label">dedupe</p>
                <p className="mt-1 text-2xl font-semibold">refresh</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="docs" className="container pb-20 md:pb-28">
        <HeaderRow
          title="Documentation"
          subtitle="Install, define variants, and trigger toasts in minutes"
        />

        <div className="space-y-6">
          <article className="tt-panel">
            <p className="tt-kicker">1. Install</p>
            <CodeBlock code={installCommand} />
          </article>

          <article className="tt-panel">
            <p className="tt-kicker">2. Create typed toasts</p>
            <CodeBlock code={createToastCode} />
          </article>

          <article className="tt-panel">
            <p className="tt-kicker">3. Mount provider and trigger</p>
            <CodeBlock code={providerCode} />
          </article>
        </div>
      </section>

      <section id="api" className="container">
        <HeaderRow
          title="API reference"
          subtitle="Core options designed for predictable runtime control"
        />

        <div className="space-y-6">
          <article className="tt-panel overflow-x-auto">
            <h3 className="text-xl font-semibold">createToast options</h3>
            <table className="tt-table mt-4">
              <caption className="sr-only">Create toast options</caption>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {createOptions.map((row) => (
                  <tr key={row.option}>
                    <td>{row.option}</td>
                    <td>{row.type}</td>
                    <td>{row.defaultValue}</td>
                    <td>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="tt-panel overflow-x-auto">
            <h3 className="text-xl font-semibold">Per-toast call options</h3>
            <table className="tt-table mt-4">
              <caption className="sr-only">Per toast options</caption>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {callOptions.map((row) => (
                  <tr key={row.option}>
                    <td>{row.option}</td>
                    <td>{row.type}</td>
                    <td>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="tt-panel overflow-x-auto">
            <h3 className="text-xl font-semibold">Runtime methods</h3>
            <table className="tt-table mt-4">
              <caption className="sr-only">Toast runtime methods</caption>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((row) => (
                  <tr key={row.method}>
                    <td>{row.method}</td>
                    <td>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </div>
      </section>
    </div>
  );
}
