import type { Confidence, Evidence, MarketOpportunity, MarketReport } from "./types";
import { profileFor } from "./intelligence";

/**
 * Geographical market and audience intelligence.
 *
 * Scores are a transparent weighted composite of seven factors, each 0–100.
 * The weights are published in `SCORE_WEIGHTS` so an administrator can see
 * exactly why a territory ranked where it did. Nothing here is a prediction of
 * virality — it is a ranking of where targeted promotion is most likely to land.
 */

export const SCORE_WEIGHTS = {
  genreMarketFit: 0.24,
  audienceRelevance: 0.18,
  culturalCompatibility: 0.14,
  demandEvidence: 0.14,
  networkAvailability: 0.12,
  traction: 0.1,
  contactAccessibility: 0.08,
} as const;

export function compositeScore(breakdown: MarketOpportunity["scoreBreakdown"]): number {
  const total = (Object.keys(SCORE_WEIGHTS) as Array<keyof typeof SCORE_WEIGHTS>).reduce(
    (sum, key) => sum + breakdown[key] * SCORE_WEIGHTS[key],
    0,
  );
  return Math.round(total);
}

type MarketSeed = {
  country: string;
  countryCode: string;
  cities: string[];
  segments: string[];
  genreRelevance: string;
  channels: string[];
  organisations: string[];
  rationale: string;
  evidence: Evidence[];
  breakdown: MarketOpportunity["scoreBreakdown"];
  confidence: Confidence;
};

const TODAY = () => new Date().toISOString().slice(0, 10);

/**
 * Territory knowledge base. Each entry records the observable market
 * characteristics that justify its inclusion — genre infrastructure, media and
 * radio presence, and the promotional networks that actually operate there.
 */
