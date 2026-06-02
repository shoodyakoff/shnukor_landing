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

import { CATALOG_ITEMS, RESULT_GROUPS, type ProductItem } from "./data";
import { ChipsBar, LogoMark, TextAction } from "./FlowNav";
import { ResultCard } from "./ProductCards";
import { Pill, StepShell } from "./ui";
import { getTaskCopy, selectedNames } from "./flow-utils";
import type { SneakersPayload } from "./sneakers-mapping";
import { fetchSneakers, type SneakersApiResult } from "./sneakers-api";
import { PRICES, type Selections } from "./types";

export function SearchScreen({
  sel,
  payload,
  allSkipped,
  onDone,
}: {
  sel: Selections;
  payload?: SneakersPayload | null;
  allSkipped?: boolean;
  onDone: (empty: boolean, items: ProductItem[]) => void;
}) {
  const statuses = [
    { label: "Сверяем размер", icon: <Ruler size={26} weight="bold" /> },
    { label: "Уточняем бюджет", icon: <CurrencyRub size={26} weight="bold" /> },
    { label: "Смотрим палитру", icon: <Palette size={26} weight="bold" /> },
    { label: "Проверяем доступные фильтры", icon: <Sparkle size={26} weight="bold" /> },
    { label: "Готовим выдачу", icon: <Package size={26} weight="bold" /> },
  ];
  const [idx, setIdx] = useState(0);
  const [apiResult, setApiResult] = useState<SneakersApiResult | null>(null);
  const previewItems = RESULT_GROUPS.flatMap((group) => group.items).slice(0, 6);
  const visibleItems = (apiResult?.items.length ? apiResult.items : previewItems).slice(0, 6);
  const progress = Math.min(
    100,
    Math.round((Math.min(idx, statuses.length) / statuses.length) * 100),
  );

  useEffect(() => {
    let active = true;

    fetchSneakers(sel, payload).then((result) => {
      if (active) setApiResult(result);
    });

    return () => {
      active = false;
    };
  }, [payload, sel]);

  useEffect(() => {
    const timer = window.setInterval(() => setIdx((prev) => prev + 1), 850);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (idx >= statuses.length && apiResult) {
      const empty = !allSkipped && apiResult.source === "api" && apiResult.items.length === 0;
      const timer = window.setTimeout(() => onDone(empty, apiResult.items), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [allSkipped, apiResult, idx, onDone, statuses.length]);

  return (
    <StepShell
      eyebrow={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <LogoMark />
          <ChipsBar sel={sel} />
        </div>
      }
      title="Подбираем модели"
      subtitle="Подбор идет по размеру, цвету, бюджету и доступным категориям."
      contentClassName="flex items-center"
    >
      <div className="grid w-full items-center gap-4 md:gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="overflow-hidden rounded-[1.5rem] border-2 border-outsole bg-lace shadow-[5px_5px_0_var(--mesh)] sm:rounded-[2rem] md:shadow-[8px_8px_0_var(--mesh)]">
          <div className="flex items-center justify-between gap-3 border-b-2 border-outsole bg-[linear-gradient(135deg,#b0ddff_0%,#ffffff_76%)] p-4 sm:gap-4 sm:p-5">
            <div>
              <div className="text-sm font-black text-suede">Ход подбора</div>
              <div className="mt-1 text-2xl font-black leading-none text-outsole sm:text-3xl">
                собираем выдачу
              </div>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-outsole bg-lace shadow-[3px_3px_0_var(--outsole)] sm:size-12">
              <MagnifyingGlass size={26} weight="bold" />
            </div>
          </div>
          <div className="mx-4 mt-4 h-3 overflow-hidden rounded-full border-2 border-outsole bg-lace sm:mx-5 sm:mt-5">
            <div
              className="h-full bg-mesh transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 grid gap-3">
            {statuses.map((status, index) => {
              const done = index < idx;
              const active = index === idx;
              return (
                <div
                  key={status.label}
                  className={`mx-4 flex items-center gap-3 rounded-[1.15rem] border-2 px-3 py-3 shadow-[3px_3px_0_var(--outsole)] transition-all sm:mx-5 sm:gap-4 sm:rounded-[1.35rem] sm:px-4 ${
                    done
                      ? "border-outsole bg-[#d8f7c8]"
                      : active
                        ? "border-outsole bg-mesh"
                        : "border-cement bg-lace shadow-none"
                  }`}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-outsole bg-lace text-outsole sm:size-11">
                    {done ? <CheckCircle size={26} weight="fill" /> : status.icon}
                  </div>
                  <div className="text-base font-black leading-tight text-outsole sm:text-lg">
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-5" />
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3">
          {visibleItems.map((item, index) => (
            <div
              key={item.id || `${item.name}-${index}`}
              className={`aspect-[4/3] overflow-hidden rounded-[1.15rem] border-2 border-cement bg-muted transition-all duration-300 sm:rounded-[1.5rem] ${
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
  items,
  allSkipped,
  onReset,
  onWiden,
}: {
  sel: Selections;
  items: ProductItem[];
  allSkipped?: boolean;
  onReset: () => void;
  onWiden: () => void;
}) {
  const resultItems = items.length ? items : CATALOG_ITEMS;

  return (
    <div className="min-h-dvh overflow-x-hidden px-3 py-3 sm:px-4 sm:py-4 md:px-8 md:py-6">
      <div className="mx-auto grid max-w-[1440px] gap-5">
        <div className="flex items-center justify-between gap-4">
          <LogoMark />
          <TextAction onClick={onReset}>подобрать заново</TextAction>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-3xl font-bold leading-[0.98] text-outsole sm:text-4xl md:text-5xl">
              {allSkipped
                ? "Жаль, что вам не понравился ни один из стилей, вот что мы вам предлагаем"
                : `Нашли ${resultItems.length} моделей под твой запрос`}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-suede md:text-lg">
              {allSkipped
                ? "Мы расширили подбор до всех карточек выбранного сценария и сохранили ваши фильтры."
                : "Учли доступные фильтры запроса."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {sel.sizes.length ? <Pill>Размер: {sel.sizes.join(", ")}</Pill> : null}
            {sel.colors.length ? (
              <Pill>
                <span className="text-suede">Цвет:</span> {selectedNames(sel.colors)}
              </Pill>
            ) : null}
            {sel.price ? (
              <Pill color="active">{PRICES.find((item) => item.id === sel.price)?.label}</Pill>
            ) : null}
            {sel.task ? <Pill color="dark">{getTaskCopy(sel.task)}</Pill> : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resultItems.map((item, index) => (
            <div key={item.id || `${item.name}-${index}`}>
              <ResultCard item={item} />
            </div>
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
    <div className="min-h-dvh overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 md:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col justify-between rounded-[1.5rem] border border-cement bg-lace p-4 sm:rounded-[2rem] sm:p-6">
          <div>
            <Pill color="active">ничего не найдено</Pill>
            <h1 className="mt-5 text-3xl font-bold leading-[0.98] text-outsole sm:mt-6 sm:text-4xl md:text-5xl">
              По вашим параметрам ничего не найдено
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-suede">
              Давайте попробуем еще раз или перейдите на сайт Шнурок{" "}
              <a
                href="https://shnurok-shipping.ru/"
                target="_blank"
                rel="noreferrer"
                className="font-black text-outsole underline underline-offset-4"
              >
                https://shnurok-shipping.ru/
              </a>
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
              className={`rounded-[1.35rem] border p-4 text-left text-xl font-bold leading-tight transition-colors hover:border-outsole sm:rounded-[1.75rem] sm:p-5 sm:text-2xl ${
                index === 0 ? "border-outsole bg-mesh" : "border-cement bg-lace"
              }`}
            >
              {action}
            </button>
          ))}
          <button
            onClick={onResults}
            className="rounded-[1.35rem] border border-outsole bg-outsole p-4 text-left text-xl font-bold leading-tight text-lace transition-colors hover:bg-suede sm:rounded-[1.75rem] sm:p-5 sm:text-2xl"
          >
            Показать ближайшие варианты
          </button>
        </div>
      </div>
    </div>
  );
}
