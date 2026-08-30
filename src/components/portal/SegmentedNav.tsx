import { useEffect, useState } from "react";

export const SEGMENTS = [
  { id: "listen", label: "Listen" },
  { id: "watch", label: "Watch" },
  { id: "shorts", label: "Shorts" },
  { id: "press", label: "Press" },
] as const;

export function useActiveSegment() {
  const [active, setActive] = useState<string>(SEGMENTS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    SEGMENTS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

export function SegmentedNav({ active }: { active: string }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="sticky top-3 z-30 mx-auto w-full max-w-md px-5">
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
              onClick={() => scrollTo(segment.id)}
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
