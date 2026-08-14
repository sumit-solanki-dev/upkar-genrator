import {
  CallToActionSection,
  CapabilitiesSection,
  CompanyStatsSection,
  FeaturedProducts,
  HomeHero,
  IndustriesSection,
  ManufacturingProcessSection,
} from "~/components/home";
import { products } from "~/data/products";
import { ScrollSequence } from "~/features/scroll-sequence/scroll-sequence";
import { createRouteMeta } from "~/lib/seo";

export function meta() {
  const description =
    "UPKAR Generator provides diesel generator products and practical support for commercial and industrial power requirements.";
  return createRouteMeta({ description, path: "/" });
}

export default function HomeRoute() {
  return (
    <main id="main-content">
      <HomeHero />
      <ScrollSequence />
      <CapabilitiesSection />
      <CompanyStatsSection />
      <IndustriesSection />
      <ManufacturingProcessSection />
      <CallToActionSection />
      <FeaturedProducts products={products} />
    </main>
  );
}
