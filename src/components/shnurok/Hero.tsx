import { BigButton, Pill } from "./ui";
import { publicAsset } from "@/lib/assets";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-dvh px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] w-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)] gap-8 md:min-h-[calc(100dvh-3rem)] md:gap-10">
        <nav className="flex items-center justify-between gap-4">
          <img
            src={publicAsset("brand/logo-shnurok.svg")}
            alt="SHNUROK"
            className="h-8 w-auto md:h-10"
          />
        </nav>

        <main className="grid items-center gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="flex max-w-3xl flex-col items-start">
            <Pill>умный подбор кроссовок</Pill>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[0.96] text-outsole text-balance md:text-6xl xl:text-7xl">
              Соберем подборку под твой стиль, задачу и ритм
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-suede">
              Пара коротких шагов, визуальный свайп по силуэтам и готовая выдача с моделями, которые
              действительно попадают в запрос.
            </p>

            <div className="mt-8">
              <BigButton onClick={onStart} variant="primary">
                Подобрать кроссовки
              </BigButton>
            </div>
          </div>

          <div className="relative min-h-[360px] w-full md:min-h-[560px]">
            <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,#f6fbff_0%,#b0ddff_35%,#0a32ff_100%)]" />
            <div className="absolute inset-x-[12%] top-[10%] h-[28%] rounded-[2rem] border border-white/60 bg-white/20 backdrop-blur-sm" />
            <div className="absolute inset-x-[6%] bottom-[8%] h-[22%] rounded-[2rem] border border-outsole/10 bg-white/30 backdrop-blur-sm" />
            <div className="absolute inset-x-[10%] top-[12%] bottom-[12%] overflow-hidden rounded-[2rem] border border-outsole bg-lace shadow-[0_25px_80px_rgba(10,10,10,0.14)]">
              <img
                src={publicAsset("hero-sneaker.jpg")}
                alt="Кроссовок крупным планом"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
