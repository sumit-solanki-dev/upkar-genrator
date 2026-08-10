import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initIndustriesAnimations() {
  const section = document.querySelector("[data-industries='section']");

  if (!section) {
    return null;
  }

  const heading = section.querySelector("[data-industries-heading]");
  const cards = gsap.utils.toArray("[data-industry-card]", section);

  if (prefersReducedMotion()) {
    gsap.set([heading, cards], { autoAlpha: 1, y: 0 });
    return section;
  }

  gsap.set([heading, cards], { autoAlpha: 0, y: 24 });

  ScrollTrigger.create({
    trigger: section,
    start: "top 76%",
    once: true,
    onEnter: () => {
      gsap
        .timeline({ defaults: { duration: 0.72, ease: "power3.out" } })
        .to(heading, { autoAlpha: 1, y: 0 })
        .to(cards, { autoAlpha: 1, y: 0, stagger: 0.07 }, "-=0.36");
    },
  });

  return section;
}
