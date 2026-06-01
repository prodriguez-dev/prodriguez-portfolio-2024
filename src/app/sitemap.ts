import type { MetadataRoute } from "next";
import { getPhaseOneStaticParams } from "@/lib/phase-one-pages";
import { projectEntries } from "@/lib/content-data";

const SITE_URL = "https://www.prodriguez.dev";

function absolute(path: string) {
  return new URL(path, SITE_URL).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    absolute("/"),
    ...getPhaseOneStaticParams().map(({ uid }) => absolute(`/${uid}`)),
    ...projectEntries.map((entry) => absolute(entry.href || `/projects/${entry.uid}`)),
  ];

  return pages.map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "monthly",
    priority: url === SITE_URL + "/" ? 1 : 0.7,
  }));
}
