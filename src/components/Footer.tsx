import Bounded from "@/components/Bounded";
import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiteSettings } from "@/lib/site-content";

type FooterProps = {
  settings: SiteSettings;
};

const socialIconClassName = "text-[54px] transition-transform transition-colors duration-200 hover:-translate-y-0.5 hover:text-[#c4621a] md:text-[64px]";

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#ede9e1] text-[#111111]">
      <Bounded as="div" className="py-16 md:py-20">
        <div className="grid gap-12 border-t border-[#d9d2c6] pt-12 md:grid-cols-[1.15fr_1fr_1fr] md:items-start">
          <div className="max-w-[260px]">
            <Link
              href="/"
              className="font-[var(--font-sofia-sans-extra-condensed)] text-[2rem] font-black uppercase italic leading-none tracking-[-0.01em] text-[#111111] transition-colors hover:text-[#c4621a]"
            >
              {settings.name}
            </Link>
            <p className="mt-4 text-[13px] leading-6 text-[#7a7570]">
              Solutions Architect, frontend engineer, and public speaker building clear, high-trust digital experiences.
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="md:justify-self-center">
            <div className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#7a7570]">Navigate</div>
            <ul className="space-y-2 font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(3.5rem,8vw,6.5rem)] font-black uppercase italic leading-[0.82] tracking-[-0.03em] text-[#8dff2f]">
              <li><Link href="/" className="block transition-colors hover:text-[#c4621a]">Home</Link></li>
              {settings.navItems.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="block transition-colors hover:text-[#c4621a]">
                    {label}
                  </Link>
                </li>
              ))}
              <li><Link href={settings.cta.href} className="block transition-colors hover:text-[#c4621a]">{settings.cta.label}</Link></li>
            </ul>
          </nav>

          <div className="md:justify-self-end">
            <div className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#7a7570]">Elsewhere</div>
            <div className="flex items-center gap-5 text-[#8dff2f] md:gap-6">
              {settings.socialLinks.map((link) => {
                const icon =
                  link.platform === "github"
                    ? <FaGithub className={socialIconClassName} />
                    : link.platform === "linkedin"
                      ? <FaLinkedin className={socialIconClassName} />
                      : <FaXTwitter className={socialIconClassName} />;

                return (
                  <Link
                    key={link.platform}
                    href={link.href}
                    aria-label={link.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-current"
                  >
                    {icon}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#d9d2c6] pt-6 text-[13px] text-[#7a7570] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <p>Built with Next.js, React, TypeScript, TailwindCSS, GSAP, GitHub, and Vercel.</p>
        </div>
      </Bounded>
    </footer>
  );
}
