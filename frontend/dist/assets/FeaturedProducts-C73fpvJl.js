async function d(){let a=[];try{a=(await(await fetch("/products.json")).json()).slice(0,4)}catch(e){console.error("Failed to fetch featured products:",e)}const t=document.createElement("section");return t.className="featured-products",t.dataset.featuredProducts="section",t.innerHTML=`
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
          ${a.map(e=>`
              <article class="featured-product-card swiper-slide">
                <figure class="featured-product-card__media">
                  <img
                    src="${e.images[0]}"
                    alt="${e.name} diesel generator"
                    width="980"
                    height="620"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div class="featured-product-card__body">
                  <p class="featured-product-card__model">${e.category}</p>
                  <dl class="featured-product-card__specs">
                    <div>
                      <dt>KVA</dt>
                      <dd>${e.kva} KVA</dd>
                    </div>
                    <div>
                      <dt>Alternator</dt>
                      <dd>${e.variants?e.variants[0].alternator:"Standard"}</dd>
                    </div>
                  </dl>
                  <p class="featured-product-card__description">${e.description}</p>
                  <a class="featured-product-card__button" href="/products/${e.slug}">View Details</a>
                </div>
              </article>
            `).join("")}
        </div>

        <button class="featured-products__nav featured-products__nav--prev swiper-button-prev" type="button" aria-label="Previous product"></button>
        <button class="featured-products__nav featured-products__nav--next swiper-button-next" type="button" aria-label="Next product"></button>
        
        <div class="featured-products__controls" aria-label="Featured products carousel controls">
          <div class="featured-products__pagination swiper-pagination"></div>
        </div>
      </div>
    </div>
  `,t}export{d as createFeaturedProductsSection};
