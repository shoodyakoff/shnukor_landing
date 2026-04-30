import { useEffect, useState } from "react";
import result1 from "@/assets/result-1.jpg";
import result2 from "@/assets/result-2.jpg";
import result3 from "@/assets/result-3.jpg";
import { Hero } from "./Hero";
import { ProgressBar, BigButton, StepShell, Pill } from "./ui";
import {
  COLORS, PRICES, SIZES, SPORTS, STYLES,
  type Selections, type Step, type Task,
} from "./types";

const FLOW_LABELS = ["Размер", "Цвет", "Цена", "Задача", "Стиль", "Подборка"];

function stepIndex(step: Step, sel: Selections): { current: number; total: number; label: string } {
  // 4 base questions + style cards
  const total = 4;
  if (step === "size") return { current: 1, total, label: "Шаг 1 из 4" };
  if (step === "color") return { current: 2, total, label: "Шаг 2 из 4" };
  if (step === "price") return { current: 3, total, label: "Шаг 3 из 4" };
  if (step === "task") return { current: 4, total, label: "Шаг 4 из 4" };
  if (step === "sport") return { current: 4, total, label: "Шаг 4 из 4 · спорт" };
  return { current: 0, total, label: "" };
}

export default function Flow() {
  const [step, setStep] = useState<Step>("hero");
  const [sel, setSel] = useState<Selections>({ colors: [], styleVotes: {} });
  const [styleIdx, setStyleIdx] = useState(0);

  const reset = () => {
    setSel({ colors: [], styleVotes: {} });
    setStyleIdx(0);
    setStep("hero");
  };

  const goAfterTask = (task: Task) => {
    setSel((s) => ({ ...s, task }));
    setStep(task === "sport" ? "sport" : "style");
  };

  // Selected summary chips bar (always visible during flow)
  const ChipsBar = () => {
    const items: { k: string; v: string }[] = [];
    if (sel.size) items.push({ k: "Размер", v: sel.size });
    if (sel.colors.length) {
      const names = sel.colors
        .map((id) => COLORS.find((c) => c.id === id)?.name ?? "")
        .join(", ");
      items.push({ k: "Цвет", v: names });
    }
    if (sel.price) items.push({ k: "Цена", v: PRICES.find((p) => p.id === sel.price)?.label ?? "" });
    if (sel.task) items.push({ k: "Задача", v: sel.task === "daily" ? "На каждый день" : "Для спорта" });
    if (sel.sport) items.push({ k: "Спорт", v: sel.sport });
    if (!items.length) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span key={it.k} className="inline-flex items-center gap-2 bg-card border-[3px] border-ink rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-tight shadow-[3px_3px_0_var(--ink)]">
            <span className="opacity-60">{it.k}:</span>
            <span>{it.v}</span>
          </span>
        ))}
      </div>
    );
  };

  const Eyebrow = () => {
    const meta = stepIndex(step, sel);
    const isStyle = step === "style";
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="font-display text-xl md:text-2xl font-black uppercase tracking-tighter">
            Шнурок<span className="text-flame">.</span>
          </div>
          <button onClick={reset} className="font-mono text-xs uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100">
            начать заново
          </button>
        </div>
        {meta.label && <ProgressBar current={meta.current} total={meta.total} label={meta.label} />}
        {isStyle && (
          <ProgressBar current={styleIdx + 1} total={STYLES.length} label={`Стиль ${styleIdx + 1} из ${STYLES.length}`} />
        )}
        <ChipsBar />
      </div>
    );
  };

  // ---- HERO ----
  if (step === "hero") return <Hero onStart={() => setStep("intro")} />;

  // ---- INTRO ----
  if (step === "intro") {
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Сейчас соберём<br />твою подборку.</>}
        subtitle="Шесть шагов. Никаких пропусков. На каждом — крупные карточки, минимум текста."
      >
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-10">
          {FLOW_LABELS.map((l, i) => (
            <div key={l} className="brutal-card p-5 md:p-6 flex flex-col gap-2">
              <span className="font-mono text-xs uppercase opacity-60">шаг {i + 1}</span>
              <span className="font-display font-black text-lg md:text-2xl uppercase tracking-tight">{l}</span>
            </div>
          ))}
        </div>
        <BigButton onClick={() => setStep("size")} variant="primary">Начать →</BigButton>
      </StepShell>
    );
  }

  // ---- SIZE ----
  if (step === "size") {
    const canNext = !!sel.size;
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Выбери свой<br />размер ноги.</>}
        subtitle="Один размер. Без него подбор не запустится."
        footer={
          <>
            <button onClick={() => setStep("intro")} className="font-mono text-sm uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100">← назад</button>
            <BigButton onClick={() => setStep("color")} variant="primary" disabled={!canNext}>Дальше →</BigButton>
          </>
        }
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 pb-32">
          {SIZES.map((s) => {
            const active = sel.size === s;
            return (
              <button
                key={s}
                onClick={() => setSel((p) => ({ ...p, size: s }))}
                className={`aspect-[5/4] rounded-3xl border-[4px] border-ink font-display font-black text-2xl md:text-4xl uppercase tracking-tight transition-all duration-150 shadow-[6px_6px_0_var(--ink)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--ink)] ${active ? "bg-volt -translate-y-1" : "bg-card"}`}
              >
                {s.replace("EU ", "")}
                <div className="font-mono text-[10px] opacity-60 normal-case mt-1">EU</div>
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }

  // ---- COLOR ----
  if (step === "color") {
    const toggle = (id: string) => {
      setSel((p) => {
        if (id === "any") return { ...p, colors: ["any"] };
        const without = p.colors.filter((c) => c !== "any");
        return {
          ...p,
          colors: without.includes(id) ? without.filter((c) => c !== id) : [...without, id],
        };
      });
    };
    const canNext = sel.colors.length > 0;
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Какие цвета тебе<br />больше нравятся?</>}
        subtitle="Кликни на прямоугольники для выбора цвета. Если без разницы — выбери явно."
        footer={
          <>
            <button onClick={() => setStep("size")} className="font-mono text-sm uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100">← назад</button>
            <BigButton onClick={() => setStep("price")} variant="primary" disabled={!canNext}>Дальше →</BigButton>
          </>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 pb-32">
          {COLORS.map((c) => {
            const active = sel.colors.includes(c.id);
            const isAny = c.id === "any";
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`group relative aspect-[4/5] rounded-3xl border-[4px] border-ink overflow-hidden text-left transition-all duration-150 shadow-[8px_8px_0_var(--ink)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--ink)] ${active ? "ring-[6px] ring-ink ring-offset-4 ring-offset-concrete -translate-y-1" : ""}`}
                style={{ background: isAny ? "repeating-linear-gradient(45deg,#fff,#fff 12px,#e7e5e4 12px,#e7e5e4 24px)" : c.hex }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="brutal-pill bg-card text-ink text-xs md:text-sm self-start" style={{ boxShadow: "3px 3px 0 var(--ink)" }}>
                    {c.name}
                  </div>
                </div>
                {active && (
                  <div className="absolute top-3 right-3 size-10 bg-volt border-[3px] border-ink rounded-full flex items-center justify-center font-display font-black text-xl">✓</div>
                )}
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }

  // ---- PRICE ----
  if (step === "price") {
    const canNext = !!sel.price;
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Выбери цену,<br />которая ОК.</>}
        subtitle="Один диапазон. Если бюджет не важен — отметь явно «Без разницы»."
        footer={
          <>
            <button onClick={() => setStep("color")} className="font-mono text-sm uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100">← назад</button>
            <BigButton onClick={() => setStep("task")} variant="primary" disabled={!canNext}>Дальше →</BigButton>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 pb-32">
          {PRICES.map((p, i) => {
            const active = sel.price === p.id;
            const colors = ["bg-card", "bg-card", "bg-volt", "bg-card", "bg-card", "bg-flame text-white", "bg-cobalt text-white"];
            return (
              <button
                key={p.id}
                onClick={() => setSel((s) => ({ ...s, price: p.id }))}
                className={`relative rounded-3xl border-[4px] border-ink p-6 md:p-8 text-left transition-all duration-150 shadow-[8px_8px_0_var(--ink)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--ink)] ${active ? "ring-[6px] ring-ink ring-offset-4 ring-offset-concrete -translate-y-1" : ""} ${colors[i]}`}
              >
                <div className="font-mono text-xs uppercase tracking-widest opacity-70">{p.sub}</div>
                <div className="font-display font-black text-2xl md:text-4xl uppercase tracking-tight mt-2">{p.label}</div>
                {active && (
                  <div className="absolute top-4 right-4 size-10 bg-volt border-[3px] border-ink rounded-full flex items-center justify-center font-display font-black text-xl text-ink">✓</div>
                )}
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }

  // ---- TASK ----
  if (step === "task") {
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Для чего нужны<br />кроссовки?</>}
        subtitle="Это определит, какие модели и какая механика подбора подключатся дальше."
        footer={
          <>
            <button onClick={() => setStep("price")} className="font-mono text-sm uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100">← назад</button>
            <span className="font-mono text-xs opacity-60 uppercase">выбери одну карточку</span>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-32">
          {[
            { id: "daily" as Task, title: "На каждый день", sub: "Город · прогулки · учёба · работа · повседневные образы.", bg: "bg-volt", chip: "lifestyle" },
            { id: "sport" as Task, title: "Для спорта",     sub: "Тренировки · бег · зал · игра · активное движение.",   bg: "bg-flame text-white", chip: "performance" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => goAfterTask(t.id)}
              className={`group relative rounded-[2.5rem] border-[5px] border-ink p-8 md:p-10 text-left min-h-[340px] md:min-h-[420px] flex flex-col justify-between transition-all duration-150 shadow-[12px_12px_0_var(--ink)] hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-[6px_6px_0_var(--ink)] ${t.bg}`}
            >
              <div className="brutal-pill bg-card text-ink text-xs self-start" style={{ boxShadow: "3px 3px 0 var(--ink)" }}>
                {t.chip}
              </div>
              <div>
                <div className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight leading-[0.95]">{t.title}</div>
                <p className="mt-4 text-base md:text-lg max-w-md opacity-90">{t.sub}</p>
              </div>
              <div className="self-end size-16 md:size-20 bg-card border-[4px] border-ink rounded-full flex items-center justify-center font-display font-black text-3xl group-hover:bg-ink group-hover:text-volt transition-colors text-ink">→</div>
            </button>
          ))}
        </div>
      </StepShell>
    );
  }

  // ---- SPORT ----
  if (step === "sport") {
    const canNext = !!sel.sport;
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Какой именно спорт?</>}
        subtitle="Выбери один вид. От него зависит подошва, амортизация и стиль."
        footer={
          <>
            <button onClick={() => setStep("task")} className="font-mono text-sm uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100">← назад</button>
            <BigButton onClick={() => setStep("style")} variant="primary" disabled={!canNext}>К стилю →</BigButton>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 pb-32">
          {SPORTS.map((s, i) => {
            const active = sel.sport === s;
            const accents = ["bg-card", "bg-volt", "bg-card", "bg-cobalt text-white", "bg-card", "bg-flame text-white", "bg-card", "bg-volt"];
            return (
              <button
                key={s}
                onClick={() => setSel((p) => ({ ...p, sport: s }))}
                className={`rounded-3xl border-[4px] border-ink p-6 text-left min-h-[140px] flex flex-col justify-between transition-all duration-150 shadow-[8px_8px_0_var(--ink)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--ink)] ${active ? "ring-[6px] ring-ink ring-offset-4 ring-offset-concrete -translate-y-1" : ""} ${accents[i]}`}
              >
                <span className="font-mono text-xs uppercase opacity-70">0{i + 1}</span>
                <span className="font-display font-black text-xl md:text-2xl uppercase tracking-tight leading-tight">{s}</span>
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }

  // ---- STYLE (visual cards) ----
  if (step === "style") {
    const card = STYLES[styleIdx];
    const vote = (v: "like" | "dislike") => {
      setSel((p) => ({ ...p, styleVotes: { ...p.styleVotes, [card.id]: v } }));
      if (styleIdx < STYLES.length - 1) setStyleIdx((i) => i + 1);
      else setStep("summary");
    };
    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Что заходит<br />визуально?</>}
        subtitle="Только «нравится» или «не нравится». Пройди все 5 карточек — это обязательно."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-40">
          <div className="lg:col-span-8 lg:col-start-3">
            <div
              key={card.id}
              className="relative rounded-[2.5rem] border-[6px] border-ink overflow-hidden shadow-[16px_16px_0_var(--ink)] animate-pop-in"
              style={{ background: card.bg, color: card.fg }}
            >
              {/* Top label */}
              <div className="absolute top-5 left-5 z-20 brutal-pill bg-card text-ink text-xs md:text-sm" style={{ boxShadow: "3px 3px 0 var(--ink)" }}>
                Стиль {styleIdx + 1} / {STYLES.length}
              </div>
              <div className="absolute top-5 right-5 z-20 brutal-pill bg-ink text-volt text-xs md:text-sm" style={{ boxShadow: "3px 3px 0 var(--ink)" }}>
                #{card.id}
              </div>

              <div className="aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>

              <div className="p-6 md:p-10 border-t-[5px] border-ink bg-card text-ink">
                <div className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight leading-[0.95]">
                  {card.title}
                </div>
                <p className="mt-3 text-base md:text-xl max-w-2xl opacity-80">{card.desc}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-center gap-4 md:gap-6 flex-wrap">
              <button
                onClick={() => vote("dislike")}
                className="group inline-flex items-center gap-3 bg-card text-ink border-[5px] border-ink rounded-full px-7 md:px-10 py-5 md:py-6 font-display font-black text-lg md:text-2xl uppercase tracking-tight shadow-[8px_8px_0_var(--ink)] hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-[3px_3px_0_var(--ink)] transition-all"
              >
                <span className="size-8 md:size-10 bg-flame border-[3px] border-ink rounded-full flex items-center justify-center text-white">✕</span>
                Не нравится
              </button>
              <button
                onClick={() => vote("like")}
                className="group inline-flex items-center gap-3 bg-volt text-ink border-[5px] border-ink rounded-full px-7 md:px-10 py-5 md:py-6 font-display font-black text-lg md:text-2xl uppercase tracking-tight shadow-[8px_8px_0_var(--ink)] hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-[3px_3px_0_var(--ink)] transition-all"
              >
                <span className="size-8 md:size-10 bg-ink border-[3px] border-ink rounded-full flex items-center justify-center text-volt">♥</span>
                Нравится
              </button>
            </div>
          </div>
        </div>
      </StepShell>
    );
  }

  // ---- SUMMARY ----
  if (step === "summary") {
    const liked = STYLES.filter((s) => sel.styleVotes[s.id] === "like").map((s) => s.title.toLowerCase());
    const disliked = STYLES.filter((s) => sel.styleVotes[s.id] === "dislike").map((s) => s.title.toLowerCase());

    const lines: { k: string; v: string }[] = [
      { k: "Размер", v: sel.size ?? "" },
      { k: "Цвет", v: sel.colors.map((c) => COLORS.find((x) => x.id === c)?.name).join(" / ") },
      { k: "Цена", v: PRICES.find((p) => p.id === sel.price)?.label ?? "" },
      { k: "Задача", v: sel.task === "daily" ? "на каждый день" : "для спорта" },
    ];
    if (sel.sport) lines.push({ k: "Вид спорта", v: sel.sport });
    lines.push({
      k: "Стиль",
      v: `${liked.length ? `нравятся ${liked.join(", ")}` : "без явных предпочтений"}${disliked.length ? `, не нравятся ${disliked.join(", ")}` : ""}`,
    });

    return (
      <StepShell
        eyebrow={<Eyebrow />}
        title={<>Вот что<br />мы ищем.</>}
        subtitle="Проверь параметры. Если всё ок — запускаем матчинг."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-32">
          <div className="lg:col-span-8 brutal-card p-6 md:p-10">
            <div className="font-mono text-xs uppercase tracking-widest opacity-60 mb-6">профиль подбора</div>
            <div className="divide-y-[3px] divide-ink/10">
              {lines.map((l) => (
                <div key={l.k} className="py-4 md:py-5 flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6">
                  <div className="md:w-44 font-mono text-xs uppercase tracking-widest opacity-60">{l.k}</div>
                  <div className="font-display font-black text-xl md:text-3xl uppercase tracking-tight">{l.v || "—"}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="brutal-card bg-volt p-6 md:p-8">
              <div className="font-mono text-xs uppercase tracking-widest opacity-70">готовность</div>
              <div className="font-display font-black text-5xl md:text-6xl mt-2">100%</div>
              <div className="font-mono text-xs uppercase tracking-widest mt-1 opacity-70">все шаги пройдены</div>
            </div>
            <BigButton onClick={() => setStep("search")} variant="primary">Искать кроссовки →</BigButton>
            <button onClick={reset} className="font-mono text-xs uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-70 self-start hover:opacity-100">начать заново</button>
          </div>
        </div>
      </StepShell>
    );
  }

  // ---- SEARCH ----
  if (step === "search") return <SearchScreen onDone={(empty) => setStep(empty ? "empty" : "results")} />;

  // ---- RESULTS ----
  if (step === "results") return <Results sel={sel} onReset={reset} onWiden={() => setStep("empty")} />;

  // ---- EMPTY ----
  if (step === "empty") return <EmptyState onReset={reset} onResults={() => setStep("results")} />;

  return null;
}

// ---- Sub: Search ----
function SearchScreen({ onDone }: { onDone: (empty: boolean) => void }) {
  const statuses = [
    "Проверяем размер в наличии",
    "Сверяем бюджет",
    "Учитываем выбранные цвета",
    "Сравниваем стиль",
    "Собираем лучшие совпадения",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => i + 1), 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (idx >= statuses.length) {
      const t = setTimeout(() => onDone(false), 600);
      return () => clearTimeout(t);
    }
  }, [idx, onDone, statuses.length]);

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full text-center">
        <div className="brutal-pill bg-card text-ink mx-auto mb-8 animate-wiggle">
          <span className="size-2 bg-flame border border-ink rounded-full mr-2 animate-pulse" />
          matching engine
        </div>
        <h1 className="font-display font-black uppercase text-5xl md:text-7xl leading-[0.95] tracking-tighter">
          Ищем для тебя<br />кроссовки
        </h1>

        <div className="mt-12 brutal-card p-6 md:p-8 text-left">
          {statuses.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <div key={s} className={`flex items-center gap-4 py-3 border-b-[2px] last:border-b-0 border-ink/10 transition-opacity ${i > idx ? "opacity-30" : "opacity-100"}`}>
                <div className={`size-8 md:size-10 rounded-full border-[3px] border-ink flex items-center justify-center font-display font-black ${done ? "bg-volt" : active ? "bg-flame text-white animate-pulse" : "bg-card"}`}>
                  {done ? "✓" : i + 1}
                </div>
                <span className="font-display font-black text-lg md:text-2xl uppercase tracking-tight">{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---- Sub: Results ----
function Results({ sel, onReset, onWiden }: { sel: Selections; onReset: () => void; onWiden: () => void }) {
  const groups = [
    {
      title: "Точное попадание",
      sub: "Размер, цена, цвет и стиль — всё в плюс.",
      bg: "bg-volt",
      items: [
        { brand: "Halcyon", name: "Tread 02", price: "13 990 ₽", sizes: ["41","42","43","44"], why: "Массивная подошва, нейтральный белый, попадает в бюджет.", img: result1 },
      ],
    },
    {
      title: "Чуть дороже, но стоит",
      sub: "+10–15% к бюджету за материалы и силуэт.",
      bg: "bg-cobalt text-white",
      items: [
        { brand: "Northbound", name: "Trail Cut", price: "16 490 ₽", sizes: ["42","43","44"], why: "Беговой силуэт с прочной подошвой, серый — универсален.", img: result2 },
      ],
    },
    {
      title: "Альтернатива",
      sub: "Другой силуэт, но матчится по вайбу.",
      bg: "bg-card",
      items: [
        { brand: "Studio K", name: "Court Low", price: "11 990 ₽", sizes: ["42","43"], why: "Низкий ретро-силуэт, тонкий и лёгкий — для городских образов.", img: result3 },
      ],
    },
  ];

  return (
    <div className="min-h-dvh">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-10 pb-24">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="font-display text-xl md:text-2xl font-black uppercase tracking-tighter">
            Шнурок<span className="text-flame">.</span>
          </div>
          <button onClick={onReset} className="font-mono text-xs uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100">подобрать заново</button>
        </div>

        <h1 className="font-display font-black uppercase text-5xl md:text-7xl leading-[0.95] tracking-tighter max-w-4xl">
          Нашли модели<br />под твой запрос.
        </h1>
        <p className="mt-5 text-base md:text-xl opacity-80 max-w-2xl">
          Учли размер, цвет, цену, задачу и стиль. Ниже — три группы совпадений.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {sel.size && <Pill>Размер: {sel.size}</Pill>}
          {sel.price && <Pill color="volt">{PRICES.find((p) => p.id === sel.price)?.label}</Pill>}
          {sel.task && <Pill color="ink">{sel.task === "daily" ? "на каждый день" : "для спорта"}</Pill>}
          {sel.sport && <Pill color="flame">{sel.sport}</Pill>}
        </div>

        <div className="mt-14 flex flex-col gap-12">
          {groups.map((g) => (
            <section key={g.title}>
              <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
                <div>
                  <div className={`inline-block px-5 py-2 rounded-full border-[4px] border-ink font-display font-black uppercase text-sm md:text-base shadow-[4px_4px_0_var(--ink)] ${g.bg}`}>
                    {g.title}
                  </div>
                  <p className="mt-3 font-mono text-xs md:text-sm uppercase tracking-widest opacity-60">{g.sub}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {g.items.map((it) => (
                  <div key={it.name} className="brutal-card overflow-hidden flex flex-col group">
                    <div className="aspect-[4/3] overflow-hidden bg-cream border-b-[4px] border-ink">
                      <img src={it.img} alt={it.name} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="font-mono text-xs uppercase tracking-widest opacity-60">{it.brand}</div>
                          <div className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight leading-tight">{it.name}</div>
                        </div>
                        <div className="font-display font-black text-xl md:text-2xl">{it.price}</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {it.sizes.map((s) => (
                          <span key={s} className="font-mono text-xs font-bold uppercase border-2 border-ink rounded-full px-2.5 py-1">{s}</span>
                        ))}
                      </div>
                      <p className="text-sm opacity-80 border-l-[3px] border-volt pl-3">{it.why}</p>
                      <button className="mt-auto self-start brutal-pill bg-ink text-volt hover:bg-flame hover:text-white transition-colors text-sm">
                        Перейти в магазин →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 brutal-card p-6 md:p-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-display font-black text-xl md:text-2xl uppercase">Хочешь шире?</div>
            <p className="opacity-70 text-sm md:text-base">Показать вариант, когда ничего не нашлось — расширим запрос.</p>
          </div>
          <button onClick={onWiden} className="font-mono text-xs uppercase tracking-widest underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100">смоделировать «ничего не найдено» →</button>
        </div>
      </div>
    </div>
  );
}

// ---- Sub: Empty ----
function EmptyState({ onReset, onResults }: { onReset: () => void; onResults: () => void }) {
  const actions = [
    { label: "Поднять цену", c: "bg-volt" },
    { label: "Убрать ограничение по цвету", c: "bg-card" },
    { label: "Смягчить стиль", c: "bg-cobalt text-white" },
    { label: "Изменить задачу", c: "bg-card" },
    { label: "Выбрать другой размер", c: "bg-card" },
  ];
  return (
    <div className="min-h-dvh flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full">
        <div className="brutal-pill bg-flame text-white mb-8">
          <span className="font-mono text-xs">no_match.exe</span>
        </div>
        <h1 className="font-display font-black uppercase text-5xl md:text-7xl leading-[0.95] tracking-tighter">
          По текущему запросу<br />ничего не нашли.
        </h1>
        <p className="mt-5 text-base md:text-xl opacity-80 max-w-2xl">
          Похоже, ограничения слишком узкие. Можно быстро расширить поиск — мы сохраним то, что уже выбрано.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={onResults}
              className={`rounded-3xl border-[4px] border-ink p-5 md:p-6 text-left font-display font-black text-lg md:text-2xl uppercase tracking-tight shadow-[8px_8px_0_var(--ink)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--ink)] transition-all ${a.c}`}
            >
              {a.label} →
            </button>
          ))}
          <button
            onClick={onReset}
            className="rounded-3xl border-[4px] border-ink p-5 md:p-6 text-left font-display font-black text-lg md:text-2xl uppercase tracking-tight shadow-[8px_8px_0_var(--ink)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[4px_4px_0_var(--ink)] transition-all bg-ink text-volt sm:col-span-2"
          >
            Начать заново ↺
          </button>
        </div>
      </div>
    </div>
  );
}
