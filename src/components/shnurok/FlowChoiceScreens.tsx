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
  Target,
} from "@phosphor-icons/react";

import { PRICE_PREVIEW_ITEMS } from "./data";
import { StepActions } from "./FlowNav";
import { StyleDeck } from "./StyleDeck";
import { ChoiceLayout, ChoiceTile, SelectionAside, StepShell } from "./ui";
import { choiceCardClass } from "./flow-utils";
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
  onNext,
  onToggle,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onNext: () => void;
  onToggle: (size: string) => void;
}) {
  const mobileNext = <StepActions next={onNext} disabled={!selections.sizes.length} />;
  const desktopNext = <StepActions next={onNext} disabled={!selections.sizes.length} />;
  return (
    <StepShell
      eyebrow={eyebrow}
      title="Какой у вас размер?"
      subtitle="Можно отметить до трёх — удобно, если носите разные бренды."
      actions={mobileNext}
      actionsClassName="lg:hidden"
      titleAction={desktopNext}
    >
      <ChoiceLayout
        columns="grid-cols-5"
        aside={
          <SelectionAside
            title="Как подобрать размер"
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
                  className="flex items-center justify-between rounded-tile border-2 border-outsole bg-lace px-3 py-2"
                >
                  <span className="text-sm font-black text-outsole">{eu}</span>
                  <span className="text-xs font-bold text-suede">{cm}</span>
                </div>
              ))}
            </div>
          </SelectionAside>
        }
      >
        {SIZES.map((size) => {
          const active = selections.sizes.includes(size);
          const disabled = !active && selections.sizes.length >= 3;
          return (
            <ChoiceTile
              key={size}
              active={active}
              disabled={disabled}
              onClick={() => onToggle(size)}
            >
              <div className="text-2xl font-black leading-none text-outsole sm:text-3xl">
                {size.replace("EU ", "")}
              </div>
            </ChoiceTile>
          );
        })}
      </ChoiceLayout>
    </StepShell>
  );
}

export function ColorScreen({
  eyebrow,
  selections,
  onNext,
  onToggle,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onNext: () => void;
  onToggle: (id: string) => void;
}) {
  const mobileNext = <StepActions next={onNext} disabled={!selections.colors.length} />;
  const desktopNext = <StepActions next={onNext} disabled={!selections.colors.length} />;
  return (
    <StepShell
      eyebrow={eyebrow}
      title="Какие цвета нравятся?"
      subtitle="Можно выбрать несколько или отметить «без разницы»."
      actions={mobileNext}
      actionsClassName="lg:hidden"
      titleAction={desktopNext}
    >
      <ChoiceLayout
        columns="grid-cols-4 sm:grid-cols-5 lg:grid-cols-6"
        aside={
          <SelectionAside
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
                  className="relative min-h-[84px] overflow-hidden rounded-card border-2 border-outsole bg-lace p-3 will-change-transform"
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
                  <div className="absolute bottom-3 left-3 rounded-full border-2 border-outsole bg-lace px-3 py-1 text-xs font-black text-outsole shadow-pop-xs">
                    {label as string}
                  </div>
                </div>
              ))}
            </div>
          </SelectionAside>
        }
      >
        {COLORS.map((color) => {
          const active = selections.colors.includes(color.id);
          const isAny = color.id === "any";
          const disabled =
            !active && !isAny && selections.colors.filter((id) => id !== "any").length >= 3;
          return (
            <ChoiceTile
              key={color.id}
              active={active}
              disabled={disabled}
              ariaPressed={active}
              onClick={() => onToggle(color.id)}
            >
              <span
                className="size-10 shrink-0 rounded-full border-2 border-outsole/15 sm:size-11"
                style={{
                  background: isAny
                    ? "repeating-linear-gradient(45deg,#fff,#fff 8px,#dddddd 8px,#dddddd 16px)"
                    : color.hex,
                }}
              />
              <span className="text-xs font-bold leading-tight sm:text-sm">{color.name}</span>
            </ChoiceTile>
          );
        })}
      </ChoiceLayout>
    </StepShell>
  );
}

export function PriceScreen({
  eyebrow,
  selections,
  onNext,
  onSelect,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onNext: () => void;
  onSelect: (id: string) => void;
}) {
  const mobileNext = <StepActions next={onNext} disabled={!selections.price} />;
  const desktopNext = <StepActions next={onNext} disabled={!selections.price} />;
  return (
    <StepShell
      eyebrow={eyebrow}
      title="Какой бюджет комфортен?"
      subtitle="Выбери один диапазон — покажем модели в этой цене."
      actions={mobileNext}
      actionsClassName="lg:hidden"
      titleAction={desktopNext}
    >
      <ChoiceLayout
        columns="grid-cols-2 md:grid-cols-3"
        aside={<PriceAside priceId={selections.price} />}
      >
        {PRICES.map((price) => {
          const active = selections.price === price.id;
          return (
            <ChoiceTile key={price.id} active={active} onClick={() => onSelect(price.id)}>
              <div className="text-base font-black leading-tight text-outsole sm:text-lg">
                {price.label}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-suede sm:text-xs">
                {price.sub}
              </div>
            </ChoiceTile>
          );
        })}
      </ChoiceLayout>
    </StepShell>
  );
}

