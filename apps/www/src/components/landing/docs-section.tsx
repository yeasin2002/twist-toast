import { CodeBlock, SectionHeader } from "../blocks";
import { createToastCode, installCommand, providerCode } from "./data";

const docsSteps = [
  { label: "1. Install", code: installCommand },
  { label: "2. Create typed toasts", code: createToastCode },
  { label: "3. Mount provider and trigger", code: providerCode },
];

export function DocsSection() {
  return (
    <section id="docs" className="container pb-20 md:pb-28">
      <SectionHeader
        title="Documentation"
        subtitle="Install, define variants, and trigger toasts in minutes"
      />

      <div className="space-y-6">
        {docsSteps.map((step) => (
          <article key={step.label} className="tt-panel">
            <p className="tt-kicker">{step.label}</p>
            <CodeBlock code={step.code} />
          </article>
        ))}
      </div>
    </section>
  );
}
