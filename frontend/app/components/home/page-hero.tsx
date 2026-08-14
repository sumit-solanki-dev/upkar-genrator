interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  titleId: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  titleId,
}: PageHeroProps) {
  return (
    <header className="relative isolate overflow-hidden bg-slate-950 px-5 pb-16 pt-32 text-white sm:px-8 lg:pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:84px_84px]"
      />
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
          {eyebrow}
        </p>
        <h1
          id={titleId}
          className="mt-4 max-w-4xl text-balance text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        >
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          {description}
        </p>
      </div>
    </header>
  );
}

