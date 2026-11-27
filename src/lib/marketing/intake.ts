import type { IntakeAsset, IntakeAssetKind, IntakeGap, IntakeResult } from "./types";

/**
 * Release intake.
 *
 * The supplied folder is the campaign's source of truth. This module validates
 * the link structurally, catalogues the assets the administrator declares, and
 * records every gap rather than inventing the missing information.
 */

const DRIVE_HOSTS = ["drive.google.com", "docs.google.com"];
const DROPBOX_HOSTS = ["dropbox.com", "www.dropbox.com", "dl.dropboxusercontent.com"];
const ONEDRIVE_HOSTS = ["1drv.ms", "onedrive.live.com"];

export function classifyLink(raw: string): {
  provider: IntakeResult["provider"];
  valid: boolean;
  error?: string;
} {
  const value = raw.trim();
  if (!value) return { provider: "unsupported", valid: false, error: "No link supplied." };
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { provider: "unsupported", valid: false, error: "That is not a valid URL." };
  }
  if (url.protocol !== "https:") {
    return { provider: "unsupported", valid: false, error: "Only https:// links are accepted." };
  }
  const host = url.hostname.toLowerCase();
  if (DRIVE_HOSTS.includes(host)) {
    // A Drive folder id lives in /folders/<id>; a file id in /d/<id> or ?id=<id>.
    const hasId = /\/folders\/[\w-]{10,}/.test(url.pathname) || /\/d\/[\w-]{10,}/.test(url.pathname) || url.searchParams.has("id");
    if (!hasId) {
      return {
        provider: "google-drive",
        valid: false,
        error: "This looks like a Google Drive link but carries no folder or file id.",
      };
    }
    return { provider: "google-drive", valid: true };
  }
  if (DROPBOX_HOSTS.includes(host)) return { provider: "dropbox", valid: true };
  if (ONEDRIVE_HOSTS.includes(host)) return { provider: "onedrive", valid: true };
  return { provider: "direct-link", valid: true };
}

export const ASSET_KINDS: Array<{ kind: IntakeAssetKind; label: string; hint: string }> = [
  { kind: "press-release", label: "Official press release", hint: "PDF or doc with the release narrative" },
  { kind: "artwork", label: "Cover artwork", hint: "Square, 3000×3000 preferred" },
  { kind: "artist-photo", label: "Artist / promotional photo", hint: "Press-ready imagery" },
  { kind: "video", label: "Music video / visualiser", hint: "YouTube or Vimeo link" },
  { kind: "audio", label: "Audio file or stream", hint: "WAV, MP3 or authorised stream" },
  { kind: "streaming-link", label: "Streaming link", hint: "Spotify, Apple Music, Audiomack…" },
  { kind: "biography", label: "Artist biography", hint: "Approved bio copy" },
  { kind: "lyrics", label: "Lyrics", hint: "Where available" },
  { kind: "campaign-info", label: "Release date & campaign info", hint: "Date, territory plan, goals" },
  { kind: "other", label: "Other promotional material", hint: "Anything else supplied" },
];

export function buildIntake(input: {
  sourceLink: string;
  assets: Array<{ name: string; kind: IntakeAssetKind; url?: string; reachable?: boolean; note?: string }>;
  releaseDate?: string;
  biography?: string;
  streamingLinks?: string[];
}): IntakeResult {
  const link = classifyLink(input.sourceLink);
  const assets: IntakeAsset[] = input.assets.map((asset, index) => ({
    id: `asset-${index + 1}`,
    name: asset.name,
    kind: asset.kind,
    ...(asset.url ? { url: asset.url } : {}),
    reachable: asset.reachable ?? Boolean(asset.url),
    ...(asset.note ? { note: asset.note } : {}),
  }));

  const has = (kind: IntakeAssetKind) => assets.some((asset) => asset.kind === kind);
  const gaps: IntakeGap[] = [];

  if (!link.valid) {
    gaps.push({
      field: "Source folder",
      severity: "blocking",
      detail: link.error ?? "The supplied link could not be validated.",
    });
  }
  if (!has("press-release")) {
    gaps.push({
      field: "Press release",
      severity: "important",
      detail: "No press release supplied — the release narrative will be built from the remaining assets only.",
    });
  }
  if (!has("artwork")) {
    gaps.push({
      field: "Cover artwork",
      severity: "important",
      detail: "No artwork supplied — the branded email will render without release artwork.",
    });
  }
  if (!has("streaming-link") && !(input.streamingLinks?.length ?? 0)) {
    gaps.push({
      field: "Streaming link",
      severity: "blocking",
      detail: "No streaming link supplied — a pitch cannot be sent without somewhere to listen.",
    });
  }
  if (!has("biography") && !input.biography?.trim()) {
    gaps.push({
      field: "Artist biography",
      severity: "important",
      detail: "No biography supplied — artist positioning will be limited to what the release materials state.",
    });
  }
  if (!input.releaseDate) {
    gaps.push({
      field: "Release date",
      severity: "important",
      detail: "No release date supplied — outreach timing cannot be planned.",
    });
  }
  if (!has("campaign-info")) {
    gaps.push({
      field: "Campaign information",
      severity: "nice-to-have",
      detail: "No campaign brief supplied — objectives default to awareness and playlist/radio consideration.",
    });
  }

  return {
    sourceLink: input.sourceLink.trim(),
    provider: link.provider,
    linkValid: link.valid,
    ...(link.error ? { linkError: link.error } : {}),
    assets,
    gaps,
    cataloguedAt: new Date().toISOString(),
  };
}

export function intakeIsBlocked(intake: IntakeResult): boolean {
  return intake.gaps.some((gap) => gap.severity === "blocking");
}
