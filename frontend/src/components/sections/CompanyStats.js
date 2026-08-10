const COMPANY_STATS = [
  {
    value: 13,
    suffix: "+",
    label: "Years Experience",
  },
  {
    value: 1000,
    suffix: "+",
    label: "Generators Delivered",
  },
  {
    value: 800,
    suffix: "+",
    label: "Happy Clients",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Customer Support",
  },
];

export function createCompanyStatsSection() {
  const section = document.createElement("section");

  section.className = "company-stats";
  section.dataset.companyStats = "section";
  section.setAttribute("aria-label", "Company statistics");
  section.innerHTML = `
    <div class="container company-stats__inner">
      <div class="company-stats__grid">
        ${COMPANY_STATS.map(
          (stat) => `
            <article class="company-stat-card" data-stat-card>
              <p
                class="company-stat-card__value"
                aria-label="${stat.value}${stat.suffix} ${stat.label}"
              >
                <span data-stat-number data-stat-value="${stat.value}" data-stat-suffix="${stat.suffix}">0${stat.suffix}</span>
              </p>
              <h2 class="company-stat-card__label">${stat.label}</h2>
            </article>
          `,
        ).join("")}
      </div>
    </div>
  `;

  return section;
}
