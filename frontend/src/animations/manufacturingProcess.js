import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateProcess(section, isMobile) {
  const heading = section.querySelector("[data-process-heading]");
  const line = section.querySelector("[data-process-line]");
  const steps = gsap.utils.toArray("[data-process-step]", section);

  gsap.set(heading, { autoAlpha: 0, y: 22 });
  gsap.set(steps, { autoAlpha: 0, y: isMobile ? 18 : 24 });
  gsap.set(line, {
    scaleX: isMobile ? 1 : 0,
    scaleY: isMobile ? 0 : 1,
    transformOrigin: isMobile ? "center top" : "left center",
  });

  const isAndroid = /Android/i.test(navigator.userAgent);

  ScrollTrigger.create({
    trigger: section,
    start: isAndroid ? "top 95%" : "top 74%",
    once: true,
    onEnter: () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(heading, { autoAlpha: 1, y: 0, duration: 0.68 })
        .to(
          line,
          {
            scaleX: 1,
            scaleY: 1,
            duration: 1.05,
          },
          "-=0.24",
        )
        .to(
          steps,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.64,
            stagger: 0.085,
          },
          "-=0.74",
        );
    },
  });
}

export function initManufacturingProcessAnimations() {
  const section = document.querySelector("[data-manufacturing-process='section']");

  if (!section) {
    return null;
  }

  const heading = section.querySelector("[data-process-heading]");
  const line = section.querySelector("[data-process-line]");
  const steps = gsap.utils.toArray("[data-process-step]", section);

  if (prefersReducedMotion()) {
    gsap.set([heading, line, steps], { autoAlpha: 1, clearProps: "transform" });
    return section;
  }

  const media = gsap.matchMedia();

  media.add("(max-width: 699px)", () => animateProcess(section, true));
  media.add("(min-width: 700px)", () => animateProcess(section, false));

  return section;
}
