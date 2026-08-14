import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { SiteShell } from "./components/layout/site-shell";
import { company } from "./data/company";
import { canonicalUrl, createRouteMeta, safeJsonLd } from "./lib/seo";
import "./app.css";

export const links: Route.LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon-32.png",
    type: "image/png",
    sizes: "32x32",
  },
  {
    rel: "apple-touch-icon",
    href: "/apple-touch-icon.png",
    sizes: "180x180",
  },
  {
    rel: "manifest",
    href: "/site.webmanifest",
  },
];

export const meta: Route.MetaFunction = () =>
  createRouteMeta({
    description: "Dependable diesel generator solutions for commercial and industrial power needs.",
    path: "/",
  });

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  url: canonicalUrl("/"),
  logo: canonicalUrl("/images/upkar-logo.svg"),
  foundingDate: String(company.foundedYear),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: company.phone.display,
    email: company.email.display,
    contactType: "customer service",
  },
};

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#075f5c" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
          type="application/ld+json"
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}

export function HydrateFallback() {
  return (
    <SiteShell>
      <main
        id="main-content"
        className="min-h-[65vh] bg-slate-50 px-5 pb-20 pt-36 sm:px-8"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="mx-auto max-w-7xl motion-safe:animate-pulse">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-800">
            UPKAR Generator
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Loading dependable power
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Preparing the requested page.
          </p>
        </div>
      </main>
    </SiteShell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Something went wrong";
  let description = "The requested page could not be displayed.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : `${error.status} ${error.statusText}`;
    description =
      error.status === 404
        ? "The page you requested does not exist or has moved."
        : typeof error.data === "string" && error.data
          ? error.data
          : description;
  } else if (error instanceof Error) {
    description = import.meta.env.DEV ? error.message : description;
    stack = import.meta.env.DEV ? error.stack : undefined;
  }

  return (
    <main
      id="main-content"
      className="grid min-h-dvh place-items-center bg-slate-50 px-5 py-16 sm:px-8"
    >
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-800">
          UPKAR Generator
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
        <Link
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-teal-800 px-6 font-bold text-white transition hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4"
          to="/"
        >
          Return home
        </Link>
        {stack ? (
          <pre className="mt-8 max-h-96 w-full overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-950 p-5 text-left text-sm text-slate-100">
            <code>{stack}</code>
          </pre>
        ) : null}
      </div>
    </main>
  );
}
