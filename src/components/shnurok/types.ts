import { publicAsset } from "@/lib/assets";

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
  "EU 45+",
];

export const COLORS = [
  { id: "white", name: "Белый", hex: "#ffffff", text: "#111" },
  { id: "black", name: "Чёрный", hex: "#111111", text: "#fff" },
  { id: "grey", name: "Серый", hex: "#9ca3af", text: "#111" },
  { id: "beige", name: "Бежевый", hex: "#e7d5b3", text: "#111" },
  { id: "blue", name: "Синий", hex: "#0044ff", text: "#fff" },
  { id: "red", name: "Красный", hex: "#ff2a00", text: "#fff" },
  { id: "green", name: "Зелёный", hex: "#16a34a", text: "#fff" },
  { id: "brown", name: "Коричневый", hex: "#7c4a1e", text: "#fff" },
  {
    id: "neon",
    name: "Яркий / акцентный",
    hex: "linear-gradient(135deg,#ccff00,#ff2a00,#0044ff)",
    text: "#111",
  },
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
  "Бег",
  "Фитнес / зал",
  "Футбол",
  "Баскетбол",
  "Теннис",
  "Трейл / улица",
  "Скейтбординг",
  "Универсальные для спорта",
];

export const STYLES = [
  {
    id: "chunky",
    title: "Массивные",
    desc: "Крупная подошва, заметный силуэт, сильный акцент в образе.",
    image: publicAsset("catalog-chunky-lifestyle.png"),
    bg: "#ff2a00",
    fg: "#fff",
  },
  {
    id: "retro",
    title: "Ретро низкие",
    desc: "Низкие классические модели, которые легко носить каждый день.",
    image: publicAsset("catalog-court-minimal.png"),
    bg: "#facc15",
    fg: "#111",
  },
  {
    id: "basket",
    title: "Ретро-баскетбол",
    desc: "Плотная форма, спортивный характер и отсылка к баскетбольной классике.",
    image: publicAsset("catalog-dark-accent.png"),
    bg: "#0044ff",
    fg: "#fff",
  },
  {
    id: "puffy",
    title: "Дутые",
    desc: "Объёмные мягкие формы, расслабленный и заметный силуэт.",
    image: publicAsset("catalog-retro-runner.png"),
    bg: "#ccff00",
    fg: "#111",
  },
  {
    id: "running",
    title: "Беговые",
    desc: "Динамичная форма, лёгкость и спортивная технологичность.",
    image: publicAsset("catalog-knit-tech.png"),
    bg: "#fb923c",
    fg: "#111",
  },
];
