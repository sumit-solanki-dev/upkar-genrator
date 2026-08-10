import { setPageMeta } from "../../utils/seo.js";

let PRODUCTS = [];

const KVA_RANGES = [
  { label: "All KVA", value: "all", min: 0, max: Infinity },
  { label: "Up to 50 KVA", value: "0-50", min: 0, max: 50 },
  { label: "51 - 125 KVA", value: "51-125", min: 51, max: 125 },
  { label: "126 - 250 KVA", value: "126-250", min: 126, max: 250 },
  { label: "251+ KVA", value: "251-plus", min: 251, max: Infinity },
];

const ITEMS_PER_PAGE = 6;

function getCategories() {
  return ["All Categories", ...new Set(PRODUCTS.map((product) => product.category))];
}

function getRange(value) {
  return KVA_RANGES.find((range) => range.value === value) || KVA_RANGES[0];
}

function formatKva(kva) {
  return Number.isInteger(kva) ? String(kva) : String(kva);
}

function createProductCard(product) {
  return `
    <article class="product-listing-card" itemscope itemtype="https://schema.org/Product">
      <figure class="product-listing-card__media">
        <a href="/products/${product.slug}">
          <img
            src="${product.images[0]}"
            alt="${product.name} diesel generator"
            width="980"
            height="620"
            loading="lazy"
            decoding="async"
            itemprop="image"
          />
        </a>
      </figure>

      <div class="product-listing-card__body">
        <p class="product-listing-card__category">${product.category}</p>
        <h2 class="product-listing-card__title" itemprop="name">
          <a href="/products/${product.slug}" style="text-decoration:none; color:inherit;">${product.name}</a>
        </h2>
        <p class="product-listing-card__description" itemprop="description">${product.description}</p>

        <dl class="product-listing-card__specs">
          <div>
            <dt>KVA</dt>
            <dd>${formatKva(product.kva)}</dd>
          </div>
          <div>
            <dt>Phase</dt>
            <dd>${product.specifications?.phase || (product.variants ? product.variants[0].phase : "N/A")}</dd>
          </div>
        </dl>

        <a class="product-listing-card__link" href="/products/${product.slug}" aria-label="View details for ${product.name}">VIEW DETAILS</a>
      </div>
    </article>
  `;
}

function createPaginationButton(label, page, isActive = false) {
  return `
    <button
      class="product-listing__page-button ${isActive ? "is-active" : ""}"
      type="button"
      data-page="${page}"
      aria-label="${isActive ? "Current page" : "Go to page"} ${page}"
      ${isActive ? 'aria-current="page"' : ""}
    >
      ${label}
    </button>
  `;
}

function filterProducts({ query, category, kvaRange }) {
  const normalizedQuery = query.trim().toLowerCase();
  const range = getRange(kvaRange);

  return PRODUCTS.filter((product) => {
    const matchesSearch =
      !normalizedQuery ||
      [product.name, product.category, product.description, product.specifications.phase, product.specifications.fuel]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesCategory = category === "All Categories" || product.category === category;
    const matchesKva = product.kva >= range.min && product.kva <= range.max;

    return matchesSearch && matchesCategory && matchesKva;
  });
}

export async function createProductListingPage() {
  try {
    const res = await fetch("/products.json");
    PRODUCTS = await res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  setPageMeta({
    title: "Products",
    description:
      "Browse UPKAR Generator products by category and KVA rating with industrial diesel generator options for businesses.",
    path: "/products/",
  });

  const page = document.createElement("div");
  const categories = getCategories();
  const state = {
    query: "",
    category: categories[0],
    kvaRange: "all",
    page: 1,
  };

  page.className = "product-listing-page";
  page.innerHTML = `
    <section class="product-listing-hero" aria-labelledby="product-listing-title">
      <div class="container product-listing-hero__inner">
        <p class="product-listing-hero__eyebrow">Product Range</p>
        <h1 class="product-listing-hero__title" id="product-listing-title">Diesel Generator Products</h1>
        <p class="product-listing-hero__description">
          Explore placeholder UPKAR generator models by application, category, and power capacity.
        </p>
      </div>
    </section>

    <section class="product-listing" aria-label="Product listing">
      <div class="container product-listing__inner">
        <form class="product-listing__filters" data-product-filters>
          <div class="product-listing__field product-listing__field--search">
            <label for="product-search">Search</label>
            <input id="product-search" type="search" name="search" placeholder="Search products" autocomplete="off" />
          </div>

          <div class="product-listing__field">
            <label for="product-category">Category</label>
            <select id="product-category" name="category">
              ${categories.map((category) => `<option value="${category}">${category}</option>`).join("")}
            </select>
          </div>

          <div class="product-listing__field">
            <label for="product-kva">KVA</label>
            <select id="product-kva" name="kva">
              ${KVA_RANGES.map((range) => `<option value="${range.value}">${range.label}</option>`).join("")}
            </select>
          </div>
        </form>

        <div class="product-listing__summary" aria-live="polite" data-product-summary></div>
        <div class="product-listing__grid" data-product-grid></div>
        <nav class="product-listing__pagination" aria-label="Product pagination" data-product-pagination></nav>
      </div>
    </section>
  `;

  const form = page.querySelector("[data-product-filters]");
  const grid = page.querySelector("[data-product-grid]");
  const summary = page.querySelector("[data-product-summary]");
  const pagination = page.querySelector("[data-product-pagination]");

  function render() {
    const filteredProducts = filterProducts(state);
    const pageCount = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

    state.page = Math.min(state.page, pageCount);

    const start = (state.page - 1) * ITEMS_PER_PAGE;
    const visibleProducts = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

    summary.textContent = `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} found`;
    grid.innerHTML =
      visibleProducts.length > 0
        ? visibleProducts.map(createProductCard).join("")
        : `
          <div class="product-listing__empty" role="status">
            <h2>No products found</h2>
            <p>Try changing the search term, category, or KVA filter.</p>
          </div>
        `;
    pagination.innerHTML =
      pageCount > 1
        ? Array.from({ length: pageCount }, (_, index) =>
            createPaginationButton(String(index + 1), index + 1, state.page === index + 1),
          ).join("")
        : "";
  }

  form.addEventListener("input", () => {
    const formData = new FormData(form);

    state.query = String(formData.get("search") || "");
    state.category = String(formData.get("category") || categories[0]);
    state.kvaRange = String(formData.get("kva") || "all");
    state.page = 1;
    render();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");

    if (!button) {
      return;
    }

    state.page = Number(button.dataset.page || 1);
    render();
    page.querySelector(".product-listing__summary")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  });

  render();

  return page;
}
