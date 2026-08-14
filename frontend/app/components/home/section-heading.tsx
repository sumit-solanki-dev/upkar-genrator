interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  titleId?: string;
  centered?: boolean;
  inverse?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
  centered = false,
  inverse = false,
}: SectionHeadingProps) {
  const alignment = centered ? "mx-auto items-center text-center" : "items-start";
  const titleColor = inverse ? "text-white" : "text-slate-950";
  const descriptionColor = inverse ? "text-slate-300" : "text-slate-600";

  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignment}`}>
      <p
        className={`flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] ${
          inverse ? "text-orange-300" : "text-[#075f5c]"
        }`}
      >
        <span aria-hidden="true" className="h-0.5 w-8 bg-orange-500" />
        {eyebrow}
      </p>
      <h2
        id={titleId}
        className={`text-balance text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${titleColor}`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`max-w-2xl text-base leading-7 sm:text-lg ${descriptionColor}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

