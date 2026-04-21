import {
  absoluteUrl,
  buildDescription,
  buildOgImage,
  buildPageTitle,
  getSiteDefaults,
} from "@/lib/metadata";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SliceZone } from "@prismicio/react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("page", params.uid)
    .catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const [page, settings] = await Promise.all([
    client.getByUID("page", params.uid).catch(() => notFound()),
    client.getSingle("settings"),
  ]);
  const site = getSiteDefaults(settings);
  const title = buildPageTitle(page.data.meta_title, page.uid, site.title);
  const description = buildDescription(
    page.data.meta_description,
    site.description,
  );
  const ogImage = buildOgImage(page.data.meta_image || settings.data.og_image);
  const path = page.url || `/${page.uid}`;

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
  const client = createClient();
  const pages = await client.getAllByType("page");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
