import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import type { Release } from "@/data/release";
import { safeExternalUrl } from "@/lib/safe-url";

export function PressSection({ release }: { release: Release }) {
  return (
    <section id="press" className="scroll-mt-24 py-10">
      <SectionHeading
        label="04 / Press"
        title="Releases & features"
        note="Campaign coverage, premieres and the release notes."
      />

      <div className="space-y-3">
        {release.press.map((item) => {
          const safeUrl = safeExternalUrl(item.url);
          return safeUrl ? (
            <a
              key={item.id}
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel block rounded-3xl p-5 transition-transform duration-300 hover:translate-y-[-2px]"
            >
              <div className="flex items-center justify-between">
                <span className="label-mono text-primary/70">{item.publication}</span>
                <span className="label-mono text-muted-foreground">{item.date}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl leading-tight font-semibold text-foreground">
                {item.headline}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">“{item.quote}”</p>
              <span className="mt-4 inline-flex items-center gap-1 font-display text-sm font-medium text-primary">
                Read the feature
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </a>
          ) : null;
        })}
      </div>
    </section>
  );
}
