import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/portal/Hero";
import { SegmentedNav, useActiveSegment } from "@/components/portal/SegmentedNav";
import { ListenSection } from "@/components/portal/ListenSection";
import { WatchSection } from "@/components/portal/WatchSection";
import { ShortsSection } from "@/components/portal/ShortsSection";
import { PressSection } from "@/components/portal/PressSection";
import { MiniBar } from "@/components/portal/MiniBar";
import { PortalFooter } from "@/components/portal/PortalFooter";
import { useRelease } from "@/lib/release-store";
import { release } from "@/data/release";

const title = `${release.artist} — ${release.title} | RADAR Release Portal`;
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
  const active = useActiveSegment();
  const release = useRelease();

  return (
    <main className="portal-gradient min-h-screen">
      <Hero release={release} />
      <SegmentedNav active={active} />
      <div className="mx-auto w-full max-w-md px-5">
        <ListenSection release={release} />
        <WatchSection release={release} />
        <ShortsSection release={release} />
        <PressSection release={release} />
        <PortalFooter release={release} />
      </div>
      <MiniBar release={release} />
    </main>
  );
}
