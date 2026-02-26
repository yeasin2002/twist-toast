import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const docsLinks = [
  { label: "Features", href: "/#playground" },
  { label: "Documentation", href: "/#docs" },
  { label: "API Reference", href: "/#api" },
];

export function Footer() {
  return (
    <footer className="container mt-20 pb-10 md:mt-28 md:pb-14">
      <div className="tt-panel relative overflow-hidden">
        <div className="from-primary/20 pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t to-transparent" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="tt-kicker">Ship notifications with intent</p>
            <h2 className="mt-3 text-3xl tracking-tight text-balance md:text-5xl">
              Design every toast exactly how your product needs it.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              twist-toast keeps runtime behavior predictable while your team
              fully controls presentation and content.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/#docs">Start with docs</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com/yeasin2002/twist-toast"
                rel="noreferrer"
                target="_blank"
              >
                GitHub <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="border-border/70 mt-10 flex flex-col gap-4 border-t pt-6 md:flex-row md:items-center md:justify-between">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {docsLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-muted-foreground text-sm">
            twist-toast · MIT · Built for React apps
          </p>
        </div>
      </div>
    </footer>
  );
}
