const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/gsap-Ctd5YKNO.js","assets/vendor-gsap-a3sj5zmn.js","assets/lenis-CgqyWAU5.js","assets/vendor-lenis-CciUKl-_.js","assets/companyStats-Cd1cj_Xm.js","assets/industries-DHGs1wbF.js","assets/manufacturingProcess-85SIWgy3.js","assets/swiper-DtDjfTGV.js","assets/vendor-swiper-DxPfGLca.js","assets/vendor-swiper-BVYAVZZL.css"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const $="modulepreload",R=function(t){return"/"+t},I={},r=function(e,a,i){let n=Promise.resolve();if(a&&a.length>0){let b=function(d){return Promise.all(d.map(m=>Promise.resolve(m).then(_=>({status:"fulfilled",value:_}),_=>({status:"rejected",reason:_}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");n=b(a.map(d=>{if(d=R(d),d in I)return;I[d]=!0;const m=d.endsWith(".css"),_=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${_}`))return;const p=document.createElement("link");if(p.rel=m?"stylesheet":$,m||(p.as="script"),p.crossOrigin="",p.href=d,c&&p.setAttribute("nonce",c),document.head.appendChild(p),m)return new Promise((y,g)=>{p.addEventListener("load",y),p.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return n.then(l=>{for(const c of l||[])c.status==="rejected"&&o(c.reason);return e().catch(o)})},f={name:"UPKAR Generator",tagline:"Power You Can Trust",phone:"+919926277986",email:"info@upkargenerator.com",location:"Industrial Area, India",foundedYear:2013},D={primary:[{label:"Home",href:"/"},{label:"Products",href:"/products/"},{label:"About",href:"/about/"},{label:"Contact",href:"/contact/"}]},M=[{label:"About",href:"/about/"},{label:"Products",href:"/products/"},{label:"Services",href:"/services/"},{label:"Contact",href:"/contact/"}],V=[{label:"Diesel Generators",href:"/products/"},{label:"Silent Generators",href:"/products/"},{label:"Industrial DG Sets",href:"/products/"},{label:"Custom Power Units",href:"/products/"}],N=[{label:"Installation",href:"/services/"},{label:"Maintenance",href:"/services/"},{label:"Load Assessment",href:"/services/"},{label:"Emergency Support",href:"/services/"}],x=[{label:"Facebook",href:"https://facebook.com",icon:`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8h2V4h-2c-3 0-5 2-5 5v2H7v4h2v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1Z" />
      </svg>
    `},{label:"Instagram",href:"https://instagram.com",icon:`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.8h.1" />
      </svg>
    `},{label:"LinkedIn",href:"https://linkedin.com",icon:`
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 10v8" />
        <path d="M6.5 6.5v.1" />
        <path d="M11 18v-8" />
        <path d="M11 13.5c0-2.2 1.4-3.8 3.5-3.8s3.5 1.4 3.5 4V18" />
      </svg>
    `}];function E(t){return t.map(e=>`<li><a href="${e.href}">${e.label}</a></li>`).join("")}function U(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function q({company:t=f}={}){const e=document.createElement("footer");e.className="site-footer",e.dataset.siteFooter="footer",e.innerHTML=`
    <div class="container site-footer__inner">
      <section class="site-footer__about" aria-labelledby="footer-about-title">
        <a class="site-footer__brand" href="/" aria-label="${t.name} home">
          <span class="site-footer__brand-mark" aria-hidden="true">
            <img class="site-footer__brand-logo" src="/images/upkar-logo.svg" alt="" width="48" height="48" loading="lazy" decoding="async" />
          </span>
          <span>
            <span class="site-footer__brand-name">${t.name}</span>
            <span class="site-footer__brand-tagline">${t.tagline}</span>
          </span>
        </a>
        <h2 class="site-footer__heading" id="footer-about-title">About</h2>
        <p class="site-footer__text">
          UPKAR Generator supplies dependable diesel power solutions for businesses, facilities, and critical operations.
        </p>
        <div class="site-footer__social" aria-label="Social links">
          ${x.map(n=>`
              <a class="site-footer__social-link" href="${n.href}" aria-label="${n.label}" target="_blank" rel="noopener noreferrer">
                ${n.icon}
              </a>
            `).join("")}
        </div>
      </section>

      <nav class="site-footer__group" aria-labelledby="footer-links-title">
        <h2 class="site-footer__heading" id="footer-links-title">Quick Links</h2>
        <ul class="site-footer__list">
          ${E(M)}
        </ul>
      </nav>

      <nav class="site-footer__group" aria-labelledby="footer-products-title">
        <h2 class="site-footer__heading" id="footer-products-title">Products</h2>
        <ul class="site-footer__list">
          ${E(V)}
        </ul>
      </nav>

      <nav class="site-footer__group" aria-labelledby="footer-services-title">
        <h2 class="site-footer__heading" id="footer-services-title">Services</h2>
        <ul class="site-footer__list">
          ${E(N)}
        </ul>
      </nav>

      <section class="site-footer__contact" aria-labelledby="footer-contact-title">
        <h2 class="site-footer__heading" id="footer-contact-title">Contact</h2>
        <ul class="site-footer__contact-list">
          <li><a href="tel:${t.phone}">${t.phone}</a></li>
          <li><a href="mailto:${t.email}">${t.email}</a></li>
          <li>${t.location}</li>
        </ul>
        <div class="site-footer__map" aria-label="UPKAR Generator location on Google Maps">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3694.0073071475617!2d75.4694067!3d22.2018286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39626f9747c05419%3A0x5e733839d4504032!2sUpkar%20generator!5e0!3m2!1sen!2sin!4v1785756048465!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            title="UPKAR Generator location"
          ></iframe>
        </div>
      </section>

      <section class="site-footer__newsletter" aria-labelledby="footer-newsletter-title">
        <h2 class="site-footer__heading" id="footer-newsletter-title">Newsletter</h2>
        <p class="site-footer__text">Get product updates and power backup tips in your inbox.</p>
        <form class="site-footer__form" action="#" method="post">
          <label class="sr-only" for="footer-email">Email address</label>
          <input id="footer-email" type="email" name="email" placeholder="Email address" autocomplete="email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <div class="site-footer__bottom">
        <p class="site-footer__copy">&copy; ${new Date().getFullYear()} ${t.name}. All rights reserved.</p>
        <button class="site-footer__back-top" type="button" data-back-to-top aria-label="Back to top">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 14 6-6 6 6" />
            <path d="M12 8v12" />
          </svg>
        </button>
      </div>
    </div>
  `;const a=e.querySelector("[data-back-to-top]"),i=e.querySelector(".site-footer__form");return a?.addEventListener("click",()=>{window.scrollTo({top:0,behavior:U()?"auto":"smooth"})}),i?.addEventListener("submit",n=>{n.preventDefault()}),e}function P(t,e=document){return e.querySelector(t)}function T(...t){return t.filter(Boolean).join(" ")}function A(t){return t&&t.replace(/\/+$/,"")||"/"}const K=`
  <svg class="site-nav__button-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" focusable="false">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.62 2.65a2 2 0 0 1-.45 2.11L8 9.76a16 16 0 0 0 6.24 6.24l1.28-1.28a2 2 0 0 1 2.11-.45c.85.29 1.74.5 2.65.62A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  </svg>
`,G=1081;function H({links:t=[]}={}){const e=document.createElement("header"),a=A(window.location.pathname),i=a.replace(/\/$/,"")||"/",n=["/","/products","/about","/contact"].includes(i);e.className=T("site-header js-site-header",n&&"site-header--dark-bg"),e.dataset.nav="header",e.dataset.animate="navbar",e.innerHTML=`
    <div class="container site-header__inner">
      <a class="brand" href="/" aria-label="${f.name} home">
        <span class="brand__mark" aria-hidden="true">
          <img class="brand__logo" src="/images/upkar-logo.svg" alt="" width="40" height="40" decoding="async" />
        </span>
        <span class="brand__text">
          <span class="brand__name">${f.name}</span>
          <span class="brand__tagline">${f.tagline}</span>
        </span>
      </a>

      <button class="site-nav__toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-navigation">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>

      <nav class="site-nav" id="primary-navigation" aria-label="Primary navigation" data-nav="menu">
        <ul class="site-nav__list" role="list">
          ${t.map(s=>{const h=A(s.href)===a;return`
                <li>
                  <a class="${T("site-nav__link",h&&"is-active")}" href="${s.href}" data-nav-item ${h?'aria-current="page"':""}>
                    ${s.label}
                  </a>
                </li>
              `}).join("")}
        </ul>
        <div class="site-nav__actions" data-nav-actions>
          <a class="site-nav__button site-nav__button--call" href="tel:${f.phone}" aria-label="Call ${f.name} now" data-nav-item>
            ${K}
            <span>Call Now</span>
          </a>
        </div>
      </nav>
    </div>
  `;const o=e.querySelector(".site-nav__toggle"),l=Array.from(e.querySelectorAll(".site-nav__link, .site-nav__button")),c=e.querySelector(".site-nav");let b=!1;function d(){return window.innerWidth<G}function m(){return Array.from(c.querySelectorAll("a[href], button:not([disabled])")).filter(s=>!s.hasAttribute("disabled")&&s.offsetParent!==null)}function _(){document.body.classList.remove("is-nav-open"),e.classList.remove("is-menu-open"),o.setAttribute("aria-expanded","false"),o.setAttribute("aria-label","Open navigation"),b=!1}function p(){e.classList.toggle("is-scrolled",window.scrollY>18)}function y(){b=!1,document.body.classList.add("is-nav-open"),e.classList.add("is-menu-open"),o.setAttribute("aria-expanded","true"),o.setAttribute("aria-label","Close navigation"),c.dispatchEvent(new CustomEvent("navbar:toggle",{detail:{isOpen:!0}})),window.setTimeout(()=>{d()&&e.classList.contains("is-menu-open")&&m()[0]?.focus({preventScroll:!0})},60)}function g({animated:s=!0}={}){if(!e.classList.contains("is-menu-open"))return;if(!s){_();return}b=!0;const h=new CustomEvent("navbar:toggle",{cancelable:!0,detail:{isOpen:!1,complete:_}});c.dispatchEvent(h),h.defaultPrevented||_()}return o.addEventListener("click",()=>{if(!b){if(e.classList.contains("is-menu-open")){g();return}y()}}),l.forEach(s=>{s.addEventListener("click",g)}),document.addEventListener("click",s=>{!d()||!e.classList.contains("is-menu-open")||e.contains(s.target)||g()}),window.addEventListener("scroll",p,{passive:!0}),window.addEventListener("resize",()=>{d()||g({animated:!1})}),window.addEventListener("keydown",s=>{if(s.key==="Tab"&&d()&&e.classList.contains("is-menu-open")){const h=[o,...m()],L=h[0],S=h[h.length-1];s.shiftKey&&document.activeElement===L?(s.preventDefault(),S?.focus()):!s.shiftKey&&document.activeElement===S&&(s.preventDefault(),L?.focus())}s.key==="Escape"&&e.classList.contains("is-menu-open")&&(g(),o.focus({preventScroll:!0}))}),p(),e}function j(){const e=`https://wa.me/${f.phone.replace(/\D/g,"")}`,a=document.createElement("a");return a.className="whatsapp-float",a.href=e,a.target="_blank",a.rel="noopener noreferrer",a.setAttribute("aria-label","Chat with us on WhatsApp"),a.innerHTML=`
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  `,a}const v="UPKAR Generator",B="UPKAR Generator designs and supports dependable diesel generator solutions for commercial and industrial power needs.";function w(t){return new URL(t,window.location.origin).href}function u(t,e){let a=document.head.querySelector(t);return a||(a=document.createElement("meta"),document.head.appendChild(a)),Object.entries(e).forEach(([i,n])=>{a.setAttribute(i,n)}),a}function F(t){let e=document.head.querySelector("link[rel='canonical']");e||(e=document.createElement("link"),e.setAttribute("rel","canonical"),document.head.appendChild(e)),e.setAttribute("href",w(t))}function W(t=null){const e="site-structured-data";let a=document.head.querySelector(`#${e}`);a||(a=document.createElement("script"),a.id=e,a.type="application/ld+json",document.head.appendChild(a));const i={"@context":"https://schema.org","@type":"Organization",name:f.name,url:window.location.origin,telephone:f.phone,email:f.email,foundingDate:String(f.foundedYear)};a.textContent=JSON.stringify(t||i)}function O({title:t=v,description:e=B,path:a=window.location.pathname,structuredData:i=null}={}){const n=t===v?t:`${t} | ${v}`,o=w(a);document.title=n,F(a),u("meta[name='description']",{name:"description",content:e}),u("meta[name='robots']",{name:"robots",content:"index, follow"}),u("meta[property='og:title']",{property:"og:title",content:n}),u("meta[property='og:description']",{property:"og:description",content:e}),u("meta[property='og:image']",{property:"og:image",content:w("/images/generator-hero.svg")}),u("meta[property='og:type']",{property:"og:type",content:"website"}),u("meta[property='og:site_name']",{property:"og:site_name",content:v}),u("meta[property='og:url']",{property:"og:url",content:o}),u("meta[name='twitter:card']",{name:"twitter:card",content:"summary_large_image"}),u("meta[name='twitter:title']",{name:"twitter:title",content:n}),u("meta[name='twitter:description']",{name:"twitter:description",content:e}),u("meta[name='twitter:image']",{name:"twitter:image",content:w("/images/generator-hero.svg")}),W(i)}function C(t){if("requestIdleCallback"in window){window.requestIdleCallback(t,{timeout:1400});return}window.setTimeout(t,0)}function k(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function z(){C(async()=>{try{const{initNavbarAnimations:t}=await r(async()=>{const{initNavbarAnimations:e}=await import("./gsap-Ctd5YKNO.js");return{initNavbarAnimations:e}},__vite__mapDeps([0,1]));t()}catch{}})}function Y(){const t=document.createElement("section");return O({title:"Page unavailable",description:"The requested UPKAR Generator page could not be loaded.",path:window.location.pathname}),t.className="page-shell",t.innerHTML=`
    <div class="container page-shell__inner">
      <p class="page-shell__eyebrow">Page unavailable</p>
      <h1 class="page-shell__title">We could not load this page</h1>
      <p class="page-shell__description">Please refresh the page or return to the homepage.</p>
      <a class="button button--primary" href="/">Go Home</a>
    </div>
  `,{nodes:[t]}}async function J(){const[{createHeroSection:t},{createScrollSequenceSection:e},{createCompanyStatsSection:a},{createIndustriesWeServeSection:i},{createManufacturingProcessSection:n},{createTestimonialsSection:o},{createCTASection:l},{createFeaturedProductsSection:c}]=await Promise.all([r(()=>import("./Hero-Cg5W7gxj.js"),[]),r(()=>import("./ScrollSequence-dCbrZm6G.js"),[]),r(()=>import("./CompanyStats-CgKN3Z81.js"),[]),r(()=>import("./IndustriesWeServe-CRIISRQK.js"),[]),r(()=>import("./ManufacturingProcess-DoFbR6ep.js"),[]),r(()=>import("./Testimonials-orXivqBi.js"),[]),r(()=>import("./CTA-CTEUn1jX.js"),[]),r(()=>import("./FeaturedProducts-DWkuwO4G.js"),[])]);return O({title:"UPKAR Generator",description:"UPKAR Generator builds dependable diesel generator solutions for factories, hospitals, hotels, construction, agriculture, telecom, and commercial facilities.",path:"/"}),{nodes:[t(),e(),a(),i(),n(),o(),l(),await c()],enhance:Z}}async function Q(t){if(t==="/products"){const{createProductListingPage:e}=await r(async()=>{const{createProductListingPage:a}=await import("./ProductListingPage-BNnmfrYZ.js");return{createProductListingPage:a}},[]);return{nodes:[await e()]}}if(t.startsWith("/products/")){const e=t.replace("/products/",""),{createProductDetailsPage:a}=await r(async()=>{const{createProductDetailsPage:i}=await import("./ProductDetailsPage-DMsj_Wmi.js");return{createProductDetailsPage:i}},[]);return{nodes:[await a(e)]}}if(t==="/contact"){const{createContactPage:e}=await r(async()=>{const{createContactPage:a}=await import("./ContactPage-DQJ7g_mv.js");return{createContactPage:a}},[]);return{nodes:[e()]}}if(t==="/about"){const{createAboutPage:e}=await r(async()=>{const{createAboutPage:a}=await import("./AboutPage-eG3Zht9g.js");return{createAboutPage:a}},[]);return{nodes:[await e()]}}if(t==="/services"){const{createServicesPage:e}=await r(async()=>{const{createServicesPage:a}=await import("./ServicesPage-Cjnk_koL.js");return{createServicesPage:a}},[]);return{nodes:[await e()]}}return J()}function Z(){C(async()=>{const[{initLenis:t},{initHeroAnimations:e},{initScrollSequence:a},{initCompanyStatsAnimations:i},{initIndustriesAnimations:n},{initManufacturingProcessAnimations:o},{initSwipers:l}]=await Promise.all([r(()=>import("./lenis-CgqyWAU5.js"),__vite__mapDeps([2,1,3])),r(()=>import("./gsap-Ctd5YKNO.js"),__vite__mapDeps([0,1])),r(()=>import("./scrollSequence-CmQ8L2ff.js"),[]),r(()=>import("./companyStats-Cd1cj_Xm.js"),__vite__mapDeps([4,1])),r(()=>import("./industries-DHGs1wbF.js"),__vite__mapDeps([5,1])),r(()=>import("./manufacturingProcess-85SIWgy3.js"),__vite__mapDeps([6,1])),r(()=>import("./swiper-DtDjfTGV.js"),__vite__mapDeps([7,8,9]))]);t(),e(),a(),i(),n(),o(),l("[data-featured-products-slider]"),l("[data-testimonials-slider]",{loop:!k(),autoplay:k()?!1:{delay:3200,disableOnInteraction:!1,pauseOnMouseEnter:!0},breakpoints:{700:{slidesPerView:2},1100:{slidesPerView:3}}})})}async function X(){P("#navigation-root")?.replaceChildren(H({links:D.primary})),z();const t=P("#app"),e=A(window.location.pathname);t?.setAttribute("aria-busy","true");let a;try{a=await Q(e)}catch{a=Y()}t?.replaceChildren(...a.nodes,j()),t?.setAttribute("aria-busy","false"),P("[data-site-footer]")?.remove(),t?.after(q()),a.enhance?.()}X();export{f as C,O as s};
