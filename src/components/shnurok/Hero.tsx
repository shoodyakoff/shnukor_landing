import { BigButton, Pill } from "./ui";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-dvh px-6 py-6 md:px-10">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[1600px] flex-col gap-8">
        <nav className="flex items-center justify-between gap-4">
          <div className="font-display text-3xl font-black uppercase tracking-tighter">
            Шнурок<span className="text-flame">.</span>
          </div>
        </nav>

        <main className="grid flex-1 grid-cols-1 items-center gap-10 xl:grid-cols-12">
          <div className="z-20 flex flex-col items-start xl:col-span-6">
            <Pill>сервис умного подбора</Pill>

            <h1 className="mt-8 font-display text-[4rem] font-black uppercase leading-[0.9] tracking-tighter text-balance xl:text-[5.5rem]">
              Подберём
              <br />
              кроссовки
              <br />
              под твой{" "}
              <span className="inline-block rounded-full border-[4px] border-ink bg-volt px-5 py-1 rotate-[1deg] shadow-[6px_6px_0_var(--ink)]">
                стиль
              </span>
              <br />
              размер и задачу.
            </h1>

            <p className="mt-5 max-w-[40rem] text-lg leading-relaxed opacity-80">
              Ответь на несколько вопросов, покажи, что нравится визуально, и получи подборку моделей,
              которые реально подходят.
            </p>

            <div className="mt-9">
              <BigButton onClick={onStart} variant="primary">
                Подобрать кроссовки →
              </BigButton>
            </div>
          </div>

          <div className="relative min-h-[540px] w-full max-w-[700px] justify-self-center xl:col-span-6">
            <div className="absolute inset-x-10 inset-y-12 rounded-[3rem] border-[5px] border-ink bg-cobalt shadow-[16px_16px_0_var(--ink)] rotate-[-5deg]" />
            <div className="absolute inset-x-0 top-1/2 h-[70%] -translate-y-1/2 rounded-[3rem] border-[5px] border-ink bg-cobalt shadow-[14px_14px_0_var(--ink)] rotate-[4deg]" />

            <div className="absolute left-[10%] top-1/2 z-10 w-[72%] -translate-y-1/2 overflow-hidden rounded-[2.5rem] border-[5px] border-ink shadow-[14px_14px_0_var(--ink)] rotate-[2deg]">
              <img
                src="/hero-sneaker.jpg"
                alt="Кроссовок крупным планом"
                className="aspect-square w-full object-cover"
              />
            </div>

            <div className="absolute right-8 top-16 z-20 rotate-6">
              <span className="inline-flex items-center rounded-full border-[5px] border-ink bg-cobalt px-6 py-3 font-display text-2xl font-black uppercase text-white shadow-[8px_8px_0_var(--ink)]">
                EU 42
              </span>
            </div>
            <div className="absolute -left-6 top-1/2 z-20 -translate-y-1/2 rotate-[-6deg]">
              <span className="inline-flex items-center rounded-full border-[5px] border-ink bg-volt px-6 py-3 font-display text-2xl font-black uppercase shadow-[8px_8px_0_var(--ink)]">
                на каждый день
              </span>
            </div>
            <div className="absolute bottom-16 right-8 z-20 rotate-[-3deg]">
              <span className="inline-flex items-center rounded-full border-[5px] border-ink bg-card px-6 py-3 font-display text-2xl font-black uppercase shadow-[8px_8px_0_var(--ink)]">
                до 15 000 ₽
              </span>
            </div>
            <div className="absolute bottom-2 left-6 z-20 rotate-[2deg]">
              <span className="inline-flex items-center gap-3 rounded-full border-[5px] border-ink bg-card px-6 py-3 font-display text-2xl font-black uppercase shadow-[8px_8px_0_var(--ink)]">
                <span className="size-6 rounded-full border-[3px] border-ink bg-white" />
                белый
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
