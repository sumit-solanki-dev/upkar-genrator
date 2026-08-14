import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@heroui/react/button";
import { ToggleButton } from "@heroui/react/toggle-button";
import { Link } from "react-router";

import { SectionHeading } from "./section-heading";
import "./featured-products.css";

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export interface FeaturedProduct {
  slug: string;
  name: string;
  model: string;
  category: string;
  kva: number;
  description: string;
  images: readonly string[];
  variants: readonly {
    type: string;
    alternator?: string;
    phase: string;
  }[];
}

interface FeaturedProductsProps {
  products: readonly FeaturedProduct[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.slice(0, 6);
  const trackRef = useRef<HTMLUListElement>(null);
  const capacityRailRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef(0);
  const activeIndexRef = useRef(0);
  const targetIndexRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const setCurrentIndex = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const scrollToProduct = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const track = trackRef.current;
      const slide = track?.children.item(index) as HTMLElement | null;
      if (!track || !slide) return;

      const trackBounds = track.getBoundingClientRect();
      const slideBounds = slide.getBoundingClientRect();
      const left = track.scrollLeft + slideBounds.left - trackBounds.left;

      targetIndexRef.current = index;
      setCurrentIndex(index);
      track.scrollTo?.({
        left,
        behavior: behavior ?? (prefersReducedMotion() ? "auto" : "smooth"),
      });
    },
    [setCurrentIndex],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateCurrentSlide = () => {
      animationFrameRef.current = 0;
      const trackLeft = track.getBoundingClientRect().left;
      const slides = Array.from(track.children) as HTMLElement[];
      let nearestIndex = activeIndexRef.current;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      if (targetIndexRef.current !== null) {
        if (nearestIndex === targetIndexRef.current) targetIndexRef.current = null;
        else return;
      }

      if (nearestIndex !== activeIndexRef.current) setCurrentIndex(nearestIndex);
    };

    const handleScroll = () => {
      if (animationFrameRef.current) return;
      animationFrameRef.current = requestAnimationFrame(updateCurrentSlide);
    };
    const handlePointerDown = () => {
      targetIndexRef.current = null;
    };
    const handleResize = () => scrollToProduct(activeIndexRef.current, "auto");

