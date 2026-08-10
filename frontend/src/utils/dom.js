export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function mount(root, element) {
  if (!root || !element) return null;
  root.replaceChildren(element);
  return element;
}

export function cx(...tokens) {
  return tokens.filter(Boolean).join(" ");
}

export function normalizePath(pathname) {
  if (!pathname) return "/";
  return pathname.replace(/\/+$/, "") || "/";
}
