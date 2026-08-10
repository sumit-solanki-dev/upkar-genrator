import { setPageMeta } from "../../utils/seo.js";

function renderList(items, className) {
  return items.map((item) => `<li class="${className}">${item}</li>`).join("");
}

const ABOUT_DATA = {
  hero_eyebrow: "About Us",
  hero_title: "Built to deliver dependable industrial power",
  hero_description:
    "Founded in 2013, UPKAR Generator supports businesses with practical diesel generator solutions, careful manufacturing, and responsive service.",
  story_eyebrow: "Company Story",
  story_title: "A focused generator company since 2013",
  story_paragraph1:
    "UPKAR Generator started with a simple goal: help commercial and industrial customers keep operations moving when power reliability matters most. Since 2013, the company has grown around hands-on manufacturing, product testing, service readiness, and long-term customer relationships.",
  story_paragraph2:
    "The team works across generator selection, fabrication, assembly, quality inspection, delivery, and support so every unit is matched to real site conditions.",
  founded_year: "2013",
  mission_title: "Mission",
  mission_text:
    "To provide dependable generator solutions that help businesses operate confidently through power interruptions and demanding workloads.",
  vision_title: "Vision",
  vision_text:
    "To become a trusted power partner for Indian industries through quality manufacturing, honest guidance, and responsive service support.",
  meta_title: "About Us",
  meta_description:
    "Learn about UPKAR Generator, founded in 2013, including company story, mission, vision, manufacturing process, certificates, team, and timeline.",
};

const PROCESS_STEPS = [
  "Requirement analysis and generator sizing",
  "Engine and alternator procurement",
  "Chassis and canopy fabrication",
  "Assembly and wiring",
  "Load testing and quality inspection",
  "Paint, finishing, and packaging",
  "Dispatch and on-site commissioning",
];

const CERTIFICATES = [
  "ISO 9001:2015 Quality Management",
  "CE Certification",
  "CPCB II Emission Norms",
];

const TEAM = [
  { role: "Engineering", description: "Generator sizing, electrical design, and quality testing." },
  { role: "Manufacturing", description: "Fabrication, assembly, and production-floor operations." },
  { role: "Sales & Support", description: "Customer consultation, quotation, and after-sales service." },
];

const TIMELINE = [
  { year: "2013", title: "Company Founded", description: "UPKAR Generator established in Industrial Area, India." },
  { year: "2016", title: "Product Range Expansion", description: "Extended capacity range from 15 KVA to 500 KVA models." },
  { year: "2019", title: "Silent Generator Line", description: "Launched acoustic enclosure DG sets for noise-sensitive sites." },
  { year: "2022", title: "Service Network Growth", description: "Expanded maintenance and AMC coverage across key regions." },
];

const STATS = [
  { value: "10", suffix: "+", label: "Years of Experience" },
  { value: "500", suffix: "+", label: "Generators Delivered" },
  { value: "200", suffix: "+", label: "Active Clients" },
  { value: "24", suffix: "/7", label: "Service Support" },
];

