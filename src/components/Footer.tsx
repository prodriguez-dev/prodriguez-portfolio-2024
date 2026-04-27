import Bounded from "@/components/Bounded";
import Link from "next/link";
import React from "react";
import { SiteSettings } from "@/lib/site-content";

type FooterProps = {
  settings: SiteSettings;
};

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="relative z-20 isolate overflow-hidden border-t border-[#e0dbd0] bg-[#ede9e1] text-[#111111]">
      <Bounded as="div" className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[#e0dbd0] pb-6">
          <Link
            href="/"
            className="font-[var(--font-sofia-sans-extra-condensed)] text-[22px] font-black uppercase italic tracking-[0.06em] text-[#111111] transition-colors hover:text-[#c4621a]"
          >
            {settings.name}
          </Link>

          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-1">
            {[{ label: "Home", href: "/" }, ...settings.navItems, settings.cta].map((item, index, items) => (
              <React.Fragment key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  className="px-2 py-1 text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#7a7570] transition-colors hover:text-[#c4621a]"
                >
                  {item.label}
                </Link>
                {index < items.length - 1 && <span className="text-[10px] text-[#cccccc]">/</span>}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-5">
            {[
              { label: "GitHub", href: settings.socialLinks.find((link) => link.platform === "github")?.href },
              { label: "LinkedIn", href: settings.socialLinks.find((link) => link.platform === "linkedin")?.href },
              { label: "Twitter", href: settings.socialLinks.find((link) => link.platform === "twitter")?.href },
            ].map(
              (item) =>
                item.href && (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-extrabold text-[#7a7570] transition-colors hover:text-[#c4621a]"
                  >
                    {item.label}
                  </Link>
                ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-5 text-[12px] text-[#7a7570] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="m-0 text-[12px] font-medium text-[#7a7570]">© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <p className="m-0 text-[12px] font-medium text-[#9a958d]">Next.js · React · TypeScript · Tailwind CSS · GSAP · Vercel</p>
        </div>
      </Bounded>
    </footer>
  );
}
