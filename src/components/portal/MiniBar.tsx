import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import artwork from "@/assets/release-artwork.jpg";
import type { Release } from "@/data/release";

export function MiniBar({ release }: { release: Release }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-md px-5 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="glass-panel flex items-center gap-3 rounded-full py-2 pr-2 pl-2">
        <img
          src={artwork}
          alt=""
          loading="lazy"
          width={1024}
          height={1024}
          className="size-11 shrink-0 rounded-full object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-sm font-semibold text-foreground">
            {release.title}
          </span>
          <span className="block truncate text-xs text-muted-foreground">{release.artist}</span>
        </span>
        <a
          href="#listen"
          className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label="Jump to listening options"
        >
          <Play className="size-4 fill-current" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
