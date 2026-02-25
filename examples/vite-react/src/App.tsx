import { ToastProvider } from "@twist-toast/react";
import { useState } from "react";
import { modalToast, toast } from "./toast";

function App() {
  const [lastGlobalToastId, setLastGlobalToastId] = useState<string | null>(
    null,
  );
  const [lastModalToastId, setLastModalToastId] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-5 p-4 md:p-8">
      <header className="relative overflow-hidden rounded-3xl border border-slate-300/80 bg-linear-to-br from-sky-50 via-white to-cyan-50 p-5 shadow-[0_12px_42px_rgba(10,35,66,0.12)] md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-cyan-200/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 left-16 h-28 w-28 rounded-full bg-sky-200/40 blur-xl" />
        <div className="relative">
          <div className="inline-flex min-h-8 items-center rounded-full border border-sky-300/70 bg-white/80 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-sky-900">
            twist-toast
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-[1.06] text-slate-900 md:text-5xl">
            Minimal toast playground for real-world flows
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-base text-slate-600 md:text-lg">
            Test queue, dedupe refresh, scoped providers, and programmatic
            dismissal. This page is intentionally design-forward but
            lightweight.
          </p>
        </div>
        <div className="relative mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-300/70 bg-white/70 p-3 backdrop-blur-sm">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Global scope
            </span>
            <code className="block truncate text-xs font-semibold text-slate-800">
              {lastGlobalToastId ?? "no active id"}
            </code>
          </div>
          <div className="rounded-xl border border-slate-300/70 bg-white/70 p-3 backdrop-blur-sm">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Modal scope
            </span>
            <code className="block truncate text-xs font-semibold text-slate-800">
              {lastModalToastId ?? "no active id"}
            </code>
          </div>
          <div className="rounded-xl border border-slate-300/70 bg-white/70 p-3 backdrop-blur-sm">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Refresh count
            </span>
            <code className="block truncate text-xs font-semibold text-slate-800">
              {refreshCount}
            </code>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-300/80 bg-white/90 p-4 shadow-[0_6px_24px_rgba(18,41,64,0.08)] md:p-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Global scope (`scope=&quot;global&quot;`)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Primary app-level toasts rendered from the root provider.
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-100"
            type="button"
            onClick={() => {
              const toastId = toast.success(
                {
                  title: "Profile saved",
                  description: "All updates are now live.",
                },
                { duration: 3200 },
              );
              setLastGlobalToastId(toastId);
            }}
          >
            Success
          </button>
          <button
            className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-900 transition duration-150 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-100"
            type="button"
            onClick={() => {
              const toastId = toast.error(
                {
                  title: "Payment failed",
                  description: "Card authorization was declined.",
                  retryLabel: "Try again",
                },
                { role: "alert", duration: 7000 },
              );
              setLastGlobalToastId(toastId);
            }}
          >
            Error alert
          </button>
          <button
            className="rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-900 transition duration-150 hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-100"
            type="button"
            onClick={() => {
              const toastId = toast.custom(
                {
                  title: "Background sync",
                  description: "Click anywhere on the toast to dismiss.",
                  accent: "#1f7a8c",
                },
                { dismissOnClick: true },
              );
              setLastGlobalToastId(toastId);
            }}
          >
            Custom click-dismiss
          </button>
          <button
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition duration-150 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100"
            type="button"
            onClick={() => {
              toast.success({
                title: "Queue 1",
                description: "Visible slot #1",
              });
              toast.success({
                title: "Queue 2",
                description: "Visible slot #2",
              });
              toast.success({
                title: "Queue 3",
                description: "Queued until a slot opens",
              });
            }}
          >
            Queue burst (max=2)
          </button>
          <button
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition duration-150 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100"
            type="button"
            onClick={() => {
              const nextCount = refreshCount + 1;
              setRefreshCount(nextCount);
              const toastId = toast.custom(
                {
                  title: "Sync in progress",
                  description: `Refresh attempt #${nextCount}`,
                  accent: "#8f3f71",
                },
                { id: "sync-status", duration: 6000 },
              );
              setLastGlobalToastId(toastId);
            }}
          >
            Refresh duplicate id
          </button>
          <button
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition duration-150 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100"
            type="button"
            onClick={() => {
              if (lastGlobalToastId) {
                toast.dismiss(lastGlobalToastId);
              }
            }}
          >
            Dismiss last global
          </button>
          <button
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition duration-150 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100"
            type="button"
            onClick={() => {
              toast.dismissAll();
            }}
          >
            Dismiss all global
          </button>
        </div>
      </section>

      <ToastProvider scope="modal">
        <section className="rounded-2xl border border-violet-200 bg-linear-to-br from-violet-50/70 to-white p-4 shadow-[0_6px_24px_rgba(49,24,90,0.08)] md:p-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Modal scope (`scope=&quot;modal&quot;`)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Fully isolated manager and queue. Useful for workflows inside
              dialogs or focused experiences.
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <button
              className="rounded-xl border border-violet-300 bg-violet-100/80 px-3 py-2 text-sm font-semibold text-violet-900 transition duration-150 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-100"
              type="button"
              onClick={() => {
                const toastId = modalToast.info(
                  {
                    title: "Modal scoped info",
                    detail: "Rendered by the modal provider only.",
                  },
                  { duration: 4800 },
                );
                setLastModalToastId(toastId);
              }}
            >
              Show modal toast
            </button>
            <button
              className="rounded-xl border border-violet-300 bg-violet-100/80 px-3 py-2 text-sm font-semibold text-violet-900 transition duration-150 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-100"
              type="button"
              onClick={() => {
                if (lastModalToastId) {
                  modalToast.dismiss(lastModalToastId);
                }
              }}
            >
              Dismiss modal toast
            </button>
            <button
              className="rounded-xl border border-violet-300 bg-white px-3 py-2 text-sm font-semibold text-violet-800 transition duration-150 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50"
              type="button"
              onClick={() => {
                modalToast.dismissAll();
              }}
            >
              Dismiss all modal
            </button>
          </div>
        </section>
      </ToastProvider>
    </main>
  );
}

export default App;
