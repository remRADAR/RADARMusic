import { EmbedFrame } from "./EmbedFrame";
import { SectionHeading } from "./SectionHeading";
import type { Release } from "@/data/release";

export function ShortsSection({ release }: { release: Release }) {
  return (
    <section id="shorts" className="scroll-mt-24 py-10">
      <SectionHeading
        label="03 / Shorts"
        title="Reels & shorts"
        note="Swipe the vertical cuts. Each one plays without leaving the page."
      />

      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
        {release.shorts.map((short) => (
          <figure key={short.id} className="w-[72%] shrink-0 snap-center sm:w-[58%]">
            <EmbedFrame src={short.src} title={short.title} ratio="vertical" />
            <figcaption className="mt-3">
              <span className="label-mono block text-primary/70">{short.source}</span>
              <span className="font-display text-sm font-medium text-foreground">
                {short.title}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
