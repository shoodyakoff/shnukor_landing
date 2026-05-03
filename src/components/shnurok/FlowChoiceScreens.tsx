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

import { INTRO_STEPS, RESULT_GROUPS } from "./data";
import { StepActions } from "./FlowNav";
import { ProductShowcase } from "./ProductCards";
import { StyleDeck } from "./StyleDeck";
import { Pill, StepShell } from "./ui";
import { choiceCardClass, useFlowSummary, voteSummary } from "./flow-utils";
import { publicAsset } from "@/lib/assets";
import {
  COLORS,
  PRICES,
  SIZES,
  SPORTS,
  STYLES,
  type Selections,
  type StyleVote,
  type Task,
} from "./types";

export function IntroScreen({ eyebrow, onNext }: { eyebrow: React.ReactNode; onNext: () => void }) {
  return (
    <StepShell
      eyebrow={eyebrow}
      title="Соберем вашу подборку"
      subtitle="Три коротких шага: параметры, визуальный стиль и готовая товарная выдача."
      actions={<StepActions next={onNext} nextLabel="Начать" />}
      contentClassName="flex items-center"
    >
      <div className="grid w-full items-center gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(380px,0.88fr)]">
        <div className="grid gap-4">
          {INTRO_STEPS.map((item) => (
            <div
              key={item.id}
              className={`rounded-[2rem] border p-5 ${
                item.id === "03" ? "border-outsole bg-mesh" : "border-cement bg-lace"
              }`}
            >
              <div
                className={`grid gap-5 ${
                  item.id === "03" ? "items-center lg:grid-cols-[minmax(0,1fr)_220px]" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-sm font-semibold text-suede">{item.id}</div>
                  <div>
                    <div className="text-[2rem] font-bold leading-none text-outsole">
                      {item.title}
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-outsole/78">
                      {item.text}
                    </p>
                  </div>
                </div>

                {item.id === "03" ? (
                  <div className="grid min-h-40 place-items-center rounded-[1.5rem] bg-lace/70 p-8">
                    <img
                      src={publicAsset("brand/hand-sneaker.svg")}
                      alt="Мини-кроссовок в руке"
                      className="h-auto w-full max-w-[210px]"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="grid">
          <ProductShowcase item={RESULT_GROUPS[0].items[0]} accent />
        </div>
      </div>
    </StepShell>
  );
}

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
      contentClassName="flex items-center"
    >
      <div className="grid w-full items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {SIZES.map((size) => {
            const active = selections.sizes.includes(size);
            const disabled = !active && selections.sizes.length >= 3;
            return (
              <button
                key={size}
                onClick={() => onToggle(size)}
                disabled={disabled}
                className={`${choiceCardClass(active)} flex h-28 flex-col items-center justify-center text-center disabled:cursor-not-allowed disabled:opacity-35 md:h-32`}
              >
                <div className="text-4xl font-black leading-none">{size.replace("EU ", "")}</div>
                <div className="mt-2 text-xs font-bold text-suede">EU</div>
              </button>
            );
          })}
        </div>

        <SelectionAside
          eyebrow="размер"
          title="Проверь посадку"
          icon={<Ruler size={26} weight="bold" />}
          footer="Если между брендами плаваешь на полразмера, выбери оба варианта."
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
              ["EU 46", "29.5 см"],
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
      subtitle="Выбирайте несколько. Если цвет не важен, отметьте «Без разницы»."
      actions={<StepActions back={onBack} next={onNext} disabled={!selections.colors.length} />}
      contentClassName="flex items-center"
    >
      <div className="grid w-full items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {COLORS.map((color) => {
            const active = selections.colors.includes(color.id);
            const isAny = color.id === "any";
            return (
              <button
                key={color.id}
                onClick={() => onToggle(color.id)}
                className={`${choiceCardClass(active)} min-h-28`}
              >
                <div
                  className="mb-5 size-10 rounded-full border border-cement"
                  style={{
                    background: isAny
                      ? "repeating-linear-gradient(45deg,#fff,#fff 8px,#dddddd 8px,#dddddd 16px)"
                      : color.hex,
                  }}
                />
                <div className="text-base font-bold leading-tight">{color.name}</div>
                <div className="mt-2 text-xs font-medium text-suede">
                  {active ? "выбрано" : "цвет"}
                </div>
              </button>
            );
          })}
        </div>

        <SelectionAside
          eyebrow="палитра"
          title="Сочетания сезона"
          icon={<Palette size={26} weight="bold" />}
          footer="Нейтральная база дружит с акцентом: серый, бежевый и один яркий цвет."
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
      contentClassName="flex items-center"
    >
      <div className="grid w-full items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PRICES.map((price) => {
            const active = selections.price === price.id;
            return (
              <button
                key={price.id}
                onClick={() => onSelect(price.id)}
                className={`${choiceCardClass(active)} min-h-30`}
              >
                <div className="text-sm font-medium text-suede">{price.sub}</div>
                <div className="mt-3 text-2xl font-bold leading-tight">{price.label}</div>
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
      image: publicAsset("result-new-balance-990v6.png"),
      label: "каждый день",
    },
    {
      id: "sport" as Task,
      title: "Для спорта",
      sub: "Тренировки, бег, зал, игра и активное движение.",
      image: publicAsset("result-nike-kobe-6-protro.png"),
      label: "спорт",
    },
  ];

  return (
    <StepShell
      eyebrow={eyebrow}
      title="Для чего нужны кроссовки?"
      subtitle="Одна задача — один сценарий подбора."
      actions={<StepActions back={onBack} />}
      contentClassName="flex items-center"
    >
      <div className="grid w-full gap-4 lg:grid-cols-2">
        {taskCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelect(card.id)}
            className="grid min-h-[260px] overflow-hidden rounded-[2rem] border border-cement bg-lace text-left transition-all hover:border-outsole focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh md:grid-cols-[1fr_0.92fr]"
          >
            <div className="flex flex-col justify-between p-6">
              <Pill color="active">{card.label}</Pill>
              <div className="mt-7">
                <div className="text-4xl font-bold leading-none text-outsole">{card.title}</div>
                <p className="mt-4 max-w-md text-base leading-relaxed text-suede">{card.sub}</p>
              </div>
              <div className="mt-6 text-sm font-semibold text-outsole">Выбрать</div>
            </div>
            <div className="min-h-56 overflow-hidden bg-muted">
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
        image: publicAsset("result-asics-gel-1130.png"),
        sub: "легкая амортизация",
        icon: <PersonSimpleRun size={22} weight="bold" />,
      },
      "Фитнес / зал": {
        image: publicAsset("result-nike-vomero-5.png"),
        sub: "стабильная база",
        icon: <Barbell size={22} weight="bold" />,
      },
      Футбол: {
        image: publicAsset("result-nike-total-90-iii.png"),
        sub: "низкий цепкий силуэт",
        icon: <SoccerBall size={22} weight="bold" />,
      },
      Баскетбол: {
        image: publicAsset("result-nike-kobe-6-protro.png"),
        sub: "поддержка и резкость",
        icon: <Basketball size={22} weight="bold" />,
      },
      Теннис: {
        image: publicAsset("result-adidas-samba-og.png"),
        sub: "плотная боковая опора",
        icon: <TennisBall size={22} weight="bold" />,
      },
      "Трейл / улица": {
        image: publicAsset("result-mizuno-wave-prophecy-moc.png"),
        sub: "цепкость и защита",
        icon: <Target size={22} weight="bold" />,
      },
      Скейтбординг: {
        image: publicAsset("result-new-balance-204l.png"),
        sub: "контроль доски",
        icon: <Sneaker size={22} weight="bold" />,
      },
      "Универсальные для спорта": {
        image: publicAsset("result-new-balance-740.png"),
        sub: "одна пара на разные дни",
        icon: <Sparkle size={22} weight="bold" />,
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
      contentClassName="flex items-center"
    >
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sportCards.map((card, index) => {
          const active = selections.sport === card.sport;
          return (
            <button
              key={card.sport}
              onClick={() => onSelect(card.sport)}
              className={`${choiceCardClass(active)} grid min-h-40 grid-cols-[minmax(0,1fr)_112px] gap-3 overflow-hidden p-3`}
            >
              <div className="flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-suede">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {card.icon}
                </div>
                <div>
                  <div className="text-xl font-black leading-tight">{card.sport}</div>
                  <div className="mt-2 text-sm font-bold leading-tight text-suede">{card.sub}</div>
                </div>
              </div>
              <div className="min-h-full overflow-hidden rounded-[1.15rem] bg-muted">
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
  styleIdx,
  onBack,
  onVote,
}: {
  eyebrow: React.ReactNode;
  styleIdx: number;
  onBack: () => void;
  onVote: (vote: StyleVote) => void;
}) {
  return (
    <StepShell
      eyebrow={eyebrow}
      title="Что нравится визуально?"
      subtitle="Свайпай карточки, чтобы отметить силуэты, которые хочется видеть в финальной подборке."
      actions={<StepActions back={onBack} />}
      contentClassName="grid min-h-0 items-center"
    >
      <StyleDeck
        key={STYLES[styleIdx].id}
        upcoming={STYLES.slice(styleIdx, styleIdx + 3)}
        currentIndex={styleIdx}
        total={STYLES.length}
        onDislike={() => onVote("dislike")}
        onLike={() => onVote("like")}
      />
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
      <div className="grid w-full items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.66fr)]">
        <div className="overflow-hidden rounded-[2rem] border-2 border-outsole bg-lace shadow-[8px_8px_0_var(--mesh)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-outsole bg-[linear-gradient(135deg,#b0ddff_0%,#ffffff_76%)] p-5">
            <div>
              <div className="text-sm font-bold text-suede">Ваш профиль</div>
              <div className="mt-1 text-3xl font-black leading-none text-outsole">
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
          <div className="grid gap-3 p-5 sm:grid-cols-2">
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
  footer: string;
}) {
  return (
    <aside className="hidden min-h-full overflow-hidden rounded-[2rem] border-2 border-outsole bg-[linear-gradient(135deg,#b0ddff_0%,#f7fbff_58%,#ffffff_100%)] p-5 shadow-[7px_7px_0_var(--outsole)] xl:grid">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-black text-suede">{eyebrow}</div>
          <div className="mt-2 max-w-64 text-3xl font-black leading-none text-outsole">{title}</div>
        </div>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-outsole bg-lace shadow-[3px_3px_0_var(--outsole)]">
          {icon}
        </div>
      </div>
      <div className="my-5">{children}</div>
      <p className="self-end text-sm font-bold leading-snug text-outsole/72">{footer}</p>
    </aside>
  );
}

function PriceAside({ priceId }: { priceId?: string }) {
  const previews: Record<string, (typeof RESULT_GROUPS)[number]["items"][number]> = {
    p1: RESULT_GROUPS[2].items[0],
    p2: RESULT_GROUPS[2].items[0],
    p3: RESULT_GROUPS[0].items[1],
    p4: RESULT_GROUPS[0].items[0],
    p5: RESULT_GROUPS[1].items[0],
    p6: RESULT_GROUPS[1].items[1],
    any: RESULT_GROUPS[0].items[0],
  };
  const defaultPriceId = priceId ?? "p3";
  const item = previews[defaultPriceId];
  const priceLabel = PRICES.find((price) => price.id === defaultPriceId)?.label;

  return (
    <SelectionAside
      eyebrow="пример"
      title="Что попадает в бюджет"
      icon={<CurrencyRub size={26} weight="bold" />}
      footer="Это не финальный результат, а ориентир по уровню моделей в выбранном диапазоне."
    >
      <div className="overflow-hidden rounded-[1.5rem] border-2 border-outsole bg-lace shadow-[4px_4px_0_var(--outsole)]">
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div className="p-3">
          {priceLabel ? (
            <div className="mb-2 w-fit rounded-full border-2 border-outsole bg-mesh px-3 py-1 text-xs font-black text-outsole shadow-[2px_2px_0_var(--outsole)]">
              {priceLabel}
            </div>
          ) : null}
          <div className="text-xs font-black text-suede">{item.brand}</div>
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
      className={`rounded-[1.35rem] border-2 border-outsole p-4 shadow-[4px_4px_0_var(--outsole)] ${accentMap[label] ?? "bg-lace"}`}
    >
      <div className="flex items-center gap-2 text-sm font-black text-outsole/70">
        {iconMap[label]}
        {label}
      </div>
      <div className="mt-3 text-xl font-black leading-tight text-outsole">{value}</div>
    </div>
  );
}
