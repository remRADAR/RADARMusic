import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { release as defaultRelease, type Release } from "@/data/release";
import { loadRelease, resetRelease, saveRelease } from "@/lib/release-store";

const title = "Creator Studio — Edit your RADAR release portal";
const description =
  "Edit your RADAR release portal: update artist details, embed stores, videos, shorts and press features, then publish to your hosted stream link.";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const cls =
    "mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";
  return (
    <label className="block">
      <span className="label-mono text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          rows={4}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </label>
  );
}

function Studio() {
  const [draft, setDraft] = useState<Release>(defaultRelease);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(loadRelease());
  }, []);

  const set = <K extends keyof Release>(key: K, value: Release[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="mx-auto w-full max-w-2xl px-5 pt-10">
        <header className="mb-8">
          <p className="label-mono text-primary/70">RADAR / Creator Studio</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
            Build your release portal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit the page details and paste embed links. Changes appear on your portal instantly.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              to="/"
              className="rounded-full border border-border px-4 py-2 font-display text-sm font-medium text-foreground"
            >
              View portal
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
              Reset
            </button>
          </div>
        </header>

        <section className="glass-panel space-y-4 rounded-3xl p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Release details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Artist" value={draft.artist} onChange={(v) => set("artist", v)} />
            <Field label="Title" value={draft.title} onChange={(v) => set("title", v)} />
            <Field label="Handle" value={draft.handle ?? ""} onChange={(v) => set("handle", v)} />
            <Field label="Type" value={draft.type} onChange={(v) => set("type", v)} />
            <Field label="Label" value={draft.label} onChange={(v) => set("label", v)} />
            <Field
              label="Release date"
              value={draft.releaseDate}
              onChange={(v) => set("releaseDate", v)}
              placeholder="2026-08-14"
            />
          </div>
          <Field
            label="Tagline"
            value={draft.tagline ?? ""}
            onChange={(v) => set("tagline", v)}
            textarea
          />
          <Field label="Story" value={draft.story} onChange={(v) => set("story", v)} textarea />
        </section>

        <section className="glass-panel mt-6 space-y-4 rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Store links</h2>
            <button
              type="button"
              onClick={() =>
                set("destinations", [
                  ...draft.destinations,
                  {
                    id: `dest-${Date.now()}`,
                    name: "New store",
                    url: "https://",
                    status: "needs-review" as const,
                  },
                ])
              }
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 font-display text-xs font-semibold text-primary-foreground"
            >
              <Plus className="size-4" aria-hidden="true" /> Add
            </button>
          </div>
          {draft.destinations.map((destination, i) => (
            <div key={destination.id} className="rounded-2xl border border-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={destination.name}
                  onChange={(v) =>
                    set(
                      "destinations",
                      draft.destinations.map((d, j) => (i === j ? { ...d, name: v } : d)),
                    )
                  }
                />
                <Field
                  label="URL"
                  value={destination.url}
                  onChange={(v) =>
                    set(
                      "destinations",
                      draft.destinations.map((d, j) => (i === j ? { ...d, url: v } : d)),
                    )
                  }
                />
              </div>
              <Field
                label="Embed URL (optional)"
                value={destination.embed?.src ?? ""}
                placeholder="https://open.spotify.com/embed/track/..."
                onChange={(v) =>
                  set(
                    "destinations",
                    draft.destinations.map((d, j) =>
                      i === j
                        ? v
                          ? {
                              ...d,
                              embed: {
                                provider: d.embed?.provider ?? "spotify",
                                src: v,
                                height: d.embed?.height ?? 152,
                              },
                            }
                          : (({ embed: _omit, ...rest }) => rest)(d)
                        : d,
                    ),
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  set(
                    "destinations",
                    draft.destinations.filter((_, j) => j !== i),
                  )
                }
                className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" /> Remove
              </button>
            </div>
          ))}
        </section>

        <section className="glass-panel mt-6 space-y-4 rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Videos</h2>
            <button
              type="button"
              onClick={() =>
                set("videos", [
                  ...draft.videos,
                  {
                    id: `vid-${Date.now()}`,
                    title: "New video",
                    kind: "Official video",
                    src: "https://www.youtube-nocookie.com/embed/",
                  },
                ])
              }
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 font-display text-xs font-semibold text-primary-foreground"
            >
              <Plus className="size-4" aria-hidden="true" /> Add
            </button>
          </div>
          {draft.videos.map((video, i) => (
            <div key={video.id} className="rounded-2xl border border-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Title"
                  value={video.title}
                  onChange={(v) =>
                    set(
                      "videos",
                      draft.videos.map((x, j) => (i === j ? { ...x, title: v } : x)),
                    )
                  }
                />
                <Field
                  label="Kind"
                  value={video.kind}
                  onChange={(v) =>
                    set(
                      "videos",
                      draft.videos.map((x, j) => (i === j ? { ...x, kind: v } : x)),
                    )
                  }
                />
              </div>
              <Field
                label="Embed URL"
                value={video.src}
                onChange={(v) =>
                  set(
                    "videos",
                    draft.videos.map((x, j) => (i === j ? { ...x, src: v } : x)),
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  set(
                    "videos",
                    draft.videos.filter((_, j) => j !== i),
                  )
                }
                className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" /> Remove
              </button>
            </div>
          ))}
        </section>

        <section className="glass-panel mt-6 space-y-4 rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Reels & shorts</h2>
            <button
              type="button"
              onClick={() =>
                set("shorts", [
                  ...draft.shorts,
                  {
                    id: `short-${Date.now()}`,
                    title: "New short",
                    source: "Reels",
                    src: "https://www.youtube-nocookie.com/embed/",
                  },
                ])
              }
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 font-display text-xs font-semibold text-primary-foreground"
            >
              <Plus className="size-4" aria-hidden="true" /> Add
            </button>
          </div>
          {draft.shorts.map((short, i) => (
            <div key={short.id} className="rounded-2xl border border-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Title"
                  value={short.title}
                  onChange={(v) =>
                    set(
                      "shorts",
                      draft.shorts.map((x, j) => (i === j ? { ...x, title: v } : x)),
                    )
                  }
                />
                <Field
                  label="Source"
                  value={short.source}
                  onChange={(v) =>
                    set(
                      "shorts",
                      draft.shorts.map((x, j) => (i === j ? { ...x, source: v } : x)),
                    )
                  }
                />
              </div>
              <Field
                label="Embed URL"
                value={short.src}
                onChange={(v) =>
                  set(
                    "shorts",
                    draft.shorts.map((x, j) => (i === j ? { ...x, src: v } : x)),
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  set(
                    "shorts",
                    draft.shorts.filter((_, j) => j !== i),
                  )
                }
                className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" /> Remove
              </button>
            </div>
          ))}
        </section>

        <section className="glass-panel mt-6 space-y-4 rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Press features</h2>
            <button
              type="button"
              onClick={() =>
                set("press", [
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
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 font-display text-xs font-semibold text-primary-foreground"
            >
              <Plus className="size-4" aria-hidden="true" /> Add
            </button>
          </div>
          {draft.press.map((item, i) => (
            <div key={item.id} className="rounded-2xl border border-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Publication"
                  value={item.publication}
                  onChange={(v) =>
                    set(
                      "press",
                      draft.press.map((x, j) => (i === j ? { ...x, publication: v } : x)),
                    )
                  }
                />
                <Field
                  label="Date"
                  value={item.date}
                  onChange={(v) =>
                    set(
                      "press",
                      draft.press.map((x, j) => (i === j ? { ...x, date: v } : x)),
                    )
                  }
                />
              </div>
              <Field
                label="Headline"
                value={item.headline}
                onChange={(v) =>
                  set(
                    "press",
                    draft.press.map((x, j) => (i === j ? { ...x, headline: v } : x)),
                  )
                }
              />
              <Field
                label="Quote"
                value={item.quote}
                textarea
                onChange={(v) =>
                  set(
                    "press",
                    draft.press.map((x, j) => (i === j ? { ...x, quote: v } : x)),
                  )
                }
              />
              <Field
                label="URL"
                value={item.url}
                onChange={(v) =>
                  set(
                    "press",
                    draft.press.map((x, j) => (i === j ? { ...x, url: v } : x)),
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  set(
                    "press",
                    draft.press.filter((_, j) => j !== i),
                  )
                }
                className="mt-3 inline-flex items-center gap-1 text-xs text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" /> Remove
              </button>
            </div>
          ))}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-40 mx-auto w-full max-w-2xl px-5">
        <div className="glass-panel flex items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5">
          <span className="text-sm text-muted-foreground">
            {saved ? "Saved to your portal" : "Unsaved changes"}
          </span>
          <button
            type="button"
            onClick={() => {
              saveRelease(draft);
              setSaved(true);
            }}
            className="rounded-full bg-primary px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground"
          >
            Save & publish
          </button>
        </div>
      </div>
    </main>
  );
}
