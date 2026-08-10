import { cx } from "../../utils/dom.js";

export function createCard({
  eyebrow,
  title,
  body,
  href,
  media,
  className = "",
} = {}) {
  const article = document.createElement("article");

  article.className = cx("card", className);
  article.innerHTML = `
    ${
      media
        ? `<div class="card__media"><img src="${media.src}" alt="${media.alt || ""}" width="${media.width || 640}" height="${media.height || 420}" loading="lazy" decoding="async" /></div>`
        : ""
    }
    <div class="card__body">
      ${eyebrow ? `<p class="card__eyebrow">${eyebrow}</p>` : ""}
      ${title ? `<h3 class="card__title">${title}</h3>` : ""}
      ${body ? `<p class="card__text">${body}</p>` : ""}
      ${href ? `<a class="card__link" href="${href}">Learn more</a>` : ""}
    </div>
  `;

  return article;
}
