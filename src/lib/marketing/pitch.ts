import type { Contact, MarketOpportunity, PitchVariant, ReleaseIntelligence } from "./types";
import { DEFAULT_THEME } from "@/lib/theme";

/**
 * AI release pitch generator.
 *
 * One release intelligence, many pitches. The underlying facts never change;
 * the angle, the evidence and the call to action are rewritten for each
 * recipient's actual business — a radio station gets a radio case, a playlist
 * curator gets a sound-and-mood case, a publication gets an editorial angle.
 *
 * The HTML is email-client compatible: table layout, inline CSS, no JavaScript,
 * no external stylesheets, with a plain-text alternative for every message.
 */

export type PitchInput = {
  artist: string;
  title: string;
  type: string;
  releaseDate: string;
  genre: string;
  artworkUrl?: string;
  streamingUrl?: string;
  additionalLinks?: Array<{ label: string; url: string }>;
  intelligence: ReleaseIntelligence;
  market?: MarketOpportunity;
  contact: Contact;
  /** RADARCharts contact details shown in the signature. */
  senderName?: string;
  senderEmail?: string;
};

const BRAND = {
  name: "RADARCharts by REM",
  site: "https://radarcharts.net",
  music: "music@radarcharts.net",
  submissions: "submissions@radarcharts.net",
};

