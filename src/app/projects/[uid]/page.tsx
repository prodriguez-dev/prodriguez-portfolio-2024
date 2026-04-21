import ContentBody from "@/components/ContentBody";
import {
  absoluteUrl,
  buildDescription,
  buildOgImage,
  buildPageTitle,
  getSiteDefaults,
} from "@/lib/metadata";
import { createClient } from "@/prismicio";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

  return <ContentBody page={page} />;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const [page, settings] = await Promise.all([
    client.getByUID("project", params.uid).catch(() => notFound()),
    client.getSingle("settings"),
  ]);
  const site = getSiteDefaults(settings);
  const projectTitle =
    (typeof page.data.title === "string" && page.data.title.trim()) ||
    page.uid ||
    "Project";
  const fallbackDescription = firstProjectDescription(page.data.description);
  const title = buildPageTitle(page.data.meta_title, projectTitle, site.title);
  const description = buildDescription(
    page.data.meta_description,
    fallbackDescription,
    site.description,
  );
  const ogImage = buildOgImage(page.data.meta_image || page.data.hover_image || settings.data.og_image);
  const path = page.url || `/projects/${page.uid}`;

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

function firstProjectDescription(description: unknown) {
  if (!Array.isArray(description)) {
    return undefined;
  }

  const firstTextBlock = description.find(
    (item): item is { type?: string; text?: string } =>
      Boolean(item) && typeof item === "object",
  );

  if (!firstTextBlock || typeof firstTextBlock.text !== "string") {
    return undefined;
  }

  const text = firstTextBlock.text.trim();
  return text || undefined;
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("project");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
