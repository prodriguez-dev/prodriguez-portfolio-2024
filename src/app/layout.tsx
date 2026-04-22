import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getSiteDefaults } from "@/lib/metadata";
import { siteSettings } from "@/lib/site-content";
import "@/scss/globals.scss";
import "@/scss/reset.scss";
import type { Metadata } from "next";
import {
  Sofia_Sans,
  Sofia_Sans_Condensed,
  Sofia_Sans_Extra_Condensed,
} from "next/font/google";

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-sofia-sans",
});

const sofiaSansCondensed = Sofia_Sans_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-sofia-sans-condensed",
});

const sofiaSansExtraCondensed = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-sofia-sans-extra-condensed",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteDefaults({
    data: {
      name: siteSettings.name,
      meta_title: siteSettings.metaTitle,
      meta_description: siteSettings.metaDescription,
      og_image: siteSettings.ogImage,
    },
  });

  return {
    metadataBase: new URL(site.siteUrl),
    title: {
      default: site.title,
      template: `%s | ${site.siteName}`,
    },
    description: site.description,
    openGraph: {
      title: site.title,
      description: site.description,
      siteName: site.siteName,
      type: "website",
      url: site.siteUrl,
      images: [site.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [site.ogImage.url],
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sofiaSans.variable} ${sofiaSansCondensed.variable} ${sofiaSansExtraCondensed.variable}`}
    >
      <body suppressHydrationWarning={true} className="bg-[#f4f1eb] text-[#111111]">
        <Header settings={siteSettings} />
        <main>{children}</main>
        <Footer settings={siteSettings} />
      </body>
    </html>
  );
}
