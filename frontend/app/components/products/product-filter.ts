import type { Product } from "~/data/products";
import { getProductSearchText } from "~/data/products";

export type KvaRange = {
  label: string;
  max: number;
  min: number;
  value: string;
};

export const allKvaRange: KvaRange = {
  label: "All power ratings",
  value: "all",
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
};

export function createKvaRanges(products: readonly Product[]): KvaRange[] {
  const candidates: KvaRange[] = [
    { label: "Up to 50 KVA", value: "0-50", min: 0, max: 50 },
    { label: "51–125 KVA", value: "51-125", min: 50.00001, max: 125 },
    { label: "126–250 KVA", value: "126-250", min: 125.00001, max: 250 },
    { label: "Above 250 KVA", value: "251-plus", min: 250.00001, max: Number.POSITIVE_INFINITY },
  ];

  return [
    allKvaRange,
    ...candidates.filter((range) =>
      products.some((product) => product.kva >= range.min && product.kva <= range.max),
    ),
  ];
}

export function filterProducts(
  products: readonly Product[],
  filters: { category: string; kvaRange: KvaRange; query: string },
): Product[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return products.filter((product) => {
    const categoryMatches = filters.category === "all" || product.category === filters.category;
    const kvaMatches = product.kva >= filters.kvaRange.min && product.kva <= filters.kvaRange.max;
    const searchMatches = query.length === 0 || getProductSearchText(product).includes(query);
    return categoryMatches && kvaMatches && searchMatches;
  });
}

