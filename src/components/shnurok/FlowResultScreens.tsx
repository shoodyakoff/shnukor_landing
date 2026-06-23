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

import { type ProductItem } from "./data";
import { ContactLinks } from "./Contacts";
import { ChipsBar, LogoMark, TextAction } from "./FlowNav";
import { ResultCard, ResultImageFrame } from "./ProductCards";
import { BigButton, Pill, StepShell } from "./ui";
import { getTaskCopy, pluralizeModels, selectedNames } from "./flow-utils";
import type { SneakersPayload } from "./sneakers-mapping";
import { fetchSneakers, type SneakersApiResult } from "./sneakers-api";
import { PRICES, type Selections } from "./types";

export function SearchScreen({
  sel,
  payload,
  onHome,
  onDone,
}: {
  sel: Selections;
  payload?: SneakersPayload | null;
  onHome: () => void;
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
  // Only ever preview real API results — never fictional catalog fillers. While
  // the request is in flight (or if it comes back empty) we keep neutral branded
  // placeholders and route to the empty state instead of inventing models.
  const items = (apiResult?.items ?? []).slice(0, 6);
  const loading = apiResult === null || items.length === 0;
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
      const empty = apiResult.items.length === 0;
      const timer = window.setTimeout(() => onDone(empty, apiResult.items), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [apiResult, idx, onDone, statuses.length]);

  return (
    <StepShell
      eyebrow={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <LogoMark onClick={onHome} />
          <ChipsBar sel={sel} />
        </div>
      }
      title="Подбираем модели"
      subtitle="Подбор идет по размеру, цвету, бюджету и доступным категориям."
      contentClassName="lg:justify-center"
    >
      <div className="grid w-full items-center gap-4 md:gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="overflow-hidden rounded-[1.5rem] border-2 border-outsole bg-lace shadow-[5px_5px_0_var(--mesh)] sm:rounded-[2rem] md:shadow-[8px_8px_0_var(--mesh)]">
          <div className="flex items-center justify-between gap-3 border-b-2 border-outsole bg-[linear-gradient(135deg,#b0ddff_0%,#ffffff_76%)] p-4 sm:gap-4 sm:p-5">
            <div className="text-2xl font-black leading-tight text-outsole sm:text-3xl">
              Ищем для вас лучший вариант
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
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ResultImageFrame
                  key={`skeleton-${index}`}
                  placeholder
                  className="rounded-card border-2 border-cement"
                />
              ))
            : items.map((item, index) => (
                <ResultImageFrame
                  key={item.id || `${item.name}-${index}`}
                  src={item.img}
                  alt={item.name}
                  loading="eager"
                  className="rounded-card border-2 border-cement"
                />
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
  const resultItems = items;

  return (
    <div className="min-h-dvh overflow-x-hidden px-3 py-3 sm:px-4 sm:py-4 md:px-8 md:py-6">
      <div className="mx-auto grid max-w-[1440px] gap-5">
        <div className="flex items-center justify-between gap-4">
          <LogoMark onClick={onReset} />
          <TextAction onClick={onReset}>подобрать заново</TextAction>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-3xl font-bold leading-[0.98] text-outsole sm:text-4xl md:text-5xl">
              {allSkipped
                ? "Жаль, что вам не понравился ни один из стилей, вот что мы вам предлагаем"
                : `Нашли ${pluralizeModels(resultItems.length)} под твой запрос`}
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
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

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden px-3 py-3 sm:px-4 sm:py-4 md:px-8 md:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-[760px] flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <LogoMark onClick={onReset} />
          <TextAction onClick={onReset}>подобрать заново</TextAction>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-[1.5rem] border-2 border-outsole bg-lace p-5 shadow-[6px_6px_0_var(--mesh)] sm:rounded-[2rem] sm:p-7">
            <Pill color="active">ничего не найдено</Pill>
            <h1 className="mt-5 text-2xl font-bold leading-[1.05] text-outsole sm:text-3xl md:text-4xl">
              По вашим параметрам ничего не найдено
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-suede sm:text-base">
              По выбранным критериям ничего не найдено. Но мы всё равно хотим помочь вам с выбором —
              напишите нам, и мы подберём подходящие варианты вручную.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <BigButton onClick={onReset} variant="primary">
                Попробовать ещё раз
              </BigButton>
              <div className="sm:ml-auto [&_a]:size-14 [&_svg]:size-6 md:[&_a]:size-16 md:[&_svg]:size-7">
                <ContactLinks />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
