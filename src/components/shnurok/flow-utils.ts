import { useMemo } from "react";

import { getSneakersCardById } from "./sneakers-mapping";
import { COLORS, PRICES, type Selections, type Step, type StyleVote, type Task } from "./types";

export function stepIndex(step: Step): { current: number; total: number; label: string } {
  const total = 4;
  if (step === "size") return { current: 1, total, label: "Шаг 1 из 4" };
  if (step === "color") return { current: 2, total, label: "Шаг 2 из 4" };
  if (step === "price") return { current: 3, total, label: "Шаг 3 из 4" };
  if (step === "task" || step === "sport") return { current: 4, total, label: "Шаг 4 из 4" };
  return { current: 0, total, label: "" };
}

export function showPriceChipForStep(step: Step) {
  return ["price", "task", "sport", "style", "summary", "search", "results", "empty"].includes(
    step,
  );
}

export function choiceCardClass(active: boolean) {
  return `rounded-card border-2 p-2.5 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh sm:p-3 ${
    active
      ? "border-outsole bg-mesh text-outsole shadow-pop-md"
      : "border-cement bg-lace text-outsole hover:border-outsole hover:bg-muted hover:shadow-pop-mesh-sm"
  }`;
}

const MODEL_FORMS: [one: string, few: string, many: string] = ["модель", "модели", "моделей"];

export function pluralizeModels(count: number) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  let form = MODEL_FORMS[2];
  if (mod10 === 1 && mod100 !== 11) form = MODEL_FORMS[0];
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) form = MODEL_FORMS[1];
  return `${count} ${form}`;
}

export function selectedNames(ids: string[]) {
  return ids
    .map((id) => COLORS.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

export function voteSummary(styleVotes: Record<string, StyleVote>) {
  const entries = Object.entries(styleVotes).map(([id, vote]) => ({
    vote,
    title: getSneakersCardById(id)?.title.toLowerCase() ?? id,
  }));
  const liked = entries.filter((entry) => entry.vote === "like").map((entry) => entry.title);
  const disliked = entries.filter((entry) => entry.vote === "dislike").map((entry) => entry.title);

  return {
    liked,
    disliked,
    text: `${liked.length ? `нравятся ${liked.join(", ")}` : "без явных предпочтений"}${
      disliked.length ? `, не нравятся ${disliked.join(", ")}` : ""
    }`,
  };
}

export function getTaskCopy(task?: Task) {
  if (task === "sport") return "Для спорта";
  if (task === "daily") return "На каждый день";
  return "";
}

export function useFlowSummary(sel: Selections) {
  return useMemo(() => {
    const style = voteSummary(sel.styleVotes);
    return [
      { k: "Размер", v: sel.sizes.join(", ") },
      { k: "Цвет", v: selectedNames(sel.colors) || "" },
      { k: "Цена", v: PRICES.find((item) => item.id === sel.price)?.label ?? "" },
      { k: "Задача", v: getTaskCopy(sel.task).toLowerCase() },
      ...(sel.sport ? [{ k: "Спорт", v: sel.sport }] : []),
      { k: "Стиль", v: style.text },
    ];
  }, [sel]);
}
