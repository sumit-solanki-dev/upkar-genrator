import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const prerenderedRoutes = [
  "/",
  "/products",
  "/about",
  "/services",
  "/contact",
  "/privacy",
  "/products/15-kva",
  "/products/25-kva",
  "/products/40-kva",
  "/products/62-5-kva",
  "/products/100-kva",
  "/products/125-kva",
] as const;

test("serves every prerendered route with complete crawlable metadata", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const route of prerenderedRoutes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main#main-content"), route).toHaveCount(1);
    await expect(page.locator("main#main-content h1"), route).toHaveCount(1);
    await expect(page, route).toHaveTitle(/\S/);
    await expect(page.locator('meta[name="description"]'), route).toHaveAttribute(
      "content",
      /\S/,
    );
    await expect(page.locator('link[rel="canonical"]'), route).toHaveAttribute(
      "href",
      /^https:\/\/upkargenerator\.com\//,
    );
    await expect(page.locator('meta[property="og:image"]'), route).toHaveAttribute(
      "content",
      /^https:\/\/upkargenerator\.com\//,
    );
  }

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("retains a real HTTP 404 for unknown direct requests", async ({ request }) => {
  const response = await request.get("/definitely-not-a-route");
  expect(response.status()).toBe(404);
});

test("shows the confirmed company track record on the home page", async ({ page }) => {
  await page.goto("/");
  const trackRecord = page.locator('dl[aria-label="Company track record"]');

  await expect(trackRecord.getByText("13+", { exact: true })).toBeVisible();
  await expect(trackRecord.getByText("Years of experience")).toBeVisible();
  await expect(trackRecord.getByText("1,000+", { exact: true })).toBeVisible();
  await expect(trackRecord.getByText("Generators delivered")).toBeVisible();
});

test("presents the company timeline and documentation on the About page", async ({
  page,
}) => {
  await page.goto("/about");

  const timeline = page.locator(
    'section[aria-labelledby="about-timeline-title"]',
  );
  await expect(
    timeline.getByRole("heading", { name: "Milestones in the UPKAR journey" }),
  ).toBeVisible();
  await expect(timeline.locator('ol[aria-label="Company milestones"] > li')).toHaveCount(
    4,
  );
  for (const milestone of [
    "Company Founded",
    "Product Range Expansion",
    "Silent Generator Line",
    "Service Network Growth",
  ]) {
    await expect(timeline.getByRole("heading", { name: milestone })).toBeVisible();
  }

  const certificates = page.locator(
    'section[aria-labelledby="about-certificates-title"]',
  );
  await expect(
    certificates.getByRole("heading", {
      name: "Documentation and quality standards",
    }),
  ).toBeVisible();
  await expect(
    certificates.locator('ul[aria-label="Certificates and standards"] > li'),
  ).toHaveCount(3);
  for (const certificate of [
    "ISO 9001:2015 Quality Management",
    "CE Certification",
    "CPCB II Emission Norms",
  ]) {
    await expect(certificates.getByRole("heading", { name: certificate })).toBeVisible();
  }
});

test("restores the Contact and Footer location maps", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });

  const visitSection = page.locator(
    'section[aria-labelledby="contact-location-title"]',
  );
  const contactMap = visitSection.locator(
    'iframe[title="UPKAR Generator location map on the Contact page"]',
  );
  const footer = page.locator("footer");
  const footerMap = footer.locator(
    'iframe[title="UPKAR Generator location map in the footer"]',
  );

  await expect(contactMap).toHaveAttribute("loading", "lazy");
  await expect(contactMap).toHaveAttribute("src", /google\.com\/maps\/embed/);
  await expect(footerMap).toHaveAttribute("loading", "lazy");
  await expect(footerMap).toHaveAttribute("src", /google\.com\/maps\/embed/);
  await expect(
    visitSection.getByRole("link", { name: /Get directions/ }),
  ).toHaveAttribute("href", "https://maps.google.com/maps?q=Upkar+generator");
  await expect(footer.getByRole("link", { name: /Get directions/ })).toHaveAttribute(
    "href",
    "https://maps.google.com/maps?q=Upkar+generator",
  );

  await contactMap.scrollIntoViewIfNeeded();
  const mapBounds = await contactMap.boundingBox();
  expect(mapBounds).not.toBeNull();
  expect(mapBounds!.height).toBeGreaterThanOrEqual(300);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});

