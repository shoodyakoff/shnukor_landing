import { useRef, useState, type CSSProperties } from "react";

import { Pill } from "./ui";
import { STYLES, type StyleVote } from "./types";

export function StyleDeck({
  upcoming,
  currentIndex,
  total,
  onLike,
  onDislike,
}: {
  upcoming: typeof STYLES;
  currentIndex: number;
  total: number;
  onLike: () => void;
  onDislike: () => void;
}) {
  const [dragX, setDragX] = useState(0);
  const [pointerDown, setPointerDown] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<StyleVote | null>(null);
  const startX = useRef(0);

  const threshold = 110;
  const topOpacity = Math.max(0.55, 1 - Math.abs(dragX) / 620);

  const completeSwipe = (vote: StyleVote) => {
    if (swipeDirection) return;
    const sign = vote === "like" ? 1 : -1;
    const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
    setPointerDown(false);
    setSwipeDirection(vote);
    setDragX(sign * Math.max(viewportWidth, 900));

    window.setTimeout(() => {
      if (vote === "like") onLike();
      else onDislike();
    }, 320);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipeDirection) return;
    startX.current = event.clientX;
    setPointerDown(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDown || swipeDirection) return;
    setDragX(event.clientX - startX.current);
  };

  const handlePointerUp = () => {
    if (!pointerDown || swipeDirection) return;
    setPointerDown(false);
    if (dragX > threshold) return completeSwipe("like");
    if (dragX < -threshold) return completeSwipe("dislike");
    setDragX(0);
  };

  return (
    <div className="mx-auto grid h-full w-full max-w-[1400px] items-center gap-6 lg:grid-cols-[220px_minmax(360px,500px)_220px] lg:gap-12 xl:gap-16">
      <div className="order-2 flex justify-center lg:order-1 lg:justify-end">
        <SwipeButton tone="quiet" disabled={Boolean(swipeDirection)} onClick={() => completeSwipe("dislike")}>
          Не нравится
        </SwipeButton>
      </div>

      <div className="order-1 mx-auto w-full max-w-[min(430px,92vw)] lg:order-2 lg:max-w-[min(500px,36vw)]">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-x-7 -inset-y-6 rounded-[2.5rem] border-2 border-outsole/10 bg-[linear-gradient(135deg,#e9f6ff_0%,#b0ddff_42%,#ffffff_100%)] shadow-[14px_18px_0_rgba(10,10,10,0.05)]" />
          <div className="pointer-events-none absolute -bottom-4 left-9 right-9 h-8 rounded-full bg-outsole/12 blur-xl" />

        <div className="relative h-[min(50dvh,490px)] min-h-[330px]">
          {upcoming
            .slice(0, 3)
            .map((style, index) => ({ style, index }))
            .reverse()
            .map(({ style, index }) => {
              const isTop = index === 0;
              const staticStyle: CSSProperties = {
                transform: `translate3d(0, ${index * 10}px, 0) scale(${1 - index * 0.035})`,
                opacity: 1 - index * 0.22,
                zIndex: 10 - index,
              };
              const topStyle: CSSProperties = {
                transform: `translate3d(${dragX}px, 0, 0) rotate(${dragX / 22}deg)`,
                opacity: topOpacity,
                transition: pointerDown
                  ? "none"
                  : "transform 320ms cubic-bezier(.16,1,.3,1), opacity 320ms ease",
                zIndex: 20,
              };

              return (
                <div
                  key={style.id}
                  className="absolute inset-0 touch-pan-y overflow-hidden rounded-[1.75rem] border-2 border-outsole bg-lace shadow-[0_18px_50px_rgba(10,10,10,0.18)] will-change-transform"
                  style={isTop ? topStyle : staticStyle}
                  onPointerDown={isTop ? handlePointerDown : undefined}
                  onPointerMove={isTop ? handlePointerMove : undefined}
                  onPointerUp={isTop ? handlePointerUp : undefined}
                  onPointerCancel={isTop ? handlePointerUp : undefined}
                >
                  <img src={style.image} alt={style.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.06)_0%,rgba(10,10,10,0.12)_38%,rgba(10,10,10,0.58)_100%)]" />
                  {isTop ? <SwipeLabels dragX={dragX} /> : null}
                  <div className="absolute inset-x-4 bottom-4 rounded-[1.3rem] border-2 border-outsole bg-white/90 p-4 shadow-[5px_5px_0_var(--outsole)] backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3">
                      <Pill color="active">
                        стиль {currentIndex + index + 1} из {total}
                      </Pill>
                      <Pill color="white">#{style.title.toLowerCase()}</Pill>
                    </div>
                    <div className="mt-3 text-2xl font-black leading-none text-outsole md:text-3xl">
                      {style.title}
                    </div>
                    <p className="mt-2 max-w-md text-sm leading-snug text-outsole/78">
                      {style.desc}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
        </div>
      </div>

      <div className="order-3 flex justify-center lg:justify-start">
        <SwipeButton tone="like" disabled={Boolean(swipeDirection)} onClick={() => completeSwipe("like")}>
          Нравится
        </SwipeButton>
      </div>

      <div className="order-4 flex flex-col items-center gap-2 lg:col-start-2">
        <div className="flex gap-2">
          {STYLES.map((style, index) => (
            <div
              key={style.id}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-10 bg-outsole"
                  : index < currentIndex
                    ? "w-6 bg-mesh"
                    : "w-6 bg-cement"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SwipeButton({
  children,
  onClick,
  tone,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone: "quiet" | "like";
  disabled?: boolean;
}) {
  const classes =
    tone === "like"
      ? "border-outsole bg-mesh text-outsole shadow-[6px_6px_0_var(--outsole)] hover:bg-[#c7e9ff] hover:shadow-[3px_3px_0_var(--outsole)]"
      : "border-outsole bg-lace text-outsole shadow-[6px_6px_0_var(--outsole)] hover:bg-muted hover:shadow-[3px_3px_0_var(--outsole)]";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-14 min-w-[176px] items-center justify-center rounded-full border-2 px-7 text-base font-black transition-all hover:translate-x-[3px] hover:translate-y-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh disabled:pointer-events-none disabled:opacity-50 md:min-w-[196px] md:text-lg ${classes}`}
    >
      {children}
    </button>
  );
}

function SwipeLabels({ dragX }: { dragX: number }) {
  return (
    <>
      <div
        className="absolute left-5 top-5 rounded-full border-2 border-outsole bg-mesh px-4 py-2 text-sm font-black text-outsole shadow-[3px_3px_0_var(--outsole)] transition-opacity"
        style={{ opacity: Math.min(Math.max(dragX / 96, 0), 1) }}
      >
        Нравится
      </div>
      <div
        className="absolute right-5 top-5 rounded-full border-2 border-outsole bg-lace px-4 py-2 text-sm font-black text-outsole shadow-[3px_3px_0_var(--outsole)] transition-opacity"
        style={{ opacity: Math.min(Math.max(-dragX / 96, 0), 1) }}
      >
        Не нравится
      </div>
    </>
  );
}
