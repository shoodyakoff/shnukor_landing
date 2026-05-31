import { useState } from "react";

import { BigButton, Pill } from "./ui";
import { publicAsset } from "@/lib/assets";
import type { SneakersPayload } from "./sneakers-mapping";

const TEST_PAYLOAD = {
  size: ["36"],
  color: ["черный"],
  categories: [493],
  price_from: 0,
  price_to: 50000,
  limit: 20,
  offset: 0,
};

const TEST_PAYLOAD_TEXT = JSON.stringify(TEST_PAYLOAD, null, 2);

export function Hero({
  onStart,
  onJsonSearch,
}: {
  onStart: () => void;
  onJsonSearch: (payload: SneakersPayload) => void;
}) {
  return (
    <div className="min-h-dvh px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] w-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)] gap-8 md:min-h-[calc(100dvh-3rem)] md:gap-10">
        <nav className="flex items-center justify-between gap-4">
          <img
            src={publicAsset("brand/shnurok8-logo.png")}
            alt="SHNUROK"
            className="h-10 w-auto object-contain md:h-12"
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

            <ApiTestStub onSubmit={onJsonSearch} />
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

function ApiTestStub({ onSubmit }: { onSubmit: (payload: SneakersPayload) => void }) {
  const [draft, setDraft] = useState(TEST_PAYLOAD_TEXT);
  const [error, setError] = useState("");

  const submit = () => {
    setError("");

    try {
      const payload = JSON.parse(draft) as SneakersPayload;
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        setError("JSON должен быть объектом payload.");
        return;
      }

      onSubmit(payload);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Не удалось разобрать JSON.");
    }
  };

  return (
    <div className="mt-6 w-full max-w-xl rounded-2xl border border-cement bg-lace p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase text-suede">тест backend</div>
          <div className="mt-1 text-base font-black leading-tight text-outsole">
            Ручной JSON-запрос через экран подбора
          </div>
        </div>
        <button
          onClick={submit}
          className="rounded-full border-2 border-outsole bg-outsole px-4 py-2 text-sm font-black text-lace transition-colors hover:bg-suede disabled:cursor-wait disabled:opacity-60"
        >
          Подобрать
        </button>
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        spellCheck={false}
        className="mt-3 h-48 w-full resize-y rounded-xl border border-cement bg-muted p-3 font-mono text-xs leading-relaxed text-outsole outline-none focus:border-outsole"
      />

      {error ? (
        <div className="mt-3 rounded-xl border border-outsole/20 bg-muted p-3 text-sm font-bold text-outsole">
          {error}
        </div>
      ) : null}
    </div>
  );
}