function formatDate(iso: string): string {
  if (!iso) return "date to be confirmed";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** The recipient-specific angle. This is the heart of the personalisation. */
function angleFor(contact: Contact, input: PitchInput): { subject: string; lead: string; caseFor: string; cta: string } {
  const { artist, title, genre, releaseDate } = input;
  const market = input.market;
  const territory = market ? market.country : contact.country;
  const date = formatDate(releaseDate);

  switch (contact.category) {
    case "radio":
      return {
        subject: `${artist} — "${title}" (${genre}) for ${contact.organisation} rotation`,
        lead: `I'm writing from ${BRAND.name} about "${title}", the new ${input.type.toLowerCase()} from ${artist}, released ${date}.`,
        caseFor:
          `For ${contact.organisation} the case is a programming one. "${title}" sits squarely in ${genre} — ${input.intelligence.musical.mood.slice(0, 2).join(" and ")} in character, with ${input.intelligence.musical.energy} energy and a hook built to survive a single listen. ` +
          `That is the profile that works in a new-music slot rather than a specialist late-night show: it is immediate enough for a first-time listener and distinctive enough to justify the airtime. ` +
          (market
            ? `It also fits the ${territory} audience you already serve — ${market.audienceSegments[0]}.`
            : `It fits the audience you already serve in ${territory}.`),
        cta: `If it's useful, I can send the full press pack, a clean radio edit and the artwork directly. Would a listen this week be possible?`,
      };

    case "playlist":
      return {
        subject: `Playlist consideration: ${artist} — "${title}" (${genre})`,
        lead: `Sharing "${title}" by ${artist} for playlist consideration — a ${input.type.toLowerCase()} out ${date} via ${BRAND.name}.`,
        caseFor:
          `On the sound: ${input.intelligence.musical.production} The mood is ${input.intelligence.musical.mood.join(", ")}, which places it naturally alongside ${input.intelligence.musical.playlistSuitability[0]}. ` +
          `It is a ${input.intelligence.musical.energy}-energy record, so it works as an anchor rather than a transition track. ` +
          `The strongest sequencing point is ${input.intelligence.musical.hooks[0]?.toLowerCase() ?? "the hook"}.`,
        cta: `The track is streaming here — if it fits a list you're building, I can supply a short blurb and artwork sized for your platform.`,
      };

    case "publication":
      return {
        subject: `Story angle: ${artist}'s "${title}" and the ${genre} moment in ${territory}`,
        lead: `I'd like to put "${title}" by ${artist} in front of your desk — released ${date}, and there's an editorial angle here beyond the release itself.`,
        caseFor:
          `The angle: ${input.intelligence.positioning.culturalRelevance} ` +
          `What makes it coverable is the specificity — ${input.intelligence.positioning.differentiator.toLowerCase()} ` +
          `and a story that is concrete rather than promotional: ${input.intelligence.positioning.story.slice(0, 220)}` +
          (input.intelligence.positioning.story.length > 220 ? "…" : ""),
        cta: `I can arrange an interview, supply approved press images and provide an exclusive first listen if the angle works for you.`,
      };

    case "label-ar":
      return {
        subject: `${artist} — "${title}" — A&R introduction from ${BRAND.name}`,
        lead: `Introducing ${artist}, whose ${input.type.toLowerCase()} "${title}" lands ${date}.`,
        caseFor:
          `From a development perspective: ${input.intelligence.positioning.artistIdentity.slice(0, 240)} ` +
          `The artistic direction is clear — ${input.intelligence.positioning.artisticDirection} ` +
          `The commercial read is that the record has a defined audience rather than a speculative one: ${input.intelligence.musical.audienceAppeal[0]}.`,
        cta: `Happy to share the full catalogue, live footage and the artist's development plan if there's interest in a conversation.`,
      };

    case "promotion":
      return {
        subject: `Campaign brief: ${artist} — "${title}" (${territory})`,
        lead: `We're coordinating the campaign for "${title}" by ${artist}, out ${date}, and ${contact.organisation} is one of the networks we'd like to work with.`,
        caseFor:
          `The campaign objective is targeted rather than broad: ${input.intelligence.opportunities
            .filter((opportunity) => opportunity.priority === "primary")
            .map((opportunity) => opportunity.area.toLowerCase())
            .join(", ")}. ` +
          (market
            ? `Our market analysis ranks ${market.country} at ${market.score}/100 for this release — ${market.rationale}`
            : `We're building the campaign around ${territory}.`),
        cta: `If the release fits your roster, I can send the full brief, assets and a proposed timeline.`,
      };

    case "creator":
      return {
        subject: `${artist} — "${title}" — a fit for ${contact.organisation}?`,
        lead: `Reaching out about "${title}" by ${artist} (${genre}, out ${date}).`,
        caseFor:
          `Why it could work for your audience: ${input.intelligence.musical.vocalIdentity} ` +
          `The visual and sonic identity is strong enough to carry a performance format — ${input.intelligence.musical.hooks[0]?.toLowerCase() ?? "a clear hook"} is the moment that translates on camera.`,
        cta: `I can share stems, a stripped-back version and approved imagery if you'd like to explore a feature.`,
      };

    case "brand":
      return {
        subject: `Partnership angle: ${artist} — "${title}"`,
        lead: `Writing about a potential cultural fit between ${artist}'s "${title}" and ${contact.organisation}.`,
        caseFor:
          `The audience alignment is the point: ${input.intelligence.musical.audienceAppeal[0]}. ` +
          `Culturally the record sits in ${input.intelligence.musical.culturalInfluences.join(", ")}, which is where your audience already spends attention.`,
        cta: `If a cultural partnership is on your roadmap this quarter, I can send a one-page concept and the release assets.`,
      };

    case "festival":
      return {
        subject: `Booking consideration: ${artist} — ${genre} (${territory})`,
        lead: `Putting ${artist} forward for your programming consideration around "${title}" (${date}).`,
        caseFor:
          `Live read: the material is ${input.intelligence.musical.energy}-energy ${genre.toLowerCase()} with ${input.intelligence.musical.mood.join(" and ")} character — the kind of set that works in a mid-bill slot and holds a room. ` +
          `The audience it draws is ${input.intelligence.musical.audienceAppeal[0]}.`,
        cta: `I can send live footage, a stage plot and availability if the slot exists.`,
      };

    case "sync":
    default:
      return {
        subject: `Sync consideration: ${artist} — "${title}"`,
        lead: `Submitting "${title}" by ${artist} for sync consideration.`,
        caseFor:
          `From a supervision perspective the record is ${input.intelligence.musical.energy}-energy with ${input.intelligence.musical.mood.join(" and ")} character, and the production is ${input.intelligence.musical.production.toLowerCase()} ` +
          `That profile suits ${input.intelligence.musical.mood.includes("intimate") ? "emotional narrative and lifestyle placements" : "energy-led sports, gaming and lifestyle placements"}.`,
        cta: `Instrumental, clean and 30-second cutdowns are available on request.`,
      };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * RADARCharts-branded HTML email.
 *
 * Uses the project's own design tokens (DEFAULT_THEME in src/lib/theme.ts) so
 * the email matches the RADARMusic portal rather than inventing a new identity.
 * Table-based layout + inline CSS for Outlook/Gmail/Apple Mail compatibility.
 */
export function renderBrandedEmail(input: PitchInput, parts: { subject: string; lead: string; caseFor: string; cta: string }): string {
  const t = DEFAULT_THEME;
  const { artist, title, type, releaseDate, genre, artworkUrl, streamingUrl, additionalLinks } = input;
  const market = input.market;

  const artwork = artworkUrl
    ? `<tr><td align="center" style="padding:0 0 24px 0;">
         <img src="${escapeHtml(artworkUrl)}" width="280" alt="${escapeHtml(`${title} by ${artist} — release artwork`)}" style="display:block;width:280px;max-width:100%;height:auto;border-radius:16px;border:1px solid ${t.border};" />
       </td></tr>`
    : "";

  const marketRow = market
    ? `<tr><td style="padding:0 0 20px 0;">
         <p style="margin:0 0 6px 0;font-family:'Space Grotesk',Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${t.accent};">Market opportunity</p>
         <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:${t.mutedText};">
           ${escapeHtml(market.country)} — opportunity score ${market.score}/100. ${escapeHtml(market.rationale)}
         </p>
       </td></tr>`
    : "";

  const links = [
    streamingUrl ? { label: "Listen now", url: streamingUrl } : null,
    ...(additionalLinks ?? []),
  ].filter((link): link is { label: string; url: string } => Boolean(link));

  const linkButtons = links
    .map(
      (link) => `<a href="${escapeHtml(link.url)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 22px;border-radius:999px;background:${t.accent};color:#0b0d16;font-family:'Space Grotesk',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;text-decoration:none;">${escapeHtml(link.label)}</a>`,
    )
    .join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${escapeHtml(parts.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${t.background};">
<div style="display:none;font-size:1px;color:${t.background};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  ${escapeHtml(`${artist} — ${title}. ${type} out ${formatDate(releaseDate)}. Presented by ${BRAND.name}.`)}
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${t.background};">
  <tr>
    <td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${t.surfaceElevated};border:1px solid ${t.border};border-radius:24px;overflow:hidden;">

        <!-- Brand header -->
        <tr>
          <td style="padding:26px 32px;background:linear-gradient(135deg,${t.gradientStart},${t.gradientEnd});border-bottom:1px solid ${t.border};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:'Space Grotesk',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:.02em;color:${t.text};">
                  RADAR<span style="color:${t.accent};">Charts</span>
                </td>
                <td align="right" style="font-family:'JetBrains Mono',Courier,monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${t.mutedText};">
                  Release presentation
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 8px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${artwork}
              <tr><td style="padding:0 0 8px 0;">
                <p style="margin:0;font-family:'JetBrains Mono',Courier,monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:${t.primary};">
                  ${escapeHtml(type)} · ${escapeHtml(genre)} · ${escapeHtml(formatDate(releaseDate))}
                </p>
              </td></tr>
              <tr><td style="padding:0 0 20px 0;">
                <h1 style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:34px;line-height:1.15;font-weight:400;color:${t.text};">
                  ${escapeHtml(title)}
                </h1>
                <p style="margin:6px 0 0 0;font-family:'Space Grotesk',Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:${t.secondary};">
                  ${escapeHtml(artist)}
                </p>
              </td></tr>
              <tr><td style="padding:0 0 18px 0;">
                <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:${t.text};">
                  ${escapeHtml(parts.lead)}
                </p>
              </td></tr>
              <tr><td style="padding:0 0 18px 0;">
                <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:${t.mutedText};">
                  ${escapeHtml(parts.caseFor)}
                </p>
              </td></tr>
              ${marketRow}
              <tr><td style="padding:0 0 22px 0;">
                <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:${t.text};">
                  ${escapeHtml(parts.cta)}
                </p>
              </td></tr>
              ${linkButtons ? `<tr><td style="padding:0 0 26px 0;">${linkButtons}</td></tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:22px 32px 28px 32px;border-top:1px solid ${t.border};">
            <p style="margin:0 0 4px 0;font-family:'Space Grotesk',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:${t.text};">
              ${escapeHtml(input.senderName ?? "RADARMarketing")}
            </p>
            <p style="margin:0 0 10px 0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${t.mutedText};">
              ${escapeHtml(BRAND.name)} · <a href="${BRAND.site}" style="color:${t.primary};text-decoration:none;">radarcharts.net</a><br />
              ${escapeHtml(input.senderEmail ?? BRAND.music)}
            </p>
            <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:${t.mutedText};">
              You are receiving this because your organisation publishes a professional contact route for music submissions.
              Reply with "unsubscribe" and we will remove you from all future RADARCharts outreach.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function renderPlainText(input: PitchInput, parts: { subject: string; lead: string; caseFor: string; cta: string }): string {
  const links = [
    input.streamingUrl ? `Listen: ${input.streamingUrl}` : null,
    ...(input.additionalLinks ?? []).map((link) => `${link.label}: ${link.url}`),
  ].filter(Boolean);

  return [
    parts.subject,
    "",
    parts.lead,
    "",
    parts.caseFor,
    "",
    input.market ? `Market opportunity: ${input.market.country} — ${input.market.score}/100. ${input.market.rationale}` : "",
    input.market ? "" : null,
    parts.cta,
    "",
    ...links,
    "",
    "--",
    input.senderName ?? "RADARMarketing",
    BRAND.name,
    BRAND.site,
    input.senderEmail ?? BRAND.music,
    "",
    'You are receiving this because your organisation publishes a professional contact route for music submissions. Reply with "unsubscribe" to be removed.',
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function generatePitch(input: PitchInput): PitchVariant {
  const parts = angleFor(input.contact, input);
  return {
    contactId: input.contact.id,
    subject: parts.subject,
    body: [parts.lead, "", parts.caseFor, "", parts.cta].join("\n"),
    rationale: input.contact.relevanceReason,
    html: renderBrandedEmail(input, parts),
    plainText: renderPlainText(input, parts),
    generatedAt: new Date().toISOString(),
  };
}

export function generatePitches(inputs: PitchInput[]): PitchVariant[] {
  return inputs.map(generatePitch);
}