export async function createAboutPage() {
  const aboutData = ABOUT_DATA;
  const processSteps = PROCESS_STEPS;
  const certificates = CERTIFICATES;
  const team = TEAM;
  const timeline = TIMELINE;
  const stats = STATS;

  const metaTitle = aboutData.meta_title;
  const metaDesc = aboutData.meta_description;

  setPageMeta({
    title: metaTitle,
    description: metaDesc,
    path: "/about/",
  });

  const page = document.createElement("div");

  page.className = "about-page";
  page.innerHTML = `
    <section class="about-hero" aria-labelledby="about-title">
      <div class="container about-hero__inner">
        <p class="about-hero__eyebrow">${aboutData.hero_eyebrow || "About Us"}</p>
        <h1 class="about-hero__title" id="about-title">${aboutData.hero_title || "Built to deliver dependable industrial power"}</h1>
        <p class="about-hero__description">
          ${aboutData.hero_description || "Founded in 2013, UPKAR Generator supports businesses with practical diesel generator solutions, careful manufacturing, and responsive service."}
        </p>
      </div>
    </section>

    <section class="about-story" aria-labelledby="about-story-title">
      <div class="container about-story__inner">
        <article class="about-story__content">
          <p class="about-story__eyebrow">${aboutData.story_eyebrow || "Company Story"}</p>
          <h2 class="about-story__title" id="about-story-title">${aboutData.story_title || "A focused generator company since 2013"}</h2>
          <p>
            ${aboutData.story_paragraph1 || "UPKAR Generator started with a simple goal: help commercial and industrial customers keep operations moving when power reliability matters most. Since 2013, the company has grown around hands-on manufacturing, product testing, service readiness, and long-term customer relationships."}
          </p>
          ${aboutData.story_paragraph2 ? `<p>${aboutData.story_paragraph2}</p>` : `<p>The team works across generator selection, fabrication, assembly, quality inspection, delivery, and support so every unit is matched to real site conditions.</p>`}
        </article>

        <div class="about-story__year" aria-label="Founded in ${aboutData.founded_year || "2013"}">
          <span>Founded</span>
          <strong>${aboutData.founded_year || "2013"}</strong>
        </div>
      </div>
    </section>

    <section class="about-values" aria-label="Mission and vision">
      <div class="container about-values__grid">
        <article class="about-value-card">
          <span class="about-value-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 3v18" /><path d="m5 10 7-7 7 7" /><path d="M5 21h14" /></svg>
          </span>
          <h2>${aboutData.mission_title || "Mission"}</h2>
          <p>${aboutData.mission_text || "To provide dependable generator solutions that help businesses operate confidently through power interruptions and demanding workloads."}</p>
        </article>

        <article class="about-value-card">
          <span class="about-value-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" /></svg>
          </span>
          <h2>${aboutData.vision_title || "Vision"}</h2>
          <p>${aboutData.vision_text || "To become a trusted power partner for Indian industries through quality manufacturing, honest guidance, and responsive service support."}</p>
        </article>
      </div>
    </section>
    
    ${stats.length > 0 ? `
    <section class="company-stats" aria-label="Company statistics" style="margin-top: 4rem;">
      <div class="container company-stats__inner">
        <div class="company-stats__grid">
          ${stats.map(stat => `
            <article class="company-stat-card" data-stat-card>
              <p class="company-stat-card__value" aria-label="${stat.value}${stat.suffix} ${stat.label}">
                <span data-stat-number data-stat-value="${stat.value}" data-stat-suffix="${stat.suffix}">${stat.value}${stat.suffix}</span>
              </p>
              <h2 class="company-stat-card__label">${stat.label}</h2>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    ` : ""}

    <section class="about-process" aria-labelledby="about-process-title">
      <div class="container about-process__inner">
        <div class="about-section-heading">
          <p>Manufacturing Process</p>
          <h2 id="about-process-title">Overview of how each unit moves through production</h2>
        </div>
        <ol class="about-process__list">
          ${processSteps.map(
            (step, index) => `
              <li class="about-process__item">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <p>${step}</p>
              </li>
            `,
          ).join("")}
        </ol>
      </div>
    </section>

    <section class="about-certificates" aria-labelledby="about-certificates-title">
      <div class="container about-certificates__inner">
        <div class="about-section-heading">
          <p>Certificates</p>
          <h2 id="about-certificates-title">Documentation and quality standards</h2>
        </div>
        <div class="about-certificates__grid">
          ${renderList(certificates, "about-certificate-card")}
        </div>
      </div>
    </section>

    ${team.length > 0 ? `
    <section class="about-team" aria-labelledby="about-team-title">
      <div class="container about-team__inner">
        <div class="about-section-heading">
          <p>Team</p>
          <h2 id="about-team-title">People behind the power systems</h2>
        </div>
        <div class="about-team__grid">
          ${team.map(
            (member) => `
              <article class="about-team-card">
                <span class="about-team-card__avatar" aria-hidden="true">${member.role.slice(0, 2).toUpperCase()}</span>
                <h3>${member.role}</h3>
                <p>${member.description}</p>
              </article>
            `,
          ).join("")}
        </div>
      </div>
    </section>
    ` : ""}

    <section class="about-timeline" aria-labelledby="about-timeline-title">
      <div class="container about-timeline__inner">
        <div class="about-section-heading">
          <p>Timeline</p>
          <h2 id="about-timeline-title">Milestones in the UPKAR journey</h2>
        </div>
        <ol class="about-timeline__list">
          ${timeline.map(
            (item) => `
              <li class="about-timeline__item">
                <span class="about-timeline__year">${item.year}</span>
                <div>
                  <h3>${item.title}</h3>
                  <p>${item.description}</p>
                </div>
              </li>
            `,
          ).join("")}
        </ol>
      </div>
    </section>
  `;

  return page;
}