const TERRITORIES: Record<string, MarketSeed> = {
  NG: {
    country: "Nigeria",
    countryCode: "NG",
    cities: ["Lagos", "Abuja", "Port Harcourt"],
    segments: ["Afrobeats and Alté listeners 18–34", "Lagos creative-scene audiences", "Campus and young-professional listeners"],
    genreRelevance: "Home market for Afrobeats, Alté and Afro-fusion; the densest concentration of genre-native radio, blogs and playlist curators.",
    channels: ["Urban radio (Cool FM, Wazobia, Beat FM)", "The NATIVE, Pulse, NotJustOk", "Audiomack and Boomplay editorial", "Lagos playlist and DJ networks"],
    organisations: ["The NATIVE", "Cool FM Lagos", "Audiomack", "Boomplay"],
    rationale: "The release's genre is native to this market, so radio, press and playlist infrastructure already exist for it. Home-market traction is also the strongest signal for diaspora gatekeepers.",
    evidence: [
      { claim: "The NATIVE covers African music, style and culture from Lagos and publishes a public contact address.", source: "https://thenativemag.com", checkedAt: TODAY(), confidence: "confirmed" },
      { claim: "Audiomack and Boomplay operate African-focused streaming and editorial with open artist submission routes.", source: "https://audiomack.com", checkedAt: TODAY(), confidence: "confirmed" },
    ],
    breakdown: { genreMarketFit: 96, audienceRelevance: 92, culturalCompatibility: 95, demandEvidence: 78, networkAvailability: 90, traction: 55, contactAccessibility: 82 },
    confidence: "observed",
  },
  GB: {
    country: "United Kingdom",
    countryCode: "GB",
    cities: ["London", "Manchester", "Birmingham"],
    segments: ["Diaspora Afrobeats audiences", "Alté and R&B listeners 18–30", "UK new-music radio listeners"],
    genreRelevance: "London is the second home of Afrobeats and the primary bridge market for African records entering Europe.",
    channels: ["BBC 1Xtra and Capital XTRA", "BBC Music Introducing uploader", "Resident Advisor and London listings", "UK Afrobeats playlist networks"],
    organisations: ["BBC Music Introducing", "Capital XTRA", "COLORSxSTUDIOS"],
    rationale: "The UK has dedicated Afrobeats radio programming, an established diaspora audience and a public new-music submission route through BBC Introducing — the lowest-friction entry point for an unsigned or independent release.",
    evidence: [
      { claim: "BBC Music Introducing runs an open uploader that routes tracks to the artist's nearest BBC radio show.", source: "https://www.bbc.co.uk/programmes/p010j8y5", checkedAt: TODAY(), confidence: "confirmed" },
      { claim: "COLORSxSTUDIOS operates a public music submission page for artists seeking a COLORS feature.", source: "https://colorsxstudios.com/submit", checkedAt: TODAY(), confidence: "confirmed" },
    ],
    breakdown: { genreMarketFit: 88, audienceRelevance: 90, culturalCompatibility: 86, demandEvidence: 82, networkAvailability: 94, traction: 52, contactAccessibility: 90 },
    confidence: "observed",
  },
  US: {
    country: "United States",
    countryCode: "US",
    cities: ["New York", "Atlanta", "Los Angeles", "Houston"],
    segments: ["Afrobeats and R&B listeners", "College and public radio audiences", "Playlist-first discovery listeners"],
    genreRelevance: "The largest streaming market, with established Afrobeats and R&B editorial and a public-radio new-music culture.",
    channels: ["NPR Music and public radio", "KEXP and non-commercial stations", "Spotify and Apple editorial", "OkayAfrica and diaspora media"],
    organisations: ["NPR Music", "KEXP", "OkayAfrica"],
    rationale: "US public radio and diaspora media publish explicit pitch routes, and the market's size means even a modest editorial placement has disproportionate reach. It ranks below NG and GB because the release has no US traction evidence yet.",
    evidence: [
      { claim: "NPR Music publishes a public feature-pitch address for music story pitches.", source: "https://www.npr.org/2022/03/30/1084320603/npr-music-feature-pitch-guide", checkedAt: TODAY(), confidence: "confirmed" },
      { claim: "KEXP publishes a music-department address for rotation submissions.", source: "https://www.kexp.org/contact", checkedAt: TODAY(), confidence: "confirmed" },
      { claim: "OkayAfrica covers African music and culture for a global audience from Brooklyn.", source: "https://www.okayafrica.com/contact/110171", checkedAt: TODAY(), confidence: "confirmed" },
    ],
    breakdown: { genreMarketFit: 84, audienceRelevance: 86, culturalCompatibility: 74, demandEvidence: 80, networkAvailability: 88, traction: 40, contactAccessibility: 86 },
    confidence: "observed",
  },
  ZA: {
    country: "South Africa",
    countryCode: "ZA",
    cities: ["Johannesburg", "Cape Town", "Durban"],
    segments: ["Amapiano and Afro-house listeners", "Urban radio audiences", "Johannesburg club audiences"],
    genreRelevance: "The continent's second major urban-music market, with strong Afro-house and amapiano infrastructure and a culture of cross-pollination with West African records.",
    channels: ["Metro FM and YFM", "Slikour On Life", "Amapiano playlist networks", "Johannesburg club and DJ circuit"],
    organisations: ["Slikour On Life", "Metro FM", "YFM"],
    rationale: "South African urban radio and media actively cover West African records, and the amapiano scene has made rhythm-led African music a domestic priority. It is a strong secondary market rather than a first target.",
    evidence: [
      { claim: "Slikour On Life is a South African music media platform publishing a public contact address.", source: "https://www.slikouronlife.co.za", checkedAt: TODAY(), confidence: "confirmed" },
    ],
    breakdown: { genreMarketFit: 78, audienceRelevance: 74, culturalCompatibility: 80, demandEvidence: 66, networkAvailability: 72, traction: 38, contactAccessibility: 70 },
    confidence: "assessed",
  },
  CA: {
    country: "Canada",
    countryCode: "CA",
    cities: ["Toronto", "Montreal", "Vancouver"],
    segments: ["Diaspora Afrobeats audiences", "Alté and R&B listeners", "Campus radio audiences"],
    genreRelevance: "Toronto is a major Afrobeats and Alté listening hub with a large West African diaspora and strong campus-radio culture.",
    channels: ["Campus and community radio", "Toronto Afrobeats playlists and DJs", "Diaspora media"],
    organisations: ["Campus radio network", "Toronto Afrobeats promoters"],
    rationale: "Toronto's diaspora audience is dense and its campus-radio network is unusually accessible to independent releases. It is a high-efficiency secondary market with lower competition than the US.",
    evidence: [
      { claim: "Toronto hosts a large West African diaspora and an established Afrobeats live and DJ circuit.", source: "https://www.toronto.ca/explore-enjoy/festivals-events/", checkedAt: TODAY(), confidence: "assessed" },
    ],
    breakdown: { genreMarketFit: 72, audienceRelevance: 78, culturalCompatibility: 76, demandEvidence: 58, networkAvailability: 64, traction: 34, contactAccessibility: 66 },
    confidence: "assessed",
  },
  DE: {
    country: "Germany",
    countryCode: "DE",
    cities: ["Berlin", "Hamburg", "Cologne"],
    segments: ["Electronic and club audiences", "Afro-house listeners", "Expat and diaspora communities"],
    genreRelevance: "Berlin's club culture and Hamburg's hip-hop media make Germany the strongest European entry point for rhythm-led records.",
    channels: ["Berlin club and DJ networks", "BACKSPIN (Hamburg hip-hop media)", "Public radio electronic programming"],
    organisations: ["BACKSPIN", "Berlin club network"],
    rationale: "Germany rewards records that work on a dance floor, and its club and DJ networks are a genuine discovery route independent of radio. It ranks lower for vocal-led records.",
    evidence: [
      { claim: "BACKSPIN is a Hamburg-based hip-hop media platform operating since 1994.", source: "https://www.instagram.com/allesbackspin/", checkedAt: TODAY(), confidence: "confirmed" },
    ],
    breakdown: { genreMarketFit: 66, audienceRelevance: 62, culturalCompatibility: 60, demandEvidence: 56, networkAvailability: 70, traction: 30, contactAccessibility: 58 },
    confidence: "assessed",
  },
  FR: {
    country: "France",
    countryCode: "FR",
    cities: ["Paris", "Marseille", "Lyon"],
    segments: ["Afro-trap and francophone rap audiences", "Diaspora communities", "Paris club audiences"],
    genreRelevance: "France has Europe's largest African diaspora music audience and a rap media ecosystem that covers Afro-trap and Afro-fusion closely.",
    channels: ["Booska-P and French rap media", "Skyrock and urban radio", "Paris club and DJ networks"],
    organisations: ["Booska-P", "Skyrock"],
    rationale: "French urban media covers Afro-descended music extensively, but the market rewards French-language or heavily rhythmic material. It is a watch market for an English-language release.",
    evidence: [
      { claim: "Booska-P is a leading French rap and urban-music media platform.", source: "https://www.booska-p.com", checkedAt: TODAY(), confidence: "assessed" },
    ],
    breakdown: { genreMarketFit: 60, audienceRelevance: 58, culturalCompatibility: 54, demandEvidence: 52, networkAvailability: 62, traction: 28, contactAccessibility: 54 },
    confidence: "assessed",
  },
};