export function TaskScreen({
  eyebrow,
  onSelect,
}: {
  eyebrow: React.ReactNode;
  onSelect: (task: Task) => void;
}) {
  const taskCards = [
    {
      id: "daily" as Task,
      title: "На каждый день",
      sub: "Город, прогулки, учеба, работа и повседневные образы.",
      image: publicAsset("task-preview/task-daily.webp"),
      label: "каждый день",
    },
    {
      id: "sport" as Task,
      title: "Для спорта",
      sub: "Тренировки, бег, зал, игра и активное движение.",
      image: publicAsset("task-preview/task-sport.webp"),
      label: "спорт",
    },
  ];

  return (
    <StepShell
      eyebrow={eyebrow}
      title="Для чего нужны кроссовки?"
      subtitle="Одна задача — один сценарий подбора."
      contentClassName="lg:justify-center"
    >
      <div className="grid w-full gap-3 sm:grid-cols-2 md:gap-4">
        {taskCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelect(card.id)}
            className="grid min-h-[8.5rem] grid-cols-[minmax(0,1fr)_38%] overflow-hidden rounded-card border-2 border-cement bg-lace text-left transition-all will-change-transform hover:border-outsole hover:shadow-pop-mesh-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh sm:min-h-[12rem] sm:rounded-panel"
          >
            <div className="flex flex-col justify-center gap-1.5 p-4 sm:p-5">
              <div className="text-xl font-bold leading-tight text-outsole sm:text-2xl md:text-3xl">
                {card.title}
              </div>
              <p className="min-h-[3.6rem] text-sm leading-snug text-suede sm:min-h-[4.1rem] sm:text-base">
                {card.sub}
              </p>
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
  onNext,
  onSelect,
}: {
  eyebrow: React.ReactNode;
  selections: Selections;
  onNext: () => void;
  onSelect: (sport: string) => void;
}) {
  const sportCards = SPORTS.map((sport) => {
    const map: Record<string, { image: string; sub: string; icon: React.ReactNode }> = {
      Бег: {
        image: publicAsset("catalog-retro-runner.webp"),
        sub: "легкая амортизация",
        icon: <PersonSimpleRun size={22} weight="bold" />,
      },
      "Фитнес / зал": {
        image: publicAsset("catalog-knit-tech.webp"),
        sub: "стабильная база",
        icon: <Barbell size={22} weight="bold" />,
      },
      Футбол: {
        image: publicAsset("catalog-dark-accent.webp"),
        sub: "низкий цепкий силуэт",
        icon: <SoccerBall size={22} weight="bold" />,
      },
      Баскетбол: {
        image: publicAsset("catalog-chunky-lifestyle.webp"),
        sub: "поддержка и резкость",
        icon: <Basketball size={22} weight="bold" />,
      },
      Теннис: {
        image: publicAsset("catalog-court-minimal.webp"),
        sub: "плотная боковая опора",
        icon: <TennisBall size={22} weight="bold" />,
      },
      "Трейл / улица": {
        image: publicAsset("catalog-chunky-lifestyle.webp"),
        sub: "цепкость и защита",
        icon: <Target size={22} weight="bold" />,
      },
      Скейтбординг: {
        image: publicAsset("catalog-dark-accent.webp"),
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
      actions={<StepActions next={onNext} disabled={!selections.sport} />}
      actionsClassName="lg:hidden"
      titleAction={<StepActions next={onNext} disabled={!selections.sport} />}
      contentClassName="lg:justify-center"
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
              <div className="hidden h-full min-h-[72px] overflow-hidden rounded-xl bg-muted will-change-transform sm:block">
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
  onVote,
}: {
  eyebrow: React.ReactNode;
  cards: SneakersCard[];
  styleIdx: number;
  onVote: (vote: StyleVote) => void;
}) {
  const currentCard = cards[styleIdx];
  if (!currentCard) return null;

  return (
    <StepShell
      eyebrow={eyebrow}
      title="Что нравится визуально?"
      subtitle="Свайпай карточки или жми кнопки, чтобы собрать подборку."
      subtitleClassName="hidden sm:block"
      contentClassName="min-h-0 gap-2"
    >
      <div className="flex min-h-0 flex-1 flex-col lg:justify-center">
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

function PriceAside({ priceId }: { priceId?: string }) {
  const defaultPriceId = priceId ?? DEFAULT_PRICE_ID;
  const item = PRICE_PREVIEW_ITEMS[defaultPriceId] ?? PRICE_PREVIEW_ITEMS[DEFAULT_PRICE_ID];

  return (
    <SelectionAside
      title="Топовая пара в этом сегменте"
      icon={<CurrencyRub size={26} weight="bold" />}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="min-h-0 flex-1 overflow-hidden rounded-card border-2 border-outsole bg-muted will-change-transform">
          <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div
          data-slot="price-preview-meta"
          className="rounded-card border-2 border-outsole bg-lace p-3 shadow-pop-sm"
        >
          <div className="min-w-0 line-clamp-2 text-lg font-black leading-tight text-outsole">
            {item.name}
          </div>
        </div>
      </div>
    </SelectionAside>
  );
}
