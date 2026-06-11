import { publicAsset } from "@/lib/assets";

import { COLORS, DEFAULT_PRICE_ID, PRICES, type Selections } from "./types";

export type SneakersPayload = {
  size?: string[];
  color?: string[];
  categories?: number[];
  price_from?: number;
  price_to?: number;
  limit?: number;
  offset?: number;
  [key: string]: unknown;
};

export type SneakersCard = {
  id: string;
  title: string;
  desc: string;
  image: string;
  bg: string;
  fg: string;
  categoryId: number;
  scenario: "daily" | "sport";
  sport?: string;
};

export const SNEAKERS_API_CONTRACT = {
  request: ["size", "color", "categories", "price_from", "price_to", "limit", "offset"],
  response: ["id", "offer_id", "name", "price", "currency", "size", "image", "detail_url"],
  note: "Product description is not returned by the current API.",
} as const;

export const SNEAKERS_COLOR_MAPPING = [
  { uiId: "beige", apiNames: ["бежевый"] },
  { uiId: "white", apiNames: ["белый"] },
  { uiId: "yellow", apiNames: ["желтый", "золотой"] },
  { uiId: "green", apiNames: ["зеленый", "оливковый", "камуфляжный"] },
  { uiId: "brown", apiNames: ["коричневый", "медный"] },
  { uiId: "red", apiNames: ["красный", "бордовый"] },
  { uiId: "orange", apiNames: ["оранжевый"] },
  { uiId: "pink", apiNames: ["розовый"] },
  { uiId: "purple", apiNames: ["фиолетовый"] },
  { uiId: "black", apiNames: ["черный"] },
  { uiId: "grey", apiNames: ["серый", "серебристый"] },
  { uiId: "blue", apiNames: ["синий", "бирюзовый"] },
] as const;

const DAILY_CARDS: SneakersCard[] = [
  {
    id: "daily-chunky",
    title: "Массивные кроссовки",
    desc: "Объемный силуэт и утолщенная подошва для выразительного повседневного образа.",
    image: publicAsset("tinder-daily/daily-chunky.webp"),
    bg: "#ff2a00",
    fg: "#fff",
    categoryId: 349,
    scenario: "daily",
  },
  {
    id: "daily-retro-low",
    title: "Ретро: низкие силуэты",
    desc: "Низкий профиль в духе футбольных бутс и ретро-спорта.",
    image: publicAsset("tinder-daily/daily-retro-low.webp"),
    bg: "#facc15",
    fg: "#111",
    categoryId: 731,
    scenario: "daily",
  },
  {
    id: "daily-retro-basket",
    title: "Ретро: вдохновленные баскетболом",
    desc: "Классика 80-х и 90-х с кожаным верхом и винтажными деталями.",
    image: publicAsset("tinder-daily/daily-retro-basket.webp"),
    bg: "#0044ff",
    fg: "#fff",
    categoryId: 730,
    scenario: "daily",
  },
  {
    id: "daily-trending",
    title: "Трендовые кроссовки",
    desc: "Свежие силуэты на стыке баскетбола, бега, хайкинга и ретро.",
    image: publicAsset("tinder-daily/daily-trending.webp"),
    bg: "#ccff00",
    fg: "#111",
    categoryId: 569,
    scenario: "daily",
  },
  {
    id: "daily-minimal",
    title: "Минималистичные кроссовки",
    desc: "Строгие пары для джинсов, офиса и smart-casual.",
    image: publicAsset("tinder-daily/daily-minimal.webp"),
    bg: "#b0ddff",
    fg: "#111",
    categoryId: 576,
    scenario: "daily",
  },
  {
    id: "daily-puffy",
    title: "Дутые кроссовки",
    desc: "Объемные мягкие формы для расслабленного, заметного силуэта.",
    image: publicAsset("tinder-daily/daily-puffy.webp"),
    bg: "#7458ff",
    fg: "#fff",
    categoryId: 765,
    scenario: "daily",
  },
  {
    id: "daily-running",
    title: "Беговые кроссовки",
    desc: "Динамичная форма, легкость и спортивная технологичность.",
    image: publicAsset("tinder-daily/daily-running.webp"),
    bg: "#22c55e",
    fg: "#111",
    categoryId: 493,
    scenario: "daily",
  },
  {
    id: "daily-retro-runner",
    title: "Ретро: вдохновленные бегом",
    desc: "Винтажные беговые силуэты с замшей, сеткой и мягкой формой.",
    image: publicAsset("tinder-daily/daily-retro-runner.webp"),
    bg: "#fb923c",
    fg: "#111",
    categoryId: 732,
    scenario: "daily",
  },
  {
    id: "daily-tech",
    title: "Технологичные кроссовки",
    desc: "Утилитарные детали, сложные подошвы и современный techwear-вайб.",
    image: publicAsset("tinder-daily/daily-tech.webp"),
    bg: "#111827",
    fg: "#fff",
    categoryId: 579,
    scenario: "daily",
  },
  {
    id: "daily-luxury",
    title: "Люксовые кроссовки",
    desc: "Премиальные материалы и аккуратные силуэты для собранного образа.",
    image: publicAsset("tinder-daily/daily-luxury.webp"),
    bg: "#b45309",
    fg: "#fff",
    categoryId: 348,
    scenario: "daily",
  },
];

