export type EmbedProvider = "spotify" | "apple" | "youtube" | "none";

export type Destination = {
  id: string;
  name: string;
  url: string;
  status: "verified" | "needs-review";
  embed?: { provider: EmbedProvider; src: string; height: number };
};

export type VideoItem = {
  id: string;
  title: string;
  kind: string;
  src: string;
};

export type ShortItem = {
  id: string;
  title: string;
  source: string;
  src: string;
};

export type PressItem = {
  id: string;
  publication: string;
  headline: string;
  quote: string;
  url: string;
  date: string;
};

export type Release = {
  slug: string;
  artist: string;
  title: string;
  type: string;
  label: string;
  handle?: string;
  tagline?: string;
  releaseDate: string;
  story: string;
  artworkAlt: string;
  destinations: Destination[];
  videos: VideoItem[];
  shorts: ShortItem[];
  press: PressItem[];
};

export const release: Release = {
  slug: "afterglow",
  artist: "Mira Okonjo",
  title: "Afterglow",
  type: "Single",
  label: "RADAR Music",
  handle: "@miraokonjo",
  tagline: "Official release portal for Afterglow — stream, watch and read, all in one place.",
  releaseDate: "2026-08-14",
  story:
    "Recorded across three nights in Lagos and finished in a London basement, Afterglow is about the hour after the room empties — the quiet that arrives once the noise has done its work.",
  artworkAlt: "Afterglow single artwork by Mira Okonjo",
  destinations: [
    {
      id: "spotify",
      name: "Spotify",
      url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
      status: "verified",
      embed: {
        provider: "spotify",
        src: "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT?theme=0",
        height: 152,
      },
    },
    {
      id: "apple",
      name: "Apple Music",
      url: "https://music.apple.com/us/browse",
      status: "verified",
    },
    {
      id: "audiomack",
      name: "Audiomack",
      url: "https://audiomack.com/search",
      status: "needs-review",
    },
    {
      id: "boomplay",
      name: "Boomplay",
      url: "https://www.boomplay.com/search",
      status: "needs-review",
    },
    { id: "deezer", name: "Deezer", url: "https://www.deezer.com/search", status: "needs-review" },
    { id: "tidal", name: "TIDAL", url: "https://tidal.com/search", status: "needs-review" },
    {
      id: "amazon",
      name: "Amazon Music",
      url: "https://music.amazon.com/search",
      status: "needs-review",
    },
    {
      id: "ytmusic",
      name: "YouTube Music",
      url: "https://music.youtube.com/search",
      status: "needs-review",
    },
  ],
  videos: [
    {
      id: "official",
      title: "Afterglow — Official Video",
      kind: "Official video",
      src: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
    },
    {
      id: "live",
      title: "Afterglow — Live at the Warehouse",
      kind: "Live session",
      src: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
    },
    {
      id: "behind",
      title: "Making Afterglow",
      kind: "Behind the scenes",
      src: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
    },
  ],
  shorts: [
    {
      id: "s1",
      title: "The hook, one take",
      source: "YouTube Shorts",
      src: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
    },
    {
      id: "s2",
      title: "Studio floor, 3am",
      source: "Reels",
      src: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
    },
    {
      id: "s3",
      title: "Rehearsal room",
      source: "YouTube Shorts",
      src: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
    },
  ],
  press: [
    {
      id: "p1",
      publication: "The Native",
      headline: "Mira Okonjo finds stillness on Afterglow",
      quote:
        "A record that understands restraint as a form of confidence, and lets the space between notes carry the weight.",
      url: "https://thenativemag.com",
      date: "Aug 2026",
    },
    {
      id: "p2",
      publication: "Clash",
      headline: "Premiere: Afterglow",
      quote: "Warm, unhurried and quietly devastating in the last thirty seconds.",
      url: "https://www.clashmusic.com",
      date: "Aug 2026",
    },
    {
      id: "p3",
      publication: "RADAR Journal",
      headline: "Notes from the Afterglow sessions",
      quote:
        "Three nights in Lagos, one basement in London, and a chorus that refused to be rushed.",
      url: "https://lovable.dev",
      date: "Aug 2026",
    },
  ],
};
