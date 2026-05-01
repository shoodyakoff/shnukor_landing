import { useEffect, useMemo, useState } from "react";
import { Hero } from "./Hero";
import { BigButton, Pill, ProgressBar, StepShell } from "./ui";
import {
  COLORS,
  PRICES,
  SIZES,
  SPORTS,
  STYLES,
  type Selections,
  type Step,
  type StyleVote,
  type Task,
} from "./types";

const INTRO_STEPS = [
  {
    id: "01",
    title: "Что ищешь",
    text: "Размер, цвет, бюджет и задачу соберём за пару экранов.",
  },
  {
    id: "02",
    title: "Какой стиль",
    text: "Покажешь, какие силуэты реально нравятся визуально.",
  },
  {
    id: "03",
    title: "Твоя подборка",
    text: "Покажем curated-выдачу с теми моделями, которые ближе всего тебе.",
    accent: true,
  },
];

const RESULT_GROUPS = [
  {
    title: "Точное попадание",
    sub: "Самые близкие по вайбу и фильтрам.",
    badge: "bg-volt text-ink",
    items: [
      {
        brand: "Nike",
        name: "Zoom Vomero 5",
        price: "14 990 ₽",
        sizes: ["41", "42", "43", "44"],
        why: "Техничный силуэт, спокойная палитра и сильный everyday матч.",
        img: "/result-nike-vomero-5.png",
      },
      {
        brand: "ASICS",
        name: "GEL-1130",
        price: "12 490 ₽",
        sizes: ["40", "41", "42", "43"],
        why: "Лёгкий беговой вайб, носибельность каждый день, хороший баланс цены.",
        img: "/result-asics-gel-1130.png",
      },
      {
        brand: "New Balance",
        name: "990v6",
        price: "18 990 ₽",
        sizes: ["41", "42", "43", "44"],
        why: "Премиальные материалы и массивный, но универсальный силуэт.",
        img: "/result-new-balance-990v6.png",
      },
    ],
  },
  {
    title: "Чуть дороже, но стоит",
    sub: "Больше технологий и более дорогой силуэт.",
    badge: "bg-flame text-white",
    items: [
      {
        brand: "Mizuno",
        name: "Wave Prophecy Moc",
        price: "26 490 ₽",
        sizes: ["42", "43", "44"],
        why: "Сильная футуристичная подошва и очень выразительная tech-подача.",
        img: "/result-mizuno-wave-prophecy-moc.png",
      },
      {
        brand: "Nike",
        name: "Kobe 6 Protro",
        price: "29 990 ₽",
        sizes: ["41", "42", "43"],
        why: "Агрессивный баскетбольный силуэт и заметный премиальный акцент.",
        img: "/result-nike-kobe-6-protro.png",
      },
      {
        brand: "New Balance",
        name: "204L",
        price: "22 990 ₽",
        sizes: ["41", "42", "43", "44"],
        why: "Более модная и тонкая альтернатива с дорогим fashion-tech ощущением.",
        img: "/result-new-balance-204l.png",
      },
    ],
  },
  {
    title: "Альтернатива",
    sub: "Чуть другой характер, но всё ещё попадает в настроение.",
    badge: "bg-card text-ink",
    items: [
      {
        brand: "adidas",
        name: "Samba OG",
        price: "11 990 ₽",
        sizes: ["40", "41", "42", "43"],
        why: "Низкий ретро-силуэт и чистый городской образ без перегруза.",
        img: "/result-adidas-samba-og.png",
      },
      {
        brand: "New Balance",
        name: "740",
        price: "13 490 ₽",
        sizes: ["41", "42", "43", "44"],
        why: "Ретро-runner настроение и более мягкий, носибельный контур.",
        img: "/result-new-balance-740.png",
      },
      {
        brand: "Nike",
        name: "Total 90 III",
        price: "15 490 ₽",
        sizes: ["41", "42", "43"],
        why: "Футбольный Y2K вайб, если хочется более резкий и необычный силуэт.",
        img: "/result-nike-total-90-iii.png",
      },
    ],
  },
];

