import { BigButton } from "./ui";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-[1600px] w-full mx-auto">
        <div className="font-display text-2xl md:text-4xl font-black uppercase tracking-tighter">
          Шнурок<span className="text-flame">.</span>
        </div>
        <div className="brutal-pill bg-card text-ink text-xs md:text-sm">
          <span className="size-2 bg-volt border border-ink rounded-full mr-2 animate-pulse" />
          алгоритм v2.0
        </div>
      </nav>

      {/* Hero grid */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pb-16 pt-4">
        <div className="lg:col-span-6 flex flex-col items-start z-20">
          <div className="brutal-pill bg-card text-ink text-xs md:text-sm mb-8 -rotate-2 animate-wiggle">
            <span className="font-mono">Сервис умного подбора</span>
          </div>

          <h1 className="font-display font-black uppercase text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.92] tracking-tighter text-balance">
            Подберём
            <br />
            кроссовки
            <br />
            под твой{" "}
            <span className="inline-block bg-volt px-5 py-1 rounded-full border-[5px] border-ink shadow-[6px_6px_0_var(--ink)] rotate-2 my-2">
              стиль
            </span>
            ,<br />
            размер и задачу.
          </h1>

          <p className="mt-8 text-base md:text-lg max-w-[48ch] opacity-80 leading-relaxed">
            Ответь на несколько вопросов, покажи, что нравится визуально, и получи
            подборку моделей, которые реально подходят.
          </p>

          <div className="mt-10">
            <BigButton onClick={onStart} variant="primary">
              Подобрать кроссовки →
            </BigButton>
          </div>
        </div>

        {/* Visual */}
        <div className="lg:col-span-6 relative min-h-[520px] flex items-center justify-center">
          {/* Color blob */}
          <div className="absolute inset-8 bg-cobalt rounded-[3rem] border-[5px] border-ink shadow-[16px_16px_0_var(--ink)] rotate-[-3deg]" />

          {/* Sneaker */}
          <div className="relative z-10 w-full max-w-[520px] aspect-square animate-pop-in">
            <img
              src="/hero-sneaker.jpg"
              alt="Кроссовок крупным планом"
              width={1280}
              height={1280}
              className="w-full h-full object-cover rounded-[2.5rem] border-[5px] border-ink shadow-[12px_12px_0_var(--ink)] rotate-2"
            />
          </div>

          {/* Floating chips */}
          <div className="absolute top-2 right-2 lg:-right-4 z-20 brutal-pill bg-cobalt text-white rotate-6 animate-pop-in" style={{ animationDelay: "100ms" }}>
            <span className="font-display font-black text-lg md:text-2xl">EU 42</span>
          </div>
          <div className="absolute bottom-16 -right-2 lg:-right-10 z-20 brutal-pill bg-card text-ink -rotate-3 animate-pop-in" style={{ animationDelay: "200ms" }}>
            <span className="font-display font-black text-base md:text-xl">до 15 000 ₽</span>
          </div>
          <div className="absolute top-1/2 -left-2 lg:-left-12 z-20 brutal-pill bg-volt text-ink -rotate-6 animate-pop-in" style={{ animationDelay: "300ms" }}>
            <span className="font-display font-black text-base md:text-xl">на каждый день</span>
          </div>
          <div className="absolute -bottom-2 left-8 z-30 brutal-pill bg-card text-ink rotate-2 animate-pop-in flex items-center gap-3" style={{ animationDelay: "400ms" }}>
            <span className="size-5 bg-white border-2 border-ink rounded-full" />
            <span className="font-display font-black text-base md:text-xl">белый</span>
          </div>
        </div>
      </main>

      {/* Bottom marquee */}
      <div className="border-t-[4px] border-ink bg-card overflow-hidden py-3">
        <div className="flex gap-12 whitespace-nowrap font-mono text-xs md:text-sm font-bold uppercase tracking-widest opacity-80">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex gap-12">
              <span>/// 14 204 пар в базе</span>
              <span>/// 48 брендов</span>
              <span>/// матчинг 0.4с</span>
              <span>/// без каталога — только подбор</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
