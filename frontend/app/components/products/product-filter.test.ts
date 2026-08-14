import { describe, expect, it } from "vitest";
import { createKvaRanges, filterProducts } from "./product-filter";
import { products } from "~/data/products";

describe("product filtering", () => {
  const ranges = createKvaRanges(products);

  it.each(["15", "single phase", "three phase", "cummins", "stamford", "silent genset"])(
    "searches normalized root and variant fields for %s",
    (query) => {
      const matches = filterProducts(products, {
        category: "all",
        kvaRange: ranges[0]!,
        query,
      });
      expect(matches.length).toBeGreaterThan(0);
    },
  );

  it("returns no products for an unknown search instead of throwing", () => {
    expect(
      filterProducts(products, {
        category: "all",
        kvaRange: ranges[0]!,
        query: "not-a-real-generator",
      }),
    ).toEqual([]);
  });

  it("omits power ranges with no matching products", () => {
    expect(ranges.map((range) => range.value)).toEqual(["all", "0-50", "51-125"]);
  });
});

