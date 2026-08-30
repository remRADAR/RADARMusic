import { createFileRoute } from "@tanstack/react-router";

import { useEffect, useState } from "react";

import { Hero } from "@/components/portal/Hero";
import { SegmentedNav, useActiveSegment } from "@/components/portal/SegmentedNav";
import { ListenSection } from "@/components/portal/ListenSection";
import { WatchSection } from "@/components/portal/WatchSection";
import { ShortsSection } from "@/components/portal/ShortsSection";
import { PressSection } from "@/components/portal/PressSection";
import { MiniBar } from "@/components/portal/MiniBar";
import { PortalFooter } from "@/components/portal/PortalFooter";
import { Reveal } from "@/components/portal/Reveal";
import { useRelease } from "@/lib/release-store";
import { release } from "@/data/release";
import { DEFAULT_THEME, deriveTheme, themeStyle, type PortalTheme } from "@/lib/theme";

const title = `The RADARMusic: ${release.artist} - ${release.title}`;
const description = `Stream ${release.title} by ${release.artist} on every store, watch the video, browse reels and shorts, and read the press coverage — all from one RADAR release portal.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "music.song" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Portal,
});

function Portal() {
  const [active, setActive] = useActiveSegment();
  const release = useRelease();
  const [theme, setTheme] = useState<PortalTheme>(DEFAULT_THEME);

  useEffect(() => {
    document.title = `The RADARMusic: ${release.artist} - ${release.title}`;
  }, [release.artist, release.title]);

  useEffect(() => {
    let mounted = true;
    deriveTheme(release.artwork ?? "").then((next) => {
      if (mounted) setTheme(next);
    });
    return () => {
      mounted = false;
    };
  }, [release.artwork]);

  return (
    <main className="portal-gradient min-h-screen" style={themeStyle(theme)}>
      <Reveal>
        <Hero release={release} />
      </Reveal>
      <Reveal delay={80}>
        <SegmentedNav active={active} onChange={setActive} />
      </Reveal>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal key={active} delay={120}>
          {active === "listen" ? <ListenSection release={release} /> : null}
          {active === "watch" ? <WatchSection release={release} /> : null}
          {active === "shorts" ? <ShortsSection release={release} /> : null}
          {active === "press" ? <PressSection release={release} /> : null}
        </Reveal>
        <Reveal delay={180}>
          <PortalFooter release={release} />
        </Reveal>
      </div>
      <MiniBar release={release} />
    </main>
  );
}