test("uses catalog artwork in the product carousel and exposes footer social links", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page
      .getByRole("region", { name: "Featured generator models" })
      .getByRole("img", { name: "Representative industrial diesel generator" }),
  ).toHaveAttribute("src", "/images/sequence/frame_0001.webp");

  for (const [label, href] of [
    ["Instagram", "https://instagram.com"],
    ["Facebook", "https://facebook.com"],
    ["LinkedIn", "https://linkedin.com"],
  ] as const) {
    await expect(
      page.getByRole("link", { name: `${label} (opens in a new tab)` }),
    ).toHaveAttribute("href", href);
  }
});

test("publishes responsive candidates for every raster-heavy page section", async ({
  page,
}) => {
  await page.goto("/");

  const productImage = page
    .getByRole("region", { name: "Featured generator models" })
    .getByRole("img", { name: "Representative industrial diesel generator" })
    .first();
  await expect(productImage).toHaveAttribute(
    "srcset",
    /optimized-v1\/products\/frame_0001-480\.webp 480w/,
  );

  const industries = page.locator('section[aria-labelledby="industries-title"]');
  const firstIndustry = industries.locator("li").first();
  await expect(firstIndustry.locator("source")).toHaveAttribute(
    "srcset",
    /construction-landscape-1024\.webp 1024w/,
  );
  await expect(firstIndustry.locator("img")).toHaveAttribute(
    "srcset",
    /construction-768\.webp 768w/,
  );

  const callToAction = page.locator('section[aria-labelledby="home-cta-title"]');
  await expect(callToAction.locator("source")).toHaveAttribute(
    "srcset",
    /cta-mobile-1000\.webp 1000w/,
  );
  await expect(callToAction.locator("img")).toHaveAttribute(
    "srcset",
    /cta-960\.webp 960w/,
  );
});

test("uses a real icon in the floating WhatsApp contact button", async ({ page }) => {
  await page.goto("/");

  const whatsapp = page.getByRole("link", {
    name: "Discuss your generator requirement on WhatsApp",
  });
  await expect(whatsapp).toHaveAttribute(
    "href",
    "https://wa.me/919926277986?text=Hello%20UPKAR%20Generator%2C%20I%20would%20like%20to%20discuss%20a%20generator%20requirement.",
  );
  await expect(whatsapp).toHaveAttribute("target", "_blank");
  await expect(whatsapp).toHaveAttribute("rel", /noopener/);
  await expect(whatsapp.locator('svg[aria-hidden="true"]')).toHaveCount(1);
  await expect(whatsapp.getByText("WA", { exact: true })).toHaveCount(0);
});