const SPORT_CARD_IMAGE_OVERRIDES: Record<string, string> = {
  "basketball-rubber": publicAsset("tinder-sport/basketball-rubber.webp"),
  "football-artificial": publicAsset("tinder-sport/football-artificial.webp"),
  "football-base": publicAsset("tinder-sport/football-base.webp"),
  "football-futsal": publicAsset("tinder-sport/football-futsal.webp"),
  "football-natural": publicAsset("tinder-sport/football-natural.webp"),
  "tennis-clay": publicAsset("tinder-sport/tennis-clay.webp"),
  "run-track": publicAsset("tinder-sport/run-track.webp"),
  "outdoor-hiking": publicAsset("tinder-sport/outdoor-hiking.webp"),
};

const SPORT_CARDS: Record<string, SneakersCard[]> = {
  "Фитнес / зал": [
    sportCard("fitness-base", "Базовые для фитнеса", 734, "Фитнес / зал"),
    sportCard("fitness-weightlifting", "Тяжёлая атлетика", 735, "Фитнес / зал"),
    sportCard("fitness-functional", "Функциональные тренировки", 736, "Фитнес / зал"),
    sportCard("fitness-crossfit", "Кроссфит", 737, "Фитнес / зал"),
    sportCard("fitness-group", "Фитнес и групповые тренировки", 738, "Фитнес / зал"),
  ],
  Бег: [
    sportCard("run-street", "Бег по улице", 739, "Бег"),
    sportCard("run-long", "Длинные дистанции", 740, "Бег"),
    sportCard("run-trail", "Трейлраннинг", 741, "Бег"),
    sportCard("run-urban-trail", "Городской трейл", 742, "Бег"),
    sportCard("run-track", "Бег по стадиону и дорожке", 743, "Бег"),
    sportCard("run-winter", "Зимний бег", 744, "Бег"),
  ],
  Футбол: [
    sportCard("football-artificial", "Бутсы для искусственного газона", 745, "Футбол"),
    sportCard("football-natural", "Бутсы для натурального газона", 746, "Футбол"),
    sportCard("football-base", "Базовые для футбола", 747, "Футбол"),
    sportCard("football-futsal", "Футзал и мини-футбол", 748, "Футбол"),
  ],
  "Трейл / улица": [
    sportCard("outdoor-trail", "Трейлраннинг", 741, "Трейл / улица"),
    sportCard("outdoor-hiking", "Хайкинг", 749, "Трейл / улица"),
    sportCard("outdoor-trekking", "Трекинг", 750, "Трейл / улица"),
  ],
  Баскетбол: [
    sportCard("basketball-base", "Базовые для баскетбола", 751, "Баскетбол"),
    sportCard("basketball-street", "Уличные площадки", 752, "Баскетбол"),
    sportCard("basketball-rubber", "Резиновое покрытие", 753, "Баскетбол"),
    sportCard("basketball-parquet", "Паркет", 754, "Баскетбол"),
  ],
  Теннис: [
    sportCard("tennis-hard", "Хард", 755, "Теннис"),
    sportCard("tennis-clay", "Грунт", 756, "Теннис"),
    sportCard("tennis-grass", "Трава", 757, "Теннис"),
    sportCard("tennis-universal", "Универсальные", 758, "Теннис"),
    sportCard("tennis-padel", "Падел", 759, "Теннис"),
  ],
  Скейтбординг: [
    sportCard("skate-base", "Базовые", 760, "Скейтбординг"),
    sportCard("skate-slipons", "Слипоны", 761, "Скейтбординг"),
    sportCard("skate-low", "Низкие скейт-кеды", 762, "Скейтбординг"),
    sportCard("skate-high", "Высокие скейт-кеды", 763, "Скейтбординг"),
    sportCard("skate-cupsole", "Кроссовки с капсульной подошвой", 764, "Скейтбординг"),
  ],
};

