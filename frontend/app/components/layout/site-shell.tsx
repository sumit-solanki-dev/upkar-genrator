import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@heroui/react/button";
import { Link, NavLink, useLocation } from "react-router";
import {
  company,
  footerNavigation,
  primaryNavigation,
  socialLinks,
} from "~/data/company";
import { LocationMap } from "~/components/ui/location-map";

function SocialIcon({ label }: { label: (typeof socialLinks)[number]["label"] }) {
  if (label === "Instagram") {
    return (
      <svg aria-hidden="true" className="size-5 fill-none stroke-current" viewBox="0 0 24 24">
        <rect height="16" rx="4" width="16" x="4" y="4" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.5" strokeWidth="1.8" />
        <circle className="fill-current stroke-none" cx="17.4" cy="6.7" r="1" />
      </svg>
    );
  }

  if (label === "Facebook") {
    return (
      <svg aria-hidden="true" className="size-5 fill-current" viewBox="0 0 24 24">
        <path d="M14 8h2V4h-2c-3 0-5 2-5 5v2H7v4h2v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-5 fill-none stroke-current" viewBox="0 0 24 24">
      <path d="M6.5 10v8M6.5 6.5v.1M11 18v-8M11 13.5c0-2.2 1.4-3.8 3.5-3.8s3.5 1.4 3.5 4V18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function NavigationLink({
  label,
  to,
  onClick,
  mobile = false,
  tone = "light",
}: {
  label: string;
  to: string;
  onClick?: () => void;
  mobile?: boolean;
  tone?: "dark" | "light";
}) {
  return (
    <NavLink
      className={({ isActive }) => {
        if (mobile) {
          return `group relative flex min-h-14 items-center justify-between overflow-hidden rounded-2xl px-4 text-base font-bold transition-[background-color,color,transform] duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-orange-500 active:scale-[0.985] ${
            isActive
              ? "bg-teal-50 text-[#075f5c]"
              : "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
          }`;
        }

        const activeClasses =
          tone === "dark"
            ? "bg-white/14 text-white ring-1 ring-inset ring-white/10"
            : "bg-teal-50 text-[#075f5c] ring-1 ring-inset ring-teal-900/10";
        const idleClasses =
          tone === "dark"
            ? "text-white/85 hover:bg-white/10 hover:text-white"
            : "text-slate-700 hover:bg-slate-100 hover:text-[#075f5c]";

        return `relative flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-bold transition-[background-color,color,box-shadow] duration-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
          isActive ? activeClasses : idleClasses
        }`;
      }}
      onClick={onClick}
      to={to}
    >
      {({ isActive }) => (
        <>
          <span>{label}</span>
          {mobile ? (
            <svg
              aria-hidden="true"
              className={`size-5 fill-none stroke-current transition-transform duration-200 group-hover:translate-x-0.5 ${
                isActive ? "text-orange-600" : "text-slate-400"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          ) : isActive ? (
            <span
              aria-hidden="true"
              className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-orange-500"
            />
          ) : null}
        </>
      )}
    </NavLink>
  );
}

function SiteHeader() {
  const [openAtPath, setOpenAtPath] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const menuOpen = openAtPath === location.pathname;
  const lightTop = /^\/products\/[^/]+\/?$/.test(location.pathname);
  const contentTone = isScrolled || lightTop ? "light" : "dark";
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    let lastIsScrolled = false;

    const updateHeader = () => {
      animationFrame = 0;
      const scrollPosition = Math.max(0, window.scrollY);
      const progress = Math.min(scrollPosition / 72, 1);
      header.current?.style.setProperty("--nav-progress", progress.toFixed(3));

      const nextIsScrolled = lastIsScrolled
        ? scrollPosition > 40
        : scrollPosition >= 56;
      if (nextIsScrolled === lastIsScrolled) return;
      lastIsScrolled = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    };

    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const focusable = () => {
      const panelElements = Array.from(
        menuPanel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      );
      return menuButton.current
        ? [menuButton.current, ...panelElements]
        : panelElements;
    };

    const initialFocusTarget = focusable();
    (initialFocusTarget[1] ?? initialFocusTarget[0])?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenAtPath(null);
        requestAnimationFrame(() => menuButton.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      aria-labelledby={menuOpen ? "mobile-navigation-title" : undefined}
      aria-modal={menuOpen ? "true" : undefined}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      data-appearance={isScrolled ? "solid" : "glass"}
      data-scrolled={isScrolled}
      data-top-tone={lightTop ? "light" : "dark"}
      ref={header}
      role={menuOpen ? "dialog" : undefined}
    >
      <div className="pointer-events-auto relative z-30 mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 sm:px-4 lg:gap-5 lg:px-5">
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-20 rounded-2xl border backdrop-blur-xl [backface-visibility:hidden] ${
            lightTop
              ? "border-slate-300/50 bg-white/10"
              : "border-white/15 bg-white/[0.06]"
          }`}
          data-testid="navbar-glass-layer"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-2xl border border-slate-200/90 bg-white/95 opacity-[var(--nav-progress,0)] shadow-[0_14px_34px_-22px_rgba(15,23,42,0.45)] transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          data-testid="navbar-solid-layer"
        />

        <Link
          aria-label={`${company.name} home`}
          className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500 sm:gap-3"
          to="/"
        >
          <img
            alt=""
            className={`h-10 w-10 shrink-0 rounded-xl border bg-slate-950 object-contain p-1 shadow-sm transition-colors duration-300 sm:h-11 sm:w-11 ${
              contentTone === "dark" ? "border-white/20" : "border-slate-300"
            }`}
            height={44}
            src="/images/upkar-logo.svg"
            width={44}
          />
          <span className="min-w-0">
            <span
              className={`block truncate text-sm font-black leading-tight transition-colors duration-300 sm:text-base ${
                contentTone === "dark" ? "text-white" : "text-slate-950"
              }`}
            >
              {company.name}
            </span>
            <span
              className={`hidden text-[0.6875rem] font-semibold transition-colors duration-300 min-[380px]:block sm:text-xs ${
                contentTone === "dark" ? "text-teal-200" : "text-teal-800"
              }`}
            >
              {company.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-2 lg:flex">
          <div
            className={`flex items-center gap-0.5 rounded-full border p-1 transition-colors duration-300 ${
              contentTone === "dark"
                ? "border-white/10 bg-slate-950/10"
                : "border-slate-200/80 bg-slate-100/75"
            }`}
          >
            {primaryNavigation.map((item) => (
              <NavigationLink key={item.to} tone={contentTone} {...item} />
            ))}
          </div>
          <a
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-orange-700 px-5 text-sm font-bold text-white shadow-sm transition-[background-color,transform] duration-200 hover:bg-orange-800 active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-500"
            href={company.phone.href}
          >
            <svg aria-hidden="true" className="size-4 fill-none stroke-current" viewBox="0 0 24 24">
              <path d="M8.2 4.5 10 8l-2.1 1.7a14.3 14.3 0 0 0 6.4 6.4L16 14l3.5 1.8v3c0 .7-.5 1.2-1.2 1.2C10.4 19.7 4.3 13.6 4 5.7c0-.7.5-1.2 1.2-1.2h3Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
            </svg>
            Call now
          </a>
        </nav>

        <Button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-orange-500 lg:hidden ${
            contentTone === "dark"
              ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
              : "border-slate-300 bg-white/70 text-slate-950 hover:bg-slate-100"
          }`}
          isIconOnly
          onPress={() => setOpenAtPath(menuOpen ? null : location.pathname)}
          ref={menuButton}
          type="button"
          variant="ghost"
        >
          <span aria-hidden="true" className="relative block h-5 w-5">
            <span
              className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                menuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[0.625rem] block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute bottom-1 left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                menuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </Button>
      </div>

      <button
        aria-hidden="true"
        aria-label="Close mobile navigation backdrop"
        className={`pointer-events-auto fixed inset-0 z-10 bg-slate-950/50 transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        data-testid="mobile-navigation-backdrop"
        onClick={() => {
          setOpenAtPath(null);
          requestAnimationFrame(() => menuButton.current?.focus());
        }}
        tabIndex={-1}
        type="button"
      />

      <div
        aria-hidden={!menuOpen}
        className={`pointer-events-auto fixed left-3 right-3 top-[5.25rem] z-20 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-3xl border border-white/70 bg-white/95 p-3 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_28px_80px_-28px_rgba(2,6,23,0.65)] backdrop-blur-xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:left-auto sm:right-5 sm:w-[26rem] lg:hidden ${
          menuOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-3 scale-[0.985] opacity-0"
        }`}
        id="mobile-navigation"
        inert={!menuOpen}
        ref={menuPanel}
      >
        <div className="px-2 pb-3 pt-1">
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.2em] text-orange-700"
              id="mobile-navigation-title"
            >
              Mobile navigation
            </p>
            <p className="mt-1 text-sm text-slate-500">Choose where you want to go.</p>
          </div>
        </div>

        <nav aria-label="Mobile primary navigation" className="grid gap-1">
          {primaryNavigation.map((item) => (
            <NavigationLink
              key={item.to}
              mobile
              onClick={() => setOpenAtPath(null)}
              {...item}
            />
          ))}
        </nav>

        <div className="mt-3 rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-200">
            Need help choosing?
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            Talk directly with the UPKAR Generator team.
          </p>
          <a
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 text-sm font-black text-white transition-[background-color,transform] hover:bg-orange-800 active:scale-[0.985] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orange-400"
            href={company.phone.href}
          >
            <svg aria-hidden="true" className="size-4 fill-none stroke-current" viewBox="0 0 24 24">
              <path d="M8.2 4.5 10 8l-2.1 1.7a14.3 14.3 0 0 0 6.4 6.4L16 14l3.5 1.8v3c0 .7-.5 1.2-1.2 1.2C10.4 19.7 4.3 13.6 4 5.7c0-.7.5-1.2 1.2-1.2h3Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
            </svg>
            Call {company.phone.display}
          </a>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-5 py-14 text-slate-300 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <Link className="inline-flex min-h-11 items-center rounded-md text-xl font-black text-white focus-visible:outline-2 focus-visible:outline-offset-4" to="/">
            {company.name}
          </Link>
          <p className="mt-3 max-w-sm leading-7 text-slate-400">
            Generator products and support for industrial and commercial power requirements.
          </p>
          <nav aria-label="Social media" className="mt-5">
            <ul className="flex list-none gap-3 p-0">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="grid size-11 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-orange-400 hover:bg-orange-400 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange-400"
                    href={social.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <SocialIcon label={social.label} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="font-bold text-white">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
            {footerNavigation.map((item) => (
              <li key={item.to}>
                <Link className="inline-flex min-h-11 items-center rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2" to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-contact-heading">
          <h2 className="font-bold text-white" id="footer-contact-heading">Contact</h2>
          <address className="mt-4 not-italic">
            <ul className="space-y-1">
              <li>
                <a className="inline-flex min-h-11 items-center rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2" href={company.phone.href}>
                  {company.phone.display}
                </a>
              </li>
              <li>
                <a className="inline-flex min-h-11 items-center rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2" href={company.email.href}>
                  {company.email.display}
                </a>
              </li>
              <li className="pt-1 text-sm leading-6 text-slate-400">
                {company.location.display}
              </li>
            </ul>
          </address>
          <a
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-bold text-orange-300 hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            href={company.location.directionsUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Get directions
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <LocationMap
            className="mt-4 h-44 rounded-xl border border-white/15"
            title="UPKAR Generator location map in the footer"
          />
        </section>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-700 pt-6 text-sm text-slate-400">
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

function RouteAccessibility() {
  const { pathname } = useLocation();
  const initialRender = useRef(true);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("#main-content h1");
      setAnnouncement(heading?.textContent?.trim() ?? "Page loaded");
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <span aria-live="polite" className="sr-only">{announcement}</span>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-slate-950">
      <a
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-md bg-slate-950 px-4 py-3 font-bold text-white transition focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>
      <RouteAccessibility />
      <SiteHeader />
      {children}
      <SiteFooter />
      <a
        aria-label="Discuss your generator requirement on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-800 text-xl font-black text-white shadow-xl transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4"
        href={company.whatsappUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span aria-hidden="true">WA</span>
      </a>
    </div>
  );
}
