import { SectionHeading } from "./section-heading";

const industries = [
  { name: "Construction", image: "/images/industries/construction.webp" },
  { name: "Factories", image: "/images/industries/factories.webp" },
  { name: "Hospitals", image: "/images/industries/hospitals.webp" },
  { name: "Hotels", image: "/images/industries/hotels.webp" },
  { name: "Malls", image: "/images/industries/mall.webp" },
  { name: "Telecom", image: "/images/industries/telecom.webp" },
  { name: "Schools", image: "/images/industries/schools.webp" },
  { name: "Warehouses", image: "/images/industries/warehouses.webp" },
] as const;

export function IndustriesSection() {
  return (
    <section
      aria-labelledby="industries-title"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Industries"
          title="Power support for varied operating environments"
          titleId="industries-title"
          description="Generator requirements vary by load profile, operating hours, site conditions, and the consequences of an interruption."
        />

        <ul className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <li
              key={industry.name}
              className="group relative isolate min-h-48 overflow-hidden rounded-xl bg-slate-900 shadow-md"
            >
              <img
                src={industry.image}
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/25 via-slate-950/45 to-slate-950/95"
              />
              <div className="flex min-h-48 items-end p-5">
                <h3 className="text-xl font-bold text-white">{industry.name}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

