// Public site origin, used for absolute URLs in social/SEO meta tags.
// Set VITE_SITE_URL at build time to point these at a custom domain (the Docker
// build wires it through and also rewrites public/robots.txt + public/sitemap.xml).
// Falls back to the Vercel origin when the env var is absent.
const configuredOrigin = import.meta.env.VITE_SITE_URL as string | undefined;

export const SITE_URL = (configuredOrigin || "https://shnukor-landing.vercel.app").replace(
  /\/+$/,
  "",
);

export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
