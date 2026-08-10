const INDUSTRIES = [
  {
    name: "Construction",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h16" />
        <path d="M6 20V9l6-4 6 4v11" />
        <path d="M9 20v-6h6v6" />
        <path d="M9 10h6" />
      </svg>
    `,
  },
  {
    name: "Factories",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 20h18" />
        <path d="M5 20V9l5 3V9l5 3V6h4v14" />
        <path d="M8 16h1" />
        <path d="M12 16h1" />
        <path d="M16 16h1" />
      </svg>
    `,
  },
  {
    name: "Hospitals",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 20V5h14v15" />
        <path d="M3 20h18" />
        <path d="M12 8v7" />
        <path d="M8.5 11.5h7" />
      </svg>
    `,
  },
  {
    name: "Hotels",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13" />
        <path d="M16 11h2a2 2 0 0 1 2 2v7" />
        <path d="M8 9h4" />
        <path d="M8 13h4" />
      </svg>
    `,
  },
  {
    name: "Mall",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    `,
  },
  {
    name: "Telecom",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20V8" />
        <path d="m8 20 4-12 4 12" />
        <path d="M8.5 10.5a5 5 0 0 1 7 0" />
        <path d="M5.5 7.5a9.2 9.2 0 0 1 13 0" />
      </svg>
    `,
  },
  {
    name: "Schools",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12v4c2.9 2 7.1 2 10 0v-4" />
        <path d="M21 9v6" />
      </svg>
    `,
  },
  {
    name: "Warehouses",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20V9l8-5 8 5v11" />
        <path d="M8 20v-7h8v7" />
        <path d="M10 16h4" />
        <path d="M12 13v7" />
      </svg>
    `,
  },
];

export function createIndustriesWeServeSection() {
  const section = document.createElement("section");

  section.className = "industries";
  section.dataset.industries = "section";
  section.innerHTML = `
    <div class="container industries__inner">
      <div class="industries__heading" data-industries-heading>
        <p class="industries__eyebrow">Industries We Serve</p>
        <h2 class="industries__title">Reliable power for critical operations</h2>
      </div>

      <div class="industries__grid" aria-label="Industries served by UPKAR Generator">
        ${INDUSTRIES.map(
          (industry) => `
            <article class="industry-card" data-industry-card>
              <div class="industry-card__bg" style="background-image: url('/images/industries/${industry.name.toLowerCase()}.webp')"></div>
              <div class="industry-card__overlay"></div>
              <span class="industry-card__icon">${industry.icon}</span>
              <h3 class="industry-card__title">${industry.name}</h3>
            </article>
          `,
        ).join("")}
      </div>
    </div>
  `;

  return section;
}
