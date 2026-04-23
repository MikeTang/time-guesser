"use client";

import { useEffect, useRef } from "react";

interface Props {
  targetMs: number; // total countdown in milliseconds
  startedAt: number; // Date.now() when the countdown began
  onStop: (elapsedMs: number) => void;
}

export default function ChildScreen({ targetMs, startedAt, onStop }: Props) {
  // We intentionally show NO time to the child — just the pulsing hourglass.
  // The ref tracks the elapsed time when STOP is pressed.
  const rafRef = useRef<number | null>(null);

  // Auto-stop at 2× the target so the page never hangs forever.
  useEffect(() => {
    const deadline = startedAt + targetMs * 2;

    function tick() {
      if (Date.now() >= deadline) {
        onStop(Date.now() - startedAt);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [startedAt, targetMs, onStop]);

  function handleStop() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    onStop(Date.now() - startedAt);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-amber-50 p-8">
      {/* Pulsing hourglass — no clock, no progress bar */}
      <div
        className="text-[10rem] leading-none select-none"
        style={{ animation: "pulse 2s ease-in-out infinite" }}
        aria-hidden="true"
      >
        ⏳
      </div>

      <p className="text-2xl font-semibold text-amber-700 text-center">
        Tap STOP when you think time is up!
      </p>

      <button
        onClick={handleStop}
        className="rounded-full bg-red-500 px-16 py-8 text-5xl font-extrabold text-white shadow-2xl transition hover:bg-red-600 active:scale-95"
      >
        STOP
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%       { transform: scale(1.15); opacity: 0.7; }
        }
      `}</style>
    </main>
  );
}