export const SNEAKERS_CARDS = [...DAILY_CARDS, ...Object.values(SPORT_CARDS).flat()] as const;

export const SNEAKERS_PRICE_RANGES = [
  { id: "p2", from: 5000, to: 10000 },
  { id: "p3", from: 10000, to: 15000 },
  { id: "p4", from: 15000, to: 20000 },
  { id: "p5", from: 20000, to: 30000 },
  { id: "p6", from: 30000 },
  { id: "any" },
] as const;

export const DEFAULT_SNEAKERS_LIMIT = 20;
export const DEFAULT_SNEAKERS_OFFSET = 0;

export function buildSneakersPayload(selections: Selections): SneakersPayload {
  const price = getSneakersPriceRange(selections.price);
  const sizes = selections.sizes.map(sizeForApi).filter(Boolean);
  const colors = selections.colors.flatMap(colorNamesForApi);
  const categories = categoryIdsForSelections(selections);

  return omitUndefined({
    size: sizes.length ? sizes : undefined,
    color: colors.length ? colors : undefined,
    categories: categories.length ? categories : undefined,
    price_from: "from" in price ? price.from : undefined,
    price_to: "to" in price ? price.to : undefined,
    limit: DEFAULT_SNEAKERS_LIMIT,
    offset: DEFAULT_SNEAKERS_OFFSET,
  });
}

export function getSneakersCardsForSelections(selections: Partial<Selections>) {
  if (selections.task === "daily") return DAILY_CARDS;
  if (selections.task === "sport" && selections.sport) return SPORT_CARDS[selections.sport] ?? [];
  return [];
}

export function getSneakersCardById(id: string) {
  return SNEAKERS_CARDS.find((card) => card.id === id);
}

export function isAllSkipSelection(selections: Selections) {
  const cards = getSneakersCardsForSelections(selections);
  return cards.length > 0 && cards.every((card) => selections.styleVotes[card.id] === "dislike");
}

export function selectionsFromSneakersPayload(payload: SneakersPayload): Selections {
  return {
    sizes: Array.isArray(payload.size) ? payload.size.map((size) => `EU ${size}`) : [],
    colors: Array.isArray(payload.color) ? payload.color.map(colorIdFromApiName) : [],
    price: priceIdFromPayload(payload),
    ...taskFromCategories(payload.categories),
    styleVotes: {},
  };
}

export function getSneakersPriceRange(priceId?: string) {
  return SNEAKERS_PRICE_RANGES.find((range) => range.id === priceId) || SNEAKERS_PRICE_RANGES[1];
}

function categoryIdsForSelections(selections: Selections) {
  const cards = getSneakersCardsForSelections(selections);
  const likedCards = cards.filter((card) => selections.styleVotes[card.id] === "like");
  return (likedCards.length ? likedCards : cards).map((card) => card.categoryId);
}

