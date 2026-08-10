import{s as E}from"./index-C9v_pf8o.js";async function q(){try{return await(await fetch(`/products.json?v=${new Date().getTime()}`,{cache:"no-store",headers:{"Cache-Control":"no-cache"}})).json()}catch(a){return console.error("Failed to load products:",a),[]}}function C(a){return`
    <article class="product-listing-card" itemscope itemtype="https://schema.org/Product">
      <figure class="product-listing-card__media">
        <a href="/products/${a.slug}">
          <img
            src="${a.images[0]}"
            alt="${a.name} diesel generator"
            width="980"
            height="620"
            loading="lazy"
            decoding="async"
            itemprop="image"
          />
        </a>
      </figure>

      <div class="product-listing-card__body">
        <p class="product-listing-card__category">${a.category}</p>
        <h2 class="product-listing-card__title" itemprop="name">
          <a href="/products/${a.slug}" style="text-decoration:none; color:inherit;">${a.name}</a>
        </h2>
        <p class="product-listing-card__description" itemprop="description">${a.description}</p>

        <dl class="product-listing-card__specs">
          <div>
            <dt>KVA</dt>
            <dd>${a.kva}</dd>
          </div>
          <div>
            <dt>Phase</dt>
            <dd>${a.specifications?.phase||(a.variants?a.variants[0].phase:"N/A")}</dd>
          </div>
        </dl>

        <a class="product-listing-card__link" href="/products/${a.slug}" aria-label="View details for ${a.name}">VIEW DETAILS</a>
      </div>
    </article>
  `}async function k(a){const m=await q(),s=m.find(t=>t.slug===a);if(!s){const t=document.createElement("section");return t.className="page-shell",t.innerHTML=`
      <div class="container page-shell__inner">
        <p class="page-shell__eyebrow">Product Not Found</p>
        <h1 class="page-shell__title">We could not find this product</h1>
        <p class="page-shell__description">Please check the URL or browse our other generator models.</p>
        <a class="button button--primary" href="/products">View All Products</a>
      </div>
    `,t}E({title:s.name,description:s.description,path:`/products/${s.slug}`});const i=document.createElement("section");i.className="product-details";const p=s.variants||[{type:"Standard",alternator:"Standard",phase:s.specifications?.phase||"Three Phase",specifications:s.specifications||{}}],v=s.gallery||s.images||[],$=v[0]||"/images/generator-hero.svg";let n=p[0];const S=["Open Genset","Silent Genset"],A=["Cummins","Stamford"],P=["Single Phase","Three Phase"],T=s.features||["Reliable performance","High efficiency","Industrial build quality"],w=s.applications||["Industrial","Commercial"],y=m.filter(t=>t.slug!==s.slug).sort(()=>.5-Math.random()).slice(0,3);i.innerHTML=`
    <div class="container product-details__container">
      
      <div class="product-details__overview">
        <!-- Gallery -->
        <div class="product-gallery">
          <div class="product-gallery__main">
            <img src="${$}" alt="${s.name}" id="main-product-image" />
          </div>
          ${v.length>1?`
            <div class="product-gallery__thumbnails">
              ${v.map((t,o)=>`
                <button class="product-gallery__thumbnail ${o===0?"is-active":""}" data-image-src="${t}" aria-label="View image ${o+1}">
                  <img src="${t}" alt="Thumbnail ${o+1}" />
                </button>
              `).join("")}
            </div>
          `:""}
        </div>

        <!-- Configuration -->
        <div class="product-config">
          <div>
            <h1 class="product-config__title">${s.name}</h1>
            <p class="product-config__desc">${s.description}</p>
          </div>

          <!-- Type Selector -->
          <div class="config-group">
            <span class="config-group__label">Generator Type</span>
            <div class="config-group__options" id="config-types">
              ${S.map(t=>`<button class="config-option" data-type="type" data-value="${t}">${t}</button>`).join("")}
            </div>
          </div>

          <!-- Alternator Selector -->
          <div class="config-group">
            <span class="config-group__label">Alternator</span>
            <div class="config-group__options" id="config-alternators">
              ${A.map(t=>`<button class="config-option" data-type="alternator" data-value="${t}">${t}</button>`).join("")}
            </div>
          </div>

          <!-- Phase Selector -->
          <div class="config-group">
            <span class="config-group__label">Phase</span>
            <div class="config-group__options" id="config-phases">
              ${P.map(t=>`<button class="config-option" data-type="phase" data-value="${t}">${t}</button>`).join("")}
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
            ${T.map(t=>`<li>${t}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h3 class="product-related__title" style="margin-bottom: var(--space-4);">Suitable For</h3>
          <div class="app-tags">
            ${w.map(t=>`<span class="app-tag">${t}</span>`).join("")}
          </div>
        </div>
      </div>

      <!-- Related Products -->
      ${y.length>0?`
        <div class="product-related">
          <h2 class="product-related__title">Related Products</h2>
          <div class="product-related__grid">
            ${y.map(t=>C(t)).join("")}
          </div>
        </div>
      `:""}
    </div>
  `;const u=i.querySelector("#main-product-image"),_=i.querySelectorAll(".product-gallery__thumbnail");_.forEach(t=>{t.addEventListener("click",()=>{_.forEach(l=>l.classList.remove("is-active")),t.classList.add("is-active");const o=t.getAttribute("data-image-src");u&&(u.style.opacity=0,setTimeout(()=>{u.src=o,u.style.opacity=1},150))})}),i.querySelectorAll("#config-types .config-option"),i.querySelectorAll("#config-alternators .config-option"),i.querySelectorAll("#config-phases .config-option"),i.querySelector("#specs-tbody");let g=n.type||"Open Genset",h=n.alternator||"Cummins",f=n.phase||"Three Phase";function b(){const t=i.querySelectorAll("#config-types .config-option"),o=i.querySelectorAll("#config-alternators .config-option"),l=i.querySelectorAll("#config-phases .config-option"),c=i.querySelector("#specs-tbody");n=p.find(e=>e.type===g&&e.alternator===h&&e.phase===f);const d=new Set(p.map(e=>e.type)),L=new Set(p.map(e=>e.alternator)),j=new Set(p.map(e=>e.phase));t.forEach(e=>{const r=e.getAttribute("data-value");e.classList.toggle("is-active",r===g),e.disabled=!d.has(r)}),o.forEach(e=>{const r=e.getAttribute("data-value");e.classList.toggle("is-active",r===h),e.disabled=!L.has(r)}),l.forEach(e=>{const r=e.getAttribute("data-value");e.classList.toggle("is-active",r===f),e.disabled=!j.has(r)}),c&&(n&&n.specifications?c.innerHTML=Object.entries(n.specifications).map(([e,r])=>`
          <tr>
            <th>${e}</th>
            <td>${r}</td>
          </tr>
        `).join(""):c.innerHTML=`
          <tr>
            <td colspan="2" style="text-align:center; padding: 2rem;">
              This specific configuration is not available for this model.
            </td>
          </tr>
        `)}return i.addEventListener("click",t=>{const o=t.target.closest(".config-option");if(!o||o.disabled)return;const l=o.getAttribute("data-type"),c=o.getAttribute("data-value");let d=!1;l==="type"&&g!==c&&(g=c,d=!0),l==="alternator"&&h!==c&&(h=c,d=!0),l==="phase"&&f!==c&&(f=c,d=!0),d&&b()}),b(),i}export{k as createProductDetailsPage};
