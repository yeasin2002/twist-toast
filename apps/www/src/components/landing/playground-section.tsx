import { SectionHeader } from "../blocks/primitives";
import {
  builderMetrics,
  builderToasts,
  playgroundNotes,
  toastVariants,
} from "./data";

export function PlaygroundSection() {
  return (
    <section id="playground" className="container pb-20 md:pb-28">
      <SectionHeader
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
            {toastVariants.map((variant) => (
              <span key={variant} className="tt-chip">
                {variant}
              </span>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {playgroundNotes.map((note) => (
              <div key={note.description} className="tt-list-item">
                <note.icon className="size-4" />
                <span>{note.description}</span>
              </div>
            ))}
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
            {builderToasts.map((toast) => (
              <div
                key={toast.title}
                className={`tt-toast-item ${toast.className}`}
              >
                <p className="font-semibold">{toast.title}</p>
                <p className="text-muted-foreground text-sm">
                  {toast.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {builderMetrics.map((metric) => (
              <div
                key={metric.label}
                className="border-border/70 bg-background/80 rounded-xl border p-3"
              >
                <p className="tt-label">{metric.label}</p>
                <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
