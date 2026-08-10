
const HERO_TITLE = "UPKAR Generator";

function createSplitTitle(text) {
  return text
    .split(" ")
    .map((word) => {
      const characters = Array.from(word)
        .map((character) => `<span class="hero-title__char">${character}</span>`)
        .join("");

      return `<span class="hero-title__word">${characters}</span>`;
    })
    .join("");
}

export function createHeroSection() {
  const section = document.createElement("section");

  section.className = "hero-section";
  section.dataset.animate = "hero";
  section.innerHTML = `
    <div class="hero-bg" aria-hidden="true">
      <span class="hero-bg__panel hero-bg__panel--primary" data-parallax-bg></span>
      <span class="hero-bg__panel hero-bg__panel--accent" data-parallax-bg></span>
      <span class="hero-bg__track hero-bg__track--one"></span>
      <span class="hero-bg__track hero-bg__track--two"></span>
    </div>

    <div class="container hero-section__inner">
      <div class="hero-copy">
        <p class="hero-subtitle">Industrial Diesel Generator Manufacturer Since 2013</p>
        <h1 class="hero-title" aria-label="${HERO_TITLE}">
          <span aria-hidden="true">${createSplitTitle(HERO_TITLE)}</span>
        </h1>
        <p class="hero-description">
          Reliable diesel power systems engineered for factories, hospitals, construction sites, and commercial facilities that cannot afford downtime.
        </p>
        <div class="hero-actions" role="group" aria-label="Hero calls to action">
          <a class="hero-button hero-button--primary" href="/products/">Explore Products</a>
          <a class="hero-button hero-button--call" href="tel:+919926277986">CALL NOW</a>
        </div>
      </div>

      <div class="hero-visual" data-parallax-visual>
        <div class="hero-visual__float">
          <img
            class="hero-generator"
            src="/images/generator-hero.svg"
            alt="Industrial diesel generator"
            width="980"
            height="620"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </div>
      </div>
    </div>

    <div class="hero-scroll-indicator" aria-hidden="true">
      <span></span>
    </div>
  `;

  return section;
}