function stepIndex(step: Step): { current: number; total: number; label: string } {
  const total = 4;
  if (step === "size") return { current: 1, total, label: "Шаг 1 из 4" };
  if (step === "color") return { current: 2, total, label: "Шаг 2 из 4" };
  if (step === "price") return { current: 3, total, label: "Шаг 3 из 4" };
  if (step === "task" || step === "sport") return { current: 4, total, label: "Шаг 4 из 4" };
  return { current: 0, total, label: "" };
}

function choiceCardClass(active: boolean, accent?: "volt" | "flame") {
  const accentClass =
    accent === "flame"
      ? "bg-flame text-white"
      : accent === "volt"
        ? "bg-volt text-ink"
        : "bg-card text-ink";

  return `relative rounded-[2rem] border-[4px] border-ink transition-all duration-150 shadow-[8px_8px_0_var(--ink)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--ink)] ${
    active ? `${accentClass} -translate-y-1` : "bg-card text-ink"
  }`;
}

function selectedNames(ids: string[]) {
  return ids.map((id) => COLORS.find((item) => item.id === id)?.name).filter(Boolean).join(", ");
}

function voteSummary(styleVotes: Record<string, StyleVote>) {
  const liked = STYLES.filter((style) => styleVotes[style.id] === "like").map((style) => style.title.toLowerCase());
  const disliked = STYLES.filter((style) => styleVotes[style.id] === "dislike").map((style) => style.title.toLowerCase());

  return {
    liked,
    disliked,
    text: `${liked.length ? `нравятся ${liked.join(", ")}` : "без явных предпочтений"}${
      disliked.length ? `, не нравятся ${disliked.join(", ")}` : ""
    }`,
  };
}

function getTaskCopy(task?: Task) {
  if (task === "sport") return "Для спорта";
  if (task === "daily") return "На каждый день";
  return "";
}

function useFlowSummary(sel: Selections) {
  return useMemo(() => {
    const style = voteSummary(sel.styleVotes);
    return [
      { k: "Размер", v: sel.size ?? "" },
      { k: "Цвет", v: selectedNames(sel.colors) || "" },
      { k: "Цена", v: PRICES.find((item) => item.id === sel.price)?.label ?? "" },
      { k: "Задача", v: getTaskCopy(sel.task).toLowerCase() },
      ...(sel.sport ? [{ k: "Спорт", v: sel.sport }] : []),
      { k: "Стиль", v: style.text },
    ];
  }, [sel]);
}

