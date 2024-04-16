import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { createClient, repositoryName } from "@/prismicio";
import { PrismicPreview } from "@prismicio/next";
import clsx from "clsx";
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="background-master">
      <body
        className={clsx("relative min-h-screen", "sofia")}
        suppressHydrationWarning={true}
      >
        <Header />
        {children}
        <Footer />
        <div className="background-gradient absolute inset-0 -z-50 max-h-screen" />
        <div className="pointer-events-none absolute inset-0 -z-40 h-full opacity-20 mix-blend-soft-light"></div>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
