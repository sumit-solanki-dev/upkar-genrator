import { setPageMeta } from "../../utils/seo.js";
import { qs, qsa } from "../../utils/dom.js";

async function fetchProducts() {
  try {
    const res = await fetch(`/products.json?v=${new Date().getTime()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      }
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

function getAvailableOptions(variants, key, currentFilters = {}) {
  const filtered = variants.filter(v => {
    return Object.entries(currentFilters).every(([k, val]) => v[k] === val);
  });
  return [...new Set(filtered.map(v => v[key]))];
}

function findBestVariant(variants, type, alternator, phase) {
  let variant = variants.find(v => v.type === type && v.alternator === alternator && v.phase === phase);
  if (variant) return variant;

  variant = variants.find(v => v.type === type && v.alternator === alternator);
  if (variant) return variant;

  variant = variants.find(v => v.type === type);
  return variant || variants[0];
}

function createRelatedProductCard(product) {
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
            <dd>${product.kva}</dd>
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

export async function createProductDetailsPage(slug) {
  const products = await fetchProducts();
  const product = products.find(p => p.slug === slug);

  if (!product) {
    const section = document.createElement("section");
    section.className = "page-shell";
    section.innerHTML = `
      <div class="container page-shell__inner">
        <p class="page-shell__eyebrow">Product Not Found</p>
        <h1 class="page-shell__title">We could not find this product</h1>
        <p class="page-shell__description">Please check the URL or browse our other generator models.</p>
        <a class="button button--primary" href="/products">View All Products</a>
      </div>
    `;
    return section;
  }

  setPageMeta({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
  });

  const section = document.createElement("section");
  section.className = "product-details";

  // Fallbacks if data structure doesn't have new fields
  const variants = product.variants || [
    {
      type: "Standard",
      alternator: "Standard",
      phase: product.specifications?.phase || "Three Phase",
      specifications: product.specifications || {}
    }
  ];
  
  const images = product.gallery || product.images || [];
  const mainImage = images[0] || "/images/generator-hero.svg";

  let currentState = variants[0];

  const types = ["Open Genset", "Silent Genset"];
  const alternators = ["Cummins", "Stamford"];
  const phases = ["Single Phase", "Three Phase"];

  const features = product.features || ["Reliable performance", "High efficiency", "Industrial build quality"];
  const applications = product.applications || ["Industrial", "Commercial"];

  // Get up to 3 related products
  const relatedProducts = products
    .filter(p => p.slug !== product.slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  section.innerHTML = `
    <div class="container product-details__container">
      
      <div class="product-details__overview">
        <!-- Gallery -->
        <div class="product-gallery">
          <div class="product-gallery__main">
            <img src="${mainImage}" alt="${product.name}" id="main-product-image" />
          </div>
          ${images.length > 1 ? `
            <div class="product-gallery__thumbnails">
              ${images.map((img, idx) => `
                <button class="product-gallery__thumbnail ${idx === 0 ? 'is-active' : ''}" data-image-src="${img}" aria-label="View image ${idx + 1}">
                  <img src="${img}" alt="Thumbnail ${idx + 1}" />
                </button>
              `).join("")}
            </div>
          ` : ""}
        </div>

        <!-- Configuration -->
        <div class="product-config">
          <div>
            <h1 class="product-config__title">${product.name}</h1>
            <p class="product-config__desc">${product.description}</p>
          </div>

          <!-- Type Selector -->
          <div class="config-group">
            <span class="config-group__label">Generator Type</span>
            <div class="config-group__options" id="config-types">
              ${types.map(t => `<button class="config-option" data-type="type" data-value="${t}">${t}</button>`).join('')}
            </div>
          </div>

          <!-- Alternator Selector -->
          <div class="config-group">
            <span class="config-group__label">Alternator</span>
            <div class="config-group__options" id="config-alternators">
              ${alternators.map(a => `<button class="config-option" data-type="alternator" data-value="${a}">${a}</button>`).join('')}
            </div>
          </div>

          <!-- Phase Selector -->
          <div class="config-group">
            <span class="config-group__label">Phase</span>
            <div class="config-group__options" id="config-phases">
              ${phases.map(p => `<button class="config-option" data-type="phase" data-value="${p}">${p}</button>`).join('')}
            </div>
          </div>



          <div class="product-config__actions">
            <a href="tel:+919926277986" class="button button--primary" style="flex: 1; justify-content: center;">CALL NOW</a>
            <a href="https://wa.me/919926277986" class="button button--secondary" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>

      <!-- Specifications -->
      <div class="product-specs">
        <h3 class="product-specs__header">Specifications</h3>
        <table class="product-specs__table">
          <tbody id="specs-tbody">
            <!-- Rendered dynamically -->
          </tbody>
        </table>
      </div>

      <!-- Features & Apps -->
      <div class="product-features-apps">
        <div>
          <h3 class="product-related__title" style="margin-bottom: var(--space-4);">Key Features</h3>
          <ul class="feature-list">
            ${features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 class="product-related__title" style="margin-bottom: var(--space-4);">Suitable For</h3>
          <div class="app-tags">
            ${applications.map(a => `<span class="app-tag">${a}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Related Products -->
      ${relatedProducts.length > 0 ? `
        <div class="product-related">
          <h2 class="product-related__title">Related Products</h2>
          <div class="product-related__grid">
            ${relatedProducts.map(p => createRelatedProductCard(p)).join('')}
          </div>
        </div>
      ` : ""}
    </div>
  `;

  // Interaction Logic
  const mainImgEl = section.querySelector("#main-product-image");
  const thumbnails = section.querySelectorAll(".product-gallery__thumbnail");

  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", () => {
      thumbnails.forEach(t => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
      const src = thumb.getAttribute("data-image-src");
      if (mainImgEl) {
        mainImgEl.style.opacity = 0;
        setTimeout(() => {
          mainImgEl.src = src;
          mainImgEl.style.opacity = 1;
        }, 150);
      }
    });
  });

  const typeButtons = section.querySelectorAll('#config-types .config-option');
  const altButtons = section.querySelectorAll('#config-alternators .config-option');
  const phaseButtons = section.querySelectorAll('#config-phases .config-option');
  const specsTbody = section.querySelector('#specs-tbody');

  let selectedType = currentState.type || "Open Genset";
  let selectedAlternator = currentState.alternator || "Cummins";
  let selectedPhase = currentState.phase || "Three Phase";

  function updateUI() {
    // Re-query the DOM every time to guarantee we have the live elements
    const liveTypeButtons = section.querySelectorAll('#config-types .config-option');
    const liveAltButtons = section.querySelectorAll('#config-alternators .config-option');
    const livePhaseButtons = section.querySelectorAll('#config-phases .config-option');
    const specsTbody = section.querySelector('#specs-tbody');

    currentState = variants.find(v => 
      v.type === selectedType && 
      v.alternator === selectedAlternator && 
      v.phase === selectedPhase
    );

    const productTypes = new Set(variants.map(v => v.type));
    const productAlternators = new Set(variants.map(v => v.alternator));
    const productPhases = new Set(variants.map(v => v.phase));

    liveTypeButtons.forEach(btn => {
      const val = btn.getAttribute('data-value');
      btn.classList.toggle('is-active', val === selectedType);
      btn.disabled = !productTypes.has(val);
    });

    liveAltButtons.forEach(btn => {
      const val = btn.getAttribute('data-value');
      btn.classList.toggle('is-active', val === selectedAlternator);
      btn.disabled = !productAlternators.has(val);
    });

    livePhaseButtons.forEach(btn => {
      const val = btn.getAttribute('data-value');
      btn.classList.toggle('is-active', val === selectedPhase);
      btn.disabled = !productPhases.has(val);
    });



    if (specsTbody) {
      if (currentState && currentState.specifications) {
        specsTbody.innerHTML = Object.entries(currentState.specifications).map(([key, val]) => `
          <tr>
            <th>${key}</th>
            <td>${val}</td>
          </tr>
        `).join('');
      } else {
        specsTbody.innerHTML = `
          <tr>
            <td colspan="2" style="text-align:center; padding: 2rem;">
              This specific configuration is not available for this model.
            </td>
          </tr>
        `;
      }
    }
  }

  // Explicitly attach click handlers to the section wrapper (Event Delegation)
  section.addEventListener('click', (e) => {
    const btn = e.target.closest('.config-option');
    if (!btn || btn.disabled) return;

    const prop = btn.getAttribute('data-type');
    const val = btn.getAttribute('data-value');

    let changed = false;
    if (prop === 'type' && selectedType !== val) {
      selectedType = val;
      changed = true;
    }
    if (prop === 'alternator' && selectedAlternator !== val) {
      selectedAlternator = val;
      changed = true;
    }
    if (prop === 'phase' && selectedPhase !== val) {
      selectedPhase = val;
      changed = true;
    }

    if (changed) {
      updateUI();
    }
  });

  // Initial render
  updateUI();

  return section;
}
