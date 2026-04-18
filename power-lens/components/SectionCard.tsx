import type { ReactNode } from "react";

export function SectionCard({
  title,
  subtitle,
  children,
  className = "",
  delay = 0,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "console";
}) {
  const shell =
    variant === "console"
      ? "rounded-md border border-white/[0.08] bg-[#0c0e14]/90 p-4 shadow-none backdrop-blur-none"
      : "rounded-xl border border-surface-border bg-surface-raised/80 p-5 shadow-card backdrop-blur-sm transition hover:border-white/10";
  const heading =
    variant === "console"
      ? "font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent/90"
      : "text-sm font-semibold tracking-wide text-ink-primary";
  const sub =
    variant === "console"
      ? "text-[11px] text-ink-faint"
      : "text-xs text-ink-secondary";

  return (
    <section
      className={`animate-fade-in ${shell} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="mb-4 flex flex-col gap-1">
        <h3 className={heading}>{title}</h3>
        {subtitle ? <p className={sub}>{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
