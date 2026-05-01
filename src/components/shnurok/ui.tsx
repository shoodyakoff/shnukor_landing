import type { ReactNode } from "react";

export function Pill({
  children,
  color = "white",
}: {
  children: ReactNode;
  color?: "white" | "volt" | "flame" | "cobalt" | "ink";
}) {
  const map: Record<string, string> = {
    white: "bg-card text-ink",
    volt: "bg-volt text-ink",
    flame: "bg-flame text-white",
    cobalt: "bg-cobalt text-white",
    ink: "bg-ink text-concrete",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-[3px] border-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] shadow-[3px_3px_0_var(--ink)] ${map[color]}`}
    >
      {children}
    </span>
  );
}

export function BigButton({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "volt" | "ghost";
  disabled?: boolean;
}) {
  const map: Record<string, string> = {
    primary: "bg-flame text-white",
    secondary: "bg-card text-ink",
    volt: "bg-volt text-ink",
    ghost: "bg-transparent text-ink",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full border-[5px] border-ink px-9 py-5 font-display text-2xl font-black uppercase tracking-tight transition-all duration-150 shadow-[8px_8px_0_var(--ink)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[8px_8px_0_var(--ink)] ${map[variant]}`}
    >
      {children}
    </button>
  );
}

export function ProgressBar({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const pct = (current / total) * 100;

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] font-bold">{label}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] opacity-60">
          {current} / {total}
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded-full border-[3px] border-ink bg-card shadow-[4px_4px_0_var(--ink)]">
        <div
          className="h-full border-r-[3px] border-ink bg-volt transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function StepShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-dvh px-6 py-6 md:px-10">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[1600px] flex-col gap-6">
        <div>{eyebrow}</div>
        <div>
          <h1 className="max-w-5xl font-display text-4xl font-black uppercase leading-[0.9] tracking-tight text-balance xl:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="mt-3 max-w-3xl text-base opacity-80">{subtitle}</p>}
        </div>
        <div className="flex-1">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 z-30 flex items-center justify-between gap-4 border-t-[4px] border-ink bg-cream/95 py-4 backdrop-blur">
            {footer}
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
