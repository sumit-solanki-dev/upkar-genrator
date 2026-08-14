import { Link } from "react-router";

import { pageTitle } from "~/lib/seo";

export function meta() {
  return [
    { title: pageTitle("Page Not Found") },
    {
      name: "description",
      content: "The requested UPKAR Generator page could not be found.",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function NotFoundRoute() {
  return (
    <main
      id="main-content"
      className="relative grid min-h-[70svh] place-items-center overflow-hidden bg-slate-950 px-5 py-32 text-white sm:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:84px_84px]"
      />
      <section
        aria-labelledby="not-found-title"
        className="relative mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-300">
          404 · Page not found
        </p>
        <h1
          id="not-found-title"
          className="mt-4 text-balance text-4xl font-black sm:text-5xl"
        >
          We could not find the page you requested
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-300">
          Check the address, return to the homepage, or browse the available
          generator products.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-orange-300 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
          >
            Return home
          </Link>
          <Link
            to="/products"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-300"
          >
            Browse products
          </Link>
        </div>
      </section>
    </main>
  );
}
