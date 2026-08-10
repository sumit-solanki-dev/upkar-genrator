import { COMPANY } from "../../utils/constants.js";

const QUICK_LINKS = [
  { label: "About", href: "/about/" },
  { label: "Products", href: "/products/" },
  { label: "Services", href: "/services/" },
  { label: "Contact", href: "/contact/" },
];

const PRODUCTS = [
  { label: "Diesel Generators", href: "/products/" },
  { label: "Silent Generators", href: "/products/" },
  { label: "Industrial DG Sets", href: "/products/" },
  { label: "Custom Power Units", href: "/products/" },
];

const SERVICES = [
  { label: "Installation", href: "/services/" },
  { label: "Maintenance", href: "/services/" },
  { label: "Load Assessment", href: "/services/" },
  { label: "Emergency Support", href: "/services/" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8h2V4h-2c-3 0-5 2-5 5v2H7v4h2v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1Z" />
      </svg>
    `,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M17.5 6.8h.1" />
      </svg>
    `,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 10v8" />
        <path d="M6.5 6.5v.1" />
        <path d="M11 18v-8" />
        <path d="M11 13.5c0-2.2 1.4-3.8 3.5-3.8s3.5 1.4 3.5 4V18" />
      </svg>
    `,
  },
];

function renderLinks(links) {
  return links.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join("");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createFooter({ company = COMPANY } = {}) {
  const footer = document.createElement("footer");

  footer.className = "site-footer";
  footer.dataset.siteFooter = "footer";
  footer.innerHTML = `
    <div class="container site-footer__inner">
      <section class="site-footer__about" aria-labelledby="footer-about-title">
        <a class="site-footer__brand" href="/" aria-label="${company.name} home">
          <span class="site-footer__brand-mark" aria-hidden="true">
            <img class="site-footer__brand-logo" src="/images/upkar-logo.svg" alt="" width="48" height="48" loading="lazy" decoding="async" />
          </span>
          <span>
            <span class="site-footer__brand-name">${company.name}</span>
            <span class="site-footer__brand-tagline">${company.tagline}</span>
          </span>
        </a>
        <h2 class="site-footer__heading" id="footer-about-title">About</h2>
        <p class="site-footer__text">
          UPKAR Generator supplies dependable diesel power solutions for businesses, facilities, and critical operations.
        </p>
        <div class="site-footer__social" aria-label="Social links">
          ${SOCIAL_LINKS.map(
            (social) => `
              <a class="site-footer__social-link" href="${social.href}" aria-label="${social.label}" target="_blank" rel="noopener noreferrer">
                ${social.icon}
              </a>
            `,
          ).join("")}
        </div>
      </section>

      <nav class="site-footer__group" aria-labelledby="footer-links-title">
        <h2 class="site-footer__heading" id="footer-links-title">Quick Links</h2>
        <ul class="site-footer__list">
          ${renderLinks(QUICK_LINKS)}
        </ul>
      </nav>

      <nav class="site-footer__group" aria-labelledby="footer-products-title">
        <h2 class="site-footer__heading" id="footer-products-title">Products</h2>
        <ul class="site-footer__list">
          ${renderLinks(PRODUCTS)}
        </ul>
      </nav>

      <nav class="site-footer__group" aria-labelledby="footer-services-title">
        <h2 class="site-footer__heading" id="footer-services-title">Services</h2>
        <ul class="site-footer__list">
          ${renderLinks(SERVICES)}
        </ul>
      </nav>

      <section class="site-footer__contact" aria-labelledby="footer-contact-title">
        <h2 class="site-footer__heading" id="footer-contact-title">Contact</h2>
        <ul class="site-footer__contact-list">
          <li><a href="tel:${company.phone}">${company.phone}</a></li>
          <li><a href="mailto:${company.email}">${company.email}</a></li>
          <li>${company.location}</li>
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
        <p class="site-footer__copy">&copy; ${new Date().getFullYear()} ${company.name}. All rights reserved.</p>
        <button class="site-footer__back-top" type="button" data-back-to-top aria-label="Back to top">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 14 6-6 6 6" />
            <path d="M12 8v12" />
          </svg>
        </button>
      </div>
    </div>
  `;

  const backToTop = footer.querySelector("[data-back-to-top]");
  const newsletterForm = footer.querySelector(".site-footer__form");

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  return footer;
}
