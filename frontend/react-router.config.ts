import type { Config } from "@react-router/dev/config";

const productSlugs = [
  "15-kva",
  "25-kva",
  "40-kva",
  "62-5-kva",
  "100-kva",
  "125-kva",
] as const;

export default {
  buildDirectory: "build",
  ssr: false,
  routeDiscovery: { mode: "initial" },
  prerender: [
    "/",
    "/products",
    "/about",
    "/services",
    "/contact",
    "/privacy",
    ...productSlugs.map((slug) => `/products/${slug}`),
  ],
} satisfies Config;
