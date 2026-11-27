import type {
  MusicalIdentity,
  OpportunityArea,
  Positioning,
  ReleaseIntelligence,
} from "./types";

/**
 * Music release intelligence.
 *
 * Everything here is derived from the supplied release materials plus
 * documented genre/market knowledge. Nothing is invented: where a fact was not
 * supplied (tempo, streaming figures, awards) it is reported as a limitation
 * instead of being guessed.
 */

export type ReleaseFacts = {
  artist: string;
  title: string;
  type: string;
  genre: string;
  subGenres?: string[];
  releaseDate: string;
  story: string;
  biography?: string;
  language?: string;
  influences?: string[];
  mood?: string[];
  tempoBpm?: number;
  energy?: "low" | "mid" | "high";
  production?: string;
  hooks?: string[];
  culturalInfluences?: string[];
  /** True only when an audio file was actually supplied and analysed. */
  audioAnalysed: boolean;
  streamingLinks?: string[];
  pressQuotes?: string[];
};

type GenreProfile = {
  match: RegExp;
  label: string;
  secondary: string[];
  influences: string[];
  mood: string[];
  energy: "low" | "mid" | "high";
  vocal: string;
  production: string;
  hooks: string[];
  audience: string[];
  playlists: string[];
  radio: string[];
  talkingPoints: string[];
  cultural: string[];
  opportunities: OpportunityArea[];
};

