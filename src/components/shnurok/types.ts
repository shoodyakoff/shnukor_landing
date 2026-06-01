export type Step =
  | "hero"
  | "size"
  | "color"
  | "price"
  | "task"
  | "sport"
  | "style"
  | "summary"
  | "search"
  | "results"
  | "empty";

export type Task = "daily" | "sport";
export type StyleVote = "like" | "dislike";

export interface Selections {
  sizes: string[];
  colors: string[];
  price?: string;
  task?: Task;
  sport?: string;
  styleVotes: Record<string, StyleVote>;
}

export const SIZES = [
  "EU 36",
  "EU 37",
  "EU 38",
  "EU 39",
  "EU 40",
  "EU 41",
  "EU 42",
  "EU 43",
  "EU 44",
  "EU 45",
];

export const COLORS = [
  { id: "beige", name: "Бежевый", hex: "#e7d5b3", text: "#111" },
  { id: "white", name: "Белый", hex: "#ffffff", text: "#111" },
  { id: "yellow", name: "Желтый", hex: "#facc15", text: "#111" },
  { id: "green", name: "Зелёный", hex: "#16a34a", text: "#fff" },
  { id: "brown", name: "Коричневый", hex: "#7c4a1e", text: "#fff" },
  { id: "red", name: "Красный", hex: "#ff2a00", text: "#fff" },
  { id: "orange", name: "Оранжевый", hex: "#fb923c", text: "#111" },
  { id: "pink", name: "Розовый", hex: "#f9a8d4", text: "#111" },
  { id: "purple", name: "Фиолетовый", hex: "#7c3aed", text: "#fff" },
  { id: "black", name: "Чёрный", hex: "#111111", text: "#fff" },
  { id: "grey", name: "Серый", hex: "#9ca3af", text: "#111" },
  { id: "blue", name: "Синий", hex: "#0044ff", text: "#fff" },
  { id: "any", name: "Без разницы", hex: "transparent", text: "#111" },
];

export const DEFAULT_PRICE_ID = "p3";

export const PRICES = [
  { id: "p2", label: "5 000 – 10 000 ₽", sub: "доступно" },
  { id: "p3", label: "10 000 – 15 000 ₽", sub: "оптимум" },
  { id: "p4", label: "15 000 – 20 000 ₽", sub: "премиум вход" },
  { id: "p5", label: "20 000 – 30 000 ₽", sub: "топ-сегмент" },
  { id: "p6", label: "30 000 ₽ и выше", sub: "без лимита" },
  { id: "any", label: "Без разницы", sub: "цена не важна" },
];

export const SPORTS = [
  "Фитнес / зал",
  "Бег",
  "Футбол",
  "Трейл / улица",
  "Баскетбол",
  "Теннис",
  "Скейтбординг",
];
