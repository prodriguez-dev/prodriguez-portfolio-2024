import Bounded from "@/components/Bounded";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiteSettings } from "@/lib/site-content";

type FooterProps = {
  settings: SiteSettings;
};

export default function Footer({ settings }: FooterProps) {
  return (
    <Bounded as="footer" className={clsx("tracking-wide")}>
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 py-4 sm:flex-row">
        <div className="name flex flex-col items-center justify-center gap-x-4 gap-y-2 sm:flex-row sm:justify-self-start">
          <Link
            href="/"
            className="global-text-mdsm footer-name-link text-gray-50 font-extrabold tracking-wide transition-colors duration-300 hover:text-amber-400"
          >
            {settings.name}
          </Link>
        </div>
        <nav className="navigation" aria-label="Footer Navigation">
          <ul className="flex flex-wrap items-center gap-1 md:mr-12">
            {settings.navItems.map(({ href, label }, index: number) => (
              <React.Fragment key={label}>
                <li>
                  <Link
                    className={clsx(
                      "global-text-mdsm group relative block overflow-hidden rounded px-1 py-1 font-extrabold tracking-wide text-gray-50 transition-colors duration-300 hover:text-amber-400 md:px-3",
                    )}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {label}
                  </Link>
                </li>
                {index < settings.navItems.length - 1 && (
                  <span
                    className={clsx(
                      "footer-copyright font-thin leading-[0] text-gray-50",
                    )}
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
        <div className="global-text-mdsm socials inline-flex justify-center sm:justify-end">
          {settings.socialLinks.map((link) => {
            const icon =
              link.platform === "github"
                ? <FaGithub />
                : link.platform === "linkedin"
                  ? <FaLinkedin />
                  : <FaXTwitter />;
            const label = `${settings.name} on ${link.platform === "twitter" ? "Twitter" : link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}`;

            return (
              <Link
                key={link.platform}
                href={link.href}
                className="footer-icons"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {icon}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="global-text-sm text-gray-500">
          © {new Date().getFullYear()} {settings.name}. All Rights Reserved.
        </p>
        <p className={clsx("footer-power-text text-gray-700")}>
          Powered by{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-power"
          >
            Next.js
          </a>
          ,{" "}
          <a
            href="https://react.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-power"
          >
            React.js
          </a>
          ,{" "}
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-power"
          >
            TypeScript
          </a>
          ,{" "}
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-power"
          >
            Node.js
          </a>
          ,{" "}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-power"
          >
            TailwindCSS
          </a>
          ,{" "}
          <a
            href="https://gsap.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-power"
          >
            GSAP
          </a>
          ,{" "}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-power"
          >
            GitHub
          </a>{" "}
          and{" "}
          <a
            href="https://vercel.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-power"
          >
            Vercel
          </a>
          .
        </p>
      </div>
    </Bounded>
  );
}
