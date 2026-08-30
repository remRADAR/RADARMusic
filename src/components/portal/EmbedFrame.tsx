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

  return (
    <div
      className={`glass-panel overflow-hidden rounded-3xl p-1.5 ${className}`}
      style={height ? { height: height + 12 } : undefined}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className={`h-full w-full rounded-[1.35rem] border-0 bg-deep/20 ${ratioClass}`}
        style={height ? { height } : undefined}
      />
    </div>
  );
}
