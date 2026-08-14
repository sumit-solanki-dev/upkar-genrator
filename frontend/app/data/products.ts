import catalog from "./products.json";

export type ProductVariant = {
  type: string;
  alternator: string;
  phase: string;
  specifications: Record<string, string>;
};

export type Product = {
  name: string;
  model: string;
  kva: number;
  description: string;
  images: string[];
  gallery: string[];
  features: string[];
  applications: string[];
  variants: ProductVariant[];
  category: string;
  slug: string;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function assertCatalog(value: unknown): asserts value is Product[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("The product catalog must contain at least one product.");
  }

  const slugs = new Set<string>();

  value.forEach((candidate, index) => {
    if (!candidate || typeof candidate !== "object") {
      throw new Error(`Product ${index + 1} must be an object.`);
    }

    const product = candidate as Partial<Product>;
    const requiredStrings = [
      "name",
      "model",
      "description",
      "category",
      "slug",
    ] as const;

    requiredStrings.forEach((key) => {
      if (typeof product[key] !== "string" || !String(product[key]).trim()) {
        throw new Error(`Product ${index + 1} has an invalid ${key}.`);
      }
    });

    if (typeof product.kva !== "number" || !Number.isFinite(product.kva) || product.kva <= 0) {
      throw new Error(`Product ${product.slug ?? index + 1} has an invalid KVA rating.`);
    }

    if (slugs.has(product.slug!)) {
      throw new Error(`Duplicate product slug: ${product.slug}`);
    }
    slugs.add(product.slug!);

    if (
      !isStringArray(product.images) ||
      !isStringArray(product.gallery) ||
      !isStringArray(product.features) ||
      !isStringArray(product.applications)
    ) {
      throw new Error(`Product ${product.slug} has an invalid list field.`);
    }

    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      throw new Error(`Product ${product.slug} must provide at least one variant.`);
    }

    product.variants.forEach((candidateVariant, variantIndex) => {
      if (!candidateVariant || typeof candidateVariant !== "object") {
        throw new Error(`Variant ${variantIndex + 1} for ${product.slug} is invalid.`);
      }

      const variant = candidateVariant as Partial<ProductVariant>;
      if (![variant.type, variant.alternator, variant.phase].every((item) => typeof item === "string" && item)) {
        throw new Error(`Variant ${variantIndex + 1} for ${product.slug} is missing an option.`);
      }
      if (!variant.specifications || typeof variant.specifications !== "object") {
        throw new Error(`Variant ${variantIndex + 1} for ${product.slug} has invalid specifications.`);
      }
    });
  });
}

assertCatalog(catalog);

export const products: readonly Product[] = Object.freeze(catalog);

export function getProduct(slug: string | undefined): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductSearchText(product: Product): string {
  return [
    product.name,
    product.model,
    String(product.kva),
    product.category,
    product.description,
    ...product.features,
    ...product.applications,
    ...product.variants.flatMap((variant) => [
      variant.type,
      variant.alternator,
      variant.phase,
      ...Object.keys(variant.specifications),
      ...Object.values(variant.specifications),
    ]),
  ]
    .join(" ")
    .toLocaleLowerCase();
}

export function getCompatibleOptions(
  variants: readonly ProductVariant[],
  selection: Partial<Pick<ProductVariant, "type" | "alternator" | "phase">>,
  option: keyof Pick<ProductVariant, "type" | "alternator" | "phase">,
): string[] {
  const compatible = variants.filter((variant) =>
    Object.entries(selection).every(([key, selected]) => {
      return key === option || !selected || variant[key as keyof typeof selection] === selected;
    }),
  );

  return [...new Set(compatible.map((variant) => variant[option]))];
}
