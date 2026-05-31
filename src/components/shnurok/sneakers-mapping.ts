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

export const SNEAKERS_API_CONTRACT = {
  request: ["size", "color", "categories", "price_from", "price_to", "limit", "offset"],
  response: ["id", "offer_id", "name", "price", "currency", "size", "image", "detail_url"],
  note: "Product description is not returned by the current API.",
} as const;

export const SNEAKERS_COLOR_MAPPING = [
  { uiId: "black", apiName: "черный" },
  { uiId: "white", apiName: "белый" },
  { uiId: "grey", apiName: "серый" },
  { uiId: "beige", apiName: "бежевый" },
  { uiId: "blue", apiName: "синий" },
  { uiId: "red", apiName: "красный" },
  { uiId: "green", apiName: "зеленый" },
  { uiId: "brown", apiName: "коричневый" },
] as const;

export const SNEAKERS_CATEGORY_MAPPING = {
  running: {
    id: 493,
    label: "Беговые кроссовки",
    sport: "Бег",
  },
} as const;

export const SNEAKERS_STYLE_MAPPING = {
  chunky: null,
  retro: null,
  basket: null,
  puffy: null,
  running: null,
} as const;

export const SNEAKERS_PRICE_RANGES = [
  { id: "p2", from: 5000, to: 10000 },
  { id: "p3", from: 10000, to: 15000 },
  { id: "p4", from: 15000, to: 20000 },
  { id: "p5", from: 20000, to: 30000 },
  { id: "p6", from: 30000, to: 50000 },
  { id: "any", from: 0, to: 50000 },
] as const;

export const DEFAULT_SNEAKERS_LIMIT = 20;
export const DEFAULT_SNEAKERS_OFFSET = 0;

export function buildSneakersPayload(selections: Selections): SneakersPayload {
  const price = getSneakersPriceRange(selections.price);
  const colors = selections.colors.reduce<string[]>((values, id) => {
    const apiName = id === "any" ? undefined : colorNameForApi(id);
    return apiName ? [...values, apiName] : values;
  }, []);
  const categories = categoryIdsForSelections(selections);

  return omitUndefined({
    size: selections.sizes.map(sizeForApi).filter(Boolean),
    color: colors.length ? colors : undefined,
    categories: categories.length ? categories : undefined,
    price_from: price.from,
    price_to: price.to,
    limit: DEFAULT_SNEAKERS_LIMIT,
    offset: DEFAULT_SNEAKERS_OFFSET,
  });
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
  if (selections.task !== "sport") return [];
  if (selections.sport !== SNEAKERS_CATEGORY_MAPPING.running.sport) return [];
  return [SNEAKERS_CATEGORY_MAPPING.running.id];
}

function taskFromCategories(categories: unknown) {
  if (!Array.isArray(categories)) return {};
  if (categories.map(String).includes(String(SNEAKERS_CATEGORY_MAPPING.running.id))) {
    return { task: "sport" as const, sport: SNEAKERS_CATEGORY_MAPPING.running.sport };
  }
  return categories.length ? { task: "sport" as const } : {};
}

function colorNameForApi(id: string) {
  return SNEAKERS_COLOR_MAPPING.find((color) => color.uiId === id)?.apiName;
}

function colorIdFromApiName(name: string) {
  const normalized = normalizeRu(name);
  const mapped = SNEAKERS_COLOR_MAPPING.find((color) => normalizeRu(color.apiName) === normalized);
  if (mapped) return mapped.uiId;
  return COLORS.find((color) => normalizeRu(color.name) === normalized)?.id || normalized;
}

function priceIdFromPayload(payload: SneakersPayload) {
  const from = payload.price_from;
  const to = payload.price_to;

  if (typeof from !== "number" || typeof to !== "number") return DEFAULT_PRICE_ID;

  return (
    SNEAKERS_PRICE_RANGES.find((range) => range.from === from && range.to === to)?.id ||
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
