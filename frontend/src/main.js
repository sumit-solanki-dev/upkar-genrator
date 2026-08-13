import "./styles/main.css";

import { createFooter } from "./components/layout/Footer.js";
import { createNavigation } from "./components/layout/Navigation.js";
import { createWhatsAppFloat } from "./components/ui/WhatsAppFloat.js";
import { ROUTES } from "./utils/constants.js";
import { normalizePath, qs } from "./utils/dom.js";
import { setPageMeta } from "./utils/seo.js";

function runWhenIdle(callback) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 1400 });
    return;
  }

  window.setTimeout(callback, 0);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initNavigationEnhancements() {
  runWhenIdle(async () => {
    try {
      const { initNavbarAnimations } = await import("./animations/gsap.js");

      initNavbarAnimations();
    } catch {
      // Non-critical animation chunk; keep navigation usable if it fails.
    }
  });
}

function createErrorPage() {
  const section = document.createElement("section");

  setPageMeta({
    title: "Page unavailable",
    description: "The requested UPKAR Generator page could not be loaded.",
    path: window.location.pathname,
  });

  section.className = "page-shell";
  section.innerHTML = `
    <div class="container page-shell__inner">
      <p class="page-shell__eyebrow">Page unavailable</p>
      <h1 class="page-shell__title">We could not load this page</h1>
      <p class="page-shell__description">Please refresh the page or return to the homepage.</p>
      <a class="button button--primary" href="/">Go Home</a>
    </div>
  `;

  return { nodes: [section] };
}

async function createHomePage() {
  const [
    { createHeroSection },
    { createScrollSequenceSection },
    { createCompanyStatsSection },
    { createIndustriesWeServeSection },
    { createManufacturingProcessSection },
    { createCTASection },
    { createFeaturedProductsSection },
  ] = await Promise.all([
    import("./components/sections/Hero.js"),
    import("./components/sections/ScrollSequence.js"),
    import("./components/sections/CompanyStats.js"),
    import("./components/sections/IndustriesWeServe.js"),
    import("./components/sections/ManufacturingProcess.js"),
    import("./components/sections/CTA.js"),
    import("./components/sections/FeaturedProducts.js"),
  ]);

  setPageMeta({
    title: "UPKAR Generator",
    description:
      "UPKAR Generator builds dependable diesel generator solutions for factories, hospitals, hotels, construction, agriculture, telecom, and commercial facilities.",
    path: "/",
  });

  return {
    nodes: [
      createHeroSection(),
      createScrollSequenceSection(),
      createCompanyStatsSection(),
      createIndustriesWeServeSection(),
      createManufacturingProcessSection(),
      createCTASection(),
      await createFeaturedProductsSection(),
    ],
    enhance: initHomeEnhancements,
  };
}

async function createPageContent(pathname) {
  if (pathname === "/products") {
    const { createProductListingPage } = await import("./components/pages/ProductListingPage.js");

    return { nodes: [await createProductListingPage()] };
  }

  if (pathname.startsWith("/products/")) {
    const slug = pathname.replace("/products/", "");
    const { createProductDetailsPage } = await import("./components/pages/ProductDetailsPage.js");

    return { nodes: [await createProductDetailsPage(slug)] };
  }

  if (pathname === "/contact") {
    const { createContactPage } = await import("./components/pages/ContactPage.js");

    return { nodes: [createContactPage()] };
  }

  if (pathname === "/about") {
    const { createAboutPage } = await import("./components/pages/AboutPage.js");

    return { nodes: [await createAboutPage()] };
  }

  if (pathname === "/services") {
    const { createServicesPage } = await import("./components/pages/ServicesPage.js");

    return { nodes: [await createServicesPage()] };
  }

  return createHomePage();
}

function initHomeEnhancements() {
  runWhenIdle(async () => {
    const [
      { initLenis },
      { initHeroAnimations },
      { initScrollSequence },
      { initCompanyStatsAnimations },
      { initIndustriesAnimations },
      { initManufacturingProcessAnimations },
      { initSwipers },
    ] = await Promise.all([
      import("./animations/lenis.js"),
      import("./animations/gsap.js"),
      import("./animations/scrollSequence.js"),
      import("./animations/companyStats.js"),
      import("./animations/industries.js"),
      import("./animations/manufacturingProcess.js"),
      import("./animations/swiper.js"),
    ]);

    initLenis();
    initHeroAnimations();
    initScrollSequence();
    initCompanyStatsAnimations();
    initIndustriesAnimations();
    initManufacturingProcessAnimations();
    initSwipers("[data-featured-products-slider]");
  });
}

async function initializeApp() {
  qs("#navigation-root")?.replaceChildren(createNavigation({ links: ROUTES.primary }));
  initNavigationEnhancements();

  const app = qs("#app");
  const currentPath = normalizePath(window.location.pathname);

  app?.setAttribute("aria-busy", "true");
  let pageContent;

  try {
    pageContent = await createPageContent(currentPath);
  } catch {
    pageContent = createErrorPage();
  }

  app?.replaceChildren(...pageContent.nodes, createWhatsAppFloat());
  app?.setAttribute("aria-busy", "false");
  qs("[data-site-footer]")?.remove();
  app?.after(createFooter());
  pageContent.enhance?.();
}

initializeApp();

// --- DIAGNOSTIC INJECTION START ---
function runDiagnostics() {
  setTimeout(() => {
    const viewportWidth = document.documentElement.clientWidth;

    const overflowingElements = [...document.querySelectorAll("*")]
      .map((element) => {
        const rect = element.getBoundingClientRect();

        return {
          element,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          overflowRight: rect.right - viewportWidth,
          overflowLeft: -rect.left,
        };
      })
      .filter(
        (item) =>
          item.right > viewportWidth + 1 ||
          item.left < -1
      );

    console.log("HORIZONTAL OVERFLOW TEST", {
      innerWidth: window.innerWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowAmount:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    });

    const worstRightOverflow = overflowingElements
      .sort((a, b) => b.right - a.right)[0];

    if (worstRightOverflow) {
      console.log("WORST HORIZONTAL OVERFLOW ELEMENT", {
        tag: worstRightOverflow.element.tagName,
        className:
          typeof worstRightOverflow.element.className === "string"
            ? worstRightOverflow.element.className
            : "",
        id: worstRightOverflow.element.id,
        left: worstRightOverflow.left,
        right: worstRightOverflow.right,
        width: worstRightOverflow.width,
        overflowRight: worstRightOverflow.overflowRight,
      });
    }
  }, 2000);
}

runWhenIdle(runDiagnostics);
// --- DIAGNOSTIC INJECTION END ---
