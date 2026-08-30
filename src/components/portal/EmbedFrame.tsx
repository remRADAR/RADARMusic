import { safeEmbedUrl } from "@/lib/safe-url";

type Props = {
  src: string;
  title: string;
  ratio?: "video" | "vertical" | "auto";
  height?: number;
  className?: string;
};

export function EmbedFrame({ src, title, ratio = "video", height, className = "" }: Props) {
  const ratioClass =
    ratio === "video" ? "aspect-video" : ratio === "vertical" ? "aspect-[9/16]" : "";
  const safeSrc = safeEmbedUrl(src);

  return (
    <div
      className={`glass-panel overflow-hidden rounded-3xl p-1.5 ${className}`}
      style={height ? { height: height + 12 } : undefined}
    >
      {safeSrc ? (
        <iframe
          src={safeSrc}
          title={title}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className={`h-full w-full rounded-[1.35rem] border-0 bg-deep/20 ${ratioClass}`}
          style={height ? { height } : undefined}
        />
      ) : (
        <div className="flex min-h-24 items-center justify-center rounded-[1.35rem] px-5 text-center text-sm text-muted-foreground">
          This embed is unavailable. Use the official destination link instead.
        </div>
      )}
    </div>
  );
}
