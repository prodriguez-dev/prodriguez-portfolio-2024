"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { MdClose, MdEmail, MdMenu } from "react-icons/md";
import Button from "./Button";
import { NameLogo } from "./NameLogo";
import { SiteSettings } from "@/lib/site-content";

type NavBarProps = {
  settings: SiteSettings;
};

type NavItemProps = {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
};

function isActivePath(pathname: string, href: string) {
  if (!href || href.startsWith("http") || href.startsWith("mailto:")) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({ href, label, isActive, onClick }: NavItemProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  return (
    <Link
      href={href}
      target={label === "Resume" || isExternal ? "_blank" : undefined}
      rel={label === "Resume" || isExternal ? "noopener noreferrer" : undefined}
      className="navbar-nav group relative block overflow-hidden rounded px-3 py-1 font-bold text-gray-50 transition-colors duration-300 hover:text-gray-900 md:px-4 md:font-extrabold md:tracking-wide md:hover:text-gray-50 md:active:text-gray-50"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={clsx(
          "absolute inset-0 z-0 hidden h-full rounded bg-gray-500 transition-transform duration-300 ease-in-out group-hover:translate-y-0 md:block",
          isActive ? "translate-y-0" : "translate-y-10",
        )}
      />
      <span className="relative text-2xl md:text-base">{label}</span>
    </Link>
  );
}

function NavSeparator({ mobile = false }: { mobile?: boolean }) {
  return (
    <li
      className={clsx(
        "font-thin leading-[0] text-gray-50",
        mobile ? "md:hidden" : "hidden md:inline",
      )}
      aria-hidden="true"
    >
      /
    </li>
  );
}

export default function NavBar({ settings }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navItems = useMemo(
    () => settings.navItems.filter((item) => item.label && item.href),
    [settings.navItems],
  );

  return (
    <nav aria-label="Main navigation">
      <div className="flex flex-col justify-between bg-gray-800 px-4 py-3 md:m-4 md:flex-row md:items-center md:rounded-xl md:px-7">
        <div className="flex items-center justify-between">
          <NameLogo name={settings.name} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            className="block p-2 text-2xl text-gray-50 transition-colors duration-300 hover:text-gray-400 md:hidden"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <MdClose /> : <MdMenu />}
          </button>
        </div>

        <div
          id="mobile-navigation"
          className={clsx(
            "background-master fixed bottom-0 left-0 right-0 top-0 z-50 md:hidden",
            open ? "translate-x-0" : "translate-x-[100%]",
          )}
        >
          <div className="flex h-full flex-col items-end gap-4 pr-4 pt-14 transition-transform duration-300 ease-in-out">
            <ul className="flex flex-col items-end gap-4">
              {navItems.map(({ href, label }, index) => (
                <React.Fragment key={`${label}-${href}`}>
                  <li className="first:mt-8">
                    <NavItem
                      href={href}
                      label={label}
                      isActive={isActivePath(pathname, href)}
                      onClick={() => setOpen(false)}
                    />
                  </li>
                  {index < navItems.length - 1 && <NavSeparator mobile />}
                </React.Fragment>
              ))}
              <li>
                <Button
                  href={settings.cta.href}
                  label={settings.cta.label}
                  className="ml-3"
                  icon={<MdEmail className="-mt-1 inline-block" />}
                />
              </li>
            </ul>
          </div>
        </div>

        <DesktopMenu settings={settings} pathname={pathname} navItems={navItems} />
      </div>
    </nav>
  );
}

function DesktopMenu({
  settings,
  pathname,
  navItems,
}: {
  settings: SiteSettings;
  pathname: string;
  navItems: { href: string; label: string }[];
}) {
  return (
    <ul className="relative z-50 hidden flex-row items-center gap-1 bg-transparent py-0 md:flex">
      {navItems.map(({ href, label }, index) => (
        <React.Fragment key={`${label}-${href}`}>
          <li>
            <NavItem
              href={href}
              label={label}
              isActive={isActivePath(pathname, href)}
            />
          </li>
          {index < navItems.length - 1 && <NavSeparator />}
        </React.Fragment>
      ))}
      <li>
        <Button
          href={settings.cta.href}
          label={settings.cta.label}
          className="ml-3"
          icon={<MdEmail className="inline-block" />}
        />
      </li>
    </ul>
  );
}
