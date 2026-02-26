import {
  AlarmClock,
  Layers2,
  MousePointerClick,
  ShieldCheck,
  SquareStack,
  Type,
  type LucideIcon,
} from "lucide-react";

export interface ValueProp {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface BuilderToast {
  title: string;
  description: string;
  className: string;
}

export interface ApiOptionRow {
  option: string;
  type: string;
  description: string;
  defaultValue?: string;
}

export interface MethodRow {
  method: string;
  description: string;
}

export interface PlaygroundNote {
  icon: LucideIcon;
  description: string;
}

export const valueProps: ValueProp[] = [
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

export const behaviorChips = [
  "createToast() factory",
  "<ToastProvider />",
  "pause on hover",
  "dedupe by id",
  "multiple scopes",
  "zero runtime deps",
];

export const toastVariants = ["success", "error", "warning", "info", "custom"];

export const playgroundNotes: PlaygroundNote[] = [
  {
    icon: ShieldCheck,
    description: "Deduplicate by ID with refresh or ignore strategy.",
  },
  {
    icon: AlarmClock,
    description: "Pause on hover, resume timers per viewport position.",
  },
  {
    icon: MousePointerClick,
    description: "Optional click-to-dismiss for actionable toasts.",
  },
];

export const builderToasts: BuilderToast[] = [
  {
    title: "Profile updated",
    description: "Avatar, bio, and links are now live.",
    className: "border-emerald-400/45",
  },
  {
    title: "Deployment still running",
    description: "Auto-close delayed while background job is active.",
    className: "border-amber-400/45",
  },
  {
    title: "Publish failed",
    description:
      "Reusing ID will refresh this toast instead of duplicating it.",
    className: "border-red-400/45",
  },
];

export const builderMetrics = [
  { label: "maxToasts", value: "5" },
  { label: "dedupe", value: "refresh" },
];

export const installCommand = "pnpm add @twist-toast/react @twist-toast/core";

export const createToastCode = `import { createToast } from "@twist-toast/react";
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

export const providerCode = `import { ToastProvider } from "@twist-toast/react";
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

export const createOptions: ApiOptionRow[] = [
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

export const callOptions: ApiOptionRow[] = [
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

export const methods: MethodRow[] = [
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
