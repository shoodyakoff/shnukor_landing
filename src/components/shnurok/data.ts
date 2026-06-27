import { publicAsset } from "@/lib/assets";

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

export const PRICE_PREVIEW_ITEMS: Record<string, ProductItem> = {
  p2: {
    brand: "",
    name: "Nike Shox R4",
    price: "от 5 000 ₽",
    why: "Ориентир для доступного бюджета.",
    img: publicAsset("price-preview/price-5000-10000.webp"),
    fit: "бюджет",
  },
  p3: {
    brand: "",
    name: "New Balance 2002R",
    price: "от 10 000 ₽",
    why: "Ориентир для сбалансированного бюджета.",
    img: publicAsset("price-preview/price-10000-15000.webp"),
    fit: "бюджет",
  },
  p4: {
    brand: "",
    name: "Nike Calm Mule",
    price: "от 15 000 ₽",
    why: "Ориентир для первого премиального диапазона.",
    img: publicAsset("price-preview/price-15000-20000.webp"),
    fit: "бюджет",
  },
  p5: {
    brand: "",
    name: "Nike Calm",
    price: "от 20 000 ₽",
    why: "Ориентир для верхнего среднего бюджета.",
    img: publicAsset("price-preview/price-20000-30000.webp"),
    fit: "бюджет",
  },
  p6: {
    brand: "",
    name: "Nike Waffle Trainer",
    price: "от 30 000 ₽",
    why: "Ориентир для премиального бюджета без потолка.",
    img: publicAsset("price-preview/price-30000-plus.webp"),
    fit: "бюджет",
  },
  any: {
    brand: "",
    name: "Air Jordan 1 Low",
    price: "без ограничений",
    why: "Ориентир для подбора без фильтра по цене.",
    img: publicAsset("price-preview/price-any.webp"),
    fit: "бюджет",
  },
};
