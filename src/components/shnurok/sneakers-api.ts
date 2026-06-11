import { publicAsset } from "@/lib/assets";

import type { ProductItem } from "./data";
import { buildSneakersPayload, type SneakersPayload } from "./sneakers-mapping";
import { PRICES, type Selections } from "./types";

const API_URL = publicAsset("api/sneakers");
const SHNUROK_ORIGIN = "https://shnurok-shipping.ru";

const FALLBACK_IMAGES = [
  publicAsset("catalog-court-minimal.webp"),
  publicAsset("catalog-retro-runner.webp"),
  publicAsset("catalog-chunky-lifestyle.webp"),
  publicAsset("catalog-knit-tech.webp"),
  publicAsset("catalog-dark-accent.webp"),
];

type ApiRecord = Record<string, unknown>;

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
    const items = records
      .map((record, index) => normalizeProduct(record, index, selections))
      .filter((item) => item.name);

    return {
      items: dedupeProducts(items),
      source: "api",
    };
  } catch (error) {
    console.warn("Sneakers API request failed, using temporary catalog.", error);
    return { items: [], source: "fallback" };
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
    size: stringFrom(record.size),
    why:
      stringFrom(record.why, record.description, record.short_description) ||
      getDefaultWhy(selections),
    img: img || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    fit:
      stringFrom(record.fit, record.match, record.score) ||
      `${Math.max(88, 96 - index * 2)}% подходит`,
    url: normalizeProductUrl(link),
  };
}

function dedupeProducts(items: ProductItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = normalizeKey(item.url || item.name || item.id);
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeProductUrl(link: string) {
  if (!link) return "";

  try {
    return new URL(link, SHNUROK_ORIGIN).toString();
  } catch {
    return link;
  }
}

function normalizeKey(value?: string) {
  return value?.trim().toLowerCase().replace(/\/$/, "") ?? "";
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
