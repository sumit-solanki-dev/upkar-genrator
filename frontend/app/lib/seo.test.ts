import { describe, expect, it } from "vitest";
import { canonicalUrl, createRouteMeta, pageTitle, safeJsonLd } from "./seo";

describe("SEO helpers", () => {
  it("normalizes canonical paths against the production origin", () => {
    expect(canonicalUrl("//products/15-kva//")).toBe("https://upkargenerator.com/products/15-kva");
  });

  it("formats route titles consistently", () => {
    expect(pageTitle("Products")).toBe("Products | UPKAR Generator");
  });

  it("escapes markup when serializing JSON-LD", () => {
    expect(safeJsonLd({ value: "</script>" })).not.toContain("<");
  });

  it("creates absolute canonical and social metadata", () => {
    const meta = createRouteMeta({
      title: "Products",
      description: "Generator products",
      path: "/products",
    });
    expect(meta).toContainEqual({
      property: "og:image",
      content: "https://upkargenerator.com/images/generator-sequence-v2/poster.webp",
    });
    expect(meta).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "https://upkargenerator.com/products",
    });
  });
});
