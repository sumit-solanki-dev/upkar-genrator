import{s as f}from"./index-C9v_pf8o.js";let u=[];const p=[{label:"All KVA",value:"all",min:0,max:1/0},{label:"Up to 50 KVA",value:"0-50",min:0,max:50},{label:"51 - 125 KVA",value:"51-125",min:51,max:125},{label:"126 - 250 KVA",value:"126-250",min:126,max:250},{label:"251+ KVA",value:"251-plus",min:251,max:1/0}],g=6;function v(){return["All Categories",...new Set(u.map(t=>t.category))]}function _(t){return p.find(i=>i.value===t)||p[0]}function y(t){return Number.isInteger(t),String(t)}function b(t){return`
    <article class="product-listing-card" itemscope itemtype="https://schema.org/Product">
      <figure class="product-listing-card__media">
        <a href="/products/${t.slug}">
          <img
            src="${t.images[0]}"
            alt="${t.name} diesel generator"
            width="980"
            height="620"
            loading="lazy"
            decoding="async"
            itemprop="image"
          />
        </a>
      </figure>

      <div class="product-listing-card__body">
        <p class="product-listing-card__category">${t.category}</p>
        <h2 class="product-listing-card__title" itemprop="name">
          <a href="/products/${t.slug}" style="text-decoration:none; color:inherit;">${t.name}</a>
        </h2>
        <p class="product-listing-card__description" itemprop="description">${t.description}</p>

        <dl class="product-listing-card__specs">
          <div>
            <dt>KVA</dt>
            <dd>${y(t.kva)}</dd>
          </div>
          <div>
            <dt>Phase</dt>
            <dd>${t.specifications?.phase||(t.variants?t.variants[0].phase:"N/A")}</dd>
          </div>
        </dl>

        <a class="product-listing-card__link" href="/products/${t.slug}" aria-label="View details for ${t.name}">VIEW DETAILS</a>
      </div>
    </article>
  `}function $(t,i,a=!1){return`
    <button
      class="product-listing__page-button ${a?"is-active":""}"
      type="button"
      data-page="${i}"
      aria-label="${a?"Current page":"Go to page"} ${i}"
      ${a?'aria-current="page"':""}
    >
      ${t}
    </button>
  `}function P({query:t,category:i,kvaRange:a}){const o=t.trim().toLowerCase(),c=_(a);return u.filter(r=>{const l=!o||[r.name,r.category,r.description,r.specifications.phase,r.specifications.fuel].join(" ").toLowerCase().includes(o),s=i==="All Categories"||r.category===i,e=r.kva>=c.min&&r.kva<=c.max;return l&&s&&e})}async function w(){try{u=await(await fetch("/products.json")).json()}catch(e){console.error("Failed to fetch products:",e)}f({title:"Products",description:"Browse UPKAR Generator products by category and KVA rating with industrial diesel generator options for businesses.",path:"/products/"});const t=document.createElement("div"),i=v(),a={query:"",category:i[0],kvaRange:"all",page:1};t.className="product-listing-page",t.innerHTML=`
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
              ${i.map(e=>`<option value="${e}">${e}</option>`).join("")}
            </select>
          </div>

          <div class="product-listing__field">
            <label for="product-kva">KVA</label>
            <select id="product-kva" name="kva">
              ${p.map(e=>`<option value="${e.value}">${e.label}</option>`).join("")}
            </select>
          </div>
        </form>

        <div class="product-listing__summary" aria-live="polite" data-product-summary></div>
        <div class="product-listing__grid" data-product-grid></div>
        <nav class="product-listing__pagination" aria-label="Product pagination" data-product-pagination></nav>
      </div>
    </section>
  `;const o=t.querySelector("[data-product-filters]"),c=t.querySelector("[data-product-grid]"),r=t.querySelector("[data-product-summary]"),l=t.querySelector("[data-product-pagination]");function s(){const e=P(a),n=Math.max(1,Math.ceil(e.length/g));a.page=Math.min(a.page,n);const m=(a.page-1)*g,h=e.slice(m,m+g);r.textContent=`${e.length} product${e.length===1?"":"s"} found`,c.innerHTML=h.length>0?h.map(b).join(""):`
          <div class="product-listing__empty" role="status">
            <h2>No products found</h2>
            <p>Try changing the search term, category, or KVA filter.</p>
          </div>
        `,l.innerHTML=n>1?Array.from({length:n},(S,d)=>$(String(d+1),d+1,a.page===d+1)).join(""):""}return o.addEventListener("input",()=>{const e=new FormData(o);a.query=String(e.get("search")||""),a.category=String(e.get("category")||i[0]),a.kvaRange=String(e.get("kva")||"all"),a.page=1,s()}),o.addEventListener("submit",e=>{e.preventDefault()}),l.addEventListener("click",e=>{const n=e.target.closest("[data-page]");n&&(a.page=Number(n.dataset.page||1),s(),t.querySelector(".product-listing__summary")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}))}),s(),t}export{w as createProductListingPage};
