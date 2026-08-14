import { isRouteErrorResponse, Link } from "react-router";
import type { Route } from "./+types/product-detail";
import { ProductCard } from "~/components/products/product-card";
import { ProductConfigurator } from "~/components/products/product-configurator";
import { ProductGallery } from "~/components/products/product-gallery";
import { ButtonLink } from "~/components/ui/button-link";
import { company } from "~/data/company";
import { getProduct, products } from "~/data/products";
import { canonicalUrl, createRouteMeta, pageTitle, safeJsonLd } from "~/lib/seo";

function loadProduct(slug: string | undefined) {
  const product = getProduct(slug);
  if (!product) {
    throw new Response("Product not found", { status: 404, statusText: "Not Found" });
  }
  return product;
}

export function loader({ params }: Route.LoaderArgs) {
  return loadProduct(params.slug);
}

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  return loadProduct(params.slug);
}

export function meta({ loaderData, params }: Route.MetaArgs) {
  const product = loaderData ?? getProduct(params.slug);
  if (!product) {
    return [
      { title: pageTitle("Product Not Found") },
      { name: "robots", content: "noindex, nofollow" },
    ];
  }

  return createRouteMeta({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
    ogType: "product",
  });
}

export function HydrateFallback() {
  return (
    <main className="min-h-[70vh] px-5 pb-20 pt-36" id="main-content">
      <div aria-busy="true" className="mx-auto max-w-7xl animate-pulse">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="mt-5 h-12 max-w-2xl rounded bg-slate-200" />
      </div>
    </main>
  );
}

export default function ProductDetailRoute({ loaderData: product }: Route.ComponentProps) {
  const gallery = product.gallery.length ? product.gallery : product.images;
  const relatedProducts = products.filter((candidate) => candidate.slug !== product.slug).slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    model: product.model,
    description: product.description,
    image: product.images.map((image) => new URL(image, canonicalUrl("/")).toString()),
    brand: { "@type": "Brand", name: company.name },
    category: product.category,
    url: canonicalUrl(`/products/${product.slug}`),
  };

  return (
    <main className="pb-20 pt-28" id="main-content">
      <script
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
        type="application/ld+json"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="underline underline-offset-4 hover:text-teal-900" to="/products">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-slate-950">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <ProductGallery images={gallery} productName={product.name} />
          </div>

          <section aria-labelledby="product-title">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-800">{product.category}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl" id="product-title">
              {product.name}
            </h1>
            <p className="mt-3 text-lg font-bold text-orange-800">Model {product.model} · {product.kva} KVA</p>
            <p className="mt-5 text-lg leading-8 text-slate-600">{product.description}</p>

            <ProductConfigurator variants={product.variants} />

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={company.phone.href}>Call {company.phone.display}</ButtonLink>
              <ButtonLink
                rel="noopener noreferrer"
                target="_blank"
                to={company.whatsappUrl}
                variant="secondary"
              >
                Discuss on WhatsApp
              </ButtonLink>
            </div>
          </section>
        </div>

        <div className="mt-20 grid gap-10 rounded-xl bg-slate-50 p-7 md:grid-cols-2 lg:p-10">
          <section aria-labelledby="features-heading">
            <h2 className="text-2xl font-black text-slate-950" id="features-heading">Key features</h2>
            <ul className="mt-5 space-y-3 text-slate-700">
              {product.features.map((feature) => (
                <li className="flex gap-3" key={feature}>
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-700" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="applications-heading">
            <h2 className="text-2xl font-black text-slate-950" id="applications-heading">Typical applications</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {product.applications.map((application) => (
                <li className="rounded-full border border-teal-800 px-4 py-2 text-sm font-bold text-teal-900" key={application}>
                  {application}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {relatedProducts.length ? (
          <section aria-labelledby="related-products-heading" className="mt-20">
            <h2 className="text-3xl font-black text-slate-950" id="related-products-heading">Related generators</h2>
            <div className="mt-7 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((candidate) => <ProductCard key={candidate.slug} product={candidate} />)}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="min-h-[70vh] px-5 pb-20 pt-36" id="main-content">
      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-slate-50 p-8 text-center sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-800">
          {missing ? "Product not found" : "Product unavailable"}
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">
          {missing ? "We could not find this generator" : "We could not load this product"}
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          {missing
            ? "Check the address or browse the available UPKAR generator models."
            : "Please try again or contact us for product information."}
        </p>
        <ButtonLink className="mt-7" to="/products">View all products</ButtonLink>
      </section>
    </main>
  );
}
