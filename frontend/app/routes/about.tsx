import { Link } from "react-router";

import { PageHero } from "~/components/home";
import { certifications, company, companyTimeline } from "~/data/company";
import { createRouteMeta } from "~/lib/seo";

const processSteps = [
  "Review the application and power requirement",
  "Select the generator configuration",
  "Fabricate the frame or enclosure components",
  "Assemble the engine, alternator, controls, and wiring",
  "Complete operating and quality checks",
  "Prepare the unit for dispatch and site handover",
] as const;

const workingPrinciples = [
  {
    title: "Practical guidance",
    description:
      "Recommendations should reflect the connected load, operating pattern, site conditions, and maintenance needs.",
  },
  {
    title: "Careful execution",
    description:
      "Fabrication, assembly, wiring, inspection, and documentation each contribute to a dependable installation.",
  },
  {
    title: "Responsive support",
    description:
      "Clear communication before delivery and accessible service support help teams operate equipment with confidence.",
  },
] as const;

function CertificateMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-8 fill-none stroke-current"
      viewBox="0 0 32 32"
    >
      <path
        d="M16 3.5 20 6l4.7.2.2 4.7 2.6 4-2.6 4-.2 4.7-4.7.2-4 2.6-4-2.6-4.7-.2-.2-4.7-2.6-4 2.6-4 .2-4.7L12 6l4-2.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="14" r="4.2" strokeWidth="1.6" />
      <path d="m13.5 23.8-1 4.7 3.5-2.2 3.5 2.2-1-4.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

export function meta() {
  const description =
    "Explore UPKAR Generator's company journey, working principles, manufacturing process, and available quality documentation.";
  return createRouteMeta({ title: "About Us", description, path: "/about" });
}

export default function AboutRoute() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="About"
        title="A focused generator company established in 2013"
        description={`${company.name} works with commercial and industrial customers on generator selection, manufacturing, installation, and ongoing support.`}
        titleId="about-title"
      />

      <section
        aria-labelledby="about-story-title"
        className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:gap-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#075f5c]">
              Company story
            </p>
            <h2
              id="about-story-title"
              className="mt-4 text-balance text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              Built around dependable power and practical service
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Since {company.foundedYear}, the company has focused on helping
              customers prepare for power interruptions and demanding operating
              conditions. Its work brings together generator sizing, fabrication,
              assembly, testing, dispatch, and support.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Each requirement begins with the application. Capacity,
              configuration, installation conditions, and service access are
              considered before a recommendation is finalized.
            </p>
          </div>
          <div className="grid min-h-64 place-items-center rounded-xl bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.18),transparent_38%),linear-gradient(135deg,#0b1220,#1f2937)] p-8 text-center text-white shadow-xl">
            <div>
              <span className="block text-sm font-bold uppercase tracking-[0.18em] text-slate-300">
                Established
              </span>
              <strong className="mt-3 block text-6xl font-black text-white sm:text-7xl">
                {company.foundedYear}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-timeline-title"
        className="bg-slate-950 px-5 py-16 text-white sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-400">
              Timeline
            </p>
            <h2
              id="about-timeline-title"
              className="mt-4 max-w-xl text-balance text-3xl font-bold sm:text-4xl"
            >
              Milestones in the UPKAR journey
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              Selected milestones show how the company developed its product
              range, quieter generator options, and support capabilities over
              time.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5">
              <span aria-hidden="true" className="size-2 rounded-full bg-orange-400" />
              <span className="text-sm font-bold tracking-wide text-slate-200">
                {companyTimeline[0].year}–{companyTimeline.at(-1)?.year}
              </span>
            </div>
          </div>

          <ol
            aria-label="Company milestones"
            className="relative list-none p-0 before:absolute before:bottom-2 before:left-[0.4375rem] before:top-2 before:w-px before:bg-gradient-to-b before:from-orange-400 before:via-teal-300 before:to-slate-700 before:content-['']"
          >
            {companyTimeline.map((milestone) => (
              <li
                key={milestone.year}
                className="relative pb-10 pl-10 last:pb-0 sm:pl-12"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 z-10 grid size-4 place-items-center rounded-full border-[3px] border-slate-950 bg-orange-400 ring-2 ring-orange-400/25"
                />
                <div className="grid gap-3 pb-9 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-6">
                  <time
                    className="text-lg font-black tracking-wide text-teal-300"
                    dateTime={milestone.year}
                  >
                    {milestone.year}
                  </time>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="principles-title"
        className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="principles-title"
            className="text-balance text-3xl font-bold text-slate-950 sm:text-4xl"
          >
            Principles that guide the work
          </h2>
          <ul className="mt-9 grid list-none gap-5 p-0 md:grid-cols-3">
            {workingPrinciples.map((principle) => (
              <li
                key={principle.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {principle.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="about-process-title"
        className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#075f5c]">
            Process overview
          </p>
          <h2
            id="about-process-title"
            className="mt-4 max-w-3xl text-balance text-3xl font-bold text-slate-950 sm:text-4xl"
          >
            How a requirement moves toward delivery
          </h2>
          <ol className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-[#075f5c] text-sm font-bold text-white"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="pt-2 font-semibold leading-6 text-slate-800">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="about-certificates-title"
        className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(18rem,0.68fr)_minmax(0,1.32fr)] lg:items-start lg:gap-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#075f5c]">
              Certificates &amp; standards
            </p>
            <h2
              id="about-certificates-title"
              className="mt-4 text-balance text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              Documentation and quality standards
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Review the documentation that applies to the selected generator
              configuration and project requirement before procurement.
            </p>
            <p className="mt-5 rounded-xl border border-teal-900/10 bg-teal-50 p-4 text-sm leading-7 text-teal-950">
              Ask our team for the current, applicable copy for the model or
              installation you are considering.
            </p>
            <Link
              to="/contact"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#075f5c] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#054b49] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
            >
              Request documentation
            </Link>
          </div>

          <ul
            aria-label="Certificates and standards"
            className="grid list-none gap-4 p-0 sm:grid-cols-3"
          >
            {certifications.map((certificate, index) => (
              <li
                key={certificate}
                className="relative min-h-60 overflow-hidden rounded-xl border border-slate-200 bg-white p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 text-sm font-black tracking-[0.14em] text-slate-500"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative grid size-14 place-items-center rounded-full bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200">
                  <CertificateMark />
                </span>
                <p className="relative mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[#075f5c]">
                  Documentation reference
                </p>
                <h3 className="relative mt-3 text-xl font-bold leading-7 text-slate-950">
                  {certificate}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
