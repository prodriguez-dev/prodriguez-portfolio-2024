import Bounded from "@/components/Bounded";
import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiteSettings } from "@/lib/site-content";

type FooterProps = {
  settings: SiteSettings;
};

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#ede9e1] text-[#111111]">
      <Bounded as="div" className="py-12">
        <div className="grid gap-10 border-t border-[#d9d2c6] pt-10 md:grid-cols-[1.2fr,1fr,1fr] md:items-start">
          <div>
            <Link
              href="/"
              className="font-[var(--font-sofia-sans-extra-condensed)] text-3xl font-black uppercase italic tracking-[0.04em] text-[#111111] transition-colors hover:text-[#c4621a]"
            >
              {settings.name}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#7a7570]">
              Solutions Architect, frontend engineer, and public speaker building clear, high-trust digital experiences.
            </p>
          </div>

          <nav aria-label="Footer Navigation">
            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#7a7570]">Navigate</div>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-[0.12em]">
              <li><Link href="/" className="transition-colors hover:text-[#c4621a]">Home</Link></li>
              {settings.navItems.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-[#c4621a]">
                    {label}
                  </Link>
                </li>
              ))}
              <li><Link href={settings.cta.href} className="transition-colors hover:text-[#c4621a]">{settings.cta.label}</Link></li>
            </ul>
          </nav>

          <div>
            <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#7a7570]">Elsewhere</div>
            <div className="flex gap-4 text-xl text-[#111111]">
              {settings.socialLinks.map((link) => {
                const icon =
                  link.platform === "github"
                    ? <FaGithub />
                    : link.platform === "linkedin"
                      ? <FaLinkedin />
                      : <FaXTwitter />;

                return (
                  <Link
                    key={link.platform}
                    href={link.href}
                    aria-label={link.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#c4621a]"
                  >
                    {icon}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[#d9d2c6] pt-6 text-sm text-[#7a7570] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <p>Built with Next.js, React, TypeScript, TailwindCSS, GSAP, GitHub, and Vercel.</p>
        </div>
      </Bounded>
    </footer>
  );
}
