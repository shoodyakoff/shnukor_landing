import { BigButton, Pill, ProgressBar } from "./ui";
import { PRICES, type Selections, type Step } from "./types";
import { getTaskCopy, selectedNames, stepIndex } from "./flow-utils";

export function LogoMark() {
  return <img src="/brand/logo-shnurok.svg" alt="SHNUROK" className="h-7 w-auto md:h-8" />;
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
      className={`rounded-full px-2 py-2 text-sm font-medium text-suede underline underline-offset-4 transition-colors hover:text-outsole focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh ${className}`}
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
  showReset = true,
}: {
  step: Step;
  styleIndex: number;
  styleTotal: number;
  selections: Selections;
  onReset: () => void;
  showReset?: boolean;
}) {
  const currentStep = stepIndex(step);
  const isStyle = step === "style";

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-4">
        <LogoMark />
      </div>
      {isStyle ? (
        <ProgressBar
          current={styleIndex + 1}
          total={styleTotal}
          label={`Стиль ${styleIndex + 1} из ${styleTotal}`}
          action={showReset ? <TextAction onClick={onReset}>начать заново</TextAction> : null}
        />
      ) : currentStep.label ? (
        <ProgressBar
          current={currentStep.current}
          total={currentStep.total}
          label={currentStep.label}
          action={showReset ? <TextAction onClick={onReset}>начать заново</TextAction> : null}
        />
      ) : null}
      <ChipsBar sel={selections} />
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
          Назад
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

export function ChipsBar({ sel }: { sel: Selections }) {
  const items: Array<{ k: string; v: string; tone?: "default" | "active" | "dark" }> = [];
  if (sel.sizes.length) items.push({ k: "Размер", v: sel.sizes.join(", ") });
  if (sel.colors.length) items.push({ k: "Цвет", v: selectedNames(sel.colors) });
  if (sel.price)
    items.push({
      k: "Цена",
      v: PRICES.find((item) => item.id === sel.price)?.label ?? "",
      tone: "active",
    });
  if (sel.task) items.push({ k: "Задача", v: getTaskCopy(sel.task), tone: "dark" });
  if (sel.sport) items.push({ k: "Спорт", v: sel.sport });

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Pill key={item.k} color={item.tone}>
          <span className="text-suede">{item.k}:</span> {item.v}
        </Pill>
      ))}
    </div>
  );
}
