import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { OG_IMAGE_URL, SITE_URL } from "@/lib/site";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">Такой страницы нет или она переехала.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Шнурок — умный подбор кроссовок" },
      {
        name: "description",
        content: "Шнурок: умный пошаговый подбор кроссовок под твой стиль, размер и бюджет.",
      },
      { name: "author", content: "Шнурок" },
      { property: "og:site_name", content: "Шнурок" },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: "Шнурок — умный подбор кроссовок" },
      {
        property: "og:description",
        content: "Шнурок: умный пошаговый подбор кроссовок под твой стиль, размер и бюджет.",
      },
      { property: "og:image", content: OG_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Шнурок — умный подбор кроссовок" },
      {
        name: "twitter:description",
        content: "Шнурок: умный пошаговый подбор кроссовок под твой стиль, размер и бюджет.",
      },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "canonical", href: SITE_URL },
      // Self-hosted Inter — preload the critical subsets/weights (body 400 +
      // headings 700, latin + cyrillic) so text paints in Inter without the
      // Google Fonts round-trip. @font-face declarations live in styles.css.
      {
        rel: "preload",
        href: "/fonts/inter-cyrillic-400.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/inter-cyrillic-700.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/inter-latin-400.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/inter-latin-700.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