    track.addEventListener("scroll", handleScroll, { passive: true });
    track.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      track.removeEventListener("scroll", handleScroll);
      track.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scrollToProduct, setCurrentIndex]);

  useEffect(() => {
    const rail = capacityRailRef.current;
    const button = rail?.querySelector<HTMLElement>(`[data-product-index="${activeIndex}"]`);
    if (!rail || !button) return;

    const railBounds = rail.getBoundingClientRect();
    const buttonBounds = button.getBoundingClientRect();
    const left =
      rail.scrollLeft +
      buttonBounds.left -
      railBounds.left -
      (railBounds.width - buttonBounds.width) / 2;
    rail.scrollTo?.({
      left,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeIndex]);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="featured-products-title"
      className="relative isolate overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-70 bg-[linear-gradient(rgba(15,118,110,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.05)_1px,transparent_1px)] bg-size-[80px_80px]"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Product range"
            title="Find the right capacity for your site"
            titleId="featured-products-title"
            description="Explore our generator range one capacity at a time, then open a model to configure its available options."
          />
          <div className="flex w-full flex-col items-start gap-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between sm:w-auto sm:justify-start">
            <Link
              to="/products"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#075f5c] px-5 py-2 text-sm font-bold text-[#075f5c] transition hover:bg-[#075f5c] hover:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
            >
              View all products
            </Link>
            <div className="flex items-center gap-2" aria-label="Product carousel controls">
              <Button
                type="button"
                aria-label="Previous product"
                className="grid size-11 place-items-center rounded-full border border-slate-300 bg-white text-slate-950 shadow-sm transition hover:border-[#075f5c] hover:bg-teal-50 hover:text-[#075f5c] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
                isDisabled={activeIndex === 0}
                isIconOnly
                onPress={() => scrollToProduct(activeIndex - 1)}
                variant="ghost"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <p aria-hidden="true" className="min-w-14 text-center text-sm font-bold tabular-nums text-slate-600">
                {String(activeIndex + 1).padStart(2, "0")} / {String(featuredProducts.length).padStart(2, "0")}
              </p>
              <Button
                type="button"
                aria-label="Next product"
                className="grid size-11 place-items-center rounded-full border border-slate-300 bg-white text-slate-950 shadow-sm transition hover:border-[#075f5c] hover:bg-teal-50 hover:text-[#075f5c] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
                isDisabled={activeIndex === featuredProducts.length - 1}
                isIconOnly
                onPress={() => scrollToProduct(activeIndex + 1)}
                variant="ghost"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <div
          aria-label="Featured generator models"
          aria-roledescription="carousel"
          className="mt-10"
          role="region"
        >
          <p aria-live="polite" className="sr-only">
            Showing {featuredProducts[activeIndex]?.name}, product {activeIndex + 1} of {featuredProducts.length}
          </p>
          <ul
            aria-label="Generator model slides"
            className="ug-products-carousel__track relative flex list-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain p-0"
            ref={trackRef}
          >
            {featuredProducts.map((product, index) => {
              const image = product.images[0] ?? "/images/generator-hero.svg";
              const types = [...new Set(product.variants.map((variant) => variant.type))];
              const phases = [...new Set(product.variants.map((variant) => variant.phase))];
              const alternators = [
                ...new Set(
                  product.variants
                    .map((variant) => variant.alternator)
                    .filter((value): value is string => Boolean(value)),
                ),
              ];
              const selected = index === activeIndex;

              return (
                <li
                  aria-hidden={!selected}
                  className="w-full min-w-full snap-start snap-always"
                  id={`featured-product-${product.slug}`}
                  inert={!selected}
                  key={product.slug}
                >
                <article
                  aria-label={`${product.name}, slide ${index + 1} of ${featuredProducts.length}`}
                  aria-roledescription="slide"
                  className="grid min-h-full overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[minmax(0,1.12fr)_minmax(23rem,0.88fr)]"
                  role="group"
                >
                  <Link
                    to={`/products/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="group relative grid aspect-video place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_60%,rgba(13,148,136,0.26),transparent_43%),linear-gradient(135deg,#07101e,#172033)] focus-visible:z-10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-orange-300 lg:aspect-auto lg:min-h-[31rem]"
                  >
                    <span className="absolute left-5 top-5 z-10 inline-flex items-end gap-2 rounded-xl border border-white/15 bg-slate-950/65 px-4 py-3 text-white shadow-lg backdrop-blur sm:left-7 sm:top-7">
                      <span className="text-3xl font-black leading-none sm:text-4xl">{product.kva}</span>
                      <span className="pb-0.5 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">KVA</span>
                    </span>
                    <img
                      src={image}
                      alt="Representative industrial diesel generator"
                      width={980}
                      height={620}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.025]"
                    />
                    <span className="absolute bottom-3 right-3 max-w-[calc(100%-1.5rem)] rounded-md bg-slate-950/75 px-2.5 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur sm:bottom-4 sm:right-4 sm:max-w-none sm:px-3 sm:py-1.5 sm:text-xs">
                      Representative image
                    </span>
                  </Link>
                  <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#075f5c]">
                      {product.category} · {product.model}
                    </p>
                    <h3 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                      <Link
                        to={`/products/${product.slug}`}
                        className="rounded-sm hover:text-[#075f5c] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-4 line-clamp-3 text-base leading-7 text-slate-600 sm:line-clamp-none sm:mt-5">
                      {product.description}
                    </p>
                    <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-y border-slate-200 py-4 text-sm sm:mt-6 sm:py-5">
                      <div>
                        <dt className="font-semibold text-slate-500">Enclosure</dt>
                        <dd className="mt-1 font-bold text-slate-950">
                          {types.length > 1 ? "Open or silent" : types[0]}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-500">Phase</dt>
                        <dd className="mt-1 font-bold text-slate-950">
                          {phases.length > 1 ? "Single or three" : phases[0]}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="font-semibold text-slate-500">Alternator options</dt>
                        <dd className="mt-1 font-bold text-slate-950">
                          {alternators.join(" or ") || "Options available"}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      to={`/products/${product.slug}`}
                      className="mt-6 inline-flex min-h-12 items-center justify-center self-start rounded-lg bg-[#075f5c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#054b49] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500 sm:mt-7"
                    >
                      Configure this model
                      <span aria-hidden="true" className="ml-2">→</span>
                    </Link>
                  </div>
                </article>
                </li>
              );
            })}
          </ul>

          <div
            aria-label="Choose a generator capacity"
            className="ug-products-carousel__rail mt-6 flex gap-2 overflow-x-auto pb-1"
            ref={capacityRailRef}
            role="navigation"
          >
            {featuredProducts.map((product, index) => {
              const selected = index === activeIndex;
              return (
                <ToggleButton
                  aria-controls={`featured-product-${product.slug}`}
                  aria-current={selected ? "true" : undefined}
                  className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500 ${
                    selected
                      ? "border-[#075f5c] bg-[#075f5c] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-[#075f5c] hover:text-[#075f5c]"
                  }`}
                  data-product-index={index}
                  isSelected={selected}
                  key={product.slug}
                  onPress={() => scrollToProduct(index)}
                  variant="ghost"
                >
                  {product.kva} KVA
                </ToggleButton>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
