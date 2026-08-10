import{s as a}from"./index-BPdsZhKd.js";const n=[{title:"Generator Installation",description:"Complete site survey, foundation planning, electrical integration, and commissioning for new diesel generator installations.",icon:'<svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a3 3 0 0 1-4.2 4.2l-.6-.4L8 18H5v-3l8.7-8.7-.4-.6a3 3 0 0 1 4.2-4.2Z" /><path d="m3 21 4-4" /></svg>'},{title:"Preventive Maintenance",description:"Scheduled inspections, oil and filter changes, coolant checks, and electrical testing to keep generators running reliably.",icon:'<svg viewBox="0 0 24 24"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z" /><path d="m9 12 2 2 4-4" /></svg>'},{title:"Load Assessment",description:"Detailed power audit and load analysis to recommend the right generator capacity for your facility's electrical demands.",icon:'<svg viewBox="0 0 24 24"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>'},{title:"Emergency Breakdown Support",description:"24/7 rapid-response repair service for critical generator failures, with on-site technician dispatch and spare parts availability.",icon:'<svg viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>'},{title:"Annual Maintenance Contracts",description:"Comprehensive AMC plans covering periodic servicing, priority breakdown support, and genuine replacement parts at fixed annual costs.",icon:'<svg viewBox="0 0 24 24"><path d="M16 2v4" /><path d="M8 2v4" /><path d="M4 6h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /><path d="M2 10h20" /></svg>'},{title:"Generator Commissioning",description:"Professional startup, synchronization testing, and performance validation to ensure your new generator meets factory specifications.",icon:'<svg viewBox="0 0 24 24"><path d="M22 11.1V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5.1" /><path d="M2 12.9V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.1" /><path d="m9 16 3-3 3 3" /><path d="M12 13v6" /></svg>'}];async function s(){const i=document.createElement("div");i.className="product-listing-page",i.innerHTML=`
    <section class="product-listing-hero" aria-labelledby="services-title">
      <div class="container product-listing-hero__inner">
        <p class="product-listing-hero__eyebrow">Our Services</p>
        <h1 class="product-listing-hero__title" id="services-title">Expert Power Solutions</h1>
        <p class="product-listing-hero__description">
          Comprehensive support for your diesel generator needs, from installation to emergency maintenance.
        </p>
      </div>
    </section>

    <section class="product-listing" aria-label="Services listing">
      <div class="container product-listing__inner">
        <div class="product-listing__grid" data-services-grid></div>
      </div>
    </section>
  `;const t=i.querySelector("[data-services-grid]");return t.innerHTML=n.map(e=>`
    <article class="product-listing-card" itemscope itemtype="https://schema.org/Service">
      <div class="product-listing-card__body" style="padding-top: 2.5rem;">
        ${e.icon?`<div class="service-icon" style="margin-bottom: 1rem; color: var(--color-primary); width: 48px; height: 48px;">${e.icon}</div>`:""}
        <h2 class="product-listing-card__title" itemprop="name" style="margin-top: 0;">${e.title}</h2>
        <p class="product-listing-card__description" itemprop="description">${e.description}</p>
        <a class="product-listing-card__link" href="/contact/" aria-label="Inquire about ${e.title}">Inquire Now</a>
      </div>
    </article>
  `).join(""),a({title:"Our Services",description:"Explore UPKAR Generator services including installation, maintenance, load assessment, and emergency support.",path:"/services/"}),i}export{s as createServicesPage};
