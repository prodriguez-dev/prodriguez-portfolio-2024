import type { SiteImage, SiteLink } from "@/lib/content-types";

export type SiteSettings = {
  name: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: SiteImage;
  navItems: SiteLink[];
  cta: SiteLink;
  socialLinks: Array<{
    platform: "github" | "linkedin" | "twitter";
    href: string;
  }>;
};

export type SiteDocument = {
  uid: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: SiteImage;
};

export const siteSettings: SiteSettings = {
  name: "Paul Rodriguez",
  metaTitle: "Paul Rodriguez | Solutions Architect",
  metaDescription:
    "Solutions Architect focused on technical discovery, enterprise platforms, and scalable system design across client-facing, high-stakes digital initiatives.",
  navItems: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Silver Tech Help", href: "/silver-tech-help" },
  ],
  cta: {
    label: "Contact",
    href: "/contact",
  },
  socialLinks: [
    { platform: "github", href: "https://github.com/prodriguez-dev" },
    {
      platform: "linkedin",
      href: "https://www.linkedin.com/in/paul-rodriguez-dev/",
    },
    { platform: "twitter", href: "https://x.com/prodriguez_dev" },
  ],
};

export const phaseOnePages: Record<string, SiteDocument> = {
  home: {
    uid: "home",
    title: "Paul Rodriguez | Solutions Architect",
    metaTitle: "Paul Rodriguez | Solutions Architect",
    metaDescription:
      "Solutions Architect focused on technical discovery, enterprise platforms, and scalable system design across client-facing, high-stakes digital initiatives.",
  },
  about: {
    uid: "about",
    title: "About Paul Rodriguez",
    metaTitle: "About Paul Rodriguez | Solutions Architect",
    metaDescription:
      "Learn about Paul Rodriguez, a Solutions Architect focused on discovery, enterprise systems, stakeholder alignment, and practical technical strategy.",
  },
  contact: {
    uid: "contact",
    title: "Contact Paul Rodriguez",
    metaTitle: "Contact Paul Rodriguez",
    metaDescription:
      "Get in touch with Paul Rodriguez about solutions architecture, technical discovery, enterprise platforms, and strategic technical consulting.",
  },
  projects: {
    uid: "projects",
    title: "Projects",
    metaTitle: "Projects | Paul Rodriguez",
    metaDescription:
      "Selected projects and case studies from Paul Rodriguez across product, platform, and client-facing technical work.",
  },
  'silver-tech-help': {
    uid: "silver-tech-help",
    title: "Silver Tech Help",
    metaTitle: "Silver Tech Help | Paul Rodriguez",
    metaDescription:
      "Silver Tech Help offers approachable, practical technology support for people who want calm guidance and clear next steps.",
  },
};

export function getPhaseOnePage(uid?: string | null) {
  if (!uid) return undefined;
  return phaseOnePages[uid];
}