test("keeps the hero clear of the fixed navigation and exposes the full product carousel", async ({
  page,
}) => {
  await page.goto("/");

  const headerBounds = await page.locator("header").boundingBox();
  const eyebrowBounds = await page
    .getByText("Established 2013", { exact: true })
    .boundingBox();
  expect(headerBounds).not.toBeNull();
  expect(eyebrowBounds).not.toBeNull();
  expect(eyebrowBounds!.y - (headerBounds!.y + headerBounds!.height)).toBeGreaterThanOrEqual(40);

  const carousel = page.getByRole("region", { name: "Featured generator models" });
  await carousel.scrollIntoViewIfNeeded();

  const next = page.getByRole("button", { name: "Next product" });
  await next.click();
  await expect(page.getByRole("button", { name: "25 KVA", exact: true })).toHaveAttribute(
    "aria-current",
    "true",
  );

  await page.getByRole("button", { name: "125 KVA", exact: true }).click();
  await expect(page.locator("#featured-product-125-kva")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await expect(next).toBeDisabled();
});

test("crossfades the transparent navbar glass into its solid scrolled layer", async ({
  page,
}) => {
  await page.goto("/");
  const header = page.locator("header");
  const glassLayer = page.getByTestId("navbar-glass-layer");
  const solidLayer = page.getByTestId("navbar-solid-layer");
  const initialBounds = await header.boundingBox();

  await expect(header).toHaveAttribute("data-appearance", "glass");
  await expect(header).toHaveAttribute("data-scrolled", "false");
  await expect(solidLayer).toHaveCSS("opacity", "0");

  const glassVisuals = await glassLayer.evaluate((element) => {
    const styles = getComputedStyle(element);
    const slashAlpha = styles.backgroundColor.match(/\/\s*([\d.]+)\s*\)/)?.[1];
    const rgbaAlpha = styles.backgroundColor.match(/rgba\([^)]*,\s*([\d.]+)\s*\)/)?.[1];
    return {
      alpha: Number(slashAlpha ?? rgbaAlpha ?? 1),
      backdropFilter: styles.backdropFilter,
    };
  });
  expect(glassVisuals.alpha).toBeLessThanOrEqual(0.1);
  expect(glassVisuals.backdropFilter).toContain("blur");

  const solidTransition = await solidLayer.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      duration: Number.parseFloat(styles.transitionDuration),
      property: styles.transitionProperty,
    };
  });
  expect(solidTransition.property).toContain("opacity");
  expect(solidTransition.duration).toBeGreaterThanOrEqual(0.3);

  await page.evaluate(() => window.scrollTo(0, 36));
  await expect
    .poll(() => solidLayer.evaluate((element) => Number(getComputedStyle(element).opacity)))
    .toBeGreaterThan(0.25);
  await expect(header).toHaveAttribute("data-appearance", "glass");

  await page.evaluate(() => window.scrollTo(0, 128));
  await expect(header).toHaveAttribute("data-scrolled", "true");
  await expect(header).toHaveAttribute("data-appearance", "solid");
  await expect(solidLayer).toHaveCSS("opacity", "1");

  const scrolledBounds = await header.boundingBox();
  expect(initialBounds).not.toBeNull();
  expect(scrolledBounds).not.toBeNull();
  expect(scrolledBounds!.y).toBe(initialBounds!.y);
  expect(scrolledBounds!.height).toBe(initialBounds!.height);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).toHaveAttribute("data-appearance", "glass");
  await expect(solidLayer).toHaveCSS("opacity", "0");
});

test("desktop navigation stays balanced across supported widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop regression check");

  for (const width of [1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const brand = page.getByRole("link", { name: "UPKAR Generator home" });
    const navigation = page.getByRole("navigation", { name: "Primary navigation" });
    const brandBounds = await brand.boundingBox();
    const navigationBounds = await navigation.boundingBox();

    expect(brandBounds, `brand at ${width}px`).not.toBeNull();
    expect(navigationBounds, `navigation at ${width}px`).not.toBeNull();
    expect(brandBounds!.x + brandBounds!.width).toBeLessThanOrEqual(navigationBounds!.x);
    expect(navigationBounds!.x + navigationBounds!.width).toBeLessThanOrEqual(width - 12);
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeHidden();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});

test("has no serious or critical automated accessibility violations", async ({ page }) => {
  for (const route of prerenderedRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blockingViolations = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );
    expect(blockingViolations, route).toEqual([]);
  }
});

test("product search covers root and variant fields without crashing", async ({ page }) => {
  await page.goto("/products");
  const search = page.getByLabel("Search products");
  const summary = page.getByRole("heading", { level: 2, name: /products? found/ });

  await search.fill("Stamford");
  await expect(summary).toHaveText("6 products found");
  await expect(page).toHaveURL(/q=Stamford/);

  await search.fill("62.5");
  await expect(summary).toHaveText("1 product found");
  await expect(
    page.getByRole("link", { name: /UPKAR 62\.5 KVA Generator/ }).first(),
  ).toBeVisible();

  await search.fill("not-a-real-generator");
  await expect(summary).toHaveText("0 products found");
  await expect(
    page.getByRole("heading", { name: "No products match those filters" }),
  ).toBeVisible();
});

