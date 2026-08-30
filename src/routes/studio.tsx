import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, Upload, Check, CircleAlert } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

import {
  release as defaultRelease,
  type Destination,
  type PressItem,
  type Release,
  type ShortItem,
  type VideoItem,
} from "@/data/release";
import { loadRelease, resetRelease, saveRelease } from "@/lib/release-store";
import { DEFAULT_THEME, deriveTheme, themeStyle, type PortalTheme } from "@/lib/theme";
import { isHttpsUrl, isSupportedEmbedUrl } from "@/lib/urls";

const title = "Creator Studio — Edit your RADAR release portal";
const description =
  "Prepare the release information, approved media, links, and visual identity for your RADAR release portal.";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type AssetKey = "artwork" | "backgroundImage" | "artistImage";

export const Route = createFileRoute("/studio")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }] }),
  component: Studio,
});

function Field({
  label,
  value,
  onChange,
  textarea = false,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  type?: string;
  placeholder?: string;
}) {
  const classes =
    "mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring";
  return (
    <label className="block">
      <span className="label-mono text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          rows={4}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={classes}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={classes}
        />
      )}
    </label>
  );
}

function ImageUpload({
  label,
  value,
  assetKey,
  onUpload,
  onRemove,
}: {
  label: string;
  value?: string;
  assetKey: AssetKey;
  onUpload: (key: AssetKey, file: File) => void;
  onRemove: (key: AssetKey) => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="label-mono text-muted-foreground">{label}</span>
        {value ? (
          <button
            type="button"
            onClick={() => onRemove(assetKey)}
            className="text-xs text-destructive"
          >
            Remove
          </button>
        ) : null}
      </div>
      {value ? (
        <img
          src={value}
          alt={`${label} preview`}
          className="mt-3 aspect-square w-full rounded-xl object-cover"
        />
      ) : (
        <label className="mt-3 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl bg-muted/50 text-center text-sm text-muted-foreground transition hover:bg-accent">
          <Upload className="mb-2 size-5" aria-hidden="true" />
          <span>Upload image</span>
          <span className="mt-1 text-xs">JPG, PNG, WebP or GIF · max 5 MB</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(assetKey, file);
              event.currentTarget.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}

function readiness(draft: Release) {
  return [
    ["Release information", Boolean(draft.artist.trim() && draft.title.trim())],
    ["Cover artwork", Boolean(draft.artwork)],
    ["Artist image", Boolean(draft.artistImage)],
    ["Portal background", Boolean(draft.backgroundImage)],
    ["Listening destinations", draft.destinations.some((item) => isHttpsUrl(item.url))],
    ["Official video", draft.videos.some((item) => isSupportedEmbedUrl(item.src))],
    ["Shorts", draft.shorts.some((item) => isSupportedEmbedUrl(item.src))],
    ["Press", draft.press.some((item) => isHttpsUrl(item.url))],
  ] as Array<[string, boolean]>;
}

function dimensionsFor(key: AssetKey) {
  return key === "backgroundImage" ? { width: 1000, height: 500 } : { width: 400, height: 400 };
}

function readAsset(file: File, key: AssetKey) {
  return new Promise<string>((resolve, reject) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type))
      return reject(new Error("Use a JPG, PNG, WebP, or GIF image."));
    if (file.size > MAX_FILE_SIZE) return reject(new Error("Images must be 5 MB or smaller."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const minimum = dimensionsFor(key);
        if (image.width < minimum.width || image.height < minimum.height)
          reject(
            new Error(
              `${key === "backgroundImage" ? "Backgrounds" : "Artwork"} must be at least ${minimum.width}×${minimum.height}px.`,
            ),
          );
        else resolve(String(reader.result));
      };
      image.onerror = () => reject(new Error("The image appears to be corrupted."));
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function Studio() {
  const [draft, setDraft] = useState<Release>(defaultRelease);
  const [theme, setTheme] = useState<PortalTheme>(DEFAULT_THEME);
  const [status, setStatus] = useState("Draft autosaves in this browser.");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    setDraft(loadRelease());
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    const timer = window.setTimeout(() => {
      saveRelease(draft);
      setStatus("Draft saved just now.");
    }, 450);
    return () => window.clearTimeout(timer);
  }, [draft]);
  useEffect(() => {
    let mounted = true;
    deriveTheme(draft.artwork ?? "").then((next) => {
      if (mounted) setTheme(next);
    });
    return () => {
      mounted = false;
    };
  }, [draft.artwork]);

  const checks = useMemo(() => readiness(draft), [draft]);
  const ready = checks.every(([, complete]) => complete);
  const update = <K extends keyof Release>(key: K, value: Release[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setStatus("Saving draft…");
  };
  const handleUpload = async (key: AssetKey, file: File) => {
    setError("");
    try {
      update(key, await readAsset(file, key));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "The image could not be uploaded.",
      );
    }
  };
  const submit = () => {
    if (!ready) {
      setError("Complete every required item in Portal readiness before submitting.");
      return;
    }
    saveRelease(draft);
    setSaved(true);
    setStatus("Submitted for editorial review.");
  };

  return (
    <main className="min-h-screen bg-background pb-24" style={themeStyle(theme)}>
      <div className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8">
        <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="label-mono text-primary/70">RADAR / Creator Studio</p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Build the release portal.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Supply the approved release information and assets once. The live preview uses the
              same release model as the public portal.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className="rounded-full border border-border px-4 py-2 font-display text-sm font-medium text-foreground"
            >
              Preview portal ↗
            </Link>
            <button
              type="button"
              onClick={() => {
                resetRelease();
                setDraft(defaultRelease);
                setSaved(false);
              }}
              className="rounded-full border border-border px-4 py-2 font-display text-sm font-medium text-muted-foreground"
            >
              Clear draft
            </button>
          </div>
        </header>

        {error ? (
          <div
            role="alert"
            className="mb-5 flex items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <CircleAlert className="size-4" aria-hidden="true" />
            {error}
          </div>
        ) : null}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
          <div className="space-y-6">
            <section className="glass-panel rounded-3xl p-5 sm:p-7">
              <h2 className="font-display text-xl font-semibold text-foreground">
                01 · Release information
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Artist"
                  value={draft.artist}
                  onChange={(value) => update("artist", value)}
                />
                <Field
                  label="Release title"
                  value={draft.title}
                  onChange={(value) => update("title", value)}
                />
                <Field
                  label="Release type"
                  value={draft.type}
                  onChange={(value) => update("type", value)}
                />
                <Field
                  label="Release date"
                  value={draft.releaseDate}
                  onChange={(value) => update("releaseDate", value)}
                  type="date"
                />
                <Field
                  label="Artist handle"
                  value={draft.handle ?? ""}
                  onChange={(value) => update("handle", value)}
                />
                <Field
                  label="Label"
                  value={draft.label}
                  onChange={(value) => update("label", value)}
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Tagline"
                  value={draft.tagline ?? ""}
                  onChange={(value) => update("tagline", value)}
                  textarea
                />
                <Field
                  label="Artist biography"
                  value={draft.biography ?? ""}
                  onChange={(value) => update("biography", value)}
                  textarea
                />
              </div>
              <div className="mt-4">
                <Field
                  label="Release story / description"
                  value={draft.story}
                  onChange={(value) => update("story", value)}
                  textarea
                />
              </div>
            </section>

            <section className="glass-panel rounded-3xl p-5 sm:p-7">
              <h2 className="font-display text-xl font-semibold text-foreground">
                02 · Visual identity
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Cover artwork derives the portal palette automatically. The background is an
                independent layer and can be replaced without changing the cover.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <ImageUpload
                  label="Cover artwork"
                  value={draft.artwork}
                  assetKey="artwork"
                  onUpload={handleUpload}
                  onRemove={(key) => update(key, "")}
                />
                <ImageUpload
                  label="Portal background"
                  value={draft.backgroundImage}
                  assetKey="backgroundImage"
                  onUpload={handleUpload}
                  onRemove={(key) => update(key, "")}
                />
                <ImageUpload
                  label="Artist profile image"
                  value={draft.artistImage}
                  assetKey="artistImage"
                  onUpload={handleUpload}
                  onRemove={(key) => update(key, "")}
                />
              </div>
            </section>

            <section className="glass-panel rounded-3xl p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  03 · Listening destinations
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    update("destinations", [
                      ...draft.destinations,
                      {
                        id: `destination-${Date.now()}`,
                        name: "New store",
                        url: "https://",
                        status: "needs-review",
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 font-display text-xs font-semibold text-primary-foreground"
                >
                  <Plus className="size-4" aria-hidden="true" /> Add
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {draft.destinations.map((destination, index) => (
                  <div key={destination.id} className="rounded-2xl border border-border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Service"
                        value={destination.name}
                        onChange={(value) =>
                          update(
                            "destinations",
                            draft.destinations.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, name: value } : item,
                            ),
                          )
                        }
                      />
                      <Field
                        label="HTTPS URL"
                        value={destination.url}
                        onChange={(value) =>
                          update(
                            "destinations",
                            draft.destinations.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, url: value } : item,
                            ),
                          )
                        }
                      />
                    </div>
                    <Field
                      label="Official embed URL (optional)"
                      value={destination.embed?.src ?? ""}
                      onChange={(value) =>
                        update(
                          "destinations",
                          draft.destinations.map((item, itemIndex) =>
                            itemIndex === index
                              ? value
                                ? {
                                    ...item,
                                    embed: {
                                      provider: item.embed?.provider ?? "spotify",
                                      src: value,
                                      height: item.embed?.height ?? 152,
                                    },
                                  }
                                : (({ embed: _embed, ...rest }) => rest)(item)
                              : item,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "destinations",
                          draft.destinations.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <MediaEditor
              title="04 · Watch"
              items={draft.videos}
              kindLabel="Kind"
              urlLabel="Embed URL"
              onAdd={() =>
                update("videos", [
                  ...draft.videos,
                  {
                    id: `video-${Date.now()}`,
                    title: "New video",
                    kind: "Official video",
                    src: "https://www.youtube-nocookie.com/embed/",
                  },
                ])
              }
              onChange={(items) => update("videos", items)}
            />
            <MediaEditor
              title="05 · Shorts"
              items={draft.shorts}
              kindLabel="Source"
              urlLabel="Embed URL"
              onAdd={() =>
                update("shorts", [
                  ...draft.shorts,
                  {
                    id: `short-${Date.now()}`,
                    title: "New short",
                    source: "YouTube Shorts",
                    src: "https://www.youtube-nocookie.com/embed/",
                  },
                ])
              }
              onChange={(items) => update("shorts", items)}
            />
            <PressEditor
              items={draft.press}
              onAdd={() =>
                update("press", [
                  ...draft.press,
                  {
                    id: `press-${Date.now()}`,
                    publication: "Publication",
                    headline: "Headline",
                    quote: "Pull quote",
                    url: "https://",
                    date: "Aug 2026",
                  },
                ])
              }
              onChange={(items) => update("press", items)}
            />
          </div>

          <aside className="sticky top-5 space-y-4">
            <section className="glass-panel rounded-3xl p-5 sm:p-6">
              <p className="label-mono text-primary/70">PORTAL READINESS</p>
              <div className="mt-4 space-y-1">
                {checks.map(([label, complete]) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 border-b border-border/60 py-2.5 text-sm ${complete ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <span className={complete ? "text-primary" : "text-muted-foreground"}>
                      {complete ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : (
                        <span aria-hidden="true">○</span>
                      )}
                    </span>
                    {label}
                  </div>
                ))}
              </div>
              <p className="mt-4 label-mono text-primary">
                {ready ? "READY TO SUBMIT" : "ACTION REQUIRED"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {ready
                  ? "All required content is present and ready for editorial review."
                  : "Add the missing items above before submission."}
              </p>
              <button
                type="button"
                disabled={!ready}
                onClick={submit}
                className="mt-5 w-full rounded-full bg-primary px-4 py-3 font-display text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saved ? "Submitted for review" : "Submit for review ↗"}
              </button>
            </section>
            <section
              className="glass-panel rounded-3xl p-5 sm:p-6"
              style={{ background: theme.surfaceElevated }}
            >
              <p className="font-display text-lg font-semibold text-foreground">
                Your portal theme
              </p>
              <div className="mt-4 flex gap-2">
                <span className="size-9 rounded-lg" style={{ background: theme.primary }} />
                <span className="size-9 rounded-lg" style={{ background: theme.secondary }} />
                <span className="size-9 rounded-lg" style={{ background: theme.accent }} />
                <span className="size-9 rounded-lg" style={{ background: theme.background }} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Derived automatically from the current cover artwork and reused by the live public
                portal.
              </p>
            </section>
            <section className="glass-panel rounded-3xl p-5 sm:p-6">
              <p className="label-mono text-primary/70">LIVE PREVIEW</p>
              <p className="mt-3 font-display text-2xl font-semibold text-foreground">
                {draft.title || "Your release"}
              </p>
              <p className="text-sm text-muted-foreground">{draft.artist || "Artist name"}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Open the same public portal renderer used for publication.
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex rounded-full border border-border px-4 py-2 font-display text-sm text-foreground"
              >
                Open live preview ↗
              </Link>
              <p role="status" className="mt-4 text-xs text-muted-foreground">
                {status}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function MediaEditor<T extends VideoItem | ShortItem>({
  title,
  items,
  kindLabel,
  urlLabel,
  onAdd,
  onChange,
}: {
  title: string;
  items: T[];
  kindLabel: string;
  urlLabel: string;
  onAdd: () => void;
  onChange: (items: T[]) => void;
}) {
  return (
    <section className="glass-panel rounded-3xl p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 font-display text-xs font-semibold text-primary-foreground"
        >
          <Plus className="size-4" aria-hidden="true" /> Add
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-2xl border border-border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Title"
                value={item.title}
                onChange={(value) =>
                  onChange(
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, title: value } : current,
                    ),
                  )
                }
              />
              <Field
                label={kindLabel}
                value={"kind" in item ? item.kind : item.source}
                onChange={(value) =>
                  onChange(
                    items.map((current, itemIndex) =>
                      itemIndex === index
                        ? "kind" in current
                          ? { ...current, kind: value }
                          : { ...current, source: value }
                        : current,
                    ),
                  )
                }
              />
            </div>
            <Field
              label={urlLabel}
              value={item.src}
              onChange={(value) =>
                onChange(
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, src: value } : current,
                  ),
                )
              }
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" /> Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function PressEditor({
  items,
  onAdd,
  onChange,
}: {
  items: PressItem[];
  onAdd: () => void;
  onChange: (items: PressItem[]) => void;
}) {
  return (
    <section className="glass-panel rounded-3xl p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-foreground">06 · Press</h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 font-display text-xs font-semibold text-primary-foreground"
        >
          <Plus className="size-4" aria-hidden="true" /> Add
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-2xl border border-border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Publication"
                value={item.publication}
                onChange={(value) =>
                  onChange(
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, publication: value } : current,
                    ),
                  )
                }
              />
              <Field
                label="Date"
                value={item.date}
                onChange={(value) =>
                  onChange(
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, date: value } : current,
                    ),
                  )
                }
              />
            </div>
            <Field
              label="Headline"
              value={item.headline}
              onChange={(value) =>
                onChange(
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, headline: value } : current,
                  ),
                )
              }
            />
            <Field
              label="Quote"
              value={item.quote}
              onChange={(value) =>
                onChange(
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, quote: value } : current,
                  ),
                )
              }
              textarea
            />
            <Field
              label="HTTPS URL"
              value={item.url}
              onChange={(value) =>
                onChange(
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, url: value } : current,
                  ),
                )
              }
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" /> Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
