import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Guesser 🕰️",
  description: "A fun time-guessing game for kids!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Sky-soft background + Nunito everywhere */}
      <body
        className="min-h-screen antialiased"
        style={{
          fontFamily: "var(--font-nunito), sans-serif",
          background: "var(--color-sky-soft)",
          color: "#1e3a5f",
        }}
      >
        {children}
      </body>
    </html>
  );
}
