import { blogEntries, getBlogEntry } from "@/lib/content-data";
import { renderContentEntry } from "@/lib/content-rendering";
import { absoluteUrl, buildDescription, buildOgImage, buildPageTitle } from "@/lib/metadata";
import { siteSettings } from "@/lib/site-content";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const entry = getBlogEntry(params.uid);

  if (!entry) {
    notFound();
  }

  return renderContentEntry(entry);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const entry = getBlogEntry(params.uid);

  if (!entry) {
    notFound();
  }

  const title = buildPageTitle(entry.metaTitle, entry.title, siteSettings.metaTitle);
  const description = buildDescription(entry.metaDescription, siteSettings.metaDescription);
  const ogImage = buildOgImage(entry.metaImage || entry.hoverImage || siteSettings.ogImage);
  const path = entry.href || `/blog/${entry.uid}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  return blogEntries.map((entry) => ({ uid: entry.uid }));
}
