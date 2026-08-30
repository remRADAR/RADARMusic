type Props = {
  label: string;
  title: string;
  note?: string;
};

export function SectionHeading({ label, title, note }: Props) {
  return (
    <header className="mb-6">
      <p className="label-mono text-primary/70">{label}</p>
      <h2 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {note ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{note}</p> : null}
    </header>
  );
}
