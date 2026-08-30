import { useState } from "react";

export const SEGMENTS = [
  { id: "listen", label: "Listen" },
  { id: "watch", label: "Watch" },
  { id: "shorts", label: "Shorts" },
  { id: "press", label: "Press" },
] as const;

export function useActiveSegment() {
  return useState<string>(SEGMENTS[0].id);
}

export function SegmentedNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="sticky top-3 z-30 mx-auto w-full max-w-6xl px-5 sm:px-8">
      <nav
        aria-label="Release sections"
        className="glass-panel no-scrollbar flex gap-1 overflow-x-auto rounded-full p-1.5"
      >
        {SEGMENTS.map((segment) => {
          const isActive = active === segment.id;
          return (
            <button
              key={segment.id}
              type="button"
              onClick={() => {
                onChange(segment.id);
                window.setTimeout(() => scrollTo(segment.id), 0);
              }}
              aria-current={isActive ? "true" : undefined}
              className={`flex-1 rounded-full px-4 py-2.5 font-display text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_10px_25px_-12px_var(--primary)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {segment.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
