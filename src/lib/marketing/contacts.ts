import type { Contact, ContactCategory, Confidence } from "./types";

/**
 * Music-industry contact discovery.
 *
 * Every entry below is a real organisation with a publicly published
 * professional contact route. Addresses are only recorded where the
 * organisation itself publishes them; where no address is published the
 * official submission page is recorded instead and `emailStatus` is
 * "form-only". Nothing is guessed, scraped from private sources, or invented.
 */

type ContactSeed = Omit<Contact, "relevance" | "relevanceReason" | "checkedAt"> & {
  /** Genre families this organisation actually works with. */
  genreFamilies: RegExp;
  /** Territories this organisation serves. */
  territories: string[];
};

const CHECKED = "2026-11-27";

const SEEDS: ContactSeed[] = [
  {
    id: "bbc-introducing",
    organisation: "BBC Music Introducing",
    role: "Uploader / new-music programming",
    category: "radio",
    country: "United Kingdom",
    countryCode: "GB",
    genres: ["All genres", "Alternative", "Pop", "Electronic"],
    website: "https://www.bbc.co.uk/programmes/p010j8y5",
    submissionUrl: "https://www.bbc.co.uk/programmes/p010j8y5",
    source: "https://www.bbc.co.uk/programmes/p010j8y5",
    emailStatus: "form-only",
    confidence: "confirmed",
    genreFamilies: /.*/,
    territories: ["GB"],
  },
  {
    id: "kexp",
    organisation: "KEXP 90.3 FM",
    person: "Music Department",
    role: "Music Director / rotation submissions",
    category: "radio",
    country: "United States",
    countryCode: "US",
    genres: ["Alternative", "Indie", "Electronic", "R&B"],
    website: "https://www.kexp.org",
    email: "md@kexp.org",
    submissionUrl: "https://www.kexp.org/contact",
    source: "https://www.kexp.org/contact",
    emailStatus: "verified-public",
    confidence: "confirmed",
    genreFamilies: /pop|indie|alternative|rock|electronic|r&b|soul/i,
    territories: ["US"],
  },
  {
    id: "npr-music",
    organisation: "NPR Music",
    role: "Feature pitches / editorial",
    category: "publication",
    country: "United States",
    countryCode: "US",
    genres: ["All genres"],
    website: "https://www.npr.org/music",
    email: "nprmusicpitches@npr.org",
    submissionUrl: "https://www.npr.org/2022/03/30/1084320603/npr-music-feature-pitch-guide",
    source: "https://www.npr.org/2022/03/30/1084320603/npr-music-feature-pitch-guide",
    emailStatus: "verified-public",
    confidence: "confirmed",
    genreFamilies: /.*/,
    territories: ["US"],
  },
  {
    id: "the-native",
    organisation: "The NATIVE",
    role: "Editorial — African music, style and culture",
    category: "publication",
    country: "Nigeria",
    countryCode: "NG",
    genres: ["Afrobeats", "Alté", "Hip-hop", "R&B"],
    website: "https://thenativemag.com",
    email: "contact@thenativemag.com",
    submissionUrl: "https://thenativemag.com",
    source: "https://thenativemag.com",
    emailStatus: "verified-public",
    confidence: "confirmed",
    genreFamilies: /afro|alte|hip.?hop|rap|r&b|soul/i,
    territories: ["NG"],
  },
  {
    id: "okayafrica",
    organisation: "OkayAfrica",
    role: "Editorial — African music and culture",
    category: "publication",
    country: "United States",
    countryCode: "US",
    genres: ["Afrobeats", "Amapiano", "Afro-house", "Hip-hop"],
    website: "https://www.okayafrica.com",
    email: "info@okayafrica.com",
    submissionUrl: "https://www.okayafrica.com/contact/110171",
    source: "https://www.okayafrica.com/contact/110171",
    emailStatus: "verified-public",
    confidence: "confirmed",
    genreFamilies: /afro|amapiano|alte|hip.?hop/i,
    territories: ["US", "NG", "ZA"],
  },
  {
    id: "colorsxstudios",
    organisation: "COLORSxSTUDIOS",
    role: "Artist submissions — COLORS show and platform",
    category: "creator",
    country: "Germany",
    countryCode: "DE",
    genres: ["Soul", "R&B", "Afrobeats", "Alternative"],
    website: "https://colorsxstudios.com",
    submissionUrl: "https://colorsxstudios.com/submit",
    source: "https://colorsxstudios.com/submit",
    emailStatus: "form-only",
    confidence: "confirmed",
    genreFamilies: /r&b|soul|afro|alte|pop|indie|alternative/i,
    territories: ["DE", "GB", "US"],
  },
  {
    id: "slikour-on-life",
    organisation: "Slikour On Life",
    role: "Editorial — South African music and hip-hop",
    category: "publication",
    country: "South Africa",
    countryCode: "ZA",
    genres: ["Hip-hop", "Amapiano", "Afro-house"],
    website: "https://www.slikouronlife.co.za",
    email: "contact@onlife.co.za",
    submissionUrl: "https://www.slikouronlife.co.za",
    source: "https://www.slikouronlife.co.za",
    emailStatus: "verified-public",
    confidence: "confirmed",
    genreFamilies: /hip.?hop|rap|amapiano|afro|electronic|house/i,
    territories: ["ZA"],
  },
  {
    id: "backspin",
    organisation: "BACKSPIN",
    role: "Hip-hop media — Hamburg",
    category: "publication",
    country: "Germany",
    countryCode: "DE",
    genres: ["Hip-hop", "Rap"],
    website: "https://www.instagram.com/allesbackspin/",
    submissionUrl: "https://www.instagram.com/allesbackspin/",
    source: "https://www.instagram.com/allesbackspin/",
    emailStatus: "form-only",
    confidence: "confirmed",
    genreFamilies: /hip.?hop|rap|drill|trap/i,
    territories: ["DE"],
  },
  {
    id: "booska-p",
    organisation: "Booska-P",
    role: "Urban music media — Paris",
    category: "publication",
    country: "France",
    countryCode: "FR",
    genres: ["Rap", "Afro-trap", "Afro-fusion"],
    website: "https://www.booska-p.com",
    submissionUrl: "https://www.booska-p.com",
    source: "https://www.booska-p.com",
    emailStatus: "form-only",
    confidence: "assessed",
    genreFamilies: /hip.?hop|rap|afro|drill|trap/i,
    territories: ["FR"],
  },
  {
    id: "audiomack",
    organisation: "Audiomack",
    role: "Streaming platform — African editorial and artist uploads",
    category: "playlist",
    country: "Nigeria",
    countryCode: "NG",
    genres: ["Afrobeats", "Afro-fusion", "Hip-hop"],
    website: "https://audiomack.com",
    submissionUrl: "https://audiomack.com/upload",
    source: "https://audiomack.com",
    emailStatus: "form-only",
    confidence: "confirmed",
    genreFamilies: /afro|alte|hip.?hop|rap/i,
    territories: ["NG", "US", "GB"],
  },
  {
    id: "boomplay",
    organisation: "Boomplay",
    role: "Streaming platform — African editorial",
    category: "playlist",
    country: "Nigeria",
    countryCode: "NG",
    genres: ["Afrobeats", "Afro-fusion", "Gospel", "Hip-hop"],
    website: "https://www.boomplay.com",
    submissionUrl: "https://www.boomplay.com",
    source: "https://www.boomplay.com",
    emailStatus: "form-only",
    confidence: "confirmed",
    genreFamilies: /afro|alte|hip.?hop|rap|gospel/i,
    territories: ["NG", "ZA"],
  },
];

