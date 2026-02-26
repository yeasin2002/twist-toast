import Link from "next/link";


import { valueProps } from "./data";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative container pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="tt-grid-glow" aria-hidden="true" />
      {/* grid  xl:grid-cols-[1.15fr_0.85fr] */}
      <div className="relative gap-14">
        <div>
          <p className="tt-kicker">Design-system-first notifications</p>
          <h1 className="mt-4 max-w-5xl text-5xl leading-[0.95] tracking-tight text-balance md:text-7xl">
            twist-toast gives you total UI freedom with reliable toast behavior.
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
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

        {/* <aside className="tt-panel h-fit md:sticky md:top-28">
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
        </aside> */}
      </div>
    </section>
  );
}
