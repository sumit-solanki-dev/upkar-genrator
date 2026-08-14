import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:slug", "routes/product-detail.tsx"),
  route("about", "routes/about.tsx"),
  route("services", "routes/services.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
