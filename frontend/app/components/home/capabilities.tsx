import { SectionHeading } from "./section-heading";

const capabilities = [
  {
    title: "Requirement-led selection",
    description:
      "Generator capacity and configuration are considered against the site's connected loads and operating priorities.",
  },
  {
    title: "Manufacturing and testing",
    description:
      "Fabrication, assembly, wiring, and operating checks form a practical path from specification to dispatch.",
  },
  {
    title: "Installation and service",
    description:
      "Support can continue through site installation, commissioning, planned maintenance, and breakdown assessment.",
  },
] as const;

export function CapabilitiesSection() {
  return (
    <section
      aria-labelledby="capabilities-title"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How we help"
          title="Support across the generator lifecycle"
          titleId="capabilities-title"
          description="A practical approach that connects equipment selection with manufacturing, commissioning, and ongoing support."
        />

        <ul className="mt-10 grid list-none gap-5 p-0 md:grid-cols-3">
          {capabilities.map((capability, index) => (
            <li
              key={capability.title}
              className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="mb-6 grid size-12 place-items-center rounded-lg bg-[#075f5c] text-sm font-bold text-white"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-bold text-slate-950">
                {capability.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {capability.description}
              </p>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#075f5c] to-orange-500"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
