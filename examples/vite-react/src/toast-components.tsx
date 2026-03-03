import type { ToastComponentProps } from "@twist-toast/react";

export type SuccessPayload = {
  title: string;
  description?: string;
};

export type ErrorPayload = {
  title: string;
  description: string;
  retryLabel?: string;
};

export type CustomPayload = {
  title: string;
  description?: string;
  accent?: string;
};

export type LoadingPayload = {
  title: string;
  description?: string;
};

export type ModalPayload = {
  title: string;
  detail?: string;
};

export function SuccessToast({
  title,
  description,
  dismiss,
  toastId,
}: ToastComponentProps<SuccessPayload>) {
  return (
    <article className="flex items-start justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-3 shadow-[0_10px_24px_rgba(5,61,33,0.12)]">
      <div>
        <p className="text-[0.95rem] font-bold text-emerald-900">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-emerald-800/80">{description}</p>
        ) : null}
      </div>
      <button
        aria-label={`Dismiss toast ${toastId}`}
        className="min-h-8 rounded-lg border border-emerald-300 bg-white px-2.5 text-xs font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-100"
        type="button"
        onClick={dismiss}
      >
        Dismiss
      </button>
    </article>
  );
}

export function ErrorToast({
  title,
  description,
  retryLabel = "Retry",
  dismiss,
  toastId,
}: ToastComponentProps<ErrorPayload>) {
  return (
    <article className="flex items-start justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 p-3 shadow-[0_10px_24px_rgba(98,25,25,0.12)]">
      <div>
        <p className="text-[0.95rem] font-bold text-rose-900">{title}</p>
        <p className="mt-1 text-sm text-rose-900/80">{description}</p>
      </div>
      <div className="flex gap-2">
        <button
          className="min-h-8 rounded-lg border border-rose-300 bg-white px-2.5 text-xs font-semibold text-rose-900 transition hover:border-rose-400 hover:bg-rose-100"
          type="button"
        >
          {retryLabel}
        </button>
        <button
          aria-label={`Dismiss toast ${toastId}`}
          className="min-h-8 rounded-lg border border-rose-300 bg-white px-2.5 text-xs font-semibold text-rose-900 transition hover:border-rose-400 hover:bg-rose-100"
          type="button"
          onClick={dismiss}
        >
          Close
        </button>
      </div>
    </article>
  );
}

export function CustomToast({
  title,
  description,
  accent = "#1f7a8c",
  dismiss,
  toastId,
}: ToastComponentProps<CustomPayload>) {
  return (
    <article
      className="flex items-start justify-between gap-3 rounded-xl border bg-cyan-50 p-3 shadow-[0_10px_24px_rgba(14,63,78,0.12)]"
      style={{ borderColor: accent }}
    >
      <div>
        <p className="text-[0.95rem] font-bold text-cyan-950">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-cyan-900/80">{description}</p>
        ) : null}
      </div>
      <button
        aria-label={`Dismiss toast ${toastId}`}
        className="min-h-8 rounded-lg border border-cyan-300 bg-white px-2.5 text-xs font-semibold text-cyan-900 transition hover:border-cyan-400 hover:bg-cyan-100"
        type="button"
        onClick={dismiss}
      >
        Done
      </button>
    </article>
  );
}

export function LoadingToast({
  title,
  description,
  dismiss,
  toastId,
}: ToastComponentProps<LoadingPayload>) {
  return (
    <article className="flex items-start justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 shadow-[0_10px_24px_rgba(96,62,5,0.12)]">
      <div className="flex items-start gap-2">
        <span
          aria-hidden
          className="mt-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"
        />
        <div>
          <p className="text-[0.95rem] font-bold text-amber-900">{title}</p>
          {description ? (
            <p className="mt-1 text-sm text-amber-900/80">{description}</p>
          ) : null}
        </div>
      </div>
      <button
        aria-label={`Dismiss toast ${toastId}`}
        className="min-h-8 rounded-lg border border-amber-300 bg-white px-2.5 text-xs font-semibold text-amber-900 transition hover:border-amber-400 hover:bg-amber-100"
        type="button"
        onClick={dismiss}
      >
        Cancel
      </button>
    </article>
  );
}

export function ModalInfoToast({
  title,
  detail,
  dismiss,
  toastId,
}: ToastComponentProps<ModalPayload>) {
  return (
    <article className="flex items-start justify-between gap-3 rounded-xl border border-violet-300 bg-violet-50 p-3 shadow-[0_10px_24px_rgba(52,20,92,0.12)]">
      <div>
        <p className="text-[0.95rem] font-bold text-violet-900">{title}</p>
        {detail ? (
          <p className="mt-1 text-sm text-violet-900/80">{detail}</p>
        ) : null}
      </div>
      <button
        aria-label={`Dismiss toast ${toastId}`}
        className="min-h-8 rounded-lg border border-violet-300 bg-white px-2.5 text-xs font-semibold text-violet-900 transition hover:border-violet-400 hover:bg-violet-100"
        type="button"
        onClick={dismiss}
      >
        Close
      </button>
    </article>
  );
}
