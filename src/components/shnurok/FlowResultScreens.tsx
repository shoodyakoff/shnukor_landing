import { useEffect, useState } from "react";
import {
  CheckCircle,
  CurrencyRub,
  MagnifyingGlass,
  Package,
  Palette,
  Ruler,
  Sparkle,
} from "@phosphor-icons/react";

import { RESULT_GROUPS } from "./data";
import { ChipsBar, LogoMark, TextAction } from "./FlowNav";
import { ResultCard } from "./ProductCards";
import { Pill, StepShell } from "./ui";
import { getTaskCopy } from "./flow-utils";
import { PRICES, type Selections } from "./types";

export function SearchScreen({
  sel,
  onDone,
}: {
  sel: Selections;
  onDone: (empty: boolean) => void;
}) {
  const statuses = [
    { label: "Сверяем размер", icon: <Ruler size={26} weight="bold" /> },
    { label: "Уточняем бюджет", icon: <CurrencyRub size={26} weight="bold" /> },
    { label: "Смотрим палитру", icon: <Palette size={26} weight="bold" /> },
    { label: "Сопоставляем стиль", icon: <Sparkle size={26} weight="bold" /> },
    { label: "Готовим выдачу", icon: <Package size={26} weight="bold" /> },
  ];
  const [idx, setIdx] = useState(0);
  const visibleItems = RESULT_GROUPS.flatMap((group) => group.items).slice(0, 6);

  useEffect(() => {
    const timer = window.setInterval(() => setIdx((prev) => prev + 1), 850);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (idx >= statuses.length) {
      const timer = window.setTimeout(() => onDone(false), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [idx, onDone, statuses.length]);

  return (
    <StepShell
      eyebrow={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <LogoMark />
          <ChipsBar sel={sel} />
        </div>
      }
      title="Подбираем модели"
      subtitle="Подбор идет по размеру, задаче, палитре и стилевым реакциям."
      contentClassName="flex items-center"
    >
      <div className="grid w-full items-center gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="overflow-hidden rounded-[2rem] border-2 border-outsole bg-lace shadow-[8px_8px_0_var(--mesh)]">
          <div className="flex items-center justify-between gap-4 border-b-2 border-outsole bg-[linear-gradient(135deg,#b0ddff_0%,#ffffff_76%)] p-5">
            <div>
              <div className="text-sm font-black text-suede">Ход подбора</div>
              <div className="mt-1 text-3xl font-black leading-none text-outsole">
                собираем выдачу
              </div>
            </div>
            <div className="flex size-12 items-center justify-center rounded-full border-2 border-outsole bg-lace shadow-[3px_3px_0_var(--outsole)]">
              <MagnifyingGlass size={26} weight="bold" />
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {statuses.map((status, index) => {
              const done = index < idx;
              const active = index === idx;
              return (
                <div
                  key={status.label}
                  className={`mx-5 flex items-center gap-4 rounded-[1.35rem] border-2 px-4 py-3 shadow-[3px_3px_0_var(--outsole)] transition-all ${
                    done
                      ? "border-outsole bg-[#d8f7c8]"
                      : active
                        ? "border-outsole bg-mesh"
                        : "border-cement bg-lace shadow-none"
                  }`}
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-outsole bg-lace text-outsole">
                    {done ? <CheckCircle size={26} weight="fill" /> : status.icon}
                  </div>
                  <div className="text-lg font-black leading-tight text-outsole">
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-5" />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {visibleItems.map((item, index) => (
            <div
              key={item.name}
              className={`aspect-[4/3] overflow-hidden rounded-[1.5rem] border-2 border-cement bg-muted transition-all duration-300 ${
                index <= idx ? "opacity-100" : "opacity-35"
              }`}
            >
              <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

export function Results({
  sel,
  onReset,
  onWiden,
}: {
  sel: Selections;
  onReset: () => void;
  onWiden: () => void;
}) {
  const totalItems = RESULT_GROUPS.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="min-h-dvh px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto grid max-w-[1440px] gap-5">
        <div className="flex items-center justify-between gap-4">
          <LogoMark />
          <TextAction onClick={onReset}>подобрать заново</TextAction>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-bold leading-[0.96] text-outsole md:text-5xl">
              Нашли {totalItems} моделей под твой запрос
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-suede md:text-lg">
              Учли размер, цвет, бюджет, задачу и визуальные предпочтения.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {sel.sizes.length ? <Pill>Размер: {sel.sizes.join(", ")}</Pill> : null}
            {sel.price ? (
              <Pill color="active">{PRICES.find((item) => item.id === sel.price)?.label}</Pill>
            ) : null}
            {sel.task ? <Pill color="dark">{getTaskCopy(sel.task)}</Pill> : null}
          </div>
        </div>

        <div className="grid gap-7">
          {RESULT_GROUPS.map((group) => (
            <section key={group.title} className="grid gap-3">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="h-px w-10 bg-outsole" />
                    <h2 className="text-2xl font-bold leading-none text-outsole md:text-3xl">
                      {group.title}
                    </h2>
                  </div>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-suede">{group.sub}</p>
                </div>
              </div>

              <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] md:-mx-8 md:px-8">
                <div className="grid auto-cols-[minmax(300px,82vw)] grid-flow-col gap-3 snap-x snap-mandatory md:auto-cols-[minmax(440px,46vw)] xl:auto-cols-[minmax(420px,31vw)]">
                  {group.items.map((item) => (
                    <div key={item.name} className="snap-start">
                      <ResultCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ onReset, onResults }: { onReset: () => void; onResults: () => void }) {
  const actions = [
    "Поднять цену",
    "Убрать цвет",
    "Смягчить стиль",
    "Изменить задачу",
    "Другой размер",
  ];

  return (
    <div className="min-h-dvh px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col justify-between rounded-[2rem] border border-cement bg-lace p-6">
          <div>
            <Pill color="active">ничего не найдено</Pill>
            <h1 className="mt-6 text-4xl font-bold leading-[0.98] text-outsole md:text-5xl">
              По текущему запросу ничего не нашли
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-suede">
              Ограничения слишком узкие. Можно быстро расширить поиск и сохранить то, что уже
              выбрано.
            </p>
          </div>
          <div className="mt-8">
            <TextAction onClick={onReset}>подобрать заново</TextAction>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {actions.map((action, index) => (
            <button
              key={action}
              onClick={onResults}
              className={`rounded-[1.75rem] border p-5 text-left text-2xl font-bold leading-tight transition-colors hover:border-outsole ${
                index === 0 ? "border-outsole bg-mesh" : "border-cement bg-lace"
              }`}
            >
              {action}
            </button>
          ))}
          <button
            onClick={onResults}
            className="rounded-[1.75rem] border border-outsole bg-outsole p-5 text-left text-2xl font-bold leading-tight text-lace transition-colors hover:bg-suede"
          >
            Показать ближайшие варианты
          </button>
        </div>
      </div>
    </div>
  );
}