const CATEGORY_WEIGHT: Record<ContactCategory, number> = {
  radio: 1,
  playlist: 0.95,
  publication: 0.9,
  "label-ar": 0.85,
  promotion: 0.8,
  creator: 0.8,
  brand: 0.6,
  festival: 0.6,
  sync: 0.55,
};

/**
 * Score a contact against a specific release.
 *
 * Relevance is a weighted blend of genre compatibility, territory match,
 * category fit and how reliable the contact route is. It is deliberately
 * explainable: the reason string names the factors that produced the number.
 */
export function scoreContact(
  seed: ContactSeed,
  input: { genre: string; territories: string[] },
): { relevance: number; reason: string } {
  const genreMatch = seed.genreFamilies.test(input.genre) ? 100 : 35;
  const territoryMatch = seed.territories.some((code) => input.territories.includes(code)) ? 100 : 30;
  const categoryFit = Math.round(CATEGORY_WEIGHT[seed.category] * 100);
  const routeReliability = seed.emailStatus === "verified-public" ? 100 : seed.emailStatus === "form-only" ? 70 : 40;

  const relevance = Math.round(
    genreMatch * 0.4 + territoryMatch * 0.3 + categoryFit * 0.18 + routeReliability * 0.12,
  );

  const reasons: string[] = [];
  reasons.push(
    genreMatch === 100
      ? `works directly in ${seed.genres.slice(0, 2).join(" / ")}`
      : `covers music broadly but is not genre-specialist for this release`,
  );
  reasons.push(
    territoryMatch === 100
      ? `operates in a recommended territory (${seed.country})`
      : `sits outside the top recommended territories (${seed.country})`,
  );
  reasons.push(
    seed.emailStatus === "verified-public"
      ? "publishes a verified professional address"
      : "accepts submissions through an official form",
  );

  return { relevance, reason: reasons.join("; ") + "." };
}

export function discoverContacts(input: {
  genre: string;
  territories: string[];
  /** Restrict to these categories when the administrator wants a narrower run. */
  categories?: ContactCategory[];
}): Contact[] {
  return SEEDS.filter((seed) => !input.categories || input.categories.includes(seed.category))
    .map((seed) => {
      const { relevance, reason } = scoreContact(seed, input);
      const { genreFamilies: _g, territories: _t, ...rest } = seed;
      return {
        ...rest,
        checkedAt: CHECKED,
        relevance,
        relevanceReason: reason,
      } satisfies Contact;
    })
    .sort((a, b) => b.relevance - a.relevance);
}

/** De-duplicate by organisation + address so a campaign never mails twice. */
export function dedupeContacts(contacts: Contact[]): Contact[] {
  const seen = new Set<string>();
  return contacts.filter((contact) => {
    const key = `${contact.organisation.toLowerCase()}|${(contact.email ?? contact.submissionUrl ?? "").toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function contactConfidenceLabel(contact: Contact): string {
  const map: Record<Confidence, string> = {
    confirmed: "Confirmed — published by the organisation",
    observed: "Observed — documented market presence",
    assessed: "Assessed — AI judgement",
  };
  return map[contact.confidence];
}
