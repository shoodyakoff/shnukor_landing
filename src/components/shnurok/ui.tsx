import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Pill({
  children,
  color: _color = "default",
}: {
  children: ReactNode;
  color?: "default" | "active" | "dark" | "muted" | "white" | "volt" | "flame" | "cobalt" | "ink";
}) {
  void _color;

  return (
    <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border-2 border-outsole bg-mesh px-3.5 py-1.5 text-sm font-extrabold leading-none whitespace-nowrap text-outsole shadow-[3px_3px_0_var(--outsole)]">
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
  variant?: "primary" | "secondary" | "accent" | "ghost" | "volt";
  disabled?: boolean;
}) {
  const map: Record<string, string> = {
    primary:
      "border-outsole bg-outsole text-lace shadow-[5px_5px_0_var(--mesh)] hover:bg-suede hover:shadow-[3px_3px_0_var(--mesh)]",
    secondary:
      "border-outsole bg-lace text-outsole shadow-[5px_5px_0_var(--outsole)] hover:bg-muted hover:shadow-[3px_3px_0_var(--outsole)]",
    accent:
      "border-outsole bg-mesh text-outsole shadow-[5px_5px_0_var(--outsole)] hover:bg-[#c7e9ff] hover:shadow-[3px_3px_0_var(--outsole)]",
    volt:
      "border-outsole bg-mesh text-outsole shadow-[5px_5px_0_var(--outsole)] hover:bg-[#c7e9ff] hover:shadow-[3px_3px_0_var(--outsole)]",
    ghost:
      "border-transparent bg-transparent text-outsole underline underline-offset-4 hover:bg-muted",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-12 min-w-[168px] items-center justify-center rounded-full border-2 px-9 py-3.5 text-base font-extrabold transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 md:min-w-[196px] md:px-11 md:py-4 md:text-lg ${map[variant]}`}
    >
      {children}
    </button>
  );
}

export function ProgressBar({
  current,
  total,
  label,
  action,
}: {
  current: number;
  total: number;
  label: string;
  action?: ReactNode;
}) {
  const pct = (current / total) * 100;

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-medium text-suede">{label}</span>
        {action}
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-cement">
        <div
          className="h-full rounded-full bg-mesh transition-all duration-500 ease-out"
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
  actions,
  contentClassName,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="min-h-dvh px-4 py-4 md:px-8 md:py-6">
      <div className="relative mx-auto grid min-h-[calc(100dvh-2rem)] w-full max-w-[1500px] grid-rows-[auto_auto_minmax(0,1fr)] gap-5 md:min-h-[calc(100dvh-3rem)] md:gap-6">
        <div className="min-h-0">{eyebrow}</div>
        {actions ? (
          <div className="flex flex-wrap items-center justify-start gap-3 lg:absolute lg:right-0 lg:top-[48px] lg:justify-end">
            {actions}
          </div>
        ) : null}
        <div className="grid min-h-0 gap-4 lg:pr-[430px]">
          <div>
            <h1 className="max-w-4xl font-display text-3xl font-bold leading-[0.98] text-balance text-outsole md:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-suede">{subtitle}</p>
            )}
          </div>
        </div>
        <div className={cn("min-h-0", contentClassName)}>{children}</div>
      </div>
    </div>
  );
}
