import { useState } from "react";
import { EmbedFrame } from "./EmbedFrame";
import { SectionHeading } from "./SectionHeading";
import type { Release } from "@/data/release";

export function WatchSection({ release }: { release: Release }) {
  const [activeId, setActiveId] = useState(release.videos[0]?.id);
  const active = release.videos.find((v) => v.id === activeId) ?? release.videos[0];

  return (
    <section id="watch" className="scroll-mt-24 py-10">
      <SectionHeading
        label="02 / Watch"
        title="The visual"
        note="Official video, live session and the room it was made in."
      />

      {active ? <EmbedFrame src={active.src} title={active.title} ratio="video" /> : null}

      <p className="label-mono mt-3 text-muted-foreground">{active?.kind}</p>
      <p className="font-display text-lg font-medium text-foreground">{active?.title}</p>

      <div className="no-scrollbar -mx-5 mt-5 flex gap-3 overflow-x-auto px-5 pb-1">
        {release.videos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActiveId(video.id)}
            className={`glass-panel w-44 shrink-0 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
              video.id === active?.id ? "ring-2 ring-primary/60" : "opacity-75 hover:opacity-100"
            }`}
          >
            <span className="label-mono block text-primary/70">{video.kind}</span>
            <span className="mt-1 block font-display text-sm leading-snug font-medium text-foreground">
              {video.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
