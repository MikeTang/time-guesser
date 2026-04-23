"use client";

import { useEffect, useRef } from "react";

// Pure-CSS canvas-free confetti rendered as absolutely positioned divs.
// We generate a fixed set of particles on mount and animate them with
// CSS keyframe animations — no external library needed.

const PARTICLE_COUNT = 60;
const COLORS = [
  "#f472b6", // pink
  "#a78bfa", // violet
  "#34d399", // emerald
  "#fbbf24", // amber
  "#60a5fa", // blue
  "#f87171", // red
];

interface Particle {
  id: number;
  color: string;
  left: number; // vw percentage
  delay: number; // ms
  duration: number; // ms
  size: number; // px
  rotate: number; // initial rotation deg
  shape: "circle" | "square" | "star";
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    left: randomBetween(2, 98),
    delay: randomBetween(0, 1200),
    duration: randomBetween(2000, 3500),
    size: randomBetween(8, 18),
    rotate: randomBetween(0, 360),
    shape: (["circle", "square", "star"] as const)[Math.floor(Math.random() * 3)],
  }));
}

export default function Confetti() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Build particles once on mount
  const particlesRef = useRef<Particle[]>(buildParticles());

  // Remove container after animations finish to keep DOM clean
  useEffect(() => {
    const maxDuration =
      Math.max(...particlesRef.current.map((p) => p.delay + p.duration)) + 200;

    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.display = "none";
      }
    }, maxDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(var(--rot)); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(100vh) rotate(calc(var(--rot) + 540deg)); opacity: 0; }
        }
      `}</style>

      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 50 }}
      >
        {particlesRef.current.map((p) => (
          <div
            key={p.id}
            style={
              {
                position: "absolute",
                top: -20,
                left: `${p.left}vw`,
                width: p.size,
                height: p.shape === "star" ? p.size : p.size,
                backgroundColor: p.shape !== "star" ? p.color : "transparent",
                borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : 0,
                color: p.shape === "star" ? p.color : "transparent",
                fontSize: p.shape === "star" ? p.size : 0,
                lineHeight: 1,
                animationName: "confetti-fall",
                animationDuration: `${p.duration}ms`,
                animationDelay: `${p.delay}ms`,
                animationTimingFunction: "linear",
                animationFillMode: "both",
                "--rot": `${p.rotate}deg`,
              } as React.CSSProperties
            }
          >
            {p.shape === "star" ? "★" : null}
          </div>
        ))}
      </div>
    </>
  );
}