export default function Flow() {
  const [step, setStep] = useState<Step>("hero");
  const [sel, setSel] = useState<Selections>({ colors: [], styleVotes: {} });
  const [styleIdx, setStyleIdx] = useState(0);
  const summaryLines = useFlowSummary(sel);

  const reset = () => {
    setSel({ colors: [], styleVotes: {} });
    setStyleIdx(0);
    setStep("hero");
  };

  const goAfterTask = (task: Task) => {
    setSel((prev) => ({ ...prev, task, sport: task === "daily" ? undefined : prev.sport }));
    setStep(task === "sport" ? "sport" : "style");
  };

  const currentStep = stepIndex(step);
  const styleMeta = step === "style" ? { current: styleIdx + 1, total: STYLES.length } : null;

  const Eyebrow = () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="font-display text-xl font-black uppercase tracking-tighter">
          Шнурок<span className="text-flame">.</span>
        </div>
        <button
          onClick={reset}
          className="font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
        >
          начать заново
        </button>
      </div>
      {styleMeta ? (
        <ProgressBar
          current={styleMeta.current}
          total={styleMeta.total}
          label={`Стиль ${styleMeta.current} из ${styleMeta.total}`}
        />
      ) : currentStep.label ? (
        <ProgressBar current={currentStep.current} total={currentStep.total} label={currentStep.label} />
      ) : null}
      <ChipsBar sel={sel} />
    </div>
  );

  if (step === "hero") return <Hero onStart={() => setStep("intro")} />;

  if (step === "intro") {
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Сейчас соберём<br />твою подборку.</>}
        subtitle="Три коротких этапа. Никаких лишних экранов, только самое важное."
        footer={
          <BigButton onClick={() => setStep("size")} variant="primary">
            Начать →
          </BigButton>
        }
      >
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.85fr)]">
          <div className="grid gap-4">
            {INTRO_STEPS.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-[2rem] border-[4px] border-ink px-6 py-5 shadow-[8px_8px_0_var(--ink)] ${
                  item.accent ? "bg-flame text-white" : "bg-card text-ink"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="font-mono text-xs uppercase tracking-[0.22em] opacity-60">{item.id}</div>
                  <div>
                    <div className="font-display text-[1.75rem] font-black uppercase leading-none">{item.title}</div>
                    <p className="mt-2 max-w-xl text-sm opacity-80">{item.text}</p>
                  </div>
                </div>
                <div className="size-12 rounded-full border-[4px] border-ink bg-card text-center font-display text-2xl font-black leading-[2.45rem] text-ink">
                  →
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="max-h-[560px] overflow-hidden rounded-[2.25rem] border-[4px] border-ink bg-cobalt shadow-[10px_10px_0_var(--ink)]">
              <img
                src="/result-nike-vomero-5.png"
                alt="Пример карточки подборки"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="rounded-[2rem] border-[4px] border-ink bg-card p-5 shadow-[8px_8px_0_var(--ink)]">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] opacity-60">пример выдачи</div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">Nike</div>
                  <div className="font-display text-2xl font-black uppercase leading-none">Zoom Vomero 5</div>
                </div>
                <div className="font-display text-xl font-black">14 990 ₽</div>
              </div>
            </div>
          </div>
        </div>
      </StepShell>
    );
  }

  if (step === "size") {
    const canNext = Boolean(sel.size);
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Выбери свой размер ноги.</>}
        subtitle="Один размер. Без него подбор не запустится."
        footer={
          <>
            <button
              onClick={() => setStep("intro")}
              className="font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
            >
              ← назад
            </button>
            <BigButton onClick={() => setStep("color")} variant="primary" disabled={!canNext}>
              Дальше →
            </BigButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {SIZES.map((size) => {
            const active = sel.size === size;
            return (
              <button
                key={size}
                onClick={() => setSel((prev) => ({ ...prev, size }))}
                className={`${choiceCardClass(active, "volt")} h-36 p-4 md:h-40`}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="font-display text-4xl font-black leading-none">{size.replace("EU ", "")}</div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">EU</div>
                </div>
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }

  if (step === "color") {
    const toggle = (id: string) => {
      setSel((prev) => {
        if (id === "any") return { ...prev, colors: ["any"] };
        const withoutAny = prev.colors.filter((color) => color !== "any");
        return {
          ...prev,
          colors: withoutAny.includes(id)
            ? withoutAny.filter((color) => color !== id)
            : [...withoutAny, id],
        };
      });
    };

    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Какие цвета нравятся?</>}
        subtitle="Выбирай несколько. Если не важно — отмечай «Без разницы»."
        footer={
          <>
            <button
              onClick={() => setStep("size")}
              className="font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
            >
              ← назад
            </button>
            <BigButton onClick={() => setStep("price")} variant="primary" disabled={!sel.colors.length}>
              Дальше →
            </BigButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COLORS.map((color) => {
            const active = sel.colors.includes(color.id);
            const isAny = color.id === "any";
            return (
              <button
                key={color.id}
                onClick={() => toggle(color.id)}
                className={`${choiceCardClass(active, active ? "volt" : undefined)} overflow-hidden p-3 text-left`}
              >
                <div
                  className="flex h-full min-h-[120px] flex-col justify-between rounded-[1.25rem] border-[3px] border-ink p-4"
                  style={{
                    background: isAny
                      ? "repeating-linear-gradient(45deg,#fff,#fff 12px,#efefef 12px,#efefef 24px)"
                      : color.hex,
                    color: color.text,
                  }}
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                    {active ? "выбрано" : "выбор"}
                  </div>
                  <div className="font-display text-2xl font-black uppercase leading-none">{color.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }

  if (step === "price") {
    const accents: Array<"volt" | "flame" | undefined> = [undefined, undefined, "volt", undefined, undefined, "flame", undefined];
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Выбери цену, которая ок.</>}
        subtitle="Один диапазон. Без акцентной радуги: только спокойная база и два сильных выделения."
        footer={
          <>
            <button
              onClick={() => setStep("color")}
              className="font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
            >
              ← назад
            </button>
            <BigButton onClick={() => setStep("task")} variant="primary" disabled={!sel.price}>
              Дальше →
            </BigButton>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PRICES.map((price, index) => {
            const active = sel.price === price.id;
            return (
              <button
                key={price.id}
                onClick={() => setSel((prev) => ({ ...prev, price: price.id }))}
                className={`${choiceCardClass(active, accents[index])} min-h-[150px] p-5 text-left`}
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">{price.sub}</div>
                <div className="mt-3 font-display text-[2rem] font-black uppercase leading-none">{price.label}</div>
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }

  if (step === "task") {
    const taskCards = [
      {
        id: "daily" as Task,
        title: "На каждый день",
        sub: "Город, прогулки, учёба, работа и повседневные образы.",
        image: "/result-new-balance-990v6.png",
        accent: "bg-volt text-ink",
      },
      {
        id: "sport" as Task,
        title: "Для спорта",
        sub: "Тренировки, бег, зал, игра и активное движение.",
        image: "/result-nike-kobe-6-protro.png",
        accent: "bg-flame text-white",
      },
    ];

    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Для чего нужны кроссовки?</>}
        subtitle="Одна задача — один сценарий подбора."
        footer={
          <button
            onClick={() => setStep("price")}
            className="font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
          >
            ← назад
          </button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {taskCards.map((card) => (
            <button
              key={card.id}
              onClick={() => goAfterTask(card.id)}
              className={`group grid min-h-[360px] grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-[2.25rem] border-[4px] border-ink text-left shadow-[10px_10px_0_var(--ink)] transition-all duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0_var(--ink)] ${card.accent}`}
            >
              <div className="flex flex-col justify-between p-6">
                <Pill>{card.id === "daily" ? "lifestyle" : "performance"}</Pill>
                <div>
                  <div className="font-display text-[3.25rem] font-black uppercase leading-[0.88]">{card.title}</div>
                  <p className="mt-4 max-w-md text-base opacity-85">{card.sub}</p>
                </div>
                <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                  выбрать
                  <span className="flex size-11 items-center justify-center rounded-full border-[4px] border-ink bg-card text-xl text-ink">
                    →
                  </span>
                </div>
              </div>
              <div className="relative">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
              </div>
            </button>
          ))}
        </div>
      </StepShell>
    );
  }

  if (step === "sport") {
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Какой именно спорт?</>}
        subtitle="Один вид спорта. От него зависят амортизация, сцепление и силуэт."
        footer={
          <>
            <button
              onClick={() => setStep("task")}
              className="font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
            >
              ← назад
            </button>
            <BigButton onClick={() => setStep("style")} variant="primary" disabled={!sel.sport}>
              К стилю →
            </BigButton>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPORTS.map((sport, index) => {
            const active = sel.sport === sport;
            return (
              <button
                key={sport}
                onClick={() => setSel((prev) => ({ ...prev, sport }))}
                className={`${choiceCardClass(active, index % 3 === 0 ? "volt" : undefined)} flex min-h-[118px] flex-col justify-between p-4 text-left`}
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-2xl font-black uppercase leading-none">{sport}</div>
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }

  if (step === "style") {
    const card = STYLES[styleIdx];
    const vote = (value: StyleVote) => {
      setSel((prev) => ({ ...prev, styleVotes: { ...prev.styleVotes, [card.id]: value } }));
      if (styleIdx < STYLES.length - 1) {
        setStyleIdx((prev) => prev + 1);
      } else {
        setStep("summary");
      }
    };

    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Что заходит визуально?</>}
        subtitle="Только нравится или не нравится. Пройти нужно все пять карточек."
        footer={
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => vote("dislike")}
              className="inline-flex items-center gap-3 rounded-full border-[4px] border-ink bg-card px-6 py-3 font-display text-lg font-black uppercase shadow-[6px_6px_0_var(--ink)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--ink)]"
            >
              <span className="flex size-8 items-center justify-center rounded-full border-[3px] border-ink bg-flame text-white">✕</span>
              Не нравится
            </button>
            <button
              onClick={() => vote("like")}
              className="inline-flex items-center gap-3 rounded-full border-[4px] border-ink bg-volt px-6 py-3 font-display text-lg font-black uppercase shadow-[6px_6px_0_var(--ink)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--ink)]"
            >
              <span className="flex size-8 items-center justify-center rounded-full border-[3px] border-ink bg-ink text-volt">♥</span>
              Нравится
            </button>
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-between rounded-[2rem] border-[4px] border-ink bg-card p-6 shadow-[8px_8px_0_var(--ink)]">
            <div>
              <Pill>стиль {styleIdx + 1} / {STYLES.length}</Pill>
              <div className="mt-6 font-display text-[4rem] font-black uppercase leading-[0.88]">{card.title}</div>
              <p className="mt-4 max-w-lg text-lg opacity-80">{card.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((style, index) => (
                <div
                  key={style.id}
                  className={`rounded-[1.25rem] border-[3px] border-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] ${
                    index === styleIdx ? "bg-volt" : "bg-concrete"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")} · {style.title}
                </div>
              ))}
            </div>
          </div>

          <div
            className="grid overflow-hidden rounded-[2.25rem] border-[4px] border-ink bg-card shadow-[10px_10px_0_var(--ink)]"
            style={{ gridTemplateRows: "minmax(0,1fr) auto" }}
          >
            <div className="relative overflow-hidden" style={{ background: card.bg }}>
              <img src={card.image} alt={card.title} className="max-h-[520px] w-full object-cover mix-blend-multiply" />
              <div className="absolute left-4 top-4">
                <Pill>#{card.id}</Pill>
              </div>
            </div>
            <div className="border-t-[4px] border-ink p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">силуэт</div>
              <div className="mt-2 font-display text-4xl font-black uppercase leading-none">{card.title}</div>
            </div>
          </div>
        </div>
      </StepShell>
    );
  }

  if (step === "summary") {
    const style = voteSummary(sel.styleVotes);
    const featured =
      RESULT_GROUPS[0].items.find((item) => item.sizes.includes((sel.size ?? "").replace("EU ", ""))) ?? RESULT_GROUPS[0].items[0];

    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Вот что мы ищем.</>}
        subtitle="Проверь профиль. Если всё ок, запускаем матчинг."
        footer={
          <>
            <button
              onClick={reset}
              className="font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
            >
              начать заново
            </button>
            <BigButton onClick={() => setStep("search")} variant="primary">
              Искать кроссовки →
            </BigButton>
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border-[4px] border-ink bg-card p-6 shadow-[8px_8px_0_var(--ink)]">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">профиль подбора</div>
            <div className="mt-4 grid gap-3">
              {summaryLines.map((line) => (
                <div key={line.k} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-t-[2px] border-ink/10 pt-3 first:border-t-0 first:pt-0">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">{line.k}</div>
                  <div className="font-display text-[2rem] font-black uppercase leading-[0.95]">{line.v || "—"}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-rows-[auto_1fr] gap-4">
            <div className="rounded-[2rem] border-[4px] border-ink bg-volt p-5 shadow-[8px_8px_0_var(--ink)]">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">готовность</div>
              <div className="mt-2 font-display text-[4.5rem] font-black leading-none">100%</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">все шаги пройдены</div>
            </div>
            <div className="grid overflow-hidden rounded-[2rem] border-[4px] border-ink bg-card shadow-[8px_8px_0_var(--ink)]">
              <div className="overflow-hidden border-b-[4px] border-ink">
                <img src={featured.img} alt={featured.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">первый кандидат</div>
                <div className="mt-2 font-display text-2xl font-black uppercase leading-none">
                  {featured.brand} {featured.name}
                </div>
                <p className="mt-2 text-sm opacity-75">{style.liked.length ? `Ближе к стилям: ${style.liked.join(", ")}.` : featured.why}</p>
              </div>
            </div>
          </div>
        </div>
      </StepShell>
    );
  }

  if (step === "search") return <SearchScreen sel={sel} onDone={(empty) => setStep(empty ? "empty" : "results")} />;
  if (step === "results") return <Results sel={sel} onReset={reset} onWiden={() => setStep("empty")} />;
  if (step === "empty") return <EmptyState onReset={reset} onResults={() => setStep("results")} />;

  return null;
}

function ChipsBar({ sel }: { sel: Selections }) {
  const items: Array<{ k: string; v: string }> = [];
  if (sel.size) items.push({ k: "Размер", v: sel.size });
  if (sel.colors.length) items.push({ k: "Цвет", v: selectedNames(sel.colors) });
  if (sel.price) items.push({ k: "Цена", v: PRICES.find((item) => item.id === sel.price)?.label ?? "" });
  if (sel.task) items.push({ k: "Задача", v: getTaskCopy(sel.task) });
  if (sel.sport) items.push({ k: "Спорт", v: sel.sport });

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Pill key={item.k}>
          <span className="opacity-60">{item.k}:</span> {item.v}
        </Pill>
      ))}
    </div>
  );
}

function SearchScreen({ sel, onDone }: { sel: Selections; onDone: (empty: boolean) => void }) {
  const statuses = [
    "Проверяем размер",
    "Сверяем бюджет",
    "Смотрим палитру",
    "Сопоставляем стиль",
    "Собираем лучшие пары",
  ];
  const [idx, setIdx] = useState(0);
  const allItems = RESULT_GROUPS.flatMap((group) => group.items);

  useEffect(() => {
    const timer = setInterval(() => setIdx((prev) => prev + 1), 850);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (idx >= statuses.length) {
      const timer = setTimeout(() => onDone(false), 700);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [idx, onDone, statuses.length]);

  return (
    <StepShell
      eyebrow={
        <div className="flex items-center justify-between gap-4">
          <div className="font-display text-xl font-black uppercase tracking-tighter">
            Шнурок<span className="text-flame">.</span>
          </div>
          <ChipsBar sel={sel} />
        </div>
      }
      title={<>Ищем для тебя кроссовки.</>}
      subtitle="Матчинг идёт по размеру, задаче, палитре и стилевым реакциям."
    >
      <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[2rem] border-[4px] border-ink bg-card p-6 shadow-[8px_8px_0_var(--ink)]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-60">progress</div>
          <div className="mt-4 grid gap-3">
            {statuses.map((status, index) => {
              const done = index < idx;
              const active = index === idx;
              return (
                <div
                  key={status}
                  className={`flex items-center gap-4 rounded-[1.2rem] border-[3px] border-ink px-4 py-3 ${
                    done ? "bg-volt" : active ? "bg-flame text-white" : "bg-concrete"
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-full border-[3px] border-ink bg-card font-display text-lg font-black text-ink">
                    {done ? "✓" : index + 1}
                  </div>
                  <div className="font-display text-2xl font-black uppercase leading-none">{status}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {allItems.map((item, index) => (
            <div
              key={item.name}
              className={`h-48 overflow-hidden rounded-[1.8rem] border-[4px] border-ink bg-card shadow-[8px_8px_0_var(--ink)] transition-all duration-300 ${
                index <= idx ? "translate-y-0 opacity-100" : "translate-y-6 opacity-50"
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

function Results({
  sel,
  onReset,
  onWiden,
}: {
  sel: Selections;
  onReset: () => void;
  onWiden: () => void;
}) {
  return (
    <div className="min-h-dvh px-6 py-6 md:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="font-display text-xl font-black uppercase tracking-tighter">
            Шнурок<span className="text-flame">.</span>
          </div>
          <button
            onClick={onReset}
            className="font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
          >
            подобрать заново
          </button>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
          <div>
            <h1 className="max-w-4xl font-display text-5xl font-black uppercase leading-[0.88] tracking-tight">
              Нашли модели под твой запрос.
            </h1>
            <p className="mt-2 max-w-2xl text-base opacity-75">
              Учли размер, цвет, цену, задачу и стиль. Ниже три группы по девяти товарам.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {sel.size && <Pill>Размер: {sel.size}</Pill>}
            {sel.price && <Pill color="volt">{PRICES.find((item) => item.id === sel.price)?.label}</Pill>}
            {sel.task && <Pill color="flame">{getTaskCopy(sel.task)}</Pill>}
          </div>
        </div>

        <div className="grid gap-8">
          {RESULT_GROUPS.map((group) => (
            <section key={group.title} className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <div className="rounded-[1.8rem] border-[4px] border-ink bg-card p-4 shadow-[8px_8px_0_var(--ink)]">
                <div className={`inline-flex rounded-full border-[3px] border-ink px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${group.badge}`}>
                  {group.title}
                </div>
                <p className="mt-3 text-sm opacity-75">{group.sub}</p>
                {group.title === "Альтернатива" && (
                  <button
                    onClick={onWiden}
                    className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100"
                  >
                    нет мэтча? →
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="grid overflow-hidden rounded-[1.8rem] border-[4px] border-ink bg-card shadow-[8px_8px_0_var(--ink)]"
                    style={{ gridTemplateRows: "auto auto" }}
                  >
                    <div className="aspect-[16/10] overflow-hidden border-b-[4px] border-ink">
                      <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="grid gap-2 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-60">{item.brand}</div>
                          <div className="font-display text-xl font-black uppercase leading-none">{item.name}</div>
                        </div>
                        <div className="font-display text-lg font-black">{item.price}</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.sizes.map((size) => (
                          <span
                            key={size}
                            className="rounded-full border-[2px] border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                      <p className="line-clamp-2 text-xs opacity-75">{item.why}</p>
                      <button className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-volt transition-colors hover:bg-flame hover:text-white">
                        Перейти в магазин →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset, onResults }: { onReset: () => void; onResults: () => void }) {
  const actions = [
    { label: "Поднять цену", accent: "bg-volt" },
    { label: "Убрать цвет", accent: "bg-card" },
    { label: "Смягчить стиль", accent: "bg-flame text-white" },
    { label: "Изменить задачу", accent: "bg-card" },
    { label: "Другой размер", accent: "bg-card" },
  ];

  return (
    <div className="min-h-dvh px-6 py-8 md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col justify-between rounded-[2rem] border-[4px] border-ink bg-card p-6 shadow-[8px_8px_0_var(--ink)]">
          <div>
            <Pill color="flame">ничего не найдено</Pill>
            <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[0.9]">
              По текущему запросу ничего не нашли.
            </h1>
            <p className="mt-4 max-w-xl text-lg opacity-75">
              Ограничения слишком узкие. Быстро расширим поиск и сохраним то, что уже выбрано.
            </p>
          </div>
          <button
            onClick={onReset}
            className="self-start font-mono text-[11px] uppercase tracking-[0.24em] underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100"
          >
            начать заново
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={onResults}
              className={`rounded-[1.8rem] border-[4px] border-ink p-5 text-left font-display text-3xl font-black uppercase leading-[0.92] shadow-[8px_8px_0_var(--ink)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--ink)] ${action.accent}`}
            >
              {action.label} →
            </button>
          ))}
          <button
            onClick={onReset}
            className="rounded-[1.8rem] border-[4px] border-ink bg-ink p-5 text-left font-display text-3xl font-black uppercase leading-[0.92] text-volt shadow-[8px_8px_0_var(--ink)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--ink)]"
          >
            Начать заново ↺
          </button>
        </div>
      </div>
    </div>
  );
}
