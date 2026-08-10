const TESTIMONIALS = [
  {
    name: "Rajiv Mehta",
    role: "Operations Director",
    company: "Apex Infra Projects",
    quote:
      "UPKAR supplied a dependable generator package for our construction sites. The installation support was sharp and the performance has been consistent.",
    colors: ["#0b8c88", "#ff7a00"],
  },
  {
    name: "Nisha Kapoor",
    role: "Facility Head",
    company: "Sterling Hospitals",
    quote:
      "Power backup is critical for us. The UPKAR team understood the requirement quickly and delivered a solution we can trust during outages.",
    colors: ["#066966", "#f7b267"],
  },
  {
    name: "Arjun Rao",
    role: "Plant Manager",
    company: "Vector Manufacturing",
    quote:
      "The generator has handled our factory load smoothly. Their testing and quality checks gave us real confidence before dispatch.",
    colors: ["#1d2939", "#0b8c88"],
  },
  {
    name: "Priya Menon",
    role: "General Manager",
    company: "Grand Meridian Hotels",
    quote:
      "Our guest experience depends on quiet and reliable backup power. UPKAR delivered a clean installation with responsive service.",
    colors: ["#c95f00", "#0b8c88"],
  },
  {
    name: "Karan Singh",
    role: "Network Lead",
    company: "Northline Telecom",
    quote:
      "We needed stable power for remote telecom equipment. UPKAR's team made selection, delivery, and support straightforward.",
    colors: ["#0b8c88", "#1d2939"],
  },
];

function createAvatar({ name, colors }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [primary, accent] = colors;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="40" fill="${primary}"/>
      <circle cx="116" cy="42" r="34" fill="${accent}" opacity="0.9"/>
      <circle cx="60" cy="64" r="28" fill="#ffffff" opacity="0.95"/>
      <path d="M28 136c8-28 26-42 54-42s46 14 54 42" fill="#ffffff" opacity="0.9"/>
      <text x="80" y="89" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="${primary}">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function createStars() {
  return Array.from(
    { length: 5 },
    () => `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </svg>
    `,
  ).join("");
}

export function createTestimonialsSection() {
  const section = document.createElement("section");

  section.className = "testimonials";
  section.dataset.testimonials = "section";
  section.innerHTML = `
    <div class="container testimonials__inner">
      <div class="testimonials__heading">
        <p class="testimonials__eyebrow">Testimonials</p>
        <h2 class="testimonials__title">Trusted by teams that cannot pause operations</h2>
      </div>

      <div
        class="testimonials__swiper swiper js-swiper"
        data-testimonials-slider
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
      >
        <div class="swiper-wrapper">
          ${TESTIMONIALS.map(
            (testimonial) => `
              <article class="testimonial-card swiper-slide">
                <div class="testimonial-card__header">
                  <img
                    class="testimonial-card__image"
                    src="${createAvatar(testimonial)}"
                    alt="${testimonial.name}, ${testimonial.role} at ${testimonial.company}"
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                  />
                  <div class="testimonial-card__meta">
                    <h3 class="testimonial-card__name">${testimonial.name}</h3>
                    <p class="testimonial-card__role">${testimonial.role}</p>
                    <p class="testimonial-card__company">${testimonial.company}</p>
                  </div>
                </div>

                <div class="testimonial-card__rating" aria-label="5 out of 5 stars">
                  ${createStars()}
                </div>

                <blockquote class="testimonial-card__quote">${testimonial.quote}</blockquote>
              </article>
            `,
          ).join("")}
        </div>

        <div class="testimonials__controls" aria-label="Testimonials carousel controls">
          <button class="testimonials__nav testimonials__nav--prev swiper-button-prev" type="button" aria-label="Previous testimonial"></button>
          <div class="testimonials__pagination swiper-pagination"></div>
          <button class="testimonials__nav testimonials__nav--next swiper-button-next" type="button" aria-label="Next testimonial"></button>
        </div>
      </div>
    </div>
  `;

  return section;
}
