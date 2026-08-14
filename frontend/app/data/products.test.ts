import { describe, expect, it } from "vitest";
import { getCompatibleOptions, getProduct, products } from "./products";

describe("product catalog", () => {
  it("contains unique resolvable slugs", () => {
    const slugs = products.map((product) => product.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(getProduct(slug)?.slug).toBe(slug));
  });

  it("derives options that remain compatible with the current selection", () => {
    const variants = products[0]!.variants;
    expect(
      getCompatibleOptions(
        variants,
        { type: "Silent Genset", alternator: "Cummins", phase: "Single Phase" },
        "phase",
      ),
    ).toEqual(["Single Phase", "Three Phase"]);
  });
});

