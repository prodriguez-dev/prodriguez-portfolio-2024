import React from "react";

import NavBar from "@/components/NavBar";
import { SiteSettings } from "@/lib/site-content";

type HeaderProps = {
  settings: SiteSettings;
};

export default function Header({ settings }: HeaderProps) {
  return (
    <header className="top-0 z-50 mx-auto max-w-[1360px] md:sticky md:top-4">
      <NavBar settings={settings} />
    </header>
  );
}
