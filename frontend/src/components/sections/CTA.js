import { COMPANY } from "../../utils/constants.js";

export function createCTASection() {
  const section = document.createElement("section");

  section.className = "cta-section";
  section.innerHTML = `
    <div class="cta-section__media" aria-hidden="true">
      <img
        class="cta-section__image"
        src="/images/sequence/CTA-img.webp"
        alt=""
        width="1448"
        height="1086"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="cta-section__overlay" aria-hidden="true"></div>

    <div class="container cta-section__inner">
      <div class="cta-section__content">
        <h2 class="cta-section__title">Power Your Business With Confidence</h2>
        <div class="cta-section__actions" aria-label="Call to action">
          <a class="cta-section__button cta-section__button--call" href="tel:+919926277986">CALL NOW</a>
        </div>
      </div>
    </div>
  `;

  return section;
}
