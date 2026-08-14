import { SectionHeading } from "./section-heading";

const industries = [
  { name: "Construction", image: "/images/industries/construction.webp", stem: "construction", height: 1024 },
  { name: "Factories", image: "/images/industries/factories.webp", stem: "factories", height: 1024 },
  { name: "Hospitals", image: "/images/industries/hospitals.webp", stem: "hospitals", height: 1024 },
  { name: "Hotels", image: "/images/industries/hotels.webp", stem: "hotels", height: 1024 },
  { name: "Malls", image: "/images/industries/mall.webp", stem: "mall", height: 683 },
  { name: "Telecom", image: "/images/industries/telecom.webp", stem: "telecom", height: 1024 },
  { name: "Schools", image: "/images/industries/schools.webp", stem: "schools", height: 1024 },
  { name: "Warehouses", image: "/images/industries/warehouses.webp", stem: "warehouses", height: 683 },
] as const;

const industryImageSizes =
  "(min-width: 1280px) 292px, (min-width: 1024px) calc((100vw - 7rem) / 4), (min-width: 640px) calc((100vw - 4rem) / 2), calc(100vw - 2rem)";

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
              <picture>
                <source
                  media="(max-width: 1023px), (min-width: 1280px)"
                  srcSet={`/images/optimized-v1/industries/${industry.stem}-landscape-384.webp 384w, /images/optimized-v1/industries/${industry.stem}-landscape-768.webp 768w, /images/optimized-v1/industries/${industry.stem}-landscape-1024.webp 1024w`}
                  sizes={industryImageSizes}
                />
                <img
                  src={industry.image}
                  srcSet={`/images/optimized-v1/industries/${industry.stem}-384.webp 384w, /images/optimized-v1/industries/${industry.stem}-768.webp 768w, ${industry.image} 1024w`}
                  sizes={industryImageSizes}
                  alt=""
                  width={1024}
                  height={industry.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-105"
                />
              </picture>
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
