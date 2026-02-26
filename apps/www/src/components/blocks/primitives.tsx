import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

interface TableCardProps {
  children: ReactNode;
  title: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8 max-w-3xl md:mb-10">
      <p className="tt-kicker">{subtitle}</p>
      <h2 className="mt-3 text-3xl leading-tight tracking-tight md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

export function TableCard({ children, title }: TableCardProps) {
  return (
    <article className="tt-panel overflow-x-auto">
      <h3 className="text-xl font-semibold">{title}</h3>
      {children}
    </article>
  );
}



