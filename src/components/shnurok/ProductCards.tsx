import { useState } from "react";

import { publicAsset } from "@/lib/assets";
import { cn } from "@/lib/utils";

import { Pill } from "./ui";
import type { ProductItem } from "./data";

const RESULT_PLACEHOLDER_SRC = publicAsset("result-placeholder.png");

export function ProductShowcase({
  item,
  accent = false,
  label,
  compact = false,
}: {
  item: ProductItem;
  accent?: boolean;
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.5rem] border-2 sm:rounded-[2rem] ${
        accent
          ? "border-outsole bg-mesh shadow-[8px_8px_0_var(--outsole)]"
          : "border-cement bg-lace"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-muted ${compact ? "aspect-[16/8.4]" : "aspect-[16/11]"}`}
      >
        <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
        {label ? (
          <div className="absolute left-4 top-4">
            <Pill color="white">{label}</Pill>
          </div>
        ) : null}
      </div>
      <div className={`grid gap-3 bg-lace ${compact ? "p-4" : "p-4 sm:p-5"}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {item.brand ? <div className="text-xs font-bold text-suede">{item.brand}</div> : null}
            <div
              className={`${compact ? "text-xl" : "text-xl sm:text-2xl"} mt-1 font-bold leading-tight text-outsole`}
            >
              {item.name}
            </div>
          </div>
          <div className="text-lg font-bold text-outsole">{item.price}</div>
        </div>
      </div>
    </div>
  );
}

export function ResultImageFrame({
  src,
  alt = "",
  loading = "lazy",
  placeholder = false,
  className,
}: {
  src?: string;
  alt?: string;
  loading?: "eager" | "lazy";
  placeholder?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const showImage = Boolean(src && !placeholder);

  return (
    <div
      data-slot={placeholder ? "result-preview-placeholder" : "result-image-frame"}
      className={cn("relative aspect-[4/3] overflow-hidden bg-white", className)}
    >
      {/* Branded backdrop — the same pattern baked into the generated shots.
          Shown only while the real photo is loading (or as a pure placeholder);
          removed once the photo is in, so loaded photos never sit on a bg. */}
      {(!showImage || !loaded) && (
        <img
          src={RESULT_PLACEHOLDER_SRC}
          alt=""
          aria-hidden="true"
          data-slot="result-placeholder-bg"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {showImage ? (
        <img
          data-slot="result-product-image"
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          className={cn(
            "relative z-10 h-full w-full object-contain object-center p-2 transition-opacity duration-300 sm:p-3",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : (
        <span className="sr-only">Загрузка изображения товара</span>
      )}
    </div>
  );
}

export function ResultCard({ item }: { item: ProductItem }) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-[1rem] border-2 border-cement bg-lace transition-all hover:border-outsole hover:shadow-[5px_5px_0_var(--mesh)] sm:rounded-[1.15rem]">
      <ResultImageFrame src={item.img} alt={item.name} loading="lazy" />

      <div className="grid content-between gap-2.5 p-3 sm:p-4">
        <div className="min-w-0">
          {item.brand ? <div className="text-xs font-bold text-suede">{item.brand}</div> : null}
          <div className="mt-1 line-clamp-2 text-base font-black leading-[1.08] text-outsole sm:text-lg sm:leading-[1.04]">
            {item.name}
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-lg font-black leading-none text-outsole sm:text-xl">
            {item.price}
          </div>
          {item.size ? (
            <span className="shrink-0 text-xs font-bold text-suede">EU {item.size}</span>
          ) : null}
        </div>

        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-outsole bg-outsole px-4 py-2.5 text-sm font-black text-lace shadow-[3px_3px_0_var(--mesh)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-suede hover:shadow-[1px_1px_0_var(--mesh)]"
          >
            В магазин
          </a>
        ) : (
          <span className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cement bg-muted px-4 py-2.5 text-sm font-black text-suede">
            Ссылка скоро появится
          </span>
        )}
      </div>
    </div>
  );
}
