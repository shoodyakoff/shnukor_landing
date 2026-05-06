import { useState } from "react";

import { Hero } from "./Hero";
import {
  ColorScreen,
  PriceScreen,
  SizeScreen,
  SportScreen,
  StyleScreen,
  TaskScreen,
} from "./FlowChoiceScreens";
import { FlowHeader } from "./FlowNav";
import { EmptyState, Results, SearchScreen } from "./FlowResultScreens";
import {
  DEFAULT_PRICE_ID,
  STYLES,
  type Selections,
  type Step,
  type StyleVote,
  type Task,
} from "./types";

const initialSelections: Selections = {
  sizes: [],
  colors: [],
  price: DEFAULT_PRICE_ID,
  styleVotes: {},
};

export default function Flow() {
  const [step, setStep] = useState<Step>("hero");
  const [sel, setSel] = useState<Selections>(initialSelections);
  const [styleIdx, setStyleIdx] = useState(0);

  const reset = () => {
    setSel(initialSelections);
    setStyleIdx(0);
    setStep("hero");
  };

  const eyebrow = (
    <FlowHeader
      step={step}
      styleIndex={styleIdx}
      styleTotal={STYLES.length}
      selections={sel}
      onReset={reset}
      showReset={step !== "intro"}
    />
  );

  const toggleSize = (size: string) => {
    setSel((prev) => {
      if (prev.sizes.includes(size)) {
        return { ...prev, sizes: prev.sizes.filter((item) => item !== size) };
      }
      if (prev.sizes.length >= 3) return prev;
      return { ...prev, sizes: [...prev.sizes, size] };
    });
  };

  const toggleColor = (id: string) => {
    setSel((prev) => {
      if (id === "any") return { ...prev, colors: ["any"] };
      const withoutAny = prev.colors.filter((color) => color !== "any");
      return {
        ...prev,
        colors: withoutAny.includes(id)
          ? withoutAny.filter((color) => color !== id)
          : [...withoutAny, id],
      };
    });
  };

  const goAfterTask = (task: Task) => {
    setSel((prev) => ({ ...prev, task, sport: task === "daily" ? undefined : prev.sport }));
    setStep(task === "sport" ? "sport" : "style");
  };

  const voteStyle = (value: StyleVote) => {
    const currentStyle = STYLES[styleIdx];
    setSel((prev) => ({
      ...prev,
      styleVotes: { ...prev.styleVotes, [currentStyle.id]: value },
    }));
    if (styleIdx < STYLES.length - 1) {
      setStyleIdx((prev) => prev + 1);
    } else {
      setStep("search");
    }
  };

  const goBackFromStyle = () => {
    if (styleIdx === 0) {
      setStep(sel.task === "sport" ? "sport" : "task");
      return;
    }

    setSel((prev) => {
      const nextVotes = { ...prev.styleVotes };
      for (const style of STYLES.slice(styleIdx)) {
        delete nextVotes[style.id];
      }
      return { ...prev, styleVotes: nextVotes };
    });
    setStyleIdx((prev) => prev - 1);
  };

  if (step === "hero") return <Hero onStart={() => setStep("size")} />;
  if (step === "size") {
    return (
      <SizeScreen
        eyebrow={eyebrow}
        selections={sel}
        onBack={() => setStep("hero")}
        onNext={() => setStep("color")}
        onToggle={toggleSize}
      />
    );
  }
  if (step === "color") {
    return (
      <ColorScreen
        eyebrow={eyebrow}
        selections={sel}
        onBack={() => setStep("size")}
        onNext={() => setStep("price")}
        onToggle={toggleColor}
      />
    );
  }
  if (step === "price") {
    return (
      <PriceScreen
        eyebrow={eyebrow}
        selections={sel}
        onBack={() => setStep("color")}
        onNext={() => setStep("task")}
        onSelect={(price) => setSel((prev) => ({ ...prev, price }))}
      />
    );
  }
  if (step === "task") {
    return <TaskScreen eyebrow={eyebrow} onBack={() => setStep("price")} onSelect={goAfterTask} />;
  }
  if (step === "sport") {
    return (
      <SportScreen
        eyebrow={eyebrow}
        selections={sel}
        onBack={() => setStep("task")}
        onNext={() => setStep("style")}
        onSelect={(sport) => setSel((prev) => ({ ...prev, sport }))}
      />
    );
  }
  if (step === "style") {
    return (
      <StyleScreen
        eyebrow={eyebrow}
        styleIdx={styleIdx}
        onBack={goBackFromStyle}
        onVote={voteStyle}
      />
    );
  }
  if (step === "search")
    return <SearchScreen sel={sel} onDone={(empty) => setStep(empty ? "empty" : "results")} />;
  if (step === "results")
    return <Results sel={sel} onReset={reset} onWiden={() => setStep("empty")} />;
  if (step === "empty") return <EmptyState onReset={reset} onResults={() => setStep("results")} />;

  return null;
}
