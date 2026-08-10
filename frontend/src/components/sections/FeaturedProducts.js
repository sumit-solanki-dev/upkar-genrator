export async function createFeaturedProductsSection() {
  let products = [];
  try {
    const res = await fetch("/products.json");
    const data = await res.json();
    // For featured, we can pick some specific ones or just the first 4
    products = data.slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
  }

  const section = document.createElement("section");

  section.className = "featured-products";
  section.dataset.featuredProducts = "section";
  section.innerHTML = `
    <div class="container featured-products__inner">
      <div class="featured-products__heading">
        <p class="featured-products__eyebrow">Product Range</p>
        <h2 class="featured-products__title">Featured Products</h2>
      </div>

      <div
        class="featured-products__swiper swiper js-swiper"
        data-featured-products-slider
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured products"
      >
        <div class="swiper-wrapper">
          ${products.map(
            (product) => `
              <article class="featured-product-card swiper-slide">
                <figure class="featured-product-card__media">
                  <img
                    src="${product.images[0]}"
                    alt="${product.model} diesel generator"
                    width="980"
                    height="620"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div class="featured-product-card__body">
                  <p class="featured-product-card__model">${product.model}</p>
                  <dl class="featured-product-card__specs">
                    <div>
                      <dt>KVA</dt>
                      <dd>${product.kva} KVA</dd>
                    </div>
                    <div>
                      <dt>Engine</dt>
                      <dd>${product.engine}</dd>
                    </div>
                  </dl>
                  <p class="featured-product-card__description">${product.description}</p>
                  <a class="featured-product-card__button" href="/products/${product.slug}">View Details</a>
                </div>
              </article>
            `,
          ).join("")}
        </div>

        <div class="featured-products__controls" aria-label="Featured products carousel controls">
          <button class="featured-products__nav featured-products__nav--prev swiper-button-prev" type="button" aria-label="Previous product"></button>
          <div class="featured-products__pagination swiper-pagination"></div>
          <button class="featured-products__nav featured-products__nav--next swiper-button-next" type="button" aria-label="Next product"></button>
        </div>
      </div>
    </div>
  `;

  return section;
}
