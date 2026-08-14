import { Link } from "react-router";

import { PageHero, ServiceIcon } from "~/components/home";
import { services } from "~/data/services";
import { createRouteMeta } from "~/lib/seo";

export function meta() {
  const description =
    "Explore generator installation, preventive maintenance, load assessment, commissioning, contract, and breakdown support from UPKAR Generator.";
  return createRouteMeta({ title: "Generator Services", description, path: "/services" });
}

export default function ServicesRoute() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Services"
        title="Practical support across the generator lifecycle"
        description="From initial capacity planning to commissioning and ongoing maintenance, services are scoped around the equipment and the site."
        titleId="services-title"
      />

      <section
        aria-labelledby="services-list-title"
        className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#075f5c]">
              Service areas
            </p>
            <h2
              id="services-list-title"
              className="mt-4 text-balance text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              Choose the support that fits your requirement
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Exact scope, timing, and availability are confirmed after the team
              reviews the generator, location, and operating need.
            </p>
          </div>

          <ul className="mt-10 grid list-none gap-5 p-0 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <li key={service.id} id={service.id}>
                <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span
                    aria-hidden="true"
                    className="grid size-14 place-items-center rounded-xl bg-teal-50 text-[#075f5c]"
                  >
                    <ServiceIcon name={service.icon} />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-slate-950">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                    {service.description}
                  </p>
                  <Link
                    to="/contact"
                    className="mt-6 inline-flex min-h-11 items-center justify-center self-start rounded-lg bg-[#075f5c] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#054b49] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
                  >
                    Ask about {service.title.toLocaleLowerCase()}
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
