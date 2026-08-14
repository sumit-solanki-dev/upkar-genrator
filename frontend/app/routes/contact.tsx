import { PageHero } from "~/components/home";
import { LocationMap } from "~/components/ui/location-map";
import { company } from "~/data/company";
import { createRouteMeta } from "~/lib/seo";

export function meta() {
  const description =
    "Contact UPKAR Generator by phone, email, or WhatsApp to discuss generator products, installation, maintenance, or support.";
  return createRouteMeta({ title: "Contact", description, path: "/contact" });
}

export default function ContactRoute() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Contact"
        title="Talk to the UPKAR Generator team"
        description="Share the application, expected load, location, and service need so the team can understand your requirement."
        titleId="contact-title"
      />

      <section
        aria-labelledby="contact-options-title"
        className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h2
              id="contact-options-title"
              className="text-balance text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              Choose how you would like to get in touch
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Please include the generator capacity or site requirement when you
              contact the team. Response timing depends on operating hours and
              availability.
            </p>
          </div>

          <ul className="mt-10 grid list-none gap-5 p-0 md:grid-cols-3">
            <li>
              <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#075f5c]">
                  Phone
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">
                  Speak with the team
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  Useful for an initial product, service, or site conversation.
                </p>
                <a
                  href={company.phone.href}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#075f5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#054b49] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
                >
                  {company.phone.display}
                </a>
              </article>
            </li>
            <li>
              <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#075f5c]">
                  Email
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">
                  Send requirement details
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  Include the application, capacity, location, and preferred way
                  to follow up.
                </p>
                <a
                  href={company.email.href}
                  className="mt-6 inline-flex min-h-12 items-center justify-center break-all rounded-lg border-2 border-[#075f5c] px-5 py-3 text-center text-sm font-bold text-[#075f5c] transition hover:bg-[#075f5c] hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
                >
                  {company.email.display}
                </a>
              </article>
            </li>
            <li>
              <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#075f5c]">
                  WhatsApp
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">
                  Start a message
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  Opens WhatsApp with a short introductory message that you can
                  edit before sending.
                </p>
                <a
                  href={company.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#176b3a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#11532d] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
                >
                  Message on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </article>
            </li>
          </ul>

          <section
            aria-labelledby="contact-location-title"
            className="mt-12 grid overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 lg:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)]"
          >
            <div className="flex flex-col justify-center px-6 py-10 text-white sm:px-9 lg:px-10 lg:py-12">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-400">
                Visit us
              </p>
              <h2
                id="contact-location-title"
                className="mt-4 text-balance text-3xl font-bold sm:text-4xl"
              >
                Find UPKAR Generator
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Use the map to plan your route. Please call before travelling so
                the team can arrange a suitable time for your visit.
              </p>

              <div className="mt-8 border-l-2 border-orange-500 pl-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Location
                </p>
                <p className="mt-2 text-lg font-bold text-white">
                  {company.location.display}
                </p>
              </div>

              <a
                className="mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-lg bg-orange-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-400"
                href={company.location.directionsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Get directions
                <svg
                  aria-hidden="true"
                  className="size-4 fill-none stroke-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 16 16 8m-6 0h6v6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            <div className="bg-white p-2 sm:p-3">
              <LocationMap
                className="h-[20rem] rounded-xl sm:h-[24rem] lg:h-full lg:min-h-[28rem]"
                title="UPKAR Generator location map on the Contact page"
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
