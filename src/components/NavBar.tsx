"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { MdEmail, MdMenu } from "react-icons/md";
import { SiteSettings } from "@/lib/site-content";
import { NameLogo } from "./NameLogo";
import clsx from "clsx";

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
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "text-[14px] font-extrabold uppercase tracking-[0.14em] transition-colors lg:text-[15px]",
        isActive ? "text-[#111111]" : "text-[#7a7570] hover:text-[#111111]",
      )}
    >
      {label}
    </Link>
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
    <nav aria-label="Main navigation" className="px-4 pt-4 md:px-6">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between rounded-2xl border border-[#e0dbd0] bg-[rgba(244,241,235,0.92)] px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.07)] backdrop-blur-xl md:px-6">
        <NameLogo name={settings.name} />

        <div className="hidden items-center gap-6 lg:gap-7 md:flex">
          {navItems.map(({ href, label }, index) => (
            <React.Fragment key={`${label}-${href}`}>
              <NavItem href={href} label={label} isActive={isActivePath(pathname, href)} />
              {index < navItems.length - 1 && <span className="text-[#cccccc]">/</span>}
            </React.Fragment>
          ))}
          <Link
            href={settings.cta.href}
            className="ml-3 inline-flex h-11 items-center gap-1.5 rounded-[8px] bg-[#c4621a] px-4.5 text-[13px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <span>{settings.cta.label}</span>
            <MdEmail className="text-[13px]" />
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-md p-2 text-2xl text-[#111111] md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          <MdMenu />
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-3 max-w-[1280px] rounded-2xl border border-[#e0dbd0] bg-[#f4f1eb] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navItems.map(({ href, label }) => (
              <NavItem
                key={`${label}-${href}`}
                href={href}
                label={label}
                isActive={isActivePath(pathname, href)}
                onClick={() => setOpen(false)}
              />
            ))}
            <Link
              href={settings.cta.href}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-fit items-center gap-1.5 rounded-[8px] bg-[#c4621a] px-4 text-[12px] font-extrabold uppercase tracking-[0.1em] text-white"
            >
              <span>{settings.cta.label}</span>
              <MdEmail className="text-[13px]" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
