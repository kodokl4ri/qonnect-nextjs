"use client";

import React from "react";
import { ModeToggle } from "@/components/mode-toggle";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-6 py-12 transition-colors duration-300">
      {/* Floating Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <div className="max-w-4xl mx-auto bg-[var(--card)] rounded-2xl shadow-lg p-8 md:p-12 space-y-8 border border-[var(--border)]">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
            {title}
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm md:text-base">
            Duta Quran Indonesia
          </p>
        </header>

        {/* Konten */}
        <div
          className="prose max-w-none leading-relaxed text-justify 
                        text-[var(--foreground)] 
                        prose-headings:text-[var(--foreground)] 
                        prose-p:text-[var(--foreground)] 
                        prose-li:text-[var(--foreground)] 
                        dark:prose-invert space-y-6 
            [&>p]:mb-6 
            [&>p]:last:mb-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
