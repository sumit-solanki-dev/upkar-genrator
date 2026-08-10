import { cx } from "../../utils/dom.js";

export function createButton({
  label,
  href,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  attributes = {},
} = {}) {
  const element = document.createElement(href ? "a" : "button");

  element.className = cx("button", `button--${variant}`, `button--${size}`, className);
  element.textContent = label || "Button";

  if (href) {
    element.href = href;
  } else {
    element.type = type;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}
