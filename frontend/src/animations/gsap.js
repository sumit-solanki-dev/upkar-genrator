import { gsap } from "gsap";

const NAV_DESKTOP_MIN_WIDTH = 1081;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initNavbarAnimations() {
  if (prefersReducedMotion()) {
    return null;
  }

  const header = document.querySelector("[data-animate='navbar']");
  const menu = document.querySelector("[data-nav='menu']");
  const menuItems = gsap.utils.toArray("[data-nav-item]");

  if (!header) {
    return null;
  }

  if (window.innerWidth < NAV_DESKTOP_MIN_WIDTH) {
    gsap
      .timeline({ defaults: { duration: 0.7, ease: "power3.out" } })
      .from(header, { autoAlpha: 0, y: -22, clearProps: "opacity,visibility,transform" })
      .from(".brand__mark", { autoAlpha: 0, scale: 0.86, clearProps: "opacity,visibility,transform" }, "-=0.4")
      .from(".brand__text", { autoAlpha: 0, x: -12, clearProps: "opacity,visibility,transform" }, "-=0.36");
    return menu;
  }

  gsap
    .timeline({ defaults: { duration: 0.7, ease: "power3.out" } })
    .from(header, { autoAlpha: 0, y: -22, clearProps: "opacity,visibility,transform" })
    .from(".brand__mark", { autoAlpha: 0, scale: 0.86, clearProps: "opacity,visibility,transform" }, "-=0.4")
    .from(".brand__text", { autoAlpha: 0, x: -12, clearProps: "opacity,visibility,transform" }, "-=0.36")
    .from(menuItems, { autoAlpha: 0, y: -8, stagger: 0.055, clearProps: "opacity,visibility,transform" }, "-=0.3");

  if (!menu) {
    return header;
  }

  // Rely on pure CSS transitions for mobile menu toggle
  // This prevents severe mobile GPU rendering bugs on Safari/Chrome
  // where backdrop-filter + child transforms cause invisible text.

  return menu;
}

export function initHeroAnimations() {
  const hero = document.querySelector("[data-animate='hero']");

  if (!hero || prefersReducedMotion()) {
    return null;
  }

  const titleCharacters = gsap.utils.toArray(".hero-title__char", hero);
  const introItems = gsap.utils.toArray(".hero-subtitle, .hero-description, .hero-actions", hero);
  const visual = hero.querySelector("[data-parallax-visual]");
  const backgroundLayers = gsap.utils.toArray("[data-parallax-bg]", hero);

  gsap
    .timeline({ defaults: { duration: 0.78, ease: "power3.out" } })
    .from(".hero-subtitle", { autoAlpha: 0, y: 18 })
    .from(titleCharacters, { autoAlpha: 0, yPercent: 105, rotateX: -60, stagger: 0.025 }, "-=0.26")
    .from(introItems.slice(1), { autoAlpha: 0, y: 18, stagger: 0.1 }, "-=0.36")
    .from(visual, { autoAlpha: 0, x: 42, scale: 0.94 }, "-=0.72")
    .from(backgroundLayers, { autoAlpha: 0, x: 32, stagger: 0.08 }, "-=0.74");

  if (!visual || !window.matchMedia("(pointer: fine)").matches) {
    return hero;
  }

  const moveVisualX = gsap.quickTo(visual, "x", { duration: 0.65, ease: "power3.out" });
  const moveVisualY = gsap.quickTo(visual, "y", { duration: 0.65, ease: "power3.out" });
  const moveVisualRotate = gsap.quickTo(visual, "rotation", { duration: 0.65, ease: "power3.out" });
  const backgroundTweens = backgroundLayers.map((layer, index) => ({
    x: gsap.quickTo(layer, "x", { duration: 0.85, ease: "power3.out" }),
    y: gsap.quickTo(layer, "y", { duration: 0.85, ease: "power3.out" }),
    depth: index + 1,
  }));

  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

    moveVisualX(pointerX * 26);
    moveVisualY(pointerY * 18);
    moveVisualRotate(pointerX * 1.6);

    backgroundTweens.forEach((tween) => {
      tween.x(pointerX * tween.depth * -18);
      tween.y(pointerY * tween.depth * -12);
    });
  });

  hero.addEventListener("pointerleave", () => {
    moveVisualX(0);
    moveVisualY(0);
    moveVisualRotate(0);

    backgroundTweens.forEach((tween) => {
      tween.x(0);
      tween.y(0);
    });
  });

  return hero;
}
