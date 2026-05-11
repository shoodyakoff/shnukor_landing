import { publicAsset } from "@/lib/assets";

import type { ProductItem } from "./data";
import { COLORS, PRICES, type Selections } from "./types";

const API_URL = publicAsset("api/sneakers");

const DEFAULT_CATEGORY_ID = "493";
const FALLBACK_IMAGES = [
  publicAsset("catalog-court-minimal.png"),
  publicAsset("catalog-retro-runner.png"),
  publicAsset("catalog-chunky-lifestyle.png"),
  publicAsset("catalog-knit-tech.png"),
  publicAsset("catalog-dark-accent.png"),
];

type ApiRecord = Record<string, unknown>;

export type SneakersPayload = {
  size?: string[];
  color?: string[];
  categories?: string[];
  price_from?: number;
  price_to?: number;
  limit?: number;
  offset?: number;
  [key: string]: unknown;
};

export type SneakersApiResult = {
  items: ProductItem[];
  source: "api" | "fallback";
};

export async function fetchSneakers(
  selections: Selections,
  payloadOverride?: SneakersPayload | null,
): Promise<SneakersApiResult> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadOverride || buildSneakersPayload(selections)),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Sneakers API responded with ${res.status}: ${text}`);
    }

    const data = text ? (JSON.parse(text) as unknown) : [];
    const records = extractRecords(data);
    return {
      items: records
        .map((record, index) => normalizeProduct(record, index, selections))
        .filter((item) => item.name),
      source: "api",
    };
  } catch (error) {
    console.warn("Sneakers API request failed, using temporary catalog.", error);
    return { items: [], source: "fallback" };
  }
}

function buildSneakersPayload(selections: Selections): SneakersPayload {
  const price = getPriceRange(selections.price);
  const colors = selections.colors
    .filter((id) => id !== "any")
    .map((id) => COLORS.find((color) => color.id === id)?.name)
    .filter(Boolean);

  return {
    size: selections.sizes.map((size) => size.replace("EU ", "").replace("+", "")),
    color: colors.length ? colors : undefined,
    categories: [DEFAULT_CATEGORY_ID],
    price_from: price.from,
    price_to: price.to,
    limit: 10,
    offset: 0,
  };
}

function getPriceRange(priceId?: string) {
  switch (priceId) {
    case "p2":
      return { from: 5000, to: 10000 };
    case "p3":
      return { from: 10000, to: 15000 };
    case "p4":
      return { from: 15000, to: 20000 };
    case "p5":
      return { from: 20000, to: 30000 };
    case "p6":
      return { from: 30000, to: 50000 };
    default:
      return { from: 0, to: 50000 };
  }
}

function extractRecords(data: unknown): ApiRecord[] {
  if (Array.isArray(data)) return data.filter(isRecord);
  if (!isRecord(data)) return [];

  const candidates = [
    data.items,
    data.data,
    data.products,
    data.sneakers,
    data.result,
    data.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate.filter(isRecord);
  }

  return [];
}

function normalizeProduct(record: ApiRecord, index: number, selections: Selections): ProductItem {
  const brand = stringFrom(record.brand, record.manufacturer, record.vendor, record.marka);
  const name = stringFrom(record.name, record.title, record.model, record.product_name);
  const img = stringFrom(
    record.img,
    record.image,
    record.photo,
    record.picture,
    record.thumbnail,
    record.image_url,
    firstString(record.images),
    firstString(record.photos),
  );
  const link = stringFrom(
    record.detail_url,
    record.url,
    record.link,
    record.href,
    record.product_url,
  );

  return {
    id: stringFrom(record.offer_id, record.id) || `${name}-${index}`,
    brand,
    name,
    price: formatPrice(record.price ?? record.cost ?? record.amount),
    why:
      stringFrom(record.why, record.description, record.short_description) ||
      getDefaultWhy(selections),
    img: img || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    fit:
      stringFrom(record.fit, record.match, record.score) ||
      `${Math.max(88, 96 - index * 2)}% подходит`,
    url: link,
  };
}

function formatPrice(value: unknown) {
  if (typeof value === "number") return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return "";
    if (normalized.includes("₽") || normalized.toLowerCase().includes("руб")) return normalized;
    const parsed = Number(normalized.replace(/\s/g, ""));
    if (Number.isFinite(parsed)) return `${new Intl.NumberFormat("ru-RU").format(parsed)} ₽`;
    return normalized;
  }
  return "";
}

function getDefaultWhy(selections: Selections) {
  const priceLabel =
    PRICES.find((price) => price.id === selections.price)?.label.toLowerCase() ||
    "выбранный бюджет";
  return `Попадает в выбранные фильтры и подходит под ${priceLabel}.`;
}

function stringFrom(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function firstString(value: unknown) {
  if (!Array.isArray(value)) return "";
  return stringFrom(...value);
}

function isRecord(value: unknown): value is ApiRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
