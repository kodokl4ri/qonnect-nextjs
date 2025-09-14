"use client";

import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";

interface FuturisticLayoutProps {
  children: ReactNode;
  centered?: boolean; // jika true, content akan center horizontal & vertical
}

export default function FuturisticLayout({
  children,
  centered = false,
}: FuturisticLayoutProps) {
  return (
    <div
      className={`min-h-screen relative overflow-hidden
        bg-[var(--background)]
        dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-900 dark:to-slate-800
        transition-colors duration-500
        ${centered ? "flex items-center justify-center" : ""}`}
    >
      {/* Floating Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      {/* Main content */}
      <main
        className={
          centered
            ? "w-full max-w-3xl px-4" // card max width 768px, responsive
            : "w-full"
        }
      >
        {children}
      </main>
    </div>
  );
}
