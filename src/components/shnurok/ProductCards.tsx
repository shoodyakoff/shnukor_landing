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
            {item.brand ? <div className="text-xs font-bold text-suede">{item.brand}</div> : null}
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
    <div className="grid h-full overflow-hidden rounded-[1.25rem] border-2 border-cement bg-lace transition-all hover:border-outsole hover:shadow-[5px_5px_0_var(--mesh)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-white p-2">
        <img src={item.img} alt={item.name} className="h-full w-full object-contain" />
        <div className="absolute left-3 top-3">
          <Pill color="active">{item.fit}</Pill>
        </div>
      </div>

      <div className="grid gap-2.5 p-3.5">
        <div className="grid gap-2">
          <div className="min-w-0">
            {item.brand ? <div className="text-xs font-bold text-suede">{item.brand}</div> : null}
            <div className="mt-1 line-clamp-2 text-xl font-black leading-[0.98] text-outsole">
              {item.name}
            </div>
          </div>
          <div className="text-lg font-black leading-none text-outsole">{item.price}</div>
        </div>

        <WhyBlock why={item.why} />

        <a
          href={item.url || "#"}
          target={item.url ? "_blank" : undefined}
          rel={item.url ? "noreferrer" : undefined}
          className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-outsole bg-outsole px-4 py-2.5 text-sm font-black text-lace shadow-[3px_3px_0_var(--mesh)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-suede hover:shadow-[1px_1px_0_var(--mesh)]"
        >
          Перейти в магазин
        </a>
      </div>
    </div>
  );
}

function WhyBlock({ why, compact = false }: { why: string; compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-outsole/10 bg-muted/70 p-3">
      <div className="text-[11px] font-bold text-suede">Почему подходит</div>
      <p
        className={`${compact ? "text-sm" : "text-sm"} mt-1.5 line-clamp-2 leading-snug text-outsole`}
      >
        {why}
      </p>
    </div>
  );
}
