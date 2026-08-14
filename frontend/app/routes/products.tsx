import { useMemo, useRef } from "react";
import { Button } from "@heroui/react/button";
import { useSearchParams } from "react-router";
import { ProductCard } from "~/components/products/product-card";
import {
  allKvaRange,
  createKvaRanges,
  filterProducts,
} from "~/components/products/product-filter";
import { products } from "~/data/products";
import { createRouteMeta } from "~/lib/seo";

export function meta() {
  const description =
    "Browse UPKAR diesel generator models by power rating, configuration, alternator, and phase.";
  return createRouteMeta({ title: "Diesel Generator Products", description, path: "/products" });
}

export default function ProductsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const kva = searchParams.get("kva") ?? "all";
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [],
  );
  const kvaRanges = useMemo(() => createKvaRanges(products), []);
  const selectedRange = kvaRanges.find((range) => range.value === kva) ?? allKvaRange;
  const filteredProducts = filterProducts(products, {
    query,
    category,
    kvaRange: selectedRange,
  });

  function updateFilter(name: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      next.delete(name);
    } else {
      next.set(name, value);
    }
    setSearchParams(next, { replace: true });
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
    requestAnimationFrame(() => resultsHeading.current?.focus());
  }

  return (
    <main id="main-content">
      <section className="bg-slate-950 px-5 pb-16 pt-32 text-white sm:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-400">Product range</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Diesel generator products
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Compare UPKAR generator models and explore the available type, alternator, and phase combinations.
          </p>
        </div>
      </section>

      <section aria-labelledby="product-results-heading" className="px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <form
            aria-label="Filter generator products"
            className="grid gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-3 lg:p-7"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label className="block text-sm font-bold text-slate-800" htmlFor="product-search">
                Search products
              </label>
              <input
                autoComplete="off"
                className="mt-2 min-h-11 w-full rounded-md border border-slate-400 bg-white px-4 text-slate-950 outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/25"
                id="product-search"
                onChange={(event) => updateFilter("q", event.currentTarget.value)}
                placeholder="Model, KVA, phase or alternator"
                type="search"
                value={query}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800" htmlFor="product-category">
                Category
              </label>
              <select
                className="mt-2 min-h-11 w-full rounded-md border border-slate-400 bg-white px-4 text-slate-950 outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/25"
                id="product-category"
                onChange={(event) => updateFilter("category", event.currentTarget.value)}
                value={category}
              >
                <option value="all">All categories</option>
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800" htmlFor="product-kva">
                Power rating
              </label>
              <select
                className="mt-2 min-h-11 w-full rounded-md border border-slate-400 bg-white px-4 text-slate-950 outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/25"
                id="product-kva"
                onChange={(event) => updateFilter("kva", event.currentTarget.value)}
                value={selectedRange.value}
              >
                {kvaRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div aria-atomic="true" aria-live="polite" className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <h2
              className="text-xl font-bold text-slate-950 focus:outline-none"
              id="product-results-heading"
              ref={resultsHeading}
              tabIndex={-1}
            >
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
            </h2>
            {searchParams.size > 0 ? (
              <Button
                className="min-h-11 rounded-md px-4 font-bold text-teal-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                onPress={clearFilters}
                type="button"
                variant="ghost"
              >
                Clear filters
              </Button>
            ) : null}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-7 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <section className="mt-7 rounded-xl border border-dashed border-slate-400 bg-slate-50 p-10 text-center" role="status">
              <h2 className="text-2xl font-bold text-slate-950">No products match those filters</h2>
              <p className="mt-3 text-slate-600">Try another model, power range, phase, or alternator.</p>
              <Button
                className="mt-6 min-h-11 rounded-md bg-teal-800 px-5 font-bold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4"
                onPress={clearFilters}
                type="button"
                variant="primary"
              >
                Show all products
              </Button>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
