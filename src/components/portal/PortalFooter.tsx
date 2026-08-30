import type { Release } from "@/data/release";

export function PortalFooter({ release }: { release: Release }) {
  return (
    <footer className="pt-6 pb-32">
      <div className="glass-panel rounded-3xl p-6 text-center">
        <p className="label-mono text-primary/70">RADAR Music</p>
        <p className="mt-3 font-display text-2xl font-medium text-foreground">
          {release.artist} — {release.title}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Hosted release portal · {release.label} · All destinations are official store links.
        </p>
      </div>
    </footer>
  );
}
