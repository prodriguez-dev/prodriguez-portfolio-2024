import React from "react";
import { Content } from "@prismicio/client";

import NavBar from "@/components/NavBar";

type HeaderProps = {
  settings: Content.SettingsDocument;
};

export default function Header({ settings }: HeaderProps) {
  return (
    <header className="top-0 z-50 mx-auto max-w-[1360px] md:sticky md:top-4">
      <NavBar settings={settings} />
    </header>
  );
}