test("product configuration exposes and updates its selected state", async ({ page }) => {
  await page.goto("/products/15-kva");
  await page.getByRole("button", { name: "Silent Genset" }).click();
  await page.getByRole("button", { name: "Stamford" }).click();
  await page.getByRole("button", { name: "Three Phase" }).click();

  await expect(page.getByRole("button", { name: "Silent Genset" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Stamford" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("row", { name: "Phase Three Phase" })).toBeVisible();
});

test("mobile navigation opens, follows a route, and closes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Mobile regression check");
  await page.goto("/");
  const header = page.locator("header");
  const openMenu = page.getByRole("button", { name: "Open navigation menu" });
  const triggerBounds = await openMenu.boundingBox();
  expect(triggerBounds).not.toBeNull();
  expect(triggerBounds!.width).toBeGreaterThanOrEqual(44);
  expect(triggerBounds!.height).toBeGreaterThanOrEqual(44);

  await openMenu.click();
  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  const mobileNavigation = dialog.getByRole("navigation", {
    name: "Mobile primary navigation",
  });
  await expect(dialog).toBeVisible();
  await expect(header).toHaveAttribute("data-appearance", "glass");
  await expect(page.getByTestId("mobile-navigation-backdrop")).toHaveCSS("opacity", "1");
  await expect(mobileNavigation.getByRole("link", { name: "Home" })).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("hidden");

  const panelBounds = await page.locator("#mobile-navigation").boundingBox();
  const viewport = page.viewportSize();
  expect(panelBounds).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(panelBounds!.x).toBeGreaterThan(0);
  expect(panelBounds!.width).toBeLessThan(viewport!.width);

  await mobileNavigation.getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.overflow))
    .toBe("");
});

test("mobile navigation traps focus and restores it after Escape", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Mobile regression check");
  await page.goto("/");
  const openMenu = page.getByRole("button", { name: "Open navigation menu" });
  await openMenu.click();

  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  const mobileNavigation = dialog.getByRole("navigation", {
    name: "Mobile primary navigation",
  });
  const closeMenu = page.getByRole("button", { name: "Close navigation menu" });
  await expect(mobileNavigation.getByRole("link", { name: "Home" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(closeMenu).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(mobileNavigation.getByRole("link", { name: "Home" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toHaveCount(0);
  await expect(openMenu).toBeFocused();
});

test("open mobile navigation has no serious accessibility violations", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Mobile regression check");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeVisible();
  await expect(page.locator("#mobile-navigation")).toHaveCSS("opacity", "1");

  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );
  expect(blockingViolations).toEqual([]);
});

test("mobile sequence scrubs one packed video without requesting frame files", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Mobile regression check");

  const requestedVideos: string[] = [];
  const requestedFrames: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/generator-sequence-v4/generator-scroll.mp4")) {
      requestedVideos.push(request.url());
    }
    if (/generator-sequence-v[23].*\/frame_\d+\.webp/.test(request.url())) {
      requestedFrames.push(request.url());
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const sequence = page.locator(".ug-scroll-sequence");
  await expect(sequence).toBeVisible();
  await expect(sequence).toHaveAttribute("data-sequence-tier", /^(?:lite|mobile)$/, {
    timeout: 10_000,
  });
  await expect(sequence).toHaveAttribute(
    "data-sequence-status",
    /^(?:ready|degraded)$/,
    { timeout: 10_000 },
  );
  await expect(sequence).toHaveAttribute("data-sequence-renderable", "true");
  await expect(sequence).toHaveAttribute("data-sequence-renderer", "video");

  const video = sequence.locator("video");
  await expect(video).toBeVisible();
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).videoWidth),
    )
    .toBe(1280);

  const scrollTarget = await sequence.evaluate((element) => {
    const section = element as HTMLElement;
    const bounds = section.getBoundingClientRect();
    const sectionTop = bounds.top + window.scrollY;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    return sectionTop + travel * 0.75;
  });

  await page.evaluate((top) => window.scrollTo(0, top), scrollTarget);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect
    .poll(
      () => video.evaluate((element) => (element as HTMLVideoElement).currentTime),
      { timeout: 10_000 },
    )
    .toBeGreaterThan(5.5);
  expect(requestedVideos).toHaveLength(1);
  expect(requestedFrames).toEqual([]);
  await expect(sequence).toHaveAttribute("data-sequence-status", /^(?:ready|degraded)$/);
});

test("desktop sequence video fits the pinned frame height without stretching", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop sequence sizing check");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const sequence = page.locator(".ug-scroll-sequence");
  await sequence.scrollIntoViewIfNeeded();
  await expect(sequence).toHaveAttribute("data-sequence-tier", "full", {
    timeout: 10_000,
  });
  await expect(sequence).toHaveAttribute("data-sequence-renderer", "video");
  await expect(sequence).toHaveAttribute("data-sequence-renderable", "true", {
    timeout: 10_000,
  });

  const sizing = await sequence.evaluate((element) => {
    const pin = element.querySelector<HTMLElement>(".ug-scroll-sequence__pin");
    const video = element.querySelector<HTMLVideoElement>("video");
    if (!pin || !video) throw new Error("Sequence media is unavailable");

    const pinBounds = pin.getBoundingClientRect();
    const videoBounds = video.getBoundingClientRect();

    return {
      pinHeight: pinBounds.height,
      videoHeight: videoBounds.height,
      cssAspectRatio: videoBounds.width / videoBounds.height,
      intrinsicAspectRatio: video.videoWidth / video.videoHeight,
    };
  });

  expect(Math.abs(sizing.videoHeight - sizing.pinHeight)).toBeLessThanOrEqual(1);
  expect(sizing.cssAspectRatio).toBeCloseTo(16 / 9, 2);
  expect(sizing.intrinsicAspectRatio).toBeCloseTo(16 / 9, 2);
});

