import { useRef, useState, type CSSProperties } from "react";

import type { SneakersCard } from "./sneakers-mapping";
import type { StyleVote } from "./types";

export function StyleDeck({
  upcoming,
  cards,
  currentIndex,
  onLike,
  onDislike,
}: {
  upcoming: SneakersCard[];
  cards: SneakersCard[];
  currentIndex: number;
  onLike: () => void;
  onDislike: () => void;
}) {
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const dragX = useRef(0);
  const dragging = useRef(false);
  const swipedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const likeRef = useRef<HTMLDivElement | null>(null);
  const dislikeRef = useRef<HTMLDivElement | null>(null);

  const threshold = 110;

  // Drive the top card straight through the DOM during a drag so we never
  // re-render the (heavy) image stack on every pointermove.
  const paint = (x: number, animate: boolean) => {
    const el = cardRef.current;
    if (el) {
      el.style.transition = animate
        ? "transform 320ms cubic-bezier(.16,1,.3,1), opacity 320ms ease"
        : "none";
      el.style.transform = `translate3d(${x}px,0,0) rotate(${x / 22}deg)`;
      el.style.opacity = String(Math.max(0.55, 1 - Math.abs(x) / 620));
    }
    if (likeRef.current) likeRef.current.style.opacity = String(Math.min(Math.max(x / 96, 0), 1));
    if (dislikeRef.current)
      dislikeRef.current.style.opacity = String(Math.min(Math.max(-x / 96, 0), 1));
  };

  const completeSwipe = (vote: StyleVote) => {
    if (swipedRef.current) return;
    swipedRef.current = true;
    dragging.current = false;
    setSwiping(true);
    const sign = vote === "like" ? 1 : -1;
    const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
    paint(sign * Math.max(viewportWidth, 900), true);
    window.setTimeout(() => {
      if (vote === "like") onLike();
      else onDislike();
    }, 320);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipedRef.current) return;
    dragging.current = true;
    startX.current = event.clientX;
    dragX.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    paint(0, false);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || swipedRef.current) return;
    dragX.current = event.clientX - startX.current;
    paint(dragX.current, false);
  };

  const handlePointerUp = () => {
    if (!dragging.current || swipedRef.current) return;
    dragging.current = false;
    const x = dragX.current;
    if (x > threshold) return completeSwipe("like");
    if (x < -threshold) return completeSwipe("dislike");
    dragX.current = 0;
    paint(0, true);
  };

  return (
    <div className="mx-auto grid w-full max-w-[1400px] items-center gap-4 pb-20 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,500px)_minmax(0,1fr)] lg:gap-12 lg:pb-0 xl:gap-16">
      <div className="fixed inset-x-3 bottom-3 z-40 order-2 grid grid-cols-2 gap-3 sm:inset-x-4 md:inset-x-6 lg:static lg:contents">
        <div className="flex min-w-0 justify-stretch lg:order-1 lg:justify-end">
          <SwipeButton tone="quiet" disabled={swiping} onClick={() => completeSwipe("dislike")}>
            Не нравится
          </SwipeButton>
        </div>
        <div className="flex min-w-0 justify-stretch lg:order-3 lg:justify-start">
          <SwipeButton tone="like" disabled={swiping} onClick={() => completeSwipe("like")}>
            Нравится
          </SwipeButton>
        </div>
      </div>

      <div className="order-1 mx-auto flex w-full max-w-[min(440px,94vw)] flex-col sm:max-w-[440px] lg:order-2 lg:max-w-[min(480px,34vw)]">
        <div className="relative h-[clamp(260px,48svh,430px)] md:h-[clamp(320px,44svh,460px)] xl:h-[clamp(360px,50dvh,500px)]">
          {upcoming
            .slice(0, 3)
            .map((style, index) => ({ style, index }))
            .reverse()
            .map(({ style, index }) => {
              const isTop = index === 0;
              const staticStyle: CSSProperties = {
                transform: `translate3d(0, ${index * 12}px, 0) scale(${1 - index * 0.04})`,
                opacity: 1 - index * 0.25,
                zIndex: 10 - index,
              };
              const topStyle: CSSProperties = {
                transform: "translate3d(0,0,0)",
                opacity: 1,
                zIndex: 20,
              };

              return (
                <div
                  key={style.id}
                  ref={isTop ? cardRef : undefined}
                  className="absolute inset-0 touch-pan-y select-none overflow-hidden rounded-panel border-2 border-outsole bg-lace shadow-[6px_8px_0_rgba(10,10,10,0.16)] will-change-transform"
                  style={isTop ? topStyle : staticStyle}
                  onPointerDown={isTop ? handlePointerDown : undefined}
                  onPointerMove={isTop ? handlePointerMove : undefined}
                  onPointerUp={isTop ? handlePointerUp : undefined}
                  onPointerCancel={isTop ? handlePointerUp : undefined}
                >
                  <img
                    src={style.image}
                    alt={style.title}
                    draggable={false}
                    className="pointer-events-none h-full w-full object-cover"
                  />
                  {isTop ? (
                    <>
                      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
                        <div className="max-w-[80%] rounded-tile border-2 border-outsole bg-mesh px-3.5 py-2 shadow-pop-sm">
                          <div className="text-base font-black leading-tight text-outsole sm:text-lg">
                            {style.title}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-outsole/70">
                            {style.desc}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border-2 border-outsole bg-outsole px-2.5 py-1 text-xs font-black text-lace">
                          {currentIndex + 1} / {cards.length}
                        </span>
                      </div>
                      <div
                        ref={likeRef}
                        style={{ opacity: 0 }}
                        className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 -rotate-[14deg] rounded-2xl border-[3px] border-outsole bg-mesh px-5 py-2.5 text-xl font-black text-outsole shadow-pop-md"
                      >
                        Нравится
                      </div>
                      <div
                        ref={dislikeRef}
                        style={{ opacity: 0 }}
                        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 rotate-[14deg] rounded-2xl border-[3px] border-outsole bg-lace px-5 py-2.5 text-xl font-black text-outsole shadow-pop-md"
                      >
                        Не нравится
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
        </div>

        <div className="mt-4 flex justify-center gap-2 lg:mt-6">
          {cards.map((style, index) => (
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
      ? "border-outsole bg-mesh text-outsole shadow-pop-lg hover:bg-[#c7e9ff] hover:shadow-pop-sm"
      : "border-outsole bg-lace text-outsole shadow-pop-lg hover:bg-muted hover:shadow-pop-sm";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-12 w-full min-w-0 items-center justify-center rounded-full border-2 px-3 text-sm font-black transition-all hover:translate-x-[3px] hover:translate-y-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mesh disabled:pointer-events-none disabled:opacity-50 sm:min-h-14 sm:w-auto sm:min-w-[176px] sm:px-7 sm:text-base md:min-w-[196px] md:text-lg ${classes}`}
    >
      {children}
    </button>
  );
}
