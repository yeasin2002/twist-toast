import Link from "next/link";

import { Github, Menu } from "lucide-react";

import { NpmIcon } from "./icons";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const navItems = [
  { label: "Features", href: "/#playground" },
  { label: "Docs", href: "/#docs" },
  { label: "API", href: "/#api" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <div className="border-border/70 bg-background/75 container rounded-2xl border px-4 py-2.5 shadow-sm backdrop-blur-xl md:px-5">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="group inline-flex items-center gap-2">
            <Image src={"/logo.png"} alt="Logo" width={30} height={30} />
            <span className="font-display text-lg tracking-tight transition-opacity group-hover:opacity-80">
              twist-toast
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="border-border/70 bg-background/70 hidden items-center gap-1 rounded-xl border p-1 md:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground text-muted-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" size="icon" className="size-9">
              <a
                aria-label="twist-toast GitHub repository"
                href="https://github.com/yeasin2002/twist-toast"
                rel="noreferrer"
                target="_blank"
              >
                <Github className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" className="size-9">
              <a
                aria-label="twist-toast GitHub repository"
                href="https://github.com/yeasin2002/twist-toast"
                rel="noreferrer"
                target="_blank"
              >
                <NpmIcon className="size-4" />
              </a>
            </Button>

            <details className="group relative md:hidden">
              <summary className="border-border/70 bg-background/70 flex size-9 cursor-pointer list-none items-center justify-center rounded-md border">
                <span className="sr-only">Open menu</span>
                <Menu className="size-4" />
              </summary>
              <nav
                aria-label="Mobile"
                className="border-border/70 bg-background/95 absolute top-11 right-0 w-52 rounded-xl border p-2 shadow-md backdrop-blur-xl"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:bg-muted block rounded-lg px-3 py-2 text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
