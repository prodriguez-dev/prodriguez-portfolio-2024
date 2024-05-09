import Bounded from "@/components/Bounded";
import { createClient } from "@/prismicio";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default async function Footer() {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return (
    <Bounded as="footer" className="bg-blue-400 tracking-wide text-blue-50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 py-4 sm:flex-row ">
        <div className="name flex flex-col items-center justify-center gap-x-4 gap-y-2 sm:flex-row sm:justify-self-start">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-wide transition-colors duration-300 hover:text-blue-400"
          >
            {settings.data.name}
          </Link>
        </div>
        <nav className="navigation" aria-label="Footer Navigation">
          <ul className="flex flex-wrap items-center gap-1 md:mr-12">
            {settings.data.nav_item.map(
              ({ link, label }: { link: any; label: any }, index: number) => (
                <React.Fragment key={label}>
                  <li>
                    <PrismicNextLink
                      className={clsx(
                        "group relative block overflow-hidden rounded px-1 py-1 text-xl font-extrabold tracking-wide text-blue-50 transition-colors duration-300 hover:text-blue-400  md:px-3 md:text-2xl",
                      )}
                      field={link}
                    >
                      {label}
                    </PrismicNextLink>
                  </li>
                  {index < settings.data.nav_item.length - 1 && (
                    <span
                      className="text-4xl font-thin leading-[0] text-blue-50"
                      aria-hidden="true"
                    >
                      /
                    </span>
                  )}
                </React.Fragment>
              ),
            )}
          </ul>
        </nav>
        <div className="socials inline-flex justify-center sm:justify-end">
          {isFilled.link(settings.data.github_link) && (
            <PrismicNextLink
              field={settings.data.github_link}
              className="footer-icons"
              aria-label={settings.data.name + " on GitHub"}
            >
              <FaGithub />
            </PrismicNextLink>
          )}
          {isFilled.link(settings.data.linkedin_link) && (
            <PrismicNextLink
              field={settings.data.linkedin_link}
              className="footer-icons"
              aria-label={settings.data.name + " on LinkedIn"}
            >
              <FaLinkedin />
            </PrismicNextLink>
          )}
          {isFilled.link(settings.data.twitter_link) && (
            <PrismicNextLink
              field={settings.data.twitter_link}
              className="footer-icons"
              aria-label={settings.data.name + " on Twitter"}
            >
              <FaXTwitter />
            </PrismicNextLink>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-blue-500">
          © {new Date().getFullYear()} {settings.data.name}. All Rights
          Reserved.
        </p>
        <p className="text-md text-blue-700">
          Powered by{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            className="footer-power"
          >
            Next.js
          </a>
          ,{" "}
          <a href="https://react.dev/" target="_blank" className="footer-power">
            React.js
          </a>
          ,{" "}
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            className="footer-power"
          >
            TypeScript
          </a>
          ,{" "}
          <a
            href="https://nodejs.org/"
            target="_blank"
            className="footer-power"
          >
            Node.js
          </a>
          ,{" "}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            className="footer-power"
          >
            TailwindCSS
          </a>
          ,{" "}
          <a href="https://gsap.com/" target="_blank" className="footer-power">
            GSAP
          </a>
          ,{" "}
          <a
            href="https://prismic.io/"
            target="_blank"
            className="footer-power"
          >
            Prismic
          </a>
          ,{" "}
          <a
            href="https://github.com/"
            target="_blank"
            className="footer-power"
          >
            GitHub
          </a>{" "}
          and{" "}
          <a
            href="https://vercel.com/"
            target="_blank"
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
