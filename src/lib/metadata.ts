type MaybeString = string | null | undefined;

type ImageLike = {
  url?: string | null;
  alt?: string | null;
  dimensions?: {
    width?: number | null;
    height?: number | null;
  } | null;
} | null | undefined;

const SITE_URL = "https://prodriguez.dev";
const SITE_NAME = "Paul Rodriguez";
const DEFAULT_DESCRIPTION =
  "Solutions Architect focused on technical discovery, enterprise platforms, and scalable system design across client-facing, high-stakes digital initiatives.";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function firstNonEmpty(...values: MaybeString[]): string | undefined {
  return values.find((value) => typeof value === "string" && value.trim().length > 0)?.trim();
}

export function buildPageTitle(...values: MaybeString[]): string {
  return firstNonEmpty(...values, SITE_NAME) || SITE_NAME;
}

export function buildDescription(...values: MaybeString[]): string {
  return firstNonEmpty(...values, DEFAULT_DESCRIPTION) || DEFAULT_DESCRIPTION;
}

export function buildOgImage(image?: ImageLike, fallbackPath = "/og-image.jpg") {
  const url = image?.url || absoluteUrl(fallbackPath);

  return {
    url,
    alt: image?.alt || SITE_NAME,
    width: image?.dimensions?.width || 1200,
    height: image?.dimensions?.height || 630,
  };
}

export function getSiteDefaults(settings?: {
  data?: {
    name?: MaybeString;
    meta_title?: MaybeString;
    meta_description?: MaybeString;
    og_image?: ImageLike;
  };
}) {
  const siteName = firstNonEmpty(settings?.data?.name, SITE_NAME) || SITE_NAME;
  const title = buildPageTitle(settings?.data?.meta_title, siteName);
  const description = buildDescription(settings?.data?.meta_description);
  const ogImage = buildOgImage(settings?.data?.og_image);

  return {
    siteName,
    title,
    description,
    ogImage,
    siteUrl: SITE_URL,
  };
}
