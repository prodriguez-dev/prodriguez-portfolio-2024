import React from "react";

import NavBar from "@/components/NavBar";
import { SiteSettings } from "@/lib/site-content";

type HeaderProps = {
  settings: SiteSettings;
};

export default function Header({ settings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      <NavBar settings={settings} />
    </header>
  );
}
