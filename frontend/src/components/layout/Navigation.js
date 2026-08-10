import { COMPANY } from "../../utils/constants.js";
import { cx, normalizePath } from "../../utils/dom.js";

const phoneIcon = `
  <svg class="site-nav__button-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" focusable="false">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.62 2.65a2 2 0 0 1-.45 2.11L8 9.76a16 16 0 0 0 6.24 6.24l1.28-1.28a2 2 0 0 1 2.11-.45c.85.29 1.74.5 2.65.62A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  </svg>
`;
const NAV_DESKTOP_MIN_WIDTH = 1081;

export function createNavigation({ links = [] } = {}) {
  const header = document.createElement("header");
  const currentPath = normalizePath(window.location.pathname);
  const normalizedPath = currentPath.replace(/\/$/, '') || '/';
  const isDarkBg = ["/", "/products", "/about", "/contact"].includes(normalizedPath);
  header.className = cx("site-header js-site-header", isDarkBg && "site-header--dark-bg");
  header.dataset.nav = "header";
  header.dataset.animate = "navbar";
  header.innerHTML = `
    <div class="container site-header__inner">
      <a class="brand" href="/" aria-label="${COMPANY.name} home">
        <span class="brand__mark" aria-hidden="true">
          <img class="brand__logo" src="/images/upkar-logo.svg" alt="" width="40" height="40" decoding="async" />
        </span>
        <span class="brand__text">
          <span class="brand__name">${COMPANY.name}</span>
          <span class="brand__tagline">${COMPANY.tagline}</span>
        </span>
      </a>

      <button class="site-nav__toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-navigation">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>

      <nav class="site-nav" id="primary-navigation" aria-label="Primary navigation" data-nav="menu">
        <ul class="site-nav__list" role="list">
          ${links
            .map((link) => {
              const isActive = normalizePath(link.href) === currentPath;
              return `
                <li>
                  <a class="${cx("site-nav__link", isActive && "is-active")}" href="${link.href}" data-nav-item ${isActive ? 'aria-current="page"' : ""}>
                    ${link.label}
                  </a>
                </li>
              `;
            })
            .join("")}
        </ul>
        <div class="site-nav__actions" data-nav-actions>
          <a class="site-nav__button site-nav__button--call" href="tel:${COMPANY.phone}" aria-label="Call ${COMPANY.name} now" data-nav-item>
            ${phoneIcon}
            <span>Call Now</span>
          </a>
        </div>
      </nav>
    </div>
  `;

  const toggle = header.querySelector(".site-nav__toggle");
  const navActions = Array.from(header.querySelectorAll(".site-nav__link, .site-nav__button"));
  const menu = header.querySelector(".site-nav");
  let isClosing = false;

  function isMobileMenu() {
    return window.innerWidth < NAV_DESKTOP_MIN_WIDTH;
  }

  function getFocusableMenuItems() {
    return Array.from(menu.querySelectorAll("a[href], button:not([disabled])")).filter(
      (element) => !element.hasAttribute("disabled") && element.offsetParent !== null,
    );
  }

  function applyClosedState() {
    document.body.classList.remove("is-nav-open");
    header.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    isClosing = false;
  }

  function setScrolledState() {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  function openMenu() {
    isClosing = false;
    document.body.classList.add("is-nav-open");
    header.classList.add("is-menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");
    menu.dispatchEvent(new CustomEvent("navbar:toggle", { detail: { isOpen: true } }));

    window.setTimeout(() => {
      if (isMobileMenu() && header.classList.contains("is-menu-open")) {
        getFocusableMenuItems()[0]?.focus({ preventScroll: true });
      }
    }, 60);
  }

  function closeMenu({ animated = true } = {}) {
    if (!header.classList.contains("is-menu-open")) {
      return;
    }

    if (!animated) {
      applyClosedState();
      return;
    }

    isClosing = true;
    const closeEvent = new CustomEvent("navbar:toggle", {
      cancelable: true,
      detail: {
        isOpen: false,
        complete: applyClosedState,
      },
    });

    menu.dispatchEvent(closeEvent);

    if (!closeEvent.defaultPrevented) {
      applyClosedState();
    }
  }

  toggle.addEventListener("click", () => {
    if (isClosing) {
      return;
    }

    if (header.classList.contains("is-menu-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navActions.forEach((action) => {
    action.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!isMobileMenu() || !header.classList.contains("is-menu-open")) {
      return;
    }

    if (!header.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", setScrolledState, { passive: true });
  window.addEventListener("resize", () => {
    if (!isMobileMenu()) {
      closeMenu({ animated: false });
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && isMobileMenu() && header.classList.contains("is-menu-open")) {
      const focusableItems = [toggle, ...getFocusableMenuItems()];
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem?.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem?.focus();
      }
    }

    if (event.key === "Escape" && header.classList.contains("is-menu-open")) {
      closeMenu();
      toggle.focus({ preventScroll: true });
    }
  });

  setScrolledState();

  return header;
}
