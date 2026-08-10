import { COMPANY } from "./constants.js";

const SITE_NAME = "UPKAR Generator";
const DEFAULT_DESCRIPTION =
  "UPKAR Generator designs and supports dependable diesel generator solutions for commercial and industrial power needs.";

function getAbsoluteUrl(path) {
  return new URL(path, window.location.origin).href;
}

function ensureMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}

function ensureCanonical(path) {
  let link = document.head.querySelector("link[rel='canonical']");

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", getAbsoluteUrl(path));
}

function ensureJsonLd(customData = null) {
  const id = "site-structured-data";
  let script = document.head.querySelector(`#${id}`);

  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  const defaultData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: window.location.origin,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    foundingDate: String(COMPANY.foundedYear),
  };

  script.textContent = JSON.stringify(customData || defaultData);
}

export function setPageMeta({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  path = window.location.pathname,
  structuredData = null,
} = {}) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const absoluteUrl = getAbsoluteUrl(path);

  document.title = fullTitle;
  ensureCanonical(path);
  ensureMeta("meta[name='description']", { name: "description", content: description });
  ensureMeta("meta[name='robots']", { name: "robots", content: "index, follow" });
  ensureMeta("meta[property='og:title']", { property: "og:title", content: fullTitle });
  ensureMeta("meta[property='og:description']", { property: "og:description", content: description });
  ensureMeta("meta[property='og:image']", { property: "og:image", content: getAbsoluteUrl("/images/generator-hero.svg") });
  ensureMeta("meta[property='og:type']", { property: "og:type", content: "website" });
  ensureMeta("meta[property='og:site_name']", { property: "og:site_name", content: SITE_NAME });
  ensureMeta("meta[property='og:url']", { property: "og:url", content: absoluteUrl });
  ensureMeta("meta[name='twitter:card']", { name: "twitter:card", content: "summary_large_image" });
  ensureMeta("meta[name='twitter:title']", { name: "twitter:title", content: fullTitle });
  ensureMeta("meta[name='twitter:description']", { name: "twitter:description", content: description });
  ensureMeta("meta[name='twitter:image']", { name: "twitter:image", content: getAbsoluteUrl("/images/generator-hero.svg") });
  ensureJsonLd(structuredData);
}
