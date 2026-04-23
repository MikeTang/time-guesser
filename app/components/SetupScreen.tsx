"use client";

import { useState } from "react";

interface Props {
  onStart: (minutes: number) => void;
}

export default function SetupScreen({ onStart }: Props) {
  const [value, setValue] = useState("2");
  const minutes = parseInt(value, 10);
  const valid = !isNaN(minutes) && minutes >= 1 && minutes <= 99;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-violet-50 p-8">
      <div className="text-7xl select-none">⏳</div>

      <h1 className="text-3xl font-bold text-violet-800 text-center">
        Time Guesser
      </h1>

      <p className="text-lg text-violet-600 text-center max-w-xs">
        Set the countdown, hand it over, and let them guess when time&apos;s up!
      </p>

      <div className="flex flex-col items-center gap-3">
        <label
          htmlFor="minutes"
          className="text-sm font-semibold uppercase tracking-widest text-violet-500"
        >
          Minutes
        </label>
        <input
          id="minutes"
          type="number"
          min={1}
          max={99}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-28 rounded-2xl border-2 border-violet-300 bg-white px-4 py-3 text-center text-5xl font-bold text-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-300"
        />
      </div>

      <button
        disabled={!valid}
        onClick={() => valid && onStart(minutes)}
        className="rounded-full bg-violet-600 px-12 py-5 text-2xl font-bold text-white shadow-lg transition hover:bg-violet-700 active:scale-95 disabled:opacity-40"
      >
        Start ▶
      </button>
    </main>
  );
}
