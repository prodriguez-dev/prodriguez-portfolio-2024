import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { createClient, repositoryName } from "@/prismicio";
import "@/scss/globals.scss";
import "@/scss/reset.scss";
import { PrismicPreview } from "@prismicio/next";
import type { Metadata } from "next";
import {
  Sofia_Sans,
  Sofia_Sans_Condensed,
  Sofia_Sans_Extra_Condensed,
} from "next/font/google";
import Head from "next/head";

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
  const client = createClient();
  const settings = await client.getSingle("settings");

  return {
    title: settings.data.meta_title,
    description: settings.data.meta_description,
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
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </Head>
      <body suppressHydrationWarning={true} className="bg-gray-800">
        <Header />
        {children}
        <Footer />
        <div className="background-gradient absolute inset-0 -z-50 max-h-screen" />
        <div className="background-pattern pointer-events-none absolute inset-0 -z-40 h-full bg-[url('/bg/abstract-pattern-1.svg')]"></div>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