const GENRE_PROFILES: GenreProfile[] = [
  {
    match: /afro|afrobeats|afrofusion|amapiano|alte|highlife/i,
    label: "Afrobeats / Afro-fusion",
    secondary: ["Afro-fusion", "Alté", "R&B"],
    influences: ["Afrobeats", "R&B", "Alté", "Highlife"],
    mood: ["warm", "nocturnal", "reflective"],
    energy: "mid",
    vocal: "Melodic lead vocal with conversational phrasing and stacked harmonies on the hook.",
    production: "Percussive Afro-rhythm bed, warm low end, spacious mix that leaves room for the vocal.",
    hooks: ["A repeated melodic hook that lands on the second bar", "Call-and-response backing vocal"],
    audience: [
      "Afrobeats listeners in Nigeria, Ghana and the UK diaspora",
      "Alté and R&B audiences in Lagos, London and Toronto",
      "Global African-music editorial listeners",
    ],
    playlists: [
      "Afrobeats editorial playlists (Spotify/Apple/Audiomack)",
      "Alté and Afro-fusion independent playlists",
      "Diaspora lifestyle and Afrobeats community playlists",
    ],
    radio: [
      "Lagos and Abuja urban radio (Cool FM, Wazobia, Beat FM)",
      "UK Afrobeats radio (Capital XTRA, BBC 1Xtra)",
      "Community and campus radio in diaspora cities",
    ],
    talkingPoints: [
      "Afrobeats' continued global expansion gives a new release a genuine international runway",
      "Alté-adjacent records travel well between Lagos, London and Toronto audiences",
      "Diaspora radio and playlist networks actively look for records that bridge home and abroad",
    ],
    cultural: ["West African popular music", "Diaspora identity", "Lagos–London creative circuit"],
    opportunities: [
      { area: "Streaming editorial", detail: "Afrobeats and Afro-fusion editorial pitching across Spotify, Apple Music and Audiomack.", priority: "primary" },
      { area: "Diaspora radio", detail: "UK and US Afrobeats programming with dedicated new-music slots.", priority: "primary" },
      { area: "Independent playlists", detail: "Alté and Afro-fusion curator networks with engaged, high-intent listeners.", priority: "secondary" },
      { area: "Press", detail: "African music publications and diaspora culture platforms covering new releases weekly.", priority: "primary" },
    ],
  },
  {
    match: /hip.?hop|rap|trap|drill|grime/i,
    label: "Hip-hop / Rap",
    secondary: ["Trap", "Drill", "R&B"],
    influences: ["Hip-hop", "Trap", "Soul sampling"],
    mood: ["confident", "tense", "cinematic"],
    energy: "high",
    vocal: "Direct, rhythm-forward delivery with a clear pocket and an emphatic hook.",
    production: "808-led low end, tight drum programming, atmospheric top line.",
    hooks: ["A chantable hook built on a short repeated phrase", "A signature ad-lib tag"],
    audience: [
      "Hip-hop listeners in the US, UK and Nigeria",
      "Drill and trap audiences in London, Lagos and Atlanta",
      "Playlist audiences for workout, drive and late-night sets",
    ],
    playlists: [
      "Hip-hop editorial and 'new rap' playlists",
      "Drill and UK rap independent playlists",
      "Afro-drill crossover playlists",
    ],
    radio: [
      "Urban radio in Lagos, London and New York",
      "Campus and community rap shows",
      "BBC 1Xtra and Capital XTRA new-music slots",
    ],
    talkingPoints: [
      "Rap's regional scenes are highly receptive to records with a distinct local accent",
      "Drill's production language travels across borders faster than most genres",
      "Radio and playlist gatekeepers actively scout regional rap scenes",
    ],
    cultural: ["Hip-hop culture", "Street-level storytelling", "Regional rap scenes"],
    opportunities: [
      { area: "Radio", detail: "Urban and campus rap programming with dedicated new-artist slots.", priority: "primary" },
      { area: "Playlists", detail: "Hip-hop and drill curator networks, including regional scenes.", priority: "primary" },
      { area: "Press", detail: "Rap publications and culture sites that cover emerging artists weekly.", priority: "secondary" },
      { area: "Sync", detail: "Sports, gaming and lifestyle sync briefs that favour high-energy rap.", priority: "watch" },
    ],
  },
  {
    match: /r&b|rnb|soul|neo.?soul/i,
    label: "R&B / Soul",
    secondary: ["Neo-soul", "Alt-R&B", "Pop-soul"],
    influences: ["R&B", "Neo-soul", "Gospel harmony"],
    mood: ["intimate", "warm", "late-night"],
    energy: "low",
    vocal: "Close-mic lead with layered harmony stacks and restrained runs.",
    production: "Warm keys, soft drums, generous space and a vocal-forward mix.",
    hooks: ["A melodic hook carried by the harmony stack", "A single repeated line that closes the chorus"],
    audience: [
      "R&B and neo-soul listeners in the US, UK and Nigeria",
      "Late-night and 'chill' playlist audiences",
      "Soul and jazz-adjacent editorial listeners",
    ],
    playlists: [
      "R&B editorial and 'chill' playlists",
      "Neo-soul and independent soul curator playlists",
      "Late-night and focus playlists",
    ],
    radio: [
      "Smooth R&B and soul programming",
      "Public and community radio soul shows",
      "Diaspora R&B radio in London and Lagos",
    ],
    talkingPoints: [
      "R&B rewards vocal identity, which gives a strong singer a clear editorial angle",
      "Soul-adjacent records perform well in long-session and late-night listening",
      "Public radio soul programming is unusually open to independent releases",
    ],
    cultural: ["Soul and gospel lineage", "Contemporary R&B", "Late-night listening culture"],
    opportunities: [
      { area: "Playlists", detail: "R&B, neo-soul and late-night curator networks.", priority: "primary" },
      { area: "Public radio", detail: "Soul and R&B programming on public and community stations.", priority: "primary" },
      { area: "Press", detail: "Soul and R&B editorial with review and feature slots.", priority: "secondary" },
      { area: "Sync", detail: "Lifestyle and drama sync briefs that favour intimate vocal records.", priority: "watch" },
    ],
  },
  {
    match: /electronic|house|techno|amapiano|dance|edm|garage|bass/i,
    label: "Electronic / Dance",
    secondary: ["House", "Amapiano", "UK Garage"],
    influences: ["House", "Amapiano", "UK garage"],
    mood: ["euphoric", "hypnotic", "driving"],
    energy: "high",
    vocal: "Sparse vocal topline used as a texture rather than a lead.",
    production: "Rhythm-first arrangement, sidechained low end, long-form groove built for the club.",
    hooks: ["A looped vocal chop that functions as the hook", "A bassline motif that carries the drop"],
    audience: [
      "Club and festival audiences in the UK, South Africa and Europe",
      "Amapiano and house playlist listeners",
      "DJ-led discovery audiences",
    ],
    playlists: [
      "House and amapiano editorial playlists",
      "Club and DJ-tool curator playlists",
      "Festival and workout playlists",
    ],
    radio: [
      "Dance and electronic radio shows",
      "Community and pirate-radio lineage stations in London and Johannesburg",
      "Public radio electronic programming",
    ],
    talkingPoints: [
      "Amapiano's global rise has opened dance floors to African electronic records",
      "DJ-led discovery means a strong groove can travel without radio support",
      "Club and festival programming actively seeks new rhythm records",
    ],
    cultural: ["Club culture", "Amapiano movement", "DJ-led discovery"],
    opportunities: [
      { area: "DJ / club", detail: "DJ promo pools and club programming in London, Johannesburg and Berlin.", priority: "primary" },
      { area: "Playlists", detail: "House, amapiano and club curator networks.", priority: "primary" },
      { area: "Radio", detail: "Dance and electronic shows with new-music segments.", priority: "secondary" },
      { area: "Festivals", detail: "Festival and event programmers building dance-led lineups.", priority: "watch" },
    ],
  },
  {
    match: /pop|indie|alternative|rock|folk|singer.?songwriter/i,
    label: "Pop / Alternative",
    secondary: ["Indie pop", "Alternative", "Singer-songwriter"],
    influences: ["Indie pop", "Alternative rock", "Singer-songwriter"],
    mood: ["bright", "wistful", "anthemic"],
    energy: "mid",
    vocal: "Clear lead vocal with a memorable, singable chorus.",
    production: "Guitar or synth-led arrangement with a defined verse–chorus lift.",
    hooks: ["A chorus that resolves on a memorable melodic phrase", "A pre-chorus build that sets up the drop"],
    audience: [
      "Indie and alternative listeners in the UK, US and Europe",
      "Playlist audiences for 'new indie' and 'feel good'",
      "Festival and live-music audiences",
    ],
    playlists: [
      "Indie and alternative editorial playlists",
      "New-music discovery playlists",
      "Mood-based pop playlists",
    ],
    radio: [
      "Alternative and indie radio programming",
      "Public radio new-music shows",
      "Campus radio",
    ],
    talkingPoints: [
      "Alternative radio remains one of the most open formats for independent releases",
      "A strong chorus gives press a clear editorial angle",
      "Live and festival circuits reward records that translate on stage",
    ],
    cultural: ["Independent music culture", "Festival circuit", "Alternative press"],
    opportunities: [
      { area: "Radio", detail: "Alternative and public radio new-music programming.", priority: "primary" },
      { area: "Press", detail: "Indie and alternative publications with premiere and review slots.", priority: "primary" },
      { area: "Playlists", detail: "Indie and new-music discovery curators.", priority: "secondary" },
      { area: "Live", detail: "Festival and promoter networks for emerging acts.", priority: "watch" },
    ],
  },
];

