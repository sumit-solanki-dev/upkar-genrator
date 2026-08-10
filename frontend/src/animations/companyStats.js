import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function renderStat(number, value) {
  const suffix = number.dataset.statSuffix || "";

  number.textContent = `${Math.round(value)}${suffix}`;
}

function setFinalValues(numbers) {
  numbers.forEach((number) => {
    renderStat(number, Number(number.dataset.statValue || 0));
  });
}

export function initCompanyStatsAnimations() {
  const section = document.querySelector("[data-company-stats='section']");

  if (!section) {
    return null;
  }

  const cards = gsap.utils.toArray("[data-stat-card]", section);
  const numbers = gsap.utils.toArray("[data-stat-number]", section);

  if (prefersReducedMotion()) {
    setFinalValues(numbers);
    return section;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top 78%",
    once: true,
    onEnter: () => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 28, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.08,
        },
      );

      numbers.forEach((number, index) => {
        const counter = { value: 0 };
        const targetValue = Number(number.dataset.statValue || 0);

        gsap.to(counter, {
          value: targetValue,
          duration: 1.4 + index * 0.12,
          ease: "power2.out",
          onUpdate: () => renderStat(number, counter.value),
          onComplete: () => renderStat(number, targetValue),
        });
      });
    },
  });

  return section;
}
