import { Link } from "react-router";

import { PageHero } from "~/components/home";
import { company } from "~/data/company";
import { createRouteMeta } from "~/lib/seo";

export function meta() {
  const description =
    "Read how the UPKAR Generator website handles information and links to third-party services.";
  return createRouteMeta({ title: "Privacy", description, path: "/privacy" });
}

export default function PrivacyRoute() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Privacy"
        title="Privacy information for this website"
        description="This page explains the information handled by the current website experience and the third-party services reached through its links."
        titleId="privacy-title"
      />

      <div className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <article className="mx-auto max-w-3xl text-slate-700">
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-7">
            This notice describes the website as currently implemented. It should
            be reviewed if analytics, online forms, advertising, payment tools,
            or other data-processing features are added.
          </p>

          <section aria-labelledby="privacy-information-title" className="mt-10">
            <h2
              id="privacy-information-title"
              className="text-2xl font-bold text-slate-950"
            >
              Information you choose to share
            </h2>
            <p className="mt-4 leading-8">
              This website does not currently provide an online inquiry or
              newsletter form. If you contact {company.name} by phone, email, or
              WhatsApp, the information you provide is handled through that
              communication channel so the team can respond to your request.
            </p>
            <p className="mt-4 leading-8">
              Avoid sending sensitive personal, financial, or account information
              unless it is necessary and you have confirmed the intended recipient.
            </p>
          </section>

          <section aria-labelledby="privacy-third-parties-title" className="mt-10">
            <h2
              id="privacy-third-parties-title"
              className="text-2xl font-bold text-slate-950"
            >
              Third-party services
            </h2>
            <p className="mt-4 leading-8">
              Contact links can open services operated by your telephone provider,
              email provider, or WhatsApp. Those services apply their own privacy
              terms. The Contact page and site footer include an embedded Google
              map. Loading a page containing the map or interacting with it may
              allow Google to receive standard device and request information
              under its own privacy terms.
            </p>
          </section>

          <section aria-labelledby="privacy-technical-title" className="mt-10">
            <h2
              id="privacy-technical-title"
              className="text-2xl font-bold text-slate-950"
            >
              Technical information
            </h2>
            <p className="mt-4 leading-8">
              Website hosting and network providers may process standard request
              information such as an IP address, browser type, requested page,
              timestamp, and security logs to deliver and protect the service.
              Retention and processing details depend on the configured provider.
            </p>
          </section>

          <section aria-labelledby="privacy-choices-title" className="mt-10">
            <h2
              id="privacy-choices-title"
              className="text-2xl font-bold text-slate-950"
            >
              Questions and choices
            </h2>
            <p className="mt-4 leading-8">
              To ask a privacy question or request correction or deletion of
              information you previously shared, contact the team at{" "}
              <a
                href={company.email.href}
                className="font-bold text-[#075f5c] underline decoration-2 underline-offset-4 hover:text-[#054b49] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
              >
                {company.email.display}
              </a>
              . The response may depend on applicable obligations and whether the
              information can be identified.
            </p>
          </section>

          <Link
            to="/contact"
            className="mt-10 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#075f5c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#054b49] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
          >
            Contact UPKAR Generator
          </Link>
        </article>
      </div>
    </main>
  );
}
