import Image from "next/image";
import Link from "next/link";

import { Github, Menu, Star } from "lucide-react";

import { NpmIcon } from "./icons";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Components", href: "/components" },
  { label: "Collections", href: "/collections" },
];

const landingPageSection = [
  { label: "Features", href: "/#playground" },
  { label: "Docs", href: "/#docs" },
  { label: "API", href: "/#api" },
];

export async function Navbar() {
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

          <nav className="border-border/70 bg-background/70 hidden items-center justify-center rounded-xl border md:flex">
            <div aria-label="Primary" className="flex items-center gap-1 p-1">
              {landingPageSection.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-foreground text-muted-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* separator */}
            <div className="bg-border h-4 w-px"></div>

            <div aria-label="Primary" className="flex items-center gap-1 p-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-foreground text-muted-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" className="h-9 px-2.5">
              <a
                aria-label="twist-toast GitHub repository"
                href="https://github.com/yeasin2002/twist-toast"
                rel="noreferrer"
                target="_blank"
                className="inline-flex items-center gap-1.5"
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
                {landingPageSection.map((item) => (
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