test("reverse scrolling reuses the packed video without another media request", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop sequence cache check");

  let videoRequests = 0;
  let frameRequests = 0;
  page.on("request", (request) => {
    if (request.url().includes("/generator-sequence-v4/generator-scroll.mp4")) {
      videoRequests += 1;
    }
    if (/generator-sequence-v[23].*\/frame_\d+\.webp/.test(request.url())) {
      frameRequests += 1;
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const sequence = page.locator(".ug-scroll-sequence");
  await expect(sequence).toHaveAttribute("data-sequence-tier", "full", {
    timeout: 10_000,
  });
  await expect(sequence).toHaveAttribute("data-sequence-renderer", "video");
  await expect(sequence).toHaveAttribute("data-sequence-renderable", "true", {
    timeout: 10_000,
  });
  const video = sequence.locator("video");

  const position = await sequence.evaluate((element) => {
    const section = element as HTMLElement;
    const bounds = section.getBoundingClientRect();
    return {
      top: bounds.top + window.scrollY,
      travel: Math.max(1, section.offsetHeight - window.innerHeight),
    };
  });
  const scrollToProgress = async (progress: number) => {
    await page.evaluate(
      ({ top, travel, progress }) => window.scrollTo(0, top + travel * progress),
      { ...position, progress },
    );
  };

  await scrollToProgress(0.25);
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).currentTime),
    )
    .toBeGreaterThan(1.8);

  await scrollToProgress(0.75);
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).currentTime),
    )
    .toBeGreaterThan(5.7);

  await scrollToProgress(0.25);
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).currentTime),
    )
    .toBeLessThan(2.2);
  expect(videoRequests).toBe(1);
  expect(frameRequests).toBe(0);
});

test("the image fallback displays fetched blobs without a second frame request", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Canvas fallback regression check");

  await page.addInitScript(() => {
    Object.defineProperty(HTMLMediaElement.prototype, "canPlayType", {
      configurable: true,
      value: () => "",
    });
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: () => null,
    });
  });
  let firstFrameRequests = 0;
  page.on("request", (request) => {
    if (/generator-sequence-v2\/mobile\/frame_000\.webp/.test(request.url())) {
      firstFrameRequests += 1;
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const sequence = page.locator(".ug-scroll-sequence");
  await sequence.scrollIntoViewIfNeeded();
  await expect.poll(() => firstFrameRequests, { timeout: 10_000 }).toBe(1);
  await expect(sequence).toHaveAttribute("data-sequence-renderable", "true", {
    timeout: 10_000,
  });
  await expect(sequence).toHaveAttribute("data-sequence-renderer", "frames");
  await expect(sequence.locator('img[aria-hidden="true"]')).toBeVisible();
  await page.waitForTimeout(400);
  expect(firstFrameRequests).toBe(1);
});

test("reduced motion keeps the sequence static and requests no frames", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Mobile regression check");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requestedAnimationAssets: string[] = [];
  page.on("request", (request) => {
    if (
      /generator-sequence-v[23].*\/frame_\d+\.webp/.test(request.url()) ||
      request.url().includes("/generator-sequence-v4/generator-scroll.mp4")
    ) {
      requestedAnimationAssets.push(request.url());
    }
  });

  await page.goto("/");
  const sequence = page.locator(".ug-scroll-sequence");
  await expect(sequence).toHaveAttribute("data-sequence-status", "static");
  await expect(sequence).toHaveAttribute("data-sequence-tier", "poster");
  await expect(sequence).toHaveAttribute("data-sequence-enhanced", "false");
  await expect(sequence).toHaveAttribute("data-sequence-renderable", "false");
  expect(requestedAnimationAssets).toEqual([]);
});
