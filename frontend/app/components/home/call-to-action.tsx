import { Link } from "react-router";

import { company } from "~/data/company";

export function CallToActionSection() {
  return (
    <section
      aria-labelledby="home-cta-title"
      className="relative isolate overflow-hidden bg-slate-950 py-20 text-white sm:py-24"
    >
      <picture>
        <source
          media="(max-width: 480px)"
          srcSet="/images/optimized-v1/cta/cta-mobile-500.webp 500w, /images/optimized-v1/cta/cta-mobile-1000.webp 1000w"
          sizes="100vw"
        />
        <img
          src="/images/sequence/CTA-img.webp"
          srcSet="/images/optimized-v1/cta/cta-640.webp 640w, /images/optimized-v1/cta/cta-960.webp 960w, /images/sequence/CTA-img.webp 1448w"
          sizes="100vw"
          alt=""
          width={1448}
          height={1086}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      </picture>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">
            Discuss your requirement
          </p>
          <h2
            id="home-cta-title"
            className="mt-4 text-balance text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
          >
            Plan a generator solution around your site and load
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Share your application, capacity needs, and site conditions with the
            {" "}{company.name} team.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#087873] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#075f5c] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-300"
            >
              Contact the team
            </Link>
            <a
              href={company.phone.href}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-orange-300 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
            >
              Call now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
