import { useEffect, useState, type ComponentType } from "react";
import bootsAnimation from "../../../public/boots.json";

import { ContactLinks } from "./Contacts";
import { BigButton, Pill } from "./ui";
import { publicAsset } from "@/lib/assets";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-lace px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col gap-4 md:gap-10">
        <nav className="flex shrink-0 items-center justify-between gap-4">
          <img
            src={publicAsset("brand/shnurok8-logo.webp")}
            alt="SHNUROK"
            className="h-9 w-auto object-contain sm:h-10 md:h-12"
          />
          <ContactLinks />
        </nav>

        <main className="flex min-h-0 flex-1 flex-col justify-center gap-8 sm:gap-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-8">
          <div className="flex min-w-0 max-w-3xl flex-col items-start">
            <Pill>умный подбор кроссовок</Pill>
            <h1 className="mt-3 max-w-full break-words font-display text-[1.8rem] font-bold leading-[1.05] text-outsole sm:mt-6 sm:text-5xl sm:leading-[0.98] md:text-6xl xl:text-7xl">
              <span className="block sm:inline">Подберем кроссовки</span>{" "}
              <span className="block sm:inline">под твой стиль,</span>{" "}
              <span className="block sm:inline">задачу и ритм</span>
            </h1>

            <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-suede sm:mt-5 sm:max-w-2xl sm:text-lg">
              Расскажите нам о своих предпочтениях, а мы найдем кроссовки, которые действительно
              попадают в сердечко.
            </p>

            <div className="mt-4 md:mt-8">
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
  type LottieRenderer = ComponentType<{
    animationData: object;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    rendererSettings?: { preserveAspectRatio: string };
  }>;

  const [LottieRenderer, setLottieRenderer] = useState<LottieRenderer | null>(null);
  const selected = ["Размер 42", "До 20 000 ₽", "Белые", "На каждый день"];
  const styles = ["Массивные", "Трендовые", "Ретро: низкие силуэты", "Ретро: беговая эстетика"];
  const recommendations = [
    {
      name: "NB 740",
      image: "result-new-balance-740.png",
    },
    {
      name: "Nike Zoom Vomero 5",
      image: "result-nike-vomero-5.png",
    },
    {
      name: "Asics Gel-1130",
      image: "result-asics-gel-1130.png",
    },
  ];

  useEffect(() => {
    let active = true;

    import("lottie-react").then((module) => {
      if (active) {
        setLottieRenderer(() => module.default as LottieRenderer);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="relative flex h-[188px] w-full min-w-0 shrink-0 flex-col items-center justify-center overflow-hidden rounded-[1.25rem] border border-cement bg-[radial-gradient(circle_at_18%_18%,#ffffff_0%,#f5fbff_35%,#e6f7ff_68%,#f7efe8_100%)] px-3 py-3 shadow-[0_18px_55px_rgba(10,10,10,0.10)] sm:h-[248px] md:hidden">
        <h2 className="font-display text-lg font-bold leading-none text-outsole sm:text-xl">
          Идеально для тебя
        </h2>

        <div className="mt-3 grid w-full grid-cols-3 gap-2">
          {recommendations.map((item) => (
            <div
              key={item.name}
              className="min-w-0 rounded-[0.85rem] border border-white/80 bg-white p-1.5 shadow-[0_14px_32px_rgba(10,10,10,0.11)]"
            >
              <div className="aspect-[1.3/1] w-full overflow-hidden rounded-[0.7rem] bg-lace">
                <img src={publicAsset(item.image)} alt="" className="h-full w-full object-cover" />
              </div>
              <p className="mt-1 min-h-[2.2em] px-0.5 text-center text-[0.55rem] font-bold leading-tight text-outsole">
                {item.name}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-1.5 max-w-[18rem] text-center text-xs font-semibold leading-snug text-suede">
          Подобрали несколько идеальных пар из тысяч товаров
        </p>
      </div>

      <div
        data-scene="hero-loop"
        className="relative hidden aspect-[16/9] w-full min-w-0 overflow-hidden rounded-[1.5rem] border border-cement bg-[radial-gradient(circle_at_18%_18%,#ffffff_0%,#f5fbff_28%,#e6f7ff_58%,#f7efe8_100%)] shadow-[0_18px_55px_rgba(10,10,10,0.10)] md:block xl:shadow-[0_24px_80px_rgba(10,10,10,0.10)]"
      >
        <style>{`
        @keyframes heroIntroCopy {
          0%, 68% { opacity: 1; transform: translateY(0); }
          72%, 100% { opacity: 0; transform: translateY(-6px); }
        }
        @keyframes heroSelected {
          0%, 68% { opacity: 1; transform: translateY(0) scale(1); }
          72%, 100% { opacity: 0; transform: translateY(-8px) scale(.99); }
        }
        @keyframes heroSceneHeader {
          0%, 68% { opacity: 1; }
          72%, 100% { opacity: 0; }
        }
        @keyframes heroCardStack {
          0%, 54% { opacity: 1; }
          58%, 100% { opacity: 0; }
        }
        @keyframes heroCardReject {
          0%, 14% { opacity: 1; transform: translate(0, 0) rotate(-2deg) scale(1); }
          26% { opacity: 1; transform: translate(-118px, 10px) rotate(-14deg) scale(.97); }
          28%, 100% { opacity: 0; transform: translate(-138px, 12px) rotate(-16deg) scale(.94); }
        }
        @keyframes heroCardApprove {
          0%, 28% { opacity: .82; transform: translate(0, 16px) rotate(1deg) scale(.96); }
          32%, 42% { opacity: 1; transform: translate(0, 16px) rotate(1deg) scale(1); }
          54% { opacity: 1; transform: translate(116px, 6px) rotate(13deg) scale(.98); }
          58%, 100% { opacity: 0; transform: translate(140px, 4px) rotate(15deg) scale(.94); }
        }
        @keyframes heroCardHoldOne {
          0%, 50% { opacity: .42; transform: translate(0, 32px) rotate(-3deg) scale(.92); }
          54% { opacity: .18; transform: translate(4px, 34px) rotate(-3deg) scale(.86); }
          58%, 100% { opacity: 0; transform: translate(8px, 36px) rotate(-4deg) scale(.84); }
        }
        @keyframes heroCardHoldTwo {
          0%, 50% { opacity: .28; transform: translate(0, 48px) rotate(3deg) scale(.88); }
          54% { opacity: .1; transform: translate(6px, 50px) rotate(3deg) scale(.82); }
          58%, 100% { opacity: 0; transform: translate(10px, 52px) rotate(2deg) scale(.8); }
        }
        @keyframes heroReject {
          0%, 14% { opacity: 0; transform: translate(24px, -6px) scale(.8); }
          17%, 26% { opacity: 1; transform: translate(-8px, 0) scale(1); }
          28%, 100% { opacity: 0; transform: translate(-24px, 4px) scale(.88); }
        }
        @keyframes heroApprove {
          0%, 42% { opacity: 0; transform: translate(-18px, -6px) scale(.8); }
          45%, 54% { opacity: 1; transform: translate(8px, 0) scale(1); }
          56%, 100% { opacity: 0; transform: translate(22px, 4px) scale(.9); }
        }
        @keyframes heroAssembling {
          0%, 58% { opacity: 0; transform: translateY(10px) scale(.96); }
          61%, 68% { opacity: 1; transform: translateY(0) scale(1); }
          72%, 100% { opacity: 0; transform: translateY(-6px) scale(.98); }
        }
        @keyframes heroPulse {
          0%, 58% { opacity: 0; transform: scale(.82); }
          61% { opacity: .55; transform: scale(.86); }
          66% { opacity: .18; transform: scale(1.32); }
          68% { opacity: .4; transform: scale(.94); }
          72%, 100% { opacity: 0; transform: scale(1.18); }
        }
        @keyframes heroCounterRoll {
          0%, 28% { transform: translateY(0); }
          29.7% { transform: translateY(-14.285%); }
          31.4% { transform: translateY(-28.57%); }
          33.2%, 56% { transform: translateY(-42.855%); }
          57.7% { transform: translateY(-57.14%); }
          59.4% { transform: translateY(-71.425%); }
          61.2%, 100% { transform: translateY(-85.71%); }
        }
        @keyframes heroCounterPanel {
          0%, 68% { opacity: 1; transform: translateY(0) scale(1); }
          72%, 100% { opacity: 0; transform: translateY(12px) scale(.96); }
        }
        @keyframes heroCounterLabelStart {
          0%, 28% { opacity: 1; }
          28.01%, 100% { opacity: 0; }
        }
        @keyframes heroCounterLabelFilter {
          0%, 28% { opacity: 0; }
          28.01%, 68% { opacity: 1; }
          72%, 100% { opacity: 0; }
        }
        @keyframes heroFinal {
          0%, 70% { opacity: 0; transform: translate(-50%, calc(-50% + 18px)) scale(.97); }
          74%, 96% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, calc(-50% - 10px)) scale(.99); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-scene="hero-loop"] [data-hero-animated] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

        <div
          data-hero-animated
          className="absolute inset-x-6 top-5 flex items-center text-[0.62rem] font-bold uppercase tracking-[0.16em] text-suede/60 sm:inset-x-8 sm:top-7 sm:text-xs"
          style={{ animation: "heroSceneHeader 10s ease-in-out infinite" }}
        >
          <span>SHNUROK AI</span>
        </div>

        <div
          data-hero-animated
          className="absolute left-[5%] top-[14%] grid w-[90%] grid-cols-2 gap-2 md:left-7 md:top-[19%] md:w-[42%] md:grid-cols-1 md:gap-3"
          style={{ animation: "heroSelected 10s ease-in-out infinite" }}
        >
          <p
            data-hero-animated
            className="col-span-2 text-[0.58rem] font-semibold leading-tight tracking-[0.02em] text-suede sm:text-xs md:col-span-1"
            style={{ animation: "heroIntroCopy 10s ease-in-out infinite" }}
          >
            1. Ответь на вопросы
          </p>
          {selected.map((item, index) => (
            <div
              key={item}
              className="rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-center text-[0.62rem] font-bold text-outsole shadow-[0_8px_22px_rgba(10,10,10,0.08)] backdrop-blur sm:px-4 sm:py-2 sm:text-xs md:text-left"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="absolute left-1/2 top-[36%] h-[38%] w-[56%] -translate-x-1/2 md:left-auto md:right-8 md:top-[19%] md:h-[58%] md:w-[43%] md:translate-x-0">
          <p
            data-hero-animated
            className="absolute inset-x-0 -top-5 text-center text-[0.58rem] font-semibold leading-tight tracking-[0.02em] text-suede sm:-top-6 sm:text-xs"
            style={{ animation: "heroIntroCopy 10s ease-in-out infinite" }}
          >
            2. Свайпай карточки
          </p>
          <div
            data-hero-animated
            className="absolute inset-0"
            style={{ animation: "heroCardStack 10s ease-in-out infinite" }}
          >
            {styles.map((styleName, index) => (
              <div
                key={styleName}
                data-hero-animated
                className="absolute inset-x-0 top-0 rounded-[1rem] border border-white/80 bg-white p-3 shadow-[0_16px_38px_rgba(10,10,10,0.12)] sm:rounded-[1.15rem] sm:p-4"
                style={{
                  animation: `${
                    index === 0
                      ? "heroCardReject"
                      : index === 1
                        ? "heroCardApprove"
                        : index === 2
                          ? "heroCardHoldOne"
                          : "heroCardHoldTwo"
                  } 10s ease-in-out infinite`,
                  zIndex: styles.length - index,
                }}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-[0.75rem] bg-lace">
                  <img
                    src={publicAsset(
                      index === 0
                        ? "tinder-daily/daily-chunky.webp"
                        : index === 1
                          ? "tinder-daily/daily-trending.webp"
                          : index === 2
                            ? "tinder-daily/daily-retro-low.webp"
                            : "tinder-daily/daily-retro-runner.webp",
                    )}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-2 truncate text-[0.64rem] font-bold text-outsole sm:text-sm">
                  {styleName}
                </p>
              </div>
            ))}
          </div>
          <div
            data-hero-animated
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ animation: "heroAssembling 10s ease-in-out infinite" }}
            data-animation-src={publicAsset("boots.json")}
          >
            <div className="relative flex h-20 w-20 items-center justify-center md:h-[8.75rem] md:w-[8.75rem]">
              <div
                data-hero-animated
                className="absolute inset-0 rounded-full bg-[#bfe8ff]/70 blur-sm"
                style={{ animation: "heroPulse 10s ease-in-out infinite" }}
              />
              {LottieRenderer ? (
                <LottieRenderer
                  animationData={bootsAnimation}
                  loop
                  autoplay
                  className="relative h-full w-full"
                  rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                />
              ) : null}
            </div>
            <p className="mt-2 text-[0.66rem] font-bold leading-tight text-outsole sm:text-sm">
              Собираем подборку
            </p>
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-suede/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-suede/55" />
              <span className="h-1.5 w-1.5 rounded-full bg-suede/70" />
            </div>
          </div>
        </div>

        <div
          data-hero-animated
          className="absolute left-[16%] top-[50%] z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#ff7d73]/30 bg-white text-lg font-black leading-none text-[#d84337] shadow-[0_12px_28px_rgba(216,67,55,0.16)] md:left-[48%] md:top-[43%] md:h-10 md:w-10 md:text-2xl"
          style={{ animation: "heroReject 10s ease-in-out infinite" }}
          aria-label="Отклонено"
        >
          ✕
        </div>

        <div
          data-hero-animated
          className="absolute right-[16%] top-[50%] z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#45c782]/30 bg-white text-lg font-black leading-none text-[#17975b] shadow-[0_12px_28px_rgba(23,151,91,0.18)] md:right-[13%] md:top-[43%] md:h-10 md:w-10 md:text-2xl"
          style={{ animation: "heroApprove 10s ease-in-out infinite" }}
          aria-label="Подходит"
        >
          ✓
        </div>

        <div
          data-hero-animated
          className="absolute bottom-5 left-1/2 w-[54%] -translate-x-1/2 rounded-[1rem] border border-white/70 bg-white/75 p-2.5 shadow-[0_14px_34px_rgba(10,10,10,0.08)] backdrop-blur md:bottom-8 md:left-8 md:w-[30%] md:translate-x-0 md:p-4"
          style={{ animation: "heroCounterPanel 10s steps(1,end) infinite" }}
        >
          <div className="relative h-4 overflow-hidden text-[0.56rem] font-bold tracking-[0] text-suede/60 sm:h-5 sm:text-[0.68rem] sm:tracking-[0.04em]">
            <span
              data-hero-animated
              className="absolute inset-0 whitespace-nowrap"
              style={{ animation: "heroCounterLabelStart 10s steps(1,end) infinite" }}
            >
              Всего товаров
            </span>
            <span
              data-hero-animated
              className="absolute inset-0 whitespace-nowrap"
              style={{ animation: "heroCounterLabelFilter 10s steps(1,end) infinite" }}
            >
              Фильтруем каталог
            </span>
          </div>
          <div className="relative mt-1 h-9 overflow-hidden font-display text-3xl font-bold leading-none text-outsole sm:h-11 sm:text-4xl">
            <div
              data-hero-animated
              className="absolute inset-x-0 top-0"
              style={{ animation: "heroCounterRoll 10s ease-in-out infinite" }}
            >
              {["12 000", "9 420", "7 180", "6 350", "3 840", "1 120", "220"].map((value) => (
                <div key={value} className="h-9 whitespace-nowrap leading-none sm:h-11">
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          data-hero-animated
          className="absolute left-1/2 top-1/2 w-[90%] max-w-[34rem] sm:w-[88%]"
          style={{ animation: "heroFinal 10s ease-in-out infinite" }}
        >
          <div className="mx-auto flex w-full flex-col items-center">
            <div className="text-center">
              <h2 className="font-display text-lg font-bold leading-none text-outsole sm:text-3xl">
                Идеально для тебя
              </h2>
            </div>

            <div className="mt-3 grid w-full grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
              {recommendations.map((item) => (
                <div
                  key={item.name}
                  className="min-w-0 rounded-[0.85rem] border border-white/80 bg-white p-1.5 shadow-[0_16px_38px_rgba(10,10,10,0.12)] sm:rounded-[1.15rem] sm:p-2"
                >
                  <div className="aspect-[1.08/1] w-full overflow-hidden rounded-[0.7rem] bg-lace sm:aspect-[1.04/1] sm:rounded-[0.9rem]">
                    <img
                      src={publicAsset(item.image)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-1 min-h-[2.4em] px-0.5 text-center text-[0.55rem] font-bold leading-tight text-outsole sm:mt-2 sm:min-h-[2.2em] sm:text-xs">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-2 max-w-[20rem] text-center text-[0.55rem] font-semibold leading-tight text-suede sm:mt-4 sm:max-w-[24rem] sm:text-sm sm:leading-snug">
              Подобрали несколько идеальных пар из тысяч товаров
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