function taskFromCategories(categories: unknown) {
  if (!Array.isArray(categories)) return {};
  const categoryIds = categories.map(Number).filter(Number.isFinite);
  const sport = Object.entries(SPORT_CARDS).find(([, cards]) =>
    cards.some((card) => categoryIds.includes(card.categoryId)),
  )?.[0];

  if (sport) {
    return { task: "sport" as const, sport };
  }

  if (DAILY_CARDS.some((card) => categoryIds.includes(card.categoryId))) {
    return { task: "daily" as const };
  }

  return categoryIds.length ? { task: "daily" as const } : {};
}

function colorNamesForApi(id: string) {
  if (id === "any") return [];
  return [...(SNEAKERS_COLOR_MAPPING.find((color) => color.uiId === id)?.apiNames ?? [])];
}

function colorIdFromApiName(name: string) {
  const normalized = normalizeRu(name);
  const mapped = SNEAKERS_COLOR_MAPPING.find((color) =>
    color.apiNames.some((apiName) => normalizeRu(apiName) === normalized),
  );
  if (mapped) return mapped.uiId;
  return COLORS.find((color) => normalizeRu(color.name) === normalized)?.id || normalized;
}

function priceIdFromPayload(payload: SneakersPayload) {
  const from = payload.price_from;
  const to = payload.price_to;

  if (from === undefined && to === undefined) return "any";
  if (typeof from === "number" && to === undefined && from === 30000) return "p6";
  if (typeof from !== "number" || typeof to !== "number") return DEFAULT_PRICE_ID;

  return (
    SNEAKERS_PRICE_RANGES.find(
      (range) => "from" in range && "to" in range && range.from === from && range.to === to,
    )?.id ||
    PRICES.find((price) => price.id === "any")?.id ||
    DEFAULT_PRICE_ID
  );
}

function sizeForApi(size: string) {
  return size.replace("EU ", "").replace("+", "");
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

function normalizeRu(value: string) {
  return value.trim().toLowerCase().replaceAll("ё", "е");
}

function sportCard(id: string, title: string, categoryId: number, sport: string): SneakersCard {
  const visual = sportVisual(sport);
  return {
    id,
    title,
    desc: sportCardDescription(title, sport),
    image: SPORT_CARD_IMAGE_OVERRIDES[id] ?? visual.image,
    bg: visual.bg,
    fg: visual.fg,
    categoryId,
    scenario: "sport",
    sport,
  };
}

function sportVisual(sport: string) {
  const visuals: Record<string, Pick<SneakersCard, "image" | "bg" | "fg">> = {
    "Фитнес / зал": {
      image: publicAsset("catalog-knit-tech.webp"),
      bg: "#b0ddff",
      fg: "#111",
    },
    Бег: {
      image: publicAsset("catalog-retro-runner.webp"),
      bg: "#fb923c",
      fg: "#111",
    },
    Футбол: {
      image: publicAsset("catalog-dark-accent.webp"),
      bg: "#0044ff",
      fg: "#fff",
    },
    "Трейл / улица": {
      image: publicAsset("catalog-chunky-lifestyle.webp"),
      bg: "#ccff00",
      fg: "#111",
    },
    Баскетбол: {
      image: publicAsset("catalog-chunky-lifestyle.webp"),
      bg: "#ff2a00",
      fg: "#fff",
    },
    Теннис: {
      image: publicAsset("catalog-court-minimal.webp"),
      bg: "#facc15",
      fg: "#111",
    },
    Скейтбординг: {
      image: publicAsset("catalog-dark-accent.webp"),
      bg: "#111111",
      fg: "#fff",
    },
  };

  return visuals[sport] ?? visuals["Бег"];
}

function sportCardDescription(title: string, sport: string) {
  return `${sport}: ${title.toLowerCase()}. Покажем пары из этой подкатегории с учетом размера, цвета и бюджета.`;
}
