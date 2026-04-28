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
      <Bounded as="div" className="py-12">
        <div className="flex flex-col gap-8 border-b border-[#ddd6ca] pb-8 lg:flex-row lg:items-start lg:justify-between">
          <Link
            href="/"
            className="font-[var(--font-sofia-sans-extra-condensed)] text-[24px] font-black uppercase italic tracking-[0.06em] text-[#111111] transition-colors hover:text-[#c4621a]"
          >
            {settings.name}
          </Link>

          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-2.5 lg:justify-center">
            {[{ label: "Home", href: "/" }, ...settings.navItems, settings.cta].map((item, index, items) => (
              <React.Fragment key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  className="px-2 py-1 text-[14px] font-extrabold uppercase tracking-[0.05em] text-[#5f5a54] transition-colors hover:text-[#c4621a]"
                >
                  {item.label}
                </Link>
                {index < items.length - 1 && <span className="text-[10px] text-[#cccccc]">/</span>}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-5 lg:justify-end">
            {[
              { label: "GitHub", href: settings.socialLinks.find((link) => link.platform === "github")?.href },
              { label: "LinkedIn", href: settings.socialLinks.find((link) => link.platform === "linkedin")?.href },
            ].map(
              (item) =>
                item.href && (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] font-extrabold text-[#67625c] transition-colors hover:text-[#c4621a]"
                  >
                    {item.label}
                  </Link>
                ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[14px] text-[#67625c] lg:flex-row lg:items-center lg:justify-between">
          <p className="m-0 text-[14px] font-medium text-[#5f5a54]">© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <p className="m-0 text-[14px] font-medium text-[#7a7570]">Built with care in Next.js, React, TypeScript, and Tailwind.</p>
        </div>
      </Bounded>
    </footer>
  );
}
