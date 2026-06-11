import { useEffect, useState, type ReactNode } from "react";

import { choiceCardClass } from "./flow-utils";
import { publicAsset } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function Pill({
  children,
  color: _color = "default",
  size = "md",
}: {
  children: ReactNode;
  color?: "default" | "active" | "dark" | "muted" | "white" | "volt" | "flame" | "cobalt" | "ink";
  size?: "sm" | "md";
}) {
  void _color;

  const sizeCls =
    size === "sm"
      ? "gap-1.5 px-2.5 py-1 text-xs shadow-pop-xs"
      : "gap-2 px-3.5 py-1.5 text-sm shadow-pop-sm";

  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-full shrink-0 items-center rounded-full border-2 border-outsole bg-mesh text-left font-extrabold leading-tight whitespace-normal text-outsole",
        sizeCls,
      )}
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
  variant?: "primary" | "secondary" | "accent" | "ghost" | "volt";
  disabled?: boolean;
}) {
  const map: Record<string, string> = {
    primary:
      "border-outsole bg-outsole text-lace shadow-pop-mesh-md hover:bg-suede hover:shadow-pop-mesh-sm",
    secondary:
      "border-outsole bg-lace text-outsole shadow-pop-lg hover:bg-muted hover:shadow-pop-sm",
    accent:
      "border-outsole bg-mesh text-outsole shadow-pop-lg hover:bg-[#c7e9ff] hover:shadow-pop-sm",
    volt: "border-outsole bg-mesh text-outsole shadow-pop-lg hover:bg-[#c7e9ff] hover:shadow-pop-sm",
    ghost:
      "border-transparent bg-transparent text-outsole underline underline-offset-4 hover:bg-muted",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-12 w-full min-w-[156px] flex-1 items-center justify-center rounded-full border-2 px-7 py-3.5 text-center text-base font-extrabold transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 sm:w-auto sm:flex-none md:min-w-[196px] md:px-11 md:py-4 md:text-lg ${map[variant]}`}
    >
      {children}
    </button>
  );
}

export function HeartMascot({ className = "" }: { className?: string }) {
  return <img src={publicAsset("brand/heart.svg")} alt="" aria-hidden className={className} />;
}

// Remembered across remounts so the fill/heart continue smoothly from the
// previous step instead of snapping. `kind` lets us skip the animation when
// switching between the step counter and the style-swipe counter (different scale).
let lastProgressPct = 0;
let lastProgressKind = "";

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
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  const kind = label.startsWith("Стиль") ? "style" : "step";
  const sameKind = kind === lastProgressKind || lastProgressKind === "";

  const [renderPct, setRenderPct] = useState(sameKind ? lastProgressPct : pct);

  useEffect(() => {
    lastProgressPct = pct;
    lastProgressKind = kind;
    const id = requestAnimationFrame(() => setRenderPct(pct));
    return () => cancelAnimationFrame(id);
  }, [pct, kind]);

  return (
    <div className="w-full">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-suede">{label}</span>
        {action}
      </div>
      <div className="relative mt-14">
        <div className="h-2.5 overflow-hidden rounded-full bg-cement">
          <div
            className="h-full rounded-full bg-mesh transition-[width] duration-700 ease-out"
            style={{ width: `${renderPct}%` }}
          />
        </div>
        {/* Marker showing where you stopped: a tick on the bar with the heart mascot above it. */}
        <div
          className="pointer-events-none absolute bottom-0 z-10 flex -translate-x-1/2 flex-col items-center transition-[left] duration-700 ease-out"
          style={{ left: `clamp(1.5rem, ${renderPct}%, calc(100% - 1.5rem))` }}
          aria-hidden
        >
          <HeartMascot className="h-12 w-12 transition-transform duration-700 ease-out" />
          <span className="mt-[5px] h-3.5 w-[2px] rounded-full bg-outsole" />
        </div>
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
  actionsClassName,
  contentClassName,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  actionsClassName?: string;
  contentClassName?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 xl:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-[1400px] flex-col gap-3 sm:min-h-[calc(100dvh-2rem)] md:min-h-[calc(100dvh-2.5rem)] md:gap-4">
        <div className="min-h-0">{eyebrow}</div>
        <div className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
          <h1 className="max-w-4xl font-display text-2xl font-bold leading-[1.05] text-balance text-outsole sm:text-3xl md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 max-w-2xl text-sm leading-snug text-suede sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out",
            contentClassName,
          )}
        >
          {children}
        </div>
        {actions ? (
          <div
            className={cn(
              "sticky bottom-0 z-30 -mx-3 mt-1 flex items-center justify-between gap-3 border-t-2 border-outsole bg-lace/95 px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:pt-1 md:backdrop-blur-none",
              actionsClassName,
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Two-column layout shared by the size / color / price steps: a selectable
// tile grid on the left and an optional helper panel on the right. Fills the
// step's content area (h-full) so the right panel is the SAME height on every
// step and there's minimal empty space. Tiles keep their fixed height and are
// centered in their column on desktop; top-aligned on mobile (panel hidden).
export function ChoiceLayout({
  columns,
  aside,
  action,
  children,
}: {
  columns: string;
  aside?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-0 w-full flex-1 gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_clamp(300px,25vw,340px)] lg:items-stretch">
      <div className="flex min-h-0 flex-col">
        <div className={cn("grid content-start gap-2.5 lg:flex-1 lg:content-center", columns)}>
          {children}
        </div>
        {action ? <div className="mt-4 hidden lg:flex">{action}</div> : null}
      </div>
      {aside}
    </div>
  );
}

// One selectable cell. Fixed height (never stretches) so size / color / price
// tiles share an identical footprint and stop "jumping" between steps.
export function ChoiceTile({
  active,
  disabled,
  ariaPressed,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  ariaPressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={ariaPressed}
      className={cn(
        choiceCardClass(active),
        "flex h-20 flex-col items-center justify-center gap-1.5 text-center disabled:cursor-not-allowed disabled:opacity-35 sm:h-24",
      )}
    >
      {children}
    </button>
  );
}

// Right-hand helper panel used by the size / color / price steps. Hidden below
// lg. Fills the full height handed down by ChoiceLayout so every step's panel
// is identical in size: title pinned top, body centered, footer pinned bottom.
export function SelectionAside({
  title,
  icon,
  children,
  footer,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  footer?: string;
}) {
  return (
    <aside className="hidden h-full flex-col overflow-hidden rounded-panel border-2 border-outsole bg-[linear-gradient(135deg,#b0ddff_0%,#f7fbff_58%,#ffffff_100%)] p-5 shadow-pop-lg lg:flex">
      <div className="flex items-start justify-between gap-3">
        <div className="max-w-[12rem] text-2xl font-black leading-[1.1] text-outsole">{title}</div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-outsole bg-lace shadow-pop-sm">
          {icon}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-center py-4">{children}</div>
      {footer ? <p className="text-sm font-bold leading-snug text-outsole/72">{footer}</p> : null}
    </aside>
  );
}
