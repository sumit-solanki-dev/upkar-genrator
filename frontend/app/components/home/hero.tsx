import { Link } from "react-router";

import { company } from "~/data/company";

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-[#0b1220] pt-20 text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,rgba(11,18,32,0.98)_0%,rgba(17,24,39,0.94)_48%,rgba(7,95,92,0.72)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-35 bg-[linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-size-[72px_72px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-48 top-16 -z-10 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl"
      />

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.04fr)_minmax(24rem,0.96fr)] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-orange-300">
            <span aria-hidden="true" className="h-0.5 w-8 bg-orange-400" />
            Established {company.foundedYear}
          </p>
          <h1
            id="home-hero-title"
            className="text-balance text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Dependable diesel power for demanding operations
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {company.name} helps commercial and industrial teams select, install,
            and support generator systems for sites where reliable backup power
            matters.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#087873] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-950/30 transition hover:bg-[#075f5c] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-300"
            >
              Explore products
            </Link>
            <a
              href={company.phone.href}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-orange-950/20 transition hover:bg-orange-300 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
            >
              Call now
            </a>
          </div>

        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute inset-x-[8%] bottom-[4%] h-[18%] rounded-full bg-black/50 blur-2xl"
          />
          <img
            src="/images/generator-hero.svg"
            alt="Industrial diesel generator"
            width={980}
            height={620}
            loading="eager"
            fetchPriority="high"
            className="relative h-auto w-full drop-shadow-[0_32px_45px_rgba(0,0,0,0.42)]"
          />
        </div>
      </div>
    </section>
  );
}
