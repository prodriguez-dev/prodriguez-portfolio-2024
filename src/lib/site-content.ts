import type { SiteImage, SiteLink } from "@/lib/content-types";

export type SiteSettings = {
  name: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: SiteImage;
  navItems: SiteLink[];
  cta: SiteLink;
  socialLinks: Array<{
    platform: "github" | "linkedin";
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
  metaTitle: "Paul Rodriguez | AI Solutions Architect & Solutions Engineer",
  metaDescription:
    "Solutions Architect and Solutions Engineer helping teams design AI-enabled workflows, enterprise SaaS solutions, integrations, and customer-facing technical systems.",
  navItems: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "AI Workflows", href: "/ai-workflows" },
  ],
  cta: {
    label: "Contact",
    href: "/contact",
  },
  socialLinks: [
    { platform: "github", href: "https://github.com/prodriguez-dev" },
    {
      platform: "linkedin",
      href: "https://www.linkedin.com/in/prodriguez-dev/",
    },
  ],
};

export const phaseOnePages: Record<string, SiteDocument> = {
  home: {
    uid: "home",
    title: "Paul Rodriguez | AI Solutions Architect & Solutions Engineer",
    metaTitle: "Paul Rodriguez | AI Solutions Architect & Solutions Engineer",
    metaDescription:
      "Solutions Architect and Solutions Engineer helping teams design AI-enabled workflows, enterprise SaaS solutions, integrations, and customer-facing technical systems.",
  },
  about: {
    uid: "about",
    title: "About Paul Rodriguez",
    metaTitle: "About Paul Rodriguez | Solutions Architect",
    metaDescription:
      "Learn about Paul Rodriguez, a Solutions Architect focused on AI workflows, technical discovery, enterprise systems, stakeholder alignment, and practical technical strategy.",
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
      "Selected projects and case studies from Paul Rodriguez across AI workflow automation, solution architecture, enterprise platforms, and client-facing technical work.",
  },
  "ai-workflows": {
    uid: "ai-workflows",
    title: "AI Workflows",
    metaTitle: "AI Workflow Automation | Paul Rodriguez",
    metaDescription:
      "AI workflow automation work from Paul Rodriguez across lead qualification, customer intake, CRM hygiene, deal intelligence, QuickBooks workflows, research, and internal knowledge systems.",
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
