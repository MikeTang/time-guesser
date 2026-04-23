"use client";

import Confetti from "./Confetti";

interface Props {
  targetMs: number;
  elapsedMs: number;
  onPlayAgain: () => void;
}

// --- Thresholds (tweak freely) ---
const PERFECT_MS = 3_000; // ≤ 3 s  → perfect
const CLOSE_MS = 10_000; // ≤ 10 s  → close (confetti)
const GOOD_MS = 30_000; // ≤ 30 s  → good
// > 30 s                          → needs practice

type Tier = "perfect" | "close" | "good" | "off";

function getTier(diffMs: number): Tier {
  if (diffMs <= PERFECT_MS) return "perfect";
  if (diffMs <= CLOSE_MS) return "close";
  if (diffMs <= GOOD_MS) return "good";
  return "off";
}

interface TierConfig {
  bg: string;
  emoji: string;
  headline: (diffLabel: string, early: boolean) => string;
  message: string;
}

const TIER_CONFIG: Record<Tier, TierConfig> = {
  perfect: {
    bg: "bg-emerald-50",
    emoji: "🏆",
    headline: (d, e) => `${d} ${e ? "early" : "late"} — PERFECT!`,
    message: "You have an incredible sense of time. Amazing!",
  },
  close: {
    bg: "bg-violet-50",
    emoji: "🎉",
    headline: (d, e) => `${d} ${e ? "early" : "late"}!`,
    message: "So close! Your time instincts are really good.",
  },
  good: {
    bg: "bg-amber-50",
    emoji: "👍",
    headline: (d, e) => `${d} ${e ? "early" : "late"}`,
    message: "Nice try! A bit more practice and you'll nail it.",
  },
  off: {
    bg: "bg-rose-50",
    emoji: "🕰️",
    headline: (d, e) => `${d} ${e ? "early" : "late"}`,
    message: "Time flies, doesn't it? Give it another go!",
  },
};

/** Format a millisecond delta as a human-friendly string, e.g. "8 seconds" or "1 min 14 sec". */
function formatDiff(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) {
    return `${totalSeconds} ${totalSeconds === 1 ? "second" : "seconds"}`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (secs === 0) {
    return `${mins} ${mins === 1 ? "minute" : "minutes"}`;
  }
  return `${mins} min ${secs} sec`;
}

export default function ResultScreen({ targetMs, elapsedMs, onPlayAgain }: Props) {
  const diffMs = Math.abs(elapsedMs - targetMs);
  const early = elapsedMs < targetMs;
  const tier = getTier(diffMs);
  const config = TIER_CONFIG[tier];
  const diffLabel = formatDiff(diffMs);
  const showConfetti = tier === "perfect" || tier === "close";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-8 ${config.bg} p-8`}
    >
      {showConfetti && <Confetti />}

      {/* Big emoji badge */}
      <div
        className="text-8xl select-none"
        style={{ animation: "pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both" }}
      >
        {config.emoji}
      </div>

      {/* Primary result — big rounded pill */}
      <div className="rounded-3xl bg-white px-8 py-5 shadow-lg text-center">
        <p className="text-4xl font-extrabold text-neutral-800 leading-tight">
          {config.headline(diffLabel, early)}
        </p>
      </div>

      {/* Friendly message */}
      <p className="text-xl text-neutral-600 text-center max-w-xs leading-snug">
        {config.message}
      </p>

      {/* Stats detail */}
      <div className="rounded-2xl bg-white/70 px-6 py-4 text-center text-sm text-neutral-500 space-y-1">
        <p>Target: {formatDiff(targetMs)}</p>
        <p>You stopped at: {formatDiff(elapsedMs)}</p>
      </div>

      {/* Play Again */}
      <button
        onClick={onPlayAgain}
        className="rounded-full bg-violet-600 px-12 py-5 text-2xl font-bold text-white shadow-lg transition hover:bg-violet-700 active:scale-95"
      >
        Play Again 🔄
      </button>

      <style>{`
        @keyframes pop {
          0%   { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
