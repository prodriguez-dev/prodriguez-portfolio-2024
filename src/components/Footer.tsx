import clsx from "clsx";
import React from "react";
import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";
import Bounded from "@/components/Bounded";
import { isFilled } from "@prismicio/client";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa6";
import Link from "next/link";

export default async function Footer() {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return (
    <Bounded as="footer" className="tracking-wide text-slate-600">
      <div className="container mx-auto mt-20 flex flex-col items-center justify-between gap-6 py-8 sm:flex-row ">
        <div className="name flex flex-col items-center justify-center gap-x-4 gap-y-2 sm:flex-row sm:justify-self-start">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-wide text-slate-100 transition-colors duration-150 hover:text-sky-500"
          >
            {settings.data.name}
          </Link>
        </div>
        <nav className="navigation" aria-label="Footer Navigation">
          <ul className="flex items-center gap-1">
            {settings.data.nav_item.map(
              ({ link, label }: { link: any; label: any }, index: number) => (
                <React.Fragment key={label}>
                  <li>
                    <PrismicNextLink
                      className={clsx(
                        "group relative block overflow-hidden  rounded px-3 py-1 text-base font-bold text-slate-100 transition-colors duration-150 hover:hover:text-sky-500 hover:drop-shadow-xl",
                      )}
                      field={link}
                    >
                      {label}
                    </PrismicNextLink>
                  </li>
                  {index < settings.data.nav_item.length - 1 && (
                    <span
                      className="text-4xl font-thin leading-[0] text-slate-400"
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
              className="p-2 text-2xl text-slate-300 transition-all duration-150 hover:scale-125 hover:text-sky-500"
              aria-label={settings.data.name + " on GitHub"}
            >
              <FaGithub />
            </PrismicNextLink>
          )}
          {isFilled.link(settings.data.linkedin_link) && (
            <PrismicNextLink
              field={settings.data.linkedin_link}
              className="p-2 text-2xl text-slate-300 transition-all duration-150 hover:scale-125 hover:text-sky-500"
              aria-label={settings.data.name + " on LinkedIn"}
            >
              <FaLinkedin />
            </PrismicNextLink>
          )}
          {isFilled.link(settings.data.twitter_link) && (
            <PrismicNextLink
              field={settings.data.twitter_link}
              className="p-2 text-2xl text-slate-300 transition-all duration-150 hover:scale-125 hover:text-sky-500"
              aria-label={settings.data.name + " on Twitter"}
            >
              <FaTwitter />
            </PrismicNextLink>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className=" text-sm text-slate-300 ">
          © {new Date().getFullYear()} {settings.data.name} / prodriguez.dev /
          All Rights Reserved.
        </p>
        <p className="text-md text-slate-500">
          Built with{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            className="font-extrabold transition-colors hover:text-slate-300"
          >
            Next.js
          </a>
          ,{" "}
          <a
            href="https://react.dev/"
            target="_blank"
            className="font-extrabold transition-colors hover:text-slate-300"
          >
            React.js
          </a>
          ,{" "}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            className="font-extrabold transition-colors hover:text-slate-300"
          >
            TailwindCSS
          </a>
          ,{" "}
          <a
            href="https://gsap.com/"
            target="_blank"
            className="font-extrabold transition-colors hover:text-slate-300"
          >
            GSAP
          </a>{" "}
          and{" "}
          <a
            href="https://prismic.io/"
            target="_blank"
            className="font-extrabold transition-colors hover:text-slate-300"
          >
            Prismic.io
          </a>
        </p>
      </div>
    </Bounded>
  );
}
