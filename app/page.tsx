"use client";

/**
 * Time Guesser — single-page orchestrator.
 *
 * Screen flow:
 *   setup  →  child  →  result  →  setup (Play Again)
 *
 * All state lives here; no backend, no router — pure client-side.
 */

import { useState, useCallback } from "react";
import SetupScreen from "./components/SetupScreen";
import ChildScreen from "./components/ChildScreen";
import ResultScreen from "./components/ResultScreen";

type Screen = "setup" | "child" | "result";

interface GameState {
  screen: Screen;
  targetMs: number;
  startedAt: number;
  elapsedMs: number;
}

const INITIAL: GameState = {
  screen: "setup",
  targetMs: 0,
  startedAt: 0,
  elapsedMs: 0,
};

export default function Home() {
  const [game, setGame] = useState<GameState>(INITIAL);

  const handleStart = useCallback((minutes: number) => {
    setGame({
      screen: "child",
      targetMs: minutes * 60 * 1000,
      startedAt: Date.now(),
      elapsedMs: 0,
    });
  }, []);

  const handleStop = useCallback((elapsedMs: number) => {
    setGame((prev) => ({ ...prev, screen: "result", elapsedMs }));
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGame(INITIAL);
  }, []);

  if (game.screen === "setup") {
    return <SetupScreen onStart={handleStart} />;
  }

  if (game.screen === "child") {
    return (
      <ChildScreen
        targetMs={game.targetMs}
        startedAt={game.startedAt}
        onStop={handleStop}
      />
    );
  }

  // result
  return (
    <ResultScreen
      targetMs={game.targetMs}
      elapsedMs={game.elapsedMs}
      onPlayAgain={handlePlayAgain}
    />
  );
}
