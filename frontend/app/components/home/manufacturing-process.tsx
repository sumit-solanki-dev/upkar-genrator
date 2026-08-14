import { SectionHeading } from "./section-heading";

const processSteps = [
  {
    title: "Design",
    description: "Power requirements, layout, and enclosure needs are defined.",
  },
  {
    title: "Fabrication",
    description: "Frames and structural parts are cut, formed, and prepared.",
  },
  {
    title: "Assembly",
    description: "Engine, alternator, controls, and wiring are integrated.",
  },
  {
    title: "Testing",
    description: "Operating, safety, and performance checks are completed.",
  },
  {
    title: "Inspection",
    description: "Fit, finish, and documentation receive a final review.",
  },
  {
    title: "Delivery",
    description: "The unit is prepared for dispatch and site handover.",
  },
] as const;

export function ManufacturingProcessSection() {
  return (
    <section
      aria-labelledby="process-title"
      className="relative overflow-hidden bg-slate-100 py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:84px_84px]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Manufacturing process"
          title="From defined requirements to site handover"
          titleId="process-title"
        />

        <ol className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {processSteps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-full bg-[#075f5c] text-sm font-bold text-white"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-950">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

