import {
  CurrencyRub,
  Palette,
  Ruler,
  Sneaker,
  SoccerBall,
  Basketball,
  TennisBall,
  PersonSimpleRun,
  Barbell,
  Sparkle,
  Target,
} from "@phosphor-icons/react";

import { PRICE_PREVIEW_ITEMS, RESULT_GROUPS } from "./data";
import { StepActions } from "./FlowNav";
import { ProductShowcase } from "./ProductCards";
import { StyleDeck } from "./StyleDeck";
import { Pill, StepShell } from "./ui";
import { choiceCardClass, useFlowSummary, voteSummary } from "./flow-utils";
import { publicAsset } from "@/lib/assets";
import type { SneakersCard } from "./sneakers-mapping";
import {
  COLORS,
  DEFAULT_PRICE_ID,
  PRICES,
  SIZES,
  SPORTS,
  type Selections,
  type StyleVote,
  type Task,
} from "./types";

export function SizeScreen({
  eyebrow,
  selections,
  onBack,
  onNext,
  onToggle,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onBack: () => void;
  onNext: () => void;
  onToggle: (size: string) => void;
}) {
  return (
    <StepShell
      eyebrow={eyebrow}
      title="Выберите размер"
      subtitle="Можно выбрать до трех размеров. Это удобно, если носишь разные бренды."
      actions={<StepActions back={onBack} next={onNext} disabled={!selections.sizes.length} />}
      contentClassName="justify-center"
    >
      <div className="grid w-full items-stretch gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {SIZES.map((size) => {
            const active = selections.sizes.includes(size);
            const disabled = !active && selections.sizes.length >= 3;
            return (
              <button
                key={size}
                onClick={() => onToggle(size)}
                disabled={disabled}
                className={`${choiceCardClass(active)} flex h-16 flex-col items-center justify-center text-center disabled:cursor-not-allowed disabled:opacity-35 sm:h-[4.5rem] md:h-20`}
              >
                <div className="text-xl font-black leading-none sm:text-2xl md:text-3xl">
                  {size.replace("EU ", "")}
                </div>
                <div className="mt-0.5 text-[10px] font-bold text-suede sm:text-xs">EU</div>
              </button>
            );
          })}
        </div>

        <SelectionAside
          eyebrow="Таблица размеров"
          title="Проверь себя"
          icon={<Ruler size={26} weight="bold" />}
          footer="Лучше проверь, сколько см твоя нога, чтобы чувствовать себя комфортно."
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              ["EU 36", "23 см"],
              ["EU 37", "23.5 см"],
              ["EU 38", "24 см"],
              ["EU 39", "25 см"],
              ["EU 40", "25.5 см"],
              ["EU 41", "26 см"],
              ["EU 42", "27 см"],
              ["EU 43", "27.5 см"],
              ["EU 44", "28 см"],
              ["EU 45", "29 см"],
            ].map(([eu, cm]) => (
              <div
                key={eu}
                className="flex items-center justify-between rounded-2xl border-2 border-outsole bg-lace px-3 py-2 shadow-[2px_2px_0_var(--outsole)]"
              >
                <span className="text-sm font-black text-outsole">{eu}</span>
                <span className="text-xs font-bold text-suede">{cm}</span>
              </div>
            ))}
          </div>
        </SelectionAside>
      </div>
    </StepShell>
  );
}