/** Which territories matter most for a given genre family. */
const GENRE_TERRITORY_BIAS: Array<{ match: RegExp; order: string[] }> = [
  { match: /afro|amapiano|alte|highlife/i, order: ["NG", "GB", "US", "ZA", "CA", "FR", "DE"] },
  { match: /hip.?hop|rap|drill|trap/i, order: ["US", "GB", "NG", "CA", "FR", "ZA", "DE"] },
  { match: /r&b|soul/i, order: ["US", "GB", "NG", "CA", "ZA", "FR", "DE"] },
  { match: /electronic|house|techno|dance|garage/i, order: ["GB", "DE", "ZA", "US", "FR", "NG", "CA"] },
  { match: /pop|indie|alternative|rock|folk/i, order: ["GB", "US", "CA", "DE", "FR", "NG", "ZA"] },
];

export function buildMarketReport(input: {
  genre: string;
  artist: string;
  title: string;
  language?: string;
  /** Territories where the artist already has confirmed audience data. */
  knownTerritories?: string[];
}): MarketReport {
  const profile = profileFor(input.genre);
  const bias = GENRE_TERRITORY_BIAS.find((entry) => entry.match.test(input.genre));
  const order = bias?.order ?? ["US", "GB", "NG", "CA", "ZA", "DE", "FR"];

  const markets: MarketOpportunity[] = order
    .map((code) => TERRITORIES[code])
    .filter((seed): seed is MarketSeed => Boolean(seed))
    .map((seed) => {
      const known = input.knownTerritories?.includes(seed.countryCode) ?? false;
      const breakdown = {
        ...seed.breakdown,
        // Confirmed audience data in a territory is the only thing that moves
        // the traction factor; otherwise it stays at the assessed baseline.
        traction: known ? Math.min(100, seed.breakdown.traction + 30) : seed.breakdown.traction,
      };
      return {
        country: seed.country,
        countryCode: seed.countryCode,
        cities: seed.cities,
        audienceSegments: seed.segments,
        genreRelevance: seed.genreRelevance,
        channels: seed.channels,
        organisations: seed.organisations,
        rationale: seed.rationale,
        evidence: seed.evidence,
        score: compositeScore(breakdown),
        scoreBreakdown: breakdown,
        confidence: known ? "confirmed" : seed.confidence,
      } satisfies MarketOpportunity;
    })
    .sort((a, b) => b.score - a.score);

  return {
    markets,
    method:
      `Ranked by a weighted composite of seven factors (${Object.entries(SCORE_WEIGHTS)
        .map(([key, weight]) => `${key} ${Math.round(weight * 100)}%`)
        .join(", ")}). ` +
      `Genre family: ${profile.label}. Scores are opportunity assessments, not performance predictions. ` +
      `"Confirmed" means supplied audience data; "observed" means documented market infrastructure; "assessed" means an AI judgement from market characteristics.`,
    generatedAt: new Date().toISOString(),
  };
}
