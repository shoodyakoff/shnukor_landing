import { ContactLinks } from "./Contacts";
import { BigButton, Pill } from "./ui";
import { publicAsset } from "@/lib/assets";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-lace px-3 py-3 sm:px-4 sm:py-4 md:px-8 md:py-6">
      <div className="mx-auto grid min-h-[calc(100svh-1.5rem)] w-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)] gap-6 sm:min-h-[calc(100svh-2rem)] md:min-h-[calc(100dvh-3rem)] md:gap-10">
        <nav className="flex items-center justify-between gap-4">
          <img
            src={publicAsset("brand/shnurok8-logo.png")}
            alt="SHNUROK"
            className="h-9 w-auto object-contain sm:h-10 md:h-12"
          />
          <ContactLinks />
        </nav>

        <main className="grid min-w-0 items-start gap-6 md:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex min-w-0 max-w-3xl flex-col items-start">
            <Pill>умный подбор кроссовок</Pill>
            <h1 className="mt-5 max-w-full break-words font-display text-[2.05rem] font-bold leading-[1.02] text-outsole sm:mt-6 sm:text-5xl sm:leading-[0.98] md:text-6xl xl:text-7xl">
              <span className="block sm:inline">Соберем подборку</span>{" "}
              <span className="block sm:inline">под твой стиль,</span>{" "}
              <span className="block sm:inline">задачу и ритм</span>
            </h1>

            <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-suede sm:max-w-2xl sm:text-lg">
              Пара коротких шагов, визуальный свайп по силуэтам и готовая выдача с моделями, которые
              действительно попадают в запрос.
            </p>

            <div className="mt-8">
              <BigButton onClick={onStart} variant="primary">
                Подобрать кроссовки
              </BigButton>
            </div>
          </div>

          <HeroProductScene />
        </main>
      </div>
    </div>
  );
}

function HeroProductScene() {
  return (
    <div
      data-scene="static-podium"
      className="relative aspect-[16/9] w-full min-w-0 overflow-hidden rounded-[1.25rem] border border-cement bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_52%,#dff3ff_100%)] shadow-[0_18px_55px_rgba(10,10,10,0.10)] md:rounded-[1.5rem] xl:shadow-[0_24px_80px_rgba(10,10,10,0.10)]"
    >
      <img
        src={publicAsset("hero-flat-hand-close.png")}
        alt="Кроссовок на подиуме с рукой"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center"
      />
    </div>
  );
}
