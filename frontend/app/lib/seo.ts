import type { MetaDescriptor } from "react-router";

export const siteOrigin = "https://upkargenerator.com";
export const socialImagePath = "/images/generator-sequence-v2/poster.webp";

export function canonicalUrl(pathname: string): string {
  const normalizedPath = pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  return new URL(normalizedPath, siteOrigin).toString();
}

export function pageTitle(title?: string): string {
  return title ? `${title} | UPKAR Generator` : "UPKAR Generator | Power You Can Trust";
}

export function createRouteMeta({
  description,
  ogType = "website",
  path,
  robots,
  title,
}: {
  description: string;
  ogType?: "product" | "website";
  path: string;
  robots?: string;
  title?: string;
}): MetaDescriptor[] {
  const resolvedTitle = pageTitle(title);
  const url = canonicalUrl(path);
  const image = canonicalUrl(socialImagePath);

  return [
    { title: resolvedTitle },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    ...(robots ? [{ name: "robots", content: robots } satisfies MetaDescriptor] : []),
    { property: "og:site_name", content: "UPKAR Generator" },
    { property: "og:type", content: ogType },
    { property: "og:title", content: resolvedTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:type", content: "image/webp" },
    { property: "og:image:width", content: "1280" },
    { property: "og:image:height", content: "720" },
    { property: "og:image:alt", content: "UPKAR enclosed industrial diesel generator" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: resolvedTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: "UPKAR enclosed industrial diesel generator" },
  ];
}

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
