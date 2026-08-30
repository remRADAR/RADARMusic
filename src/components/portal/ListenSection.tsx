import { ArrowUpRight } from "lucide-react";
import { EmbedFrame } from "./EmbedFrame";
import { SectionHeading } from "./SectionHeading";
import type { Release } from "@/data/release";

export function ListenSection({ release }: { release: Release }) {
  const primary = release.destinations.find((d) => d.embed);
  const rest = release.destinations.filter((d) => d.id !== primary?.id);

  return (
    <section id="listen" className="scroll-mt-24 py-10">
      <SectionHeading
        label="01 / Listen"
        title="Every store, one door"
        note="The verified source plays here. Other destinations open on the service you prefer."
      />

      {primary?.embed ? (
        <EmbedFrame
          src={primary.embed.src}
          title={`${release.title} on ${primary.name}`}
          ratio="auto"
          height={primary.embed.height}
          className="mb-4"
        />
      ) : null}

      <ul className="space-y-2.5">
        {rest.map((destination) => (
          <li key={destination.id}>
            <a
              href={destination.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3.5 transition-transform duration-300 hover:translate-y-[-2px]"
            >
              <span className="flex flex-col">
                <span className="font-display text-base font-medium text-foreground">
                  {destination.name}
                </span>
                <span className="label-mono mt-0.5 text-muted-foreground">
                  {destination.status === "verified" ? "Verified source" : "Needs review"}
                </span>
              </span>
              <ArrowUpRight className="size-5 text-primary" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
