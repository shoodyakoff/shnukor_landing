import { publicAsset } from "@/lib/assets";

export const INTRO_STEPS = [
  {
    id: "01",
    title: "Что ищешь",
    text: "Размер, цвет, бюджет и задачу соберем за пару коротких экранов.",
  },
  {
    id: "02",
    title: "Какой стиль",
    text: "Свайпом покажешь, какие силуэты реально нравятся визуально.",
  },
  {
    id: "03",
    title: "Твоя подборка",
    text: "На выходе получишь товарную выдачу с сильными совпадениями по характеру и фильтрам.",
  },
];

export type ProductItem = {
  id?: string;
  brand: string;
  name: string;
  price: string;
  size?: string;
  why: string;
  img: string;
  fit: string;
  url?: string;
};

export const CATALOG_ITEMS: ProductItem[] = [
  {
    brand: "",
    name: "Court Minimal",
    price: "9 990 ₽",
    why: "Чистая кожаная база без лишних акцентов, легко попадает в повседневный гардероб.",
    img: publicAsset("catalog-court-minimal.png"),
    fit: "96% подходит",
  },
  {
    brand: "",
    name: "Retro Runner",
    price: "13 990 ₽",
    why: "Спокойный ретро-беговой силуэт, мягкая палитра и хороший баланс цены.",
    img: publicAsset("catalog-retro-runner.png"),
    fit: "94% подходит",
  },
  {
    brand: "",
    name: "Chunky Lifestyle",
    price: "18 990 ₽",
    why: "Более заметная форма с массивной подошвой, но без визуального шума.",
    img: publicAsset("catalog-chunky-lifestyle.png"),
    fit: "92% подходит",
  },
  {
    brand: "",
    name: "Knit Tech",
    price: "24 990 ₽",
    why: "Легкий технологичный верх и спокойный акцент для спортивного городского образа.",
    img: publicAsset("catalog-knit-tech.png"),
    fit: "90% подходит",
  },
  {
    brand: "",
    name: "Dark Accent Low",
    price: "31 990 ₽",
    why: "Премиальная темная отделка, чистый низкий силуэт и выразительный контраст.",
    img: publicAsset("catalog-dark-accent.png"),
    fit: "88% подходит",
  },
];

export const PRICE_PREVIEW_ITEMS: Record<string, ProductItem> = {
  p2: CATALOG_ITEMS[0],
  p3: CATALOG_ITEMS[1],
  p4: CATALOG_ITEMS[2],
  p5: CATALOG_ITEMS[3],
  p6: CATALOG_ITEMS[4],
  any: CATALOG_ITEMS[1],
};

export const RESULT_GROUPS: Array<{
  title: string;
  sub: string;
  items: ProductItem[];
}> = [
  {
    title: "Точное попадание",
    sub: "Самые близкие по характеру, палитре и сценарию носки.",
    items: CATALOG_ITEMS.slice(0, 3),
  },
  {
    title: "Чуть дороже, но стоит",
    sub: "Больше технологий, материалов и визуального характера.",
    items: CATALOG_ITEMS.slice(3),
  },
  {
    title: "Альтернатива",
    sub: "Чуть другой характер, но все еще в правильном настроении.",
    items: [CATALOG_ITEMS[1], CATALOG_ITEMS[4]],
  },
];