export function ColorScreen({
  eyebrow,
  selections,
  onBack,
  onNext,
  onToggle,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onBack: () => void;
  onNext: () => void;
  onToggle: (id: string) => void;
}) {
  return (
    <StepShell
      eyebrow={eyebrow}
      title="Какие цвета нравятся?"
      subtitle="Можешь выбрать несколько, если цвет не важен так и скажи."
      actions={<StepActions back={onBack} next={onNext} disabled={!selections.colors.length} />}
      contentClassName="justify-center"
    >
      <div className="grid w-full items-stretch gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
          {COLORS.map((color) => {
            const active = selections.colors.includes(color.id);
            const isAny = color.id === "any";
            const disabled =
              !active && !isAny && selections.colors.filter((id) => id !== "any").length >= 3;
            return (
              <button
                key={color.id}
                onClick={() => onToggle(color.id)}
                aria-pressed={active}
                disabled={disabled}
                className={`${choiceCardClass(active)} flex min-h-[5.25rem] flex-col items-center justify-center gap-2 text-center disabled:cursor-not-allowed disabled:opacity-35`}
              >
                <span
                  className="size-11 rounded-full border-2 border-outsole/15 sm:size-12"
                  style={{
                    background: isAny
                      ? "repeating-linear-gradient(45deg,#fff,#fff 8px,#dddddd 8px,#dddddd 16px)"
                      : color.hex,
                  }}
                />
                <span className="text-xs font-bold leading-tight sm:text-sm">{color.name}</span>
              </button>
            );
          })}
        </div>

        <SelectionAside
          eyebrow="палитра"
          title="Сочетания сезона"
          icon={<Palette size={26} weight="bold" />}
          footer="Для повседневной пары проще выбрать базовый цвет, а яркий оставить как акцент."
        >
          <div className="grid gap-3">
            {[
              ["городская база", "#9ca3af", "#0044ff", "#ffffff"],
              ["теплый контраст", "#e7d5b3", "#111111", "#ffffff"],
              ["яркий акцент", "#ffffff", "#ccff00", "#ff2a00"],
            ].map(([label, base, accent, light]) => (
              <div
                key={label as string}
                className="relative min-h-[84px] overflow-hidden rounded-2xl border-2 border-outsole bg-lace p-3 shadow-[3px_3px_0_var(--outsole)]"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${base as string} 0 42%, ${light as string} 42% 64%, ${accent as string} 64% 100%)`,
                  }}
                />
                <div className="absolute right-3 top-3 flex -space-x-2">
                  {[base, light, accent].map((swatch) => (
                    <span
                      key={swatch as string}
                      className="size-8 rounded-full border-2 border-outsole"
                      style={{ background: swatch as string }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-3 left-3 rounded-full border-2 border-outsole bg-lace px-3 py-1 text-xs font-black text-outsole shadow-[2px_2px_0_var(--outsole)]">
                  {label as string}
                </div>
              </div>
            ))}
          </div>
        </SelectionAside>
      </div>
    </StepShell>
  );
}

export function PriceScreen({
  eyebrow,
  selections,
  onBack,
  onNext,
  onSelect,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onBack: () => void;
  onNext: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <StepShell
      eyebrow={eyebrow}
      title="Выберите бюджет"
      subtitle="Один диапазон. Мы покажем модели, которые попадают в комфортную цену."
      actions={<StepActions back={onBack} next={onNext} disabled={!selections.price} />}
      contentClassName="justify-center"
    >
      <div className="grid w-full items-stretch gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
          {PRICES.map((price) => {
            const active = selections.price === price.id;
            return (
              <button
                key={price.id}
                onClick={() => onSelect(price.id)}
                className={`${choiceCardClass(active)} flex min-h-[4.75rem] flex-col justify-center sm:min-h-[5.25rem]`}
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-suede">
                  {price.sub}
                </div>
                <div className="mt-1 text-base font-bold leading-tight sm:text-lg">
                  {price.label}
                </div>
              </button>
            );
          })}
        </div>

        <PriceAside priceId={selections.price} />
      </div>
    </StepShell>
  );
}

export function TaskScreen({
  eyebrow,
  onBack,
  onSelect,
}: {
  eyebrow: React.ReactNode;
  onBack: () => void;
  onSelect: (task: Task) => void;
}) {
  const taskCards = [
    {
      id: "daily" as Task,
      title: "На каждый день",
      sub: "Город, прогулки, учеба, работа и повседневные образы.",
      image: publicAsset("catalog-court-minimal.png"),
      label: "каждый день",
    },
    {
      id: "sport" as Task,
      title: "Для спорта",
      sub: "Тренировки, бег, зал, игра и активное движение.",
      image: publicAsset("catalog-knit-tech.png"),
      label: "спорт",
    },
  ];

  return (
    <StepShell
      eyebrow={eyebrow}
      title="Для чего нужны кроссовки?"
      subtitle="Одна задача — один сценарий подбора."
      actions={<StepActions back={onBack} />}
      contentClassName="justify-center"
    >
      <div className="grid w-full gap-3 sm:grid-cols-2 md:gap-4">
        {taskCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelect(card.id)}
            className="grid min-h-[8.5rem] grid-cols-[minmax(0,1fr)_38%] overflow-hidden rounded-[1.25rem] border-2 border-cement bg-lace text-left transition-all hover:border-outsole hover:shadow-[4px_4px_0_var(--mesh)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh sm:min-h-[12rem] sm:rounded-[1.5rem]"
          >
            <div className="flex flex-col justify-center gap-1.5 p-4 sm:p-5">
              <div className="text-xl font-bold leading-tight text-outsole sm:text-2xl md:text-3xl">
                {card.title}
              </div>
              <p className="text-sm leading-snug text-suede sm:text-base">{card.sub}</p>
              <div className="mt-1.5 text-sm font-bold text-outsole">Выбрать →</div>
            </div>
            <div className="overflow-hidden bg-muted">
              <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
            </div>
          </button>
        ))}
      </div>
    </StepShell>
  );
}

export function SportScreen({
  eyebrow,
  selections,
  onBack,
  onNext,
  onSelect,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onBack: () => void;
  onNext: () => void;
  onSelect: (sport: string) => void;
}) {
  const sportCards = SPORTS.map((sport) => {
    const map: Record<string, { image: string; sub: string; icon: React.ReactNode }> = {
      Бег: {
        image: publicAsset("catalog-retro-runner.png"),
        sub: "легкая амортизация",
        icon: <PersonSimpleRun size={22} weight="bold" />,
      },
      "Фитнес / зал": {
        image: publicAsset("catalog-knit-tech.png"),
        sub: "стабильная база",
        icon: <Barbell size={22} weight="bold" />,
      },
      Футбол: {
        image: publicAsset("catalog-dark-accent.png"),
        sub: "низкий цепкий силуэт",
        icon: <SoccerBall size={22} weight="bold" />,
      },
      Баскетбол: {
        image: publicAsset("catalog-chunky-lifestyle.png"),
        sub: "поддержка и резкость",
        icon: <Basketball size={22} weight="bold" />,
      },
      Теннис: {
        image: publicAsset("catalog-court-minimal.png"),
        sub: "плотная боковая опора",
        icon: <TennisBall size={22} weight="bold" />,
      },
      "Трейл / улица": {
        image: publicAsset("catalog-chunky-lifestyle.png"),
        sub: "цепкость и защита",
        icon: <Target size={22} weight="bold" />,
      },
      Скейтбординг: {
        image: publicAsset("catalog-dark-accent.png"),
        sub: "контроль доски",
        icon: <Sneaker size={22} weight="bold" />,
      },
    };

    return { sport, ...map[sport] };
  });

  return (
    <StepShell
      eyebrow={eyebrow}
      title="Какой именно спорт?"
      subtitle="От этого зависят амортизация, сцепление и силуэт."
      actions={<StepActions back={onBack} next={onNext} disabled={!selections.sport} />}
      contentClassName="justify-center"
    >
      <div className="grid w-full grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {sportCards.map((card, index) => {
          const active = selections.sport === card.sport;
          return (
            <button
              key={card.sport}
              onClick={() => onSelect(card.sport)}
              className={`${choiceCardClass(active)} grid min-h-24 items-center gap-2.5 overflow-hidden sm:min-h-[6.5rem] sm:grid-cols-[minmax(0,1fr)_72px]`}
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-suede">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {card.icon}
                </div>
                <div className="truncate text-base font-black leading-tight sm:text-lg">
                  {card.sport}
                </div>
                <div className="text-xs font-bold leading-tight text-suede">{card.sub}</div>
              </div>
              <div className="hidden h-full min-h-[72px] overflow-hidden rounded-xl bg-muted sm:block">
                <img src={card.image} alt={card.sport} className="h-full w-full object-cover" />
              </div>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

export function StyleScreen({
  eyebrow,
  cards,
  styleIdx,
  onBack,
  onVote,
}: {
  eyebrow: React.ReactNode;
  cards: SneakersCard[];
  styleIdx: number;
  onBack: () => void;
  onVote: (vote: StyleVote) => void;
}) {
  const currentCard = cards[styleIdx];
  if (!currentCard) return null;

  return (
    <StepShell
      eyebrow={eyebrow}
      title="Что нравится визуально?"
      subtitle="Свайпай карточки или жми кнопки — отметь силуэты для финальной подборки."
      contentClassName="min-h-0 gap-2"
    >
      <button
        onClick={onBack}
        className="self-start rounded-full px-2 py-1 text-sm font-bold text-suede underline underline-offset-4 transition-colors hover:text-outsole focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh"
      >
        ← Назад
      </button>
      <div className="min-h-0 flex-1">
        <StyleDeck
          key={currentCard.id}
          upcoming={cards.slice(styleIdx, styleIdx + 3)}
          cards={cards}
          currentIndex={styleIdx}
          onDislike={() => onVote("dislike")}
          onLike={() => onVote("like")}
        />
      </div>
    </StepShell>
  );
}

export function SummaryScreen({
  eyebrow,
  selections,
  onBack,
  onNext,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onBack: () => void;
  onNext: () => void;
}) {
  const style = voteSummary(selections.styleVotes);
  const summaryLines = useFlowSummary(selections);

  return (
    <StepShell
      eyebrow={eyebrow}
      title="Профиль подбора готов"
      subtitle="Проверь параметры. Если все хорошо, запускаем поиск по подходящим моделям."
      actions={<StepActions back={onBack} next={onNext} nextLabel="Показать подборку" />}
      contentClassName="flex items-center"
    >
      <div className="grid w-full items-center gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.66fr)]">
        <div className="overflow-hidden rounded-[1.5rem] border-2 border-outsole bg-lace shadow-[5px_5px_0_var(--mesh)] sm:rounded-[2rem] md:shadow-[8px_8px_0_var(--mesh)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-outsole bg-[linear-gradient(135deg,#b0ddff_0%,#ffffff_76%)] p-4 sm:p-5">
            <div>
              <div className="text-sm font-bold text-suede">Ваш профиль</div>
              <div className="mt-1 text-2xl font-black leading-none text-outsole sm:text-3xl">
                готов к поиску
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill>
                <span className="text-suede">Статус:</span> готов
              </Pill>
              {style.liked.length ? (
                <Pill>
                  <span className="text-suede">Стиль:</span> {style.liked.slice(0, 2).join(", ")}
                </Pill>
              ) : null}
            </div>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
            {summaryLines.map((line) => (
              <SummaryTile key={line.k} label={line.k} value={line.v || "—"} />
            ))}
          </div>
        </div>

        <div className="grid">
          <ProductShowcase item={RESULT_GROUPS[0].items[0]} compact accent />
        </div>
      </div>
    </StepShell>
  );
}

function SelectionAside({
  eyebrow,
  title,
  icon,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer?: string;
}) {
  return (
    <aside className="hidden min-h-full overflow-hidden rounded-[1.5rem] border-2 border-outsole bg-[linear-gradient(135deg,#b0ddff_0%,#f7fbff_58%,#ffffff_100%)] p-4 shadow-[6px_6px_0_var(--outsole)] lg:grid">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-black text-suede">{eyebrow}</div>
          <div className="mt-2 max-w-64 text-[1.65rem] font-black leading-[1.05] text-outsole">
            {title}
          </div>
        </div>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-outsole bg-lace shadow-[3px_3px_0_var(--outsole)]">
          {icon}
        </div>
      </div>
      <div className={footer ? "my-5" : "mt-5"}>{children}</div>
      {footer ? (
        <p className="self-end text-sm font-bold leading-snug text-outsole/72">{footer}</p>
      ) : null}
    </aside>
  );
}

function PriceAside({ priceId }: { priceId?: string }) {
  const defaultPriceId = priceId ?? DEFAULT_PRICE_ID;
  const item = PRICE_PREVIEW_ITEMS[defaultPriceId] ?? PRICE_PREVIEW_ITEMS[DEFAULT_PRICE_ID];
  const priceLabel = PRICES.find((price) => price.id === defaultPriceId)?.label;

  return (
    <SelectionAside
      eyebrow="Что попадает в бюджет"
      title="Топовая пара в этом сегменте"
      icon={<CurrencyRub size={26} weight="bold" />}
    >
      <div className="overflow-hidden rounded-[1.5rem] border-2 border-outsole bg-lace shadow-[4px_4px_0_var(--outsole)]">
        <div className="aspect-[16/12] overflow-hidden bg-muted">
          <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div className="p-4">
          {priceLabel ? (
            <div className="mb-2 w-fit rounded-full border-2 border-outsole bg-mesh px-3 py-1 text-xs font-black text-outsole shadow-[2px_2px_0_var(--outsole)]">
              {priceLabel}
            </div>
          ) : null}
          {item.brand ? <div className="text-xs font-black text-suede">{item.brand}</div> : null}
          <div className="mt-1 text-xl font-black leading-none text-outsole">{item.name}</div>
          <div className="mt-2 text-base font-black text-outsole">{item.price}</div>
        </div>
      </div>
    </SelectionAside>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    Размер: <Ruler size={22} weight="bold" />,
    Цвет: <Palette size={22} weight="bold" />,
    Цена: <CurrencyRub size={22} weight="bold" />,
    Задача: <Target size={22} weight="bold" />,
    Спорт: <Basketball size={22} weight="bold" />,
    Стиль: <Sparkle size={22} weight="bold" />,
  };
  const accentMap: Record<string, string> = {
    Размер: "bg-mesh",
    Цвет: "bg-[#ffe1f0]",
    Цена: "bg-[#d8f7c8]",
    Задача: "bg-[#fff1ad]",
    Спорт: "bg-[#e6ddff]",
    Стиль: "bg-[#ffd9c7]",
  };

  return (
    <div
      className={`rounded-[1.25rem] border-2 border-outsole p-4 shadow-[3px_3px_0_var(--outsole)] sm:rounded-[1.35rem] sm:shadow-[4px_4px_0_var(--outsole)] ${accentMap[label] ?? "bg-lace"}`}
    >
      <div className="flex items-center gap-2 text-sm font-black text-outsole/70">
        {iconMap[label]}
        {label}
      </div>
      <div className="mt-3 text-xl font-black leading-tight text-outsole">{value}</div>
    </div>
  );
}
