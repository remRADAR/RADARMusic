import { useState } from "react";
import { Play, Music2, Youtube, Radio, Disc3, ArrowRight } from "lucide-react";
import fallbackArtwork from "@/assets/release-artwork.jpg";
import type { Release } from "@/data/release";

const ICONS = [Play, Radio, Disc3, Music2, Youtube];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function Hero({ release }: { release: Release }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const links = release.destinations.slice(0, 5);

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={release.backgroundImage || release.artwork || fallbackArtwork}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-110 object-cover opacity-70 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/50 via-deep/75 to-deep" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-10 pb-8 text-center">
        <div className="mx-auto w-fit overflow-hidden rounded-full ring-1 ring-white/25">
          <img
            src={release.artistImage || release.artwork || fallbackArtwork}
            alt={release.artworkAlt}
            width={1024}
            height={1024}
            className="size-40 object-cover"
          />
        </div>

        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-deep-foreground">
          {release.artist}
        </h1>
        <p className="mt-1 font-display text-lg text-deep-muted">
          {release.handle ?? `@${release.slug}`}
        </p>

        <ul className="mt-5 flex items-center justify-center gap-3">
          {links.map((destination, i) => {
            const Icon = ICONS[i % ICONS.length] ?? Play;
            return (
              <li key={destination.id}>
                <a
                  href={destination.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={destination.name}
                  className="flex size-11 items-center justify-center rounded-full bg-white/12 text-deep-foreground ring-1 ring-white/20 transition-transform duration-300 hover:scale-110"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-6 max-w-xs text-base leading-relaxed text-deep-foreground/90">
          {release.tagline ?? `Official landing page for ${release.title}`}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setJoined(true);
          }}
          className="mt-6 flex items-center gap-1 rounded-full bg-white p-1.5 pl-5 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            aria-label="Email address"
            className="min-w-0 flex-1 bg-transparent text-base text-deep outline-none placeholder:text-deep/40"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-deep px-4 py-2.5 font-display text-sm font-semibold text-deep-foreground"
          >
            {joined ? "Connected" : "Connect"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </form>

        <div className="glass-panel-dark mt-6 rounded-[1.75rem] p-5 text-left">
          <p className="label-mono text-deep-muted">
            {release.type} · {release.label} · {formatDate(release.releaseDate)}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-deep-foreground">
            {release.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-deep-muted">{release.story}</p>
          <a
            href="#listen"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-deep-foreground px-6 py-3 font-display text-sm font-semibold text-deep transition-transform duration-300 hover:scale-[1.02]"
          >
            Play the release
          </a>
        </div>
      </div>
    </section>
  );
}