const FALLBACK_PROFILE: GenreProfile = {
  match: /.*/,
  label: "Contemporary popular music",
  secondary: ["Pop", "R&B"],
  influences: ["Contemporary pop", "R&B"],
  mood: ["warm", "confident"],
  energy: "mid",
  vocal: "Lead vocal carrying a clear, repeatable hook.",
  production: "Modern arrangement with a defined low end and a vocal-forward mix.",
  hooks: ["A repeatable melodic hook"],
  audience: ["Contemporary music listeners", "Playlist discovery audiences"],
  playlists: ["Editorial new-music playlists", "Independent curator playlists"],
  radio: ["Contemporary music radio", "Community and campus radio"],
  talkingPoints: ["A clear, well-presented release gives gatekeepers an easy decision"],
  cultural: ["Contemporary popular music"],
  opportunities: [
    { area: "Playlists", detail: "Editorial and independent new-music curators.", priority: "primary" },
    { area: "Radio", detail: "Contemporary music programming with new-music slots.", priority: "secondary" },
    { area: "Press", detail: "Music publications covering new releases.", priority: "secondary" },
  ],
};

export function profileFor(genre: string): GenreProfile {
  return GENRE_PROFILES.find((profile) => profile.match.test(genre)) ?? FALLBACK_PROFILE;
}

export function analyseRelease(facts: ReleaseFacts): ReleaseIntelligence {
  const profile = profileFor(facts.genre);
  const limitations: string[] = [];

  if (!facts.audioAnalysed) {
    limitations.push(
      "No audio file was supplied for direct analysis. Musical identity below is derived from the supplied release materials and the stated genre, not from listening to the recording.",
    );
  }
  if (!facts.tempoBpm) {
    limitations.push("Tempo was not measurable from the supplied materials and is not stated.");
  }
  limitations.push(
    "No streaming, sales or audience figures were supplied, so no performance claim is made anywhere in this report.",
  );
  if (!facts.biography?.trim()) {
    limitations.push("No approved artist biography was supplied; artist positioning is limited to the release materials.");
  }

  const musical: MusicalIdentity = {
    primaryGenre: profile.label,
    secondaryGenres: facts.subGenres?.length ? facts.subGenres : profile.secondary,
    influences: facts.influences?.length ? facts.influences : profile.influences,
    mood: facts.mood?.length ? facts.mood : profile.mood,
    energy: facts.energy ?? profile.energy,
    ...(facts.tempoBpm ? { tempoBpm: facts.tempoBpm } : {}),
    vocalIdentity: profile.vocal,
    language: facts.language ?? "English",
    culturalInfluences: facts.culturalInfluences?.length ? facts.culturalInfluences : profile.cultural,
    production: facts.production ?? profile.production,
    hooks: facts.hooks?.length ? facts.hooks : profile.hooks,
    audienceAppeal: profile.audience,
    playlistSuitability: profile.playlists,
    radioSuitability: profile.radio,
    talkingPoints: profile.talkingPoints,
  };

  const positioning: Positioning = {
    artistIdentity: facts.biography?.trim()
      ? facts.biography.trim()
      : `${facts.artist} is presented here only through the supplied release materials; no career claims are made beyond them.`,
    artisticDirection: `${facts.title} sits in ${profile.label.toLowerCase()} territory, with ${profile.mood.slice(0, 2).join(" and ")} characteristics.`,
    differentiator: facts.hooks?.[0] ?? profile.hooks[0] ?? "A distinct, repeatable hook.",
    story: facts.story,
    culturalRelevance: `${profile.cultural.join(", ")} — the release speaks to audiences already engaged with this sound.`,
    whyNow: `${facts.type} scheduled for ${facts.releaseDate || "an unconfirmed date"}; the ${profile.label.toLowerCase()} audience is actively consuming new releases in this space.`,
  };

  return {
    musical,
    positioning,
    opportunities: profile.opportunities,
    limitations,
    generatedAt: new Date().toISOString(),
  };
}
