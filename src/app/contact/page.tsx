import { absoluteUrl, buildDescription, buildOgImage, buildPageTitle, getSiteDefaults } from "@/lib/metadata";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SliceZone } from "@prismicio/react";
import { Metadata } from "next";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("contact");

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const [page, settings] = await Promise.all([
    client.getSingle("contact"),
    client.getSingle("settings"),
  ]);
  const site = getSiteDefaults(settings);
  const title = buildPageTitle(page.data.meta_title, "Contact");
  const description = buildDescription(
    page.data.meta_description,
    site.description,
  );
  const ogImage = buildOgImage(page.data.meta_image || settings.data.og_image);

  return {
    title,
    description,
    alternates: {
      canonical: "/contact",
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl("/contact"),
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
