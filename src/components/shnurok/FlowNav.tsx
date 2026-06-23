import { ContactLinks } from "./Contacts";
import { BigButton, ProgressBar } from "./ui";
import { PRICES, type Selections, type Step } from "./types";
import { getTaskCopy, selectedNames, showPriceChipForStep, stepIndex } from "./flow-utils";
import { publicAsset } from "@/lib/assets";

export function LogoMark({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
} = {}) {
  const image = (
    <img
      src={publicAsset("brand/shnurok8-logo.webp")}
      alt="SHNUROK"
      className="h-9 w-auto object-contain md:h-10"
    />
  );

  if (!onClick) return image;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="На главную"
      className={`inline-flex w-fit shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mesh ${className}`}
    >
      {image}
    </button>
  );
}

export function TextAction({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-2 py-2 text-sm font-medium text-suede underline underline-offset-4 transition-colors hover:text-outsole focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh ${className}`}
    >
      {children}
    </button>
  );
}

export function FlowHeader({
  step,
  styleIndex,
  styleTotal,
  selections,
  onReset,
  onBack,
  onLogoClick,
  showReset = true,
}: {
  step: Step;
  styleIndex: number;
  styleTotal: number;
  selections: Selections;
  onReset: () => void;
  onBack?: () => void;
  onLogoClick?: () => void;
  showReset?: boolean;
}) {
  const currentStep = stepIndex(step);
  const isStyle = step === "style";

  // Back + restart sit together top-right so the chips row below spans the full
  // width and packs two chips per line instead of stacking one per row.
  const headerActions = (
    <div className="flex items-center gap-3">
      {onBack ? <TextAction onClick={onBack}>← назад</TextAction> : null}
      {showReset ? <TextAction onClick={onReset}>начать заново</TextAction> : null}
    </div>
  );

  return (
    <div className="grid min-w-0 gap-2.5">
      <div className="flex items-center justify-between gap-4">
        <LogoMark onClick={onLogoClick ?? onReset} />
        <ContactLinks />
      </div>
      {isStyle ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-suede">
            Стиль {styleIndex + 1} из {styleTotal}
          </span>
          {headerActions}
        </div>
      ) : currentStep.label ? (
        <ProgressBar
          current={currentStep.current}
          total={currentStep.total}
          label={currentStep.label}
          action={headerActions}
        />
      ) : null}
      <ChipsBar sel={selections} showPrice={showPriceChipForStep(step)} />
    </div>
  );
}

export function StepActions({
  back,
  next,
  nextLabel = "Далее",
  disabled,
}: {
  back?: () => void;
  next?: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <>
      {back ? (
        <TextAction onClick={back} className="text-base md:text-lg">
          назад
        </TextAction>
      ) : null}
      {next ? (
        <BigButton onClick={next} variant="primary" disabled={disabled}>
          {nextLabel}
        </BigButton>
      ) : null}
    </>
  );
}

export function ChipsBar({ sel, showPrice = true }: { sel: Selections; showPrice?: boolean }) {
  const items: Array<{ k: string; v: string; tone?: "default" | "active" | "dark" }> = [];
  if (sel.sizes.length) items.push({ k: "Размер", v: sel.sizes.join(", ") });
  if (sel.colors.length) items.push({ k: "Цвет", v: selectedNames(sel.colors) });
  if (showPrice && sel.price)
    items.push({
      k: "Цена",
      v: PRICES.find((item) => item.id === sel.price)?.label ?? "",
      tone: "active",
    });
  if (sel.task) items.push({ k: "Задача", v: getTaskCopy(sel.task), tone: "dark" });
  if (sel.sport) items.push({ k: "Спорт", v: sel.sport });

  // Reserve one chip-row of height even when empty so the first selection
  // (e.g. size on step 1) doesn't shift the content below the progress bar.
  if (!items.length) return <div className="min-h-8" aria-hidden />;

  // Two per row so the chip list stays compact and never pushes the content
  // (e.g. the style-swipe card) off-screen on short phones.
  return (
    <div className="grid min-h-8 min-w-0 grid-cols-2 items-start gap-1.5 sm:flex sm:flex-wrap">
      {items.map((item) => (
        <span
          key={item.k}
          className="inline-flex w-full items-center gap-1 rounded-[0.85rem] border-2 border-outsole bg-mesh px-2.5 py-1 text-[0.7rem] font-extrabold leading-tight text-outsole shadow-pop-xs sm:w-auto sm:rounded-full sm:px-3.5 sm:py-1.5 sm:text-sm"
        >
          <span className="shrink-0 text-suede">{item.k}:</span>
          <span className="min-w-0 break-words">{item.v}</span>
        </span>
      ))}
    </div>
  );
}
