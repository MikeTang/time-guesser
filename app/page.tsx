"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type Screen = "setup" | "child" | "result";

interface ResultInfo {
  diffSeconds: number;
  targetSeconds: number;
  guessSeconds: number;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function resultTheme(diff: number): {
  bg: string;
  border: string;
  label: string;
  emoji: string;
  message: string;
} {
  if (diff < 5) {
    return {
      bg: "bg-amber-100",
      border: "border-amber-400",
      label: "text-amber-600",
      emoji: "🏆",
      message: "WOW — almost perfect!",
    };
  }
  if (diff < 15) {
    return {
      bg: "bg-green-100",
      border: "border-green-400",
      label: "text-green-600",
      emoji: "🎉",
      message: "Super close — great job!",
    };
  }
  return {
    bg: "bg-violet-100",
    border: "border-violet-400",
    label: "text-violet-600",
    emoji: "⭐",
    message: "Nice try — keep practising!",
  };
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

/* Tiny floating confetti pieces */
function Confetti() {
  const pieces = ["🌟", "✨", "🎈", "💫", "🎊"];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="animate-confetti absolute text-2xl"
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            top: "-10px",
            animationDelay: `${(i * 0.07).toFixed(2)}s`,
            animationDuration: `${0.9 + (i % 5) * 0.12}s`,
          }}
        >
          {pieces[i % pieces.length]}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Screen 1 — Parent Setup
───────────────────────────────────────────── */
function SetupScreen({ onStart }: { onStart: (minutes: number) => void }) {
  const [minutes, setMinutes] = useState(1);

  return (
    <div className="animate-fade-up flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-6xl">⏳</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-sky-700">
          Time Guesser
        </h1>
        <p className="text-lg font-semibold text-sky-600">
          How long can you feel time?
        </p>
      </div>

      {/* Minute picker card */}
      <div className="w-full max-w-sm rounded-3xl bg-white/70 p-8 shadow-lg ring-1 ring-sky-200 backdrop-blur-sm">
        <p className="mb-4 text-center text-base font-bold uppercase tracking-widest text-sky-500">
          Set the timer
        </p>

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setMinutes((m) => Math.max(1, m - 1))}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-3xl font-black text-sky-700 shadow transition hover:bg-sky-200 active:scale-95"
            aria-label="Decrease minutes"
          >
            −
          </button>

          <div className="flex flex-col items-center">
            <span className="text-6xl font-black leading-none text-sky-700">
              {minutes}
            </span>
            <span className="text-sm font-bold text-sky-400">
              {minutes === 1 ? "minute" : "minutes"}
            </span>
          </div>

          <button
            onClick={() => setMinutes((m) => Math.min(60, m + 1))}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-3xl font-black text-sky-700 shadow transition hover:bg-sky-200 active:scale-95"
            aria-label="Increase minutes"
          >
            +
          </button>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart(minutes)}
        className="rounded-full bg-sky-500 px-16 py-5 text-2xl font-extrabold text-white shadow-xl transition hover:bg-sky-600 active:scale-95"
      >
        Start ▶
      </button>

      <p className="max-w-xs text-center text-sm text-sky-500">
        Hand the device to your child after tapping Start — the clock stays
        hidden!
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Screen 2 — Child's Turn
───────────────────────────────────────────── */
function ChildScreen({
  targetSeconds,
  onStop,
}: {
  targetSeconds: number;
  onStop: (elapsed: number) => void;
}) {
  const startRef = useRef<number>(Date.now());

  return (
    <div className="animate-fade-up flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-12">
      {/* Pulsing hourglass */}
      <div className="animate-hg-pulse select-none text-[9rem] leading-none drop-shadow-lg">
        ⏳
      </div>

      <p className="text-center text-2xl font-extrabold text-sky-700">
        When you think time is up…
      </p>

      {/* Coral STOP button */}
      <button
        onClick={() => onStop((Date.now() - startRef.current) / 1000)}
        className="
          rounded-full px-20 py-8
          text-4xl font-black text-white
          shadow-2xl
          transition
          active:scale-95
        "
        style={{
          background: "var(--color-coral)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--color-coral-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--color-coral)")
        }
      >
        STOP!
      </button>

      <p className="text-sm font-semibold text-sky-400">
        Target: {fmt(targetSeconds)} — but no peeking! 👀
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Screen 3 — Result
───────────────────────────────────────────── */
function ResultScreen({
  result,
  onPlayAgain,
}: {
  result: ResultInfo;
  onPlayAgain: () => void;
}) {
  const { diffSeconds, targetSeconds, guessSeconds } = result;
  const theme = resultTheme(diffSeconds);
  const isGold = diffSeconds < 5;

  return (
    <div
      className={`animate-fade-up relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 py-12 ${theme.bg}`}
    >
      {/* Confetti for gold + green */}
      {diffSeconds < 15 && <Confetti />}

      {/* Big result card */}
      <div
        className={`animate-pop-in relative z-10 w-full max-w-sm rounded-3xl border-4 bg-white/80 p-8 text-center shadow-2xl backdrop-blur-sm ${theme.border}`}
      >
        <div className="text-7xl leading-none">{theme.emoji}</div>

        <p className={`mt-3 text-lg font-extrabold uppercase tracking-wider ${theme.label}`}>
          {theme.message}
        </p>

        {/* Big diff number */}
        <div className="my-6">
          <span
            className={`text-8xl font-black leading-none ${theme.label}`}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(diffSeconds)}
          </span>
          <p className="mt-1 text-base font-bold text-neutral-500">off target</p>
        </div>

        {/* Detail row */}
        <div className="flex justify-around rounded-2xl bg-neutral-50 py-3">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Target
            </span>
            <span className="text-xl font-extrabold text-neutral-700">
              {fmt(targetSeconds)}
            </span>
          </div>
          <div className="w-px bg-neutral-200" />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Your guess
            </span>
            <span className="text-xl font-extrabold text-neutral-700">
              {fmt(guessSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Play again */}
      <button
        onClick={onPlayAgain}
        className="z-10 rounded-full bg-sky-500 px-14 py-4 text-xl font-extrabold text-white shadow-xl transition hover:bg-sky-600 active:scale-95"
      >
        Play Again 🔄
      </button>

      {/* Gold shimmer badge */}
      {isGold && (
        <p className="z-10 animate-pop-in rounded-full bg-amber-400 px-6 py-2 text-sm font-black text-white shadow-lg">
          🏅 PERFECT TIMING!
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root — orchestrates screens
───────────────────────────────────────────── */
export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [targetSeconds, setTargetSeconds] = useState(60);
  const [result, setResult] = useState<ResultInfo | null>(null);

  function handleStart(minutes: number) {
    setTargetSeconds(minutes * 60);
    setScreen("child");
  }

  function handleStop(elapsed: number) {
    const diff = Math.abs(elapsed - targetSeconds);
    setResult({
      diffSeconds: Math.round(diff),
      targetSeconds,
      guessSeconds: Math.round(elapsed),
    });
    setScreen("result");
  }

  function handlePlayAgain() {
    setResult(null);
    setScreen("setup");
  }

  if (screen === "child") {
    return <ChildScreen targetSeconds={targetSeconds} onStop={handleStop} />;
  }

  if (screen === "result" && result) {
    return <ResultScreen result={result} onPlayAgain={handlePlayAgain} />;
  }

  return <SetupScreen onStart={handleStart} />;
}
