import { Link } from "react-router";
import type { Product } from "~/data/products";

export function ProductCard({ product }: { product: Product }) {
  const phases = [...new Set(product.variants.map((variant) => variant.phase))].join(", ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link
        aria-label={`View ${product.name}`}
        className="relative block aspect-[16/10] overflow-hidden bg-slate-100"
        to={`/products/${product.slug}`}
      >
        <img
          alt="Representative industrial diesel generator"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          decoding="async"
          height={620}
          loading="lazy"
          src={product.images[0]}
          width={980}
        />
        <span className="absolute bottom-2 right-2 rounded bg-slate-950/85 px-2 py-1 text-xs font-semibold text-white">
          Representative image
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">{product.category}</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">
          <Link className="rounded-sm hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4" to={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{product.description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-200 py-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-500">Power rating</dt>
            <dd className="mt-1 font-bold text-slate-950">{product.kva} KVA</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Available phase</dt>
            <dd className="mt-1 font-bold text-slate-950">{phases}</dd>
          </div>
        </dl>

        <Link
          className="mt-5 inline-flex min-h-11 items-center font-bold text-orange-800 underline decoration-2 underline-offset-4 hover:text-orange-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          to={`/products/${product.slug}`}
        >
          View {product.name}
        </Link>
      </div>
    </article>
  );
}
