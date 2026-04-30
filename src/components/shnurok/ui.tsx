import type { ReactNode } from "react";

export function Pill({ children, color = "white" }: { children: ReactNode; color?: "white" | "volt" | "flame" | "cobalt" | "ink" }) {
  const map: Record<string, string> = {
    white: "bg-card text-ink",
    volt: "bg-volt text-ink",
    flame: "bg-flame text-white",
    cobalt: "bg-cobalt text-white",
    ink: "bg-ink text-concrete",
  };
  return (
    <span className={`brutal-pill text-sm md:text-base ${map[color]}`}>{children}</span>
  );
}

export function BigButton({
  children, onClick, variant = "primary", disabled,
}: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "volt" | "ghost"; disabled?: boolean }) {
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
      className={`group relative inline-flex items-center justify-center gap-3 border-[5px] border-ink rounded-full px-8 md:px-10 py-5 md:py-6 font-display font-black text-lg md:text-2xl uppercase tracking-tight transition-all duration-150 ${map[variant]} shadow-[8px_8px_0_var(--ink)] hover:shadow-[0_0_0_var(--ink)] hover:translate-x-[8px] hover:translate-y-[8px] active:translate-x-[8px] active:translate-y-[8px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[8px_8px_0_var(--ink)]`}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = (current / total) * 100;
  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-mono text-xs md:text-sm uppercase tracking-widest font-bold">{label}</span>
        <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-60">
          {current} / {total}
        </span>
      </div>
      <div className="h-3 bg-card border-[3px] border-ink rounded-full overflow-hidden shadow-[4px_4px_0_var(--ink)]">
        <div
          className="h-full bg-volt border-r-[3px] border-ink transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function StepShell({
  eyebrow, title, subtitle, children, footer,
}: { eyebrow: ReactNode; title: ReactNode; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <div className="px-6 md:px-10 pt-8 md:pt-10 pb-6 max-w-[1600px] mx-auto w-full">
        {eyebrow}
      </div>
      <div className="flex-1 px-6 md:px-10 max-w-[1600px] mx-auto w-full">
        <h1 className="font-display font-black uppercase text-4xl sm:text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance max-w-5xl animate-slide-up">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-base md:text-xl max-w-2xl opacity-80 animate-slide-up">{subtitle}</p>
        )}
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
      {footer && (
        <div className="sticky bottom-0 left-0 right-0 z-30 border-t-[4px] border-ink bg-cream/95 backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto w-full px-6 md:px-10 py-4 md:py-5 flex items-center justify-between gap-4 flex-wrap">
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}
