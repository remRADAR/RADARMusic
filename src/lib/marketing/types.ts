/**
 * RADARMarketing Mail Agent — domain model.
 *
 * One campaign record is the single source of truth for a release campaign.
 * Every stage of the agent (intake → intelligence → markets → contacts →
 * pitch → approval → monitor) reads and writes this same record, so research
 * is never lost when the administrator moves between stages.
 */

export type Confidence = "confirmed" | "observed" | "assessed";

export type Evidence = {
  /** What the claim is. */
  claim: string;
  /** Where it came from — a real URL or a named supplied asset. */
  source: string;
  /** ISO date the source was checked. */
  checkedAt: string;
  confidence: Confidence;
};

/* ------------------------------------------------------------------ intake */

export type IntakeAssetKind =
  | "press-release"
  | "artwork"
  | "artist-photo"
  | "video"
  | "audio"
  | "streaming-link"
  | "biography"
  | "lyrics"
  | "campaign-info"
  | "other";

export type IntakeAsset = {
  id: string;
  name: string;
  kind: IntakeAssetKind;
  /** Present when the asset is a link we can open. */
  url?: string;
  /** True when the asset was actually reachable when catalogued. */
  reachable: boolean;
  note?: string;
};

export type IntakeGap = {
  field: string;
  severity: "blocking" | "important" | "nice-to-have";
  detail: string;
};

export type IntakeResult = {
  /** The authorised folder / file link supplied by the administrator. */
  sourceLink: string;
  provider: "google-drive" | "dropbox" | "onedrive" | "direct-link" | "unsupported";
  /** Whether the link passed structural validation. */
  linkValid: boolean;
  linkError?: string;
  assets: IntakeAsset[];
  gaps: IntakeGap[];
  cataloguedAt: string;
};

/* ------------------------------------------------------- release intelligence */

export type MusicalIdentity = {
  primaryGenre: string;
  secondaryGenres: string[];
  influences: string[];
  mood: string[];
  energy: "low" | "mid" | "high";
  tempoBpm?: number;
  vocalIdentity: string;
  language: string;
  culturalInfluences: string[];
  production: string;
  hooks: string[];
  audienceAppeal: string[];
  playlistSuitability: string[];
  radioSuitability: string[];
  talkingPoints: string[];
};

export type Positioning = {
  artistIdentity: string;
  artisticDirection: string;
  differentiator: string;
  story: string;
  culturalRelevance: string;
  whyNow: string;
};

export type OpportunityArea = {
  area: string;
  detail: string;
  priority: "primary" | "secondary" | "watch";
};

export type ReleaseIntelligence = {
  musical: MusicalIdentity;
  positioning: Positioning;
  opportunities: OpportunityArea[];
  /** Explicit statement of what could not be analysed. */
  limitations: string[];
  generatedAt: string;
};

/* ------------------------------------------------------------ market intel */

export type MarketOpportunity = {
  country: string;
  countryCode: string;
  cities: string[];
  audienceSegments: string[];
  genreRelevance: string;
  channels: string[];
  organisations: string[];
  rationale: string;
  evidence: Evidence[];
  /** 0–100 transparent composite score. */
  score: number;
  scoreBreakdown: {
    genreMarketFit: number;
    audienceRelevance: number;
    culturalCompatibility: number;
    demandEvidence: number;
    networkAvailability: number;
    traction: number;
    contactAccessibility: number;
  };
  confidence: Confidence;
};

export type MarketReport = {
  markets: MarketOpportunity[];
  method: string;
  generatedAt: string;
};

/* --------------------------------------------------------------- contacts */

export type ContactCategory =
  | "radio"
  | "playlist"
  | "publication"
  | "label-ar"
  | "promotion"
  | "brand"
  | "creator"
  | "festival"
  | "sync";

export type Contact = {
  id: string;
  organisation: string;
  person?: string;
  role: string;
  category: ContactCategory;
  country: string;
  countryCode: string;
  genres: string[];
  website: string;
  /** Only ever a publicly published professional address. */
  email?: string;
  /** Official submission / contact form when no verified email exists. */
  submissionUrl?: string;
  /** Where the contact detail was found. */
  source: string;
  checkedAt: string;
  /** 0–100 relevance to this specific release. */
  relevance: number;
  relevanceReason: string;
  /** How the address was established. */
  emailStatus: "verified-public" | "form-only" | "unverified";
  confidence: Confidence;
};

/* ------------------------------------------------------------------ pitch */

export type PitchVariant = {
  contactId: string;
  subject: string;
  /** Recipient-specific body paragraphs (plain text). */
  body: string;
  /** The single reason this recipient was chosen. */
  rationale: string;
  html: string;
  plainText: string;
  generatedAt: string;
};

/* --------------------------------------------------------------- campaign */

export type CampaignStatus =
  | "intake"
  | "intelligence"
  | "markets"
  | "contacts"
  | "pitch"
  | "approval"
  | "approved"
  | "sent"
  | "monitoring";

export type EmailDraft = {
  id: string;
  contactId: string;
  to: string;
  subject: string;
  html: string;
  plainText: string;
  bcc: string[];
  status: "draft" | "approved" | "queued" | "sent" | "failed" | "skipped";
  /** Populated only from a real provider response. */
  providerMessageId?: string;
  sentAt?: string;
  error?: string;
};

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export type Campaign = {
  id: string;
  name: string;
  artist: string;
  releaseTitle: string;
  releaseDate: string;
  genre: string;
  sourceFolder: string;
  status: CampaignStatus;
  intake?: IntakeResult;
  intelligence?: ReleaseIntelligence;
  markets?: MarketReport;
  contacts: Contact[];
  pitches: PitchVariant[];
  drafts: EmailDraft[];
  /** Mandatory internal monitoring addresses — never optional. */
  bcc: string[];
  approvedAt?: string;
  approvedBy?: string;
  audit: AuditEntry[];
  createdAt: string;
  updatedAt: string;
};

export const MANDATORY_BCC = ["music@radarcharts.net", "submissions@radarcharts.net"] as const;
