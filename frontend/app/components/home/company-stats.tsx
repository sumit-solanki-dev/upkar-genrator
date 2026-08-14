import { company } from "~/data/company";

export function CompanyStatsSection() {
  return (
    <section
      aria-labelledby="company-track-record-title"
      className="relative isolate overflow-hidden bg-[#075f5c] py-12 text-white sm:py-14 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,#075f5c_0%,#064e4b_52%,#0b1220_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[56px_56px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-1/2 -z-10 size-72 -translate-y-1/2 rounded-full bg-orange-400/15 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-9 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,1.1fr)] lg:gap-14 lg:px-8">
        <div className="max-w-xl">
          <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-orange-300">
            <span aria-hidden="true" className="h-0.5 w-8 bg-orange-400" />
            Proven track record
          </p>
          <h2
            id="company-track-record-title"
            className="mt-4 text-balance text-3xl font-bold leading-tight sm:text-4xl"
          >
            Experience built through dependable delivery
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-teal-50/85">
            Since {company.foundedYear}, every completed generator has added to a
            practical understanding of reliable commercial and industrial power.
          </p>
        </div>

        <dl aria-label="Company track record" className="grid gap-4 sm:grid-cols-2">
          {company.proofPoints.map((proofPoint) => (
            <div
              key={proofPoint.label}
              className="flex min-h-44 flex-col justify-center rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl shadow-slate-950/15 backdrop-blur-sm sm:p-7"
            >
              <dt className="order-2 mt-2 text-sm font-bold uppercase tracking-[0.12em] text-teal-50">
                {proofPoint.label}
              </dt>
              <dd className="order-1 flex flex-col items-start text-5xl font-black tracking-tight text-white sm:text-6xl">
                <span>{proofPoint.value}</span>
                <span
                  aria-hidden="true"
                  className="mt-5 h-1 w-14 rounded-full bg-orange-400"
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
