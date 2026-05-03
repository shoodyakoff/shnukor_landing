import { Pill } from "./ui";
import type { ProductItem } from "./data";

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
      className={`overflow-hidden rounded-[2rem] border-2 ${
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
      <div className={`grid gap-3 bg-lace ${compact ? "p-4" : "p-5"}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-suede">
              {item.brand}
            </div>
            <div
              className={`${compact ? "text-xl" : "text-2xl"} mt-1 font-bold leading-tight text-outsole`}
            >
              {item.name}
            </div>
          </div>
          <div className="text-lg font-bold text-outsole">{item.price}</div>
        </div>
        {!compact ? <WhyBlock why={item.why} compact /> : null}
      </div>
    </div>
  );
}

export function ResultCard({ item }: { item: ProductItem }) {
  return (
    <div className="grid h-full overflow-hidden rounded-[1.75rem] border-2 border-cement bg-lace transition-all hover:border-outsole hover:shadow-[6px_6px_0_var(--mesh)]">
      <div className="relative aspect-[16/9] max-h-[260px] overflow-hidden bg-muted">
        <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4">
          <Pill color="active">{item.fit}</Pill>
        </div>
      </div>

      <div className="grid gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-suede">
              {item.brand}
            </div>
            <div className="mt-1 text-[1.45rem] font-black leading-[1] text-outsole">
              {item.name}
            </div>
          </div>
          <div className="shrink-0 text-lg font-bold text-outsole">{item.price}</div>
        </div>

        <WhyBlock why={item.why} />

        <button className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-outsole bg-outsole px-5 py-3 text-base font-black text-lace shadow-[4px_4px_0_var(--mesh)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-suede hover:shadow-[2px_2px_0_var(--mesh)]">
          Перейти в магазин
        </button>
      </div>
    </div>
  );
}

function WhyBlock({ why, compact = false }: { why: string; compact?: boolean }) {
  return (
    <div className="rounded-[1.25rem] border border-outsole/10 bg-muted/70 p-3">
      <div className="text-[11px] font-bold text-suede">
        Почему подходит
      </div>
      <p className={`${compact ? "text-sm" : "text-sm"} mt-1.5 leading-snug text-outsole`}>
        {why}
      </p>
    </div>
  );
}
