"use client";

import { Content, asLink } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { MdClose, MdEmail, MdMenu } from "react-icons/md";
import Button from "./Button";
import { NameLogo } from "./NameLogo";

export default function NavBar({
  settings,
}: {
  settings: Content.SettingsDocument;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col justify-between bg-gray-800 px-4 py-3 md:m-4 md:flex-row md:items-center md:rounded-xl md:px-7">
        <div className="flex items-center justify-between">
          <NameLogo name={settings.data.name} />
          <button
            aria-expanded={open}
            aria-label="Open menu"
            className="block p-2 text-2xl text-gray-50 transition-colors duration-300 hover:text-gray-400 md:hidden"
            onClick={() => setOpen(true)}
          >
            <MdMenu />
          </button>
        </div>
        <div
          className={clsx(
            "background-master fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-end gap-4 pr-4 pt-14 transition-transform duration-300 ease-in-out md:hidden",
            open ? "translate-x-0" : "translate-x-[100%]",
          )}
        >
          <button
            aria-label="Close menu"
            aria-expanded={open}
            className="fixed right-4 top-3 block p-2 text-2xl text-gray-50 transition-colors duration-300 hover:text-gray-400 md:hidden "
            onClick={() => setOpen(false)}
          >
            <MdClose />
          </button>
          {settings.data.nav_item.map(({ link, label }, index) => {
            return (
              <React.Fragment key={label}>
                <li className="first:mt-8">
                  <a
                    href={asLink(link) as string}
                    target={label === "Resume" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="navbar-nav group relative block overflow-hidden rounded px-3 py-1 text-2xl font-bold text-gray-50 transition-colors duration-300 hover:text-gray-900"
                    onClick={() => setOpen(false)}
                    aria-current={
                      pathname.includes(asLink(link) as string)
                        ? "page"
                        : undefined
                    }
                  >
                    <span className="relative">{label}</span>
                  </a>
                </li>
                {index < settings.data.nav_item.length - 1 && (
                  <span
                    className="hidden text-4xl font-thin leading-[0] text-gray-50 md:inline"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </React.Fragment>
            );
          })}

          <li>
            <Button
              linkField={settings.data.cta_link}
              label={settings.data.cta_label}
              className="ml-3"
              icon={<MdEmail className="-mt-1 inline-block" />}
            />
          </li>
        </div>
        <DesktopMenu settings={settings} pathname={pathname} />
      </ul>
    </nav>
  );
}

function DesktopMenu({
  settings,
  pathname,
}: {
  settings: Content.SettingsDocument;
  pathname: string;
}) {
  return (
    <div className="relative z-50 hidden flex-row items-center gap-1 bg-transparent py-0 md:flex">
      {settings.data.nav_item.map(({ link, label }, index) => (
        <React.Fragment key={label}>
          <li>
            <PrismicNextLink
              className={clsx(
                "navbar-nav group relative block overflow-hidden rounded px-4 py-1 font-extrabold tracking-wide text-gray-50 transition-colors duration-300 hover:text-gray-50 active:text-gray-50",
              )}
              field={link}
              aria-current={
                pathname.includes(asLink(link) as string) ? "page" : undefined
              }
            >
              <span
                className={clsx(
                  "absolute inset-0 z-0 h-full rounded bg-gray-500 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
                  pathname.includes(asLink(link) as string)
                    ? "translate-y-0"
                    : "translate-y-10",
                )}
              />
              <span className="relative">{label}</span>
            </PrismicNextLink>
          </li>
          {index < settings.data.nav_item.length - 1 && (
            <span
              className="hidden font-thin leading-[0] text-gray-50 md:inline"
              aria-hidden="true"
            >
              /
            </span>
          )}
        </React.Fragment>
      ))}
      <li>
        <Button
          linkField={settings.data.cta_link}
          label={settings.data.cta_label}
          className="ml-3"
          icon={<MdEmail className="inline-block" />}
        />
      </li>
    </div>
  );
}
