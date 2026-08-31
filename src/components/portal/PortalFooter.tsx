import type { Release } from "@/data/release";

export function PortalFooter({ release }: { release: Release }) {
  const year = new Date().getFullYear();

  return (
    <footer className="pt-6 pb-32">
      <div className="glass-panel rounded-3xl p-6 text-center">
        <img
          src="/brand-logo.png"
          alt="The RADARMusic"
          className="mx-auto mb-4 size-20 object-contain drop-shadow-[0_12px_24px_rgba(127,156,255,.2)]"
        />
        <p className="label-mono text-primary/70">The RADARMusic</p>
        <p className="mt-3 font-display text-2xl font-medium text-foreground">
          {release.artist} — {release.title}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Hosted release portal · {release.label} · All destinations are official store links.
        </p>
        <p className="mt-5 text-xs text-muted-foreground">
          by{" "}
          <a
            href="https://radarcharts.net"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary"
          >
            RADARCharts by REM
          </a>
          <span className="mx-2 text-muted-foreground/50">·</span>© {year} RADARCharts by REM
        </p>
      </div>
    </footer>
  );
}
