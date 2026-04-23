import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import HeroMotion from "@/components/HeroMotion";
import { ExperienceAccordion, ProjectsExplorer } from "@/components/InteractiveSections";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { projects } from "@/content/projects";
import type { ContentEntry, RichTextBlock, SiteImage } from "@/lib/content-types";
import {
  absoluteUrl,
  buildDescription,
  buildOgImage,
  buildPageTitle,
  getSiteDefaults,
} from "@/lib/metadata";
import { getPhaseOnePage, siteSettings } from "@/lib/site-content";

type HeroSection = {
  firstName: string;
  lastName: string;
  tagline: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stageImage: SiteImage;
  standingImage: SiteImage;
};

type HomeStatsSection = {
  items: Array<{ value: string; label: string }>;
};

type HomeServicesSection = {
  heading: string;
  items: Array<{
    icon: string;
    title: string;
    body: string;
  }>;
};

type HomeProjectsSection = {
  heading: string;
  body: string;
  items: ContentEntry[];
};

type HomeTestimonialsSection = {
  heading: string;
  items: Array<{
    quote: string;
    name: string;
    role: string;
    avatar: SiteImage;
  }>;
};

type HomeContactCtaSection = {
  heading: string;
  body: string;
  cta: { label: string; href: string };
};

type BiographySection = {
  heading: string;
  role: string;
  bullets: string[];
  avatar?: SiteImage;
  certifications: string[];
  languages: string[];
  socialLinks: Array<{ label: string; href: string }>;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

type SkillsSection = {
  marqueeRows: string[][];
  pills: string[];
};

type ExperienceItem = {
  title: string;
  institution: string;
  location?: string;
  timePeriod?: string;
  description: string[];
};

type EducationSection = {
  education: string[];
  certifications: string[];
};

type ReferenceSection = {
  items: Array<{
    quote: string;
    name: string;
    role: string;
    avatar: SiteImage;
  }>;
};

type ProjectsPageSection = {
  categories: string[];
  items: Array<ContentEntry & { category: string; yearLabel: string; award?: boolean; fullImage?: SiteImage }>;
};

type SilverTechHeroSection = {
  headingTop: string;
  headingBottom: string;
  lead: string;
  paragraphs: string[];
  image: SiteImage;
  cta: { label: string; href: string };
};

type SilverTechServicesSection = {
  items: Array<{ icon: string; title: string; body: string }>;
};

type SilverTechQuoteSection = {
  quote: string;
  attribution: string;
};

type ContactSection = {
  headingLines: string[];
  intro: string;
  cards: Array<{ label: string; value: string; href: string }>;
  formSubjects: string[];
};

type SimpleTextSection = {
  heading?: string;
  text: RichTextBlock[];
};

type PhaseOnePageContent = {
  uid: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  hero?: HeroSection;
  homeStats?: HomeStatsSection;
  homeServices?: HomeServicesSection;
  homeProjects?: HomeProjectsSection;
  homeTestimonials?: HomeTestimonialsSection;
  homeContactCta?: HomeContactCtaSection;
  biography?: BiographySection;
  skills?: SkillsSection;
  experiences?: {
    heading: string;
    items: ExperienceItem[];
  };
  educationSection?: EducationSection;
  references?: ReferenceSection;
  projectsPage?: ProjectsPageSection;
  silverTechHero?: SilverTechHeroSection;
  silverTechServices?: SilverTechServicesSection;
  silverTechQuote?: SilverTechQuoteSection;
  contact?: ContactSection;
  textSections?: SimpleTextSection[];
};

const stageImage: SiteImage = {
  url: "/images/prismic/ZlBBNCol0Zci9aaw_paul-stage-photo-1.jpg",
  alt: "Paul Rodriguez on stage",
  dimensions: { width: 1800, height: 2200 },
};

const standingImage: SiteImage = {
  url: "/images/prismic/Zk16dSol0Zci9Vnk_paul-rodriguez-standing-up.png",
  alt: "Paul Rodriguez standing",
  dimensions: { width: 1000, height: 1800 },
};

const aboutHeadshot: SiteImage = {
  url: "/images/paul-rodriguez-auxo-midshot_6_2025.png",
  alt: "Paul Rodriguez headshot",
  dimensions: { width: 1200, height: 1200 },
};

const silverTechImage: SiteImage = {
  url: "/images/paul-rodriguez-with-elderly-people.png",
  alt: "Paul Rodriguez helping older adults with technology",
  dimensions: { width: 1200, height: 900 },
};

const ericMaAvatar: SiteImage = {
  url: "/images/eric-ma.jpg",
  alt: "Eric Ma",
  dimensions: { width: 512, height: 512 },
};

const robertAlgeriAvatar: SiteImage = {
  url: "/images/prismic/ZmSN55m069VX1kom_robert-algeri.jpg",
  alt: "Robert Algeri",
  dimensions: { width: 512, height: 512 },
};

const jonTraisterAvatar: SiteImage = {
  url: "/images/prismic/ZmSN5pm069VX1kol_jon-traister.jpg",
  alt: "Jon Traister",
  dimensions: { width: 512, height: 512 },
};

const chrisHeggAvatar: SiteImage = {
  url: "/images/prismic/ZmSN5Zm069VX1kok_chris-hegg.jpg",
  alt: "Chris Hegg",
  dimensions: { width: 512, height: 512 },
};

const jamiePhillipsAvatar: SiteImage = {
  url: "/images/prismic/ZmSN5Jm069VX1koj_jamie-phillips.jpg",
  alt: "Jamie H. Phillips",
  dimensions: { width: 512, height: 512 },
};

const latestProjects = ["larkin-hoffman", "sullivan-worcester", "moses-singer"]
  .map((uid) => projects.find((project) => project.uid === uid))
  .filter(Boolean) as ContentEntry[];

const projectCategoryMap: Record<string, string> = {
  "larkin-hoffman": "Website Development",
  "sullivan-worcester": "Website Development",
  "tarter-krinsky": "Website Development",
  "moses-singer": "Website Development",
  polsinelli: "Website Development",
  "susan-bruce-travel": "Website Development",
  "happier-homes": "Logo & Print",
  "ontech-smart-services": "E-Commerce",
  "dish---branding-microsite": "Website Development",
  "domo-visualizer": "Web Application",
  "dynamic-html5-banners": "DCO Banners",
  roofstops: "Web Application",
};

const featuredAwardUids = new Set(["moses-singer", "polsinelli"]);
const projectListOrder = [
  "larkin-hoffman",
  "sullivan-worcester",
  "tarter-krinsky",
  "moses-singer",
  "polsinelli",
  "susan-bruce-travel",
  "happier-homes",
  "ontech-smart-services",
  "dish---branding-microsite",
  "domo-visualizer",
  "dynamic-html5-banners",
  "roofstops",
];

const projectList = projectListOrder
  .map((uid) => projects.find((project) => project.uid === uid))
  .filter(Boolean)
  .map((project) => ({
    ...project!,
    category: projectCategoryMap[project!.uid] || "Website Development",
    yearLabel: project!.date ? new Date(project!.date).getFullYear().toString() : "",
    award: featuredAwardUids.has(project!.uid),
    fullImage: project!.slices?.find((slice) => slice.type === "image")?.image,
  }));

const pages: Record<string, PhaseOnePageContent> = {
  home: {
    uid: "home",
    path: "/",
    title: "Paul Rodriguez | Solutions Architect",
    metaTitle: "Paul Rodriguez | Solutions Architect",
    metaDescription:
      "Solutions Architect, frontend engineer, and public speaker building clear, high-trust digital experiences.",
    hero: {
      firstName: "Paul",
      lastName: "Rodriguez",
      tagline: "Solutions Architect / Frontend Engineer / Public Speaker",
      body: "I build clear, high-trust digital experiences across architecture, frontend engineering, and client-facing delivery.",
      primaryCta: { label: "Contact", href: "/contact" },
      secondaryCta: { label: "About", href: "/about" },
      stageImage,
      standingImage,
    },
    homeStats: {
      items: [
        { value: "12+", label: "Years Experience" },
        { value: "$100K+", label: "Projects Delivered" },
        { value: "164%", label: "Sales Lift (DISH)" },
        { value: "98%", label: "Client Retention" },
      ],
    },
    homeServices: {
      heading: "What I Do",
      items: [
        {
          icon: "01",
          title: "Solutions Architecture",
          body: "Turn messy requirements into clear systems, practical decisions, and a buildable path forward.",
        },
        {
          icon: "02",
          title: "Frontend Engineering",
          body: "Build polished interfaces with strong interaction design, accessibility, and production-ready implementation.",
        },
        {
          icon: "03",
          title: "Client-Facing Delivery",
          body: "Translate between business goals, stakeholder needs, and technical execution without losing the plot.",
        },
      ],
    },
    homeProjects: {
      heading: "Featured Projects",
      body: "A quick look at a few projects that best show the mix of architecture, polish, and delivery judgment.",
      items: latestProjects,
    },
    homeTestimonials: {
      heading: "Testimonials",
      items: [
        {
          quote:
            "Paul brings a rare combination of technical depth, calm communication, and execution discipline. He makes hard work feel navigable.",
          name: "Eric Ma",
          role: "Product and technology leader",
          avatar: ericMaAvatar,
        },
        {
          quote:
            "He can move from implementation detail to executive-level context without losing clarity. That makes him incredibly effective with clients.",
          name: "Robert Algeri",
          role: "Creative and digital leader",
          avatar: robertAlgeriAvatar,
        },
      ],
    },
    homeContactCta: {
      heading: "Let’s build something great.",
      body: "If you need architecture, frontend leadership, or a calm operator in the middle of complex work, let’s talk.",
      cta: { label: "Get in touch", href: "/contact" },
    },
  },
  about: {
    uid: "about",
    path: "/about",
    title: "About Paul Rodriguez",
    metaTitle: "About Paul Rodriguez | Solutions Architect",
    metaDescription:
      "Learn about Paul Rodriguez, a Solutions Architect focused on discovery, enterprise systems, stakeholder alignment, and practical technical strategy.",
    biography: {
      heading: "Paul Rodriguez",
      role: "Solutions Architect, Frontend Engineer, and Public Speaker",
      bullets: [
        "Architecting enterprise and client-facing digital solutions with a bias for clarity.",
        "Bridging stakeholder goals, technical strategy, and implementation reality.",
        "Leading frontend builds with strong systems thinking and visual polish.",
        "Comfortable in discovery, pre-sales, delivery, and platform evolution work.",
        "Focused on trust, momentum, and making the next decision obvious.",
        "Equally at home with code, clients, and the messy middle between them.",
      ],
      avatar: aboutHeadshot,
      certifications: ["Salesforce Admin", "Salesforce Dev", "AWS", "Unqork"],
      languages: ["English", "Spanish"],
      socialLinks: [
        { label: "GitHub ↗", href: "https://github.com/prodriguez-dev" },
        { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/paul-rodriguez-dev/" },
        { label: "Twitter/X ↗", href: "https://x.com/prodriguez_dev" },
      ],
      primaryCta: { label: "Download Résumé", href: "https://www.prodriguez.dev/resume" },
      secondaryCta: { label: "Get in Touch", href: "/contact" },
    },
    skills: {
      marqueeRows: [
        [
          "Solution Architecture",
          "Technical Discovery",
          "Enterprise Platforms",
          "Salesforce",
          "AWS",
          "API Integrations",
          "React",
          "Next.js",
        ],
        [
          "TypeScript",
          "GSAP",
          "Accessibility",
          "Client Workshops",
          "Stakeholder Alignment",
          "Pre-Sales",
          "Information Architecture",
          "Design Systems",
        ],
      ],
      pills: [
        "Solution Architecture",
        "Technical Discovery",
        "Enterprise Platforms",
        "API Integrations",
        "Salesforce",
        "AWS",
        "React",
        "Next.js",
        "TypeScript",
        "GSAP",
        "Accessibility",
        "Pre-Sales",
        "Client Workshops",
        "Stakeholder Alignment",
        "Design Systems",
        "Information Architecture",
      ],
    },
    experiences: {
      heading: "Experience",
      items: [
        {
          title: "Solutions Architect",
          institution: "Auxo Solutions",
          location: "New York, NY",
          timePeriod: "Oct 2024–Present",
          description: [
            "Shape solution strategy for enterprise and client-facing engagements.",
            "Translate discovery into scoped technical direction and implementation planning.",
          ],
        },
        {
          title: "Senior Front End Developer",
          institution: "Great Jakes",
          location: "New York, NY",
          timePeriod: "Jul 2021–Sep 2024",
          description: [
            "Led frontend architecture and reusable component patterns across legal-industry builds.",
            "Improved delivery quality through stronger structure, accessibility, and maintainability.",
          ],
        },
        {
          title: "Founder & Solutions Architect",
          institution: "Smart Code Shop",
          location: "Denver, CO",
          timePeriod: "Mar 2016–Present",
          description: [
            "Built websites, applications, and brand systems for small businesses and founder-led teams.",
            "Owned strategy, design, engineering, and client communication end to end.",
          ],
        },
        {
          title: "Lead Front End Developer",
          institution: "OneTen Creative (DISH Network)",
          location: "Denver, CO",
          timePeriod: "Jul 2018–Jun 2021",
          description: [
            "Built campaign microsites, ecommerce experiences, and internal tools.",
            "Supported measurable growth and high-visibility marketing launches.",
          ],
        },
        {
          title: "Senior Web Developer & Designer",
          institution: "Denver Print Company",
          location: "Denver, CO",
          timePeriod: "Nov 2014–Mar 2016",
          description: [
            "Delivered design and development work across client web and print engagements.",
          ],
        },
        {
          title: "Senior Web Developer & Designer",
          institution: "Graphik Creative",
          location: "Denver, CO",
          timePeriod: "Mar 2012–Jan 2013",
          description: [
            "Handled design and frontend implementation across agency client work.",
          ],
        },
        {
          title: "Web Developer & Art Director",
          institution: "SlantMedia Creative",
          location: "Chicago, IL",
          timePeriod: "Apr 2008–Mar 2012",
          description: [
            "Worked across visual design, frontend builds, and interactive campaign execution.",
          ],
        },
      ],
    },
    educationSection: {
      education: [
        "Full-Stack Web Development Immersive — Galvanize (Feb 2018)",
        "BFA, Graphic Design — University of Illinois",
      ],
      certifications: [
        "Certified Salesforce Administrator — Jun 2024",
        "Certified Salesforce Developer — Jun 2024",
      ],
    },
    references: {
      items: [
        {
          quote: "Paul is one of those people who can untangle complexity fast and then explain it in a way everybody can act on.",
          name: "Eric Ma",
          role: "Product and technology leader",
          avatar: ericMaAvatar,
        },
        {
          quote: "His mix of design sense and technical rigor makes him unusually effective in real delivery environments.",
          name: "Robert Algeri",
          role: "Creative and digital leader",
          avatar: robertAlgeriAvatar,
        },
        {
          quote: "Paul consistently brings calm, clarity, and follow-through to the kinds of projects that usually drift.",
          name: "Jon Traister",
          role: "Client and collaborator",
          avatar: jonTraisterAvatar,
        },
        {
          quote: "He does not just build things well. He helps teams make better decisions while they are building.",
          name: "Chris Hegg",
          role: "Creative and product collaborator",
          avatar: chrisHeggAvatar,
        },
        {
          quote: "A steady hand, sharp instincts, and zero drama -- that combination is rare.",
          name: "Jamie H. Phillips",
          role: "Creative director",
          avatar: jamiePhillipsAvatar,
        },
      ],
    },
  },
  projects: {
    uid: "projects",
    path: "/projects",
    title: "Projects",
    metaTitle: "Projects | Paul Rodriguez",
    metaDescription:
      "Selected projects and case studies from Paul Rodriguez across product, platform, and client-facing technical work.",
    projectsPage: {
      categories: [
        "All",
        "Website Development",
        "Web Application",
        "E-Commerce",
        "Logo & Print",
        "DCO Banners",
      ],
      items: projectList,
    },
  },
  "silver-tech-help": {
    uid: "silver-tech-help",
    path: "/silver-tech-help",
    title: "Silver Tech Help",
    metaTitle: "Silver Tech Help | Paul Rodriguez",
    metaDescription:
      "Silver Tech Help offers approachable, practical technology support for people who want calm guidance and clear next steps.",
    silverTechHero: {
      headingTop: "Silver",
      headingBottom: "Tech Help",
      lead: "Technology should bring people together -- not leave anyone behind.",
      paragraphs: [
        "Silver Tech Help is calm, practical support for older adults and families who want help using phones, tablets, computers, apps, and connected devices without confusion or pressure.",
        "I focus on patience, plain language, and real-world confidence so the technology in front of you starts feeling useful again.",
      ],
      image: silverTechImage,
      cta: { label: "Request Help ✉", href: "mailto:paul@prodriguez.dev?subject=Silver%20Tech%20Help" },
    },
    silverTechServices: {
      items: [
        { icon: "📱", title: "Smartphones & Tablets", body: "Setup, navigation help, updates, settings, and everyday troubleshooting." },
        { icon: "📹", title: "Video Calls & Email", body: "Get comfortable with FaceTime, Zoom, Gmail, Outlook, and staying in touch." },
        { icon: "☁️", title: "Cloud & Photo Storage", body: "Understand backups, shared albums, storage cleanup, and safer access to files." },
        { icon: "🔒", title: "Online Safety", body: "Spot scams, improve passwords, and make safer decisions online without panic." },
        { icon: "🏠", title: "Smart Home Devices", body: "Set up and simplify home assistants, Wi-Fi gadgets, and connected devices." },
        { icon: "🎓", title: "Online Learning", body: "Build confidence using new apps, websites, services, and digital tools step by step." },
      ],
    },
    silverTechQuote: {
      quote: "Good tech help should feel calm, clear, and human.",
      attribution: "-- Paul Rodriguez",
    },
  },
  contact: {
    uid: "contact",
    path: "/contact",
    title: "Contact Paul Rodriguez",
    metaTitle: "Contact Paul Rodriguez",
    metaDescription:
      "Get in touch with Paul Rodriguez about solutions architecture, technical discovery, enterprise platforms, and strategic technical consulting.",
    contact: {
      headingLines: ["Let’s Build", "Something", "Great."],
      intro:
        "If you need architecture, frontend leadership, technical discovery, speaking, or Silver Tech Help, send a note and I’ll get back to you.",
      cards: [
        { label: "Email", value: "paul@prodriguez.dev", href: "mailto:paul@prodriguez.dev" },
        { label: "LinkedIn", value: "linkedin.com/in/paul-rodriguez-dev", href: "https://www.linkedin.com/in/paul-rodriguez-dev/" },
        { label: "GitHub", value: "github.com/prodriguez-dev", href: "https://github.com/prodriguez-dev" },
      ],
      formSubjects: [
        "General Inquiry",
        "Solutions Architecture Engagement",
        "Frontend Development Project",
        "Speaking Engagement",
        "Silver Tech Help",
        "Other",
      ],
    },
  },
};

function SectionShell({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <section className={clsx("px-4 md:px-8", className)}>
      <div className={clsx("mx-auto w-full", wide ? "max-w-[1380px]" : "max-w-[1280px]")}>{children}</div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 font-[var(--font-sofia-sans-condensed)] text-[0.95rem] font-extrabold uppercase italic tracking-[0.2em] text-[#c4621a]">
      {children}
    </div>
  );
}

function DisplayHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={clsx(
        "font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(3rem,6vw,7rem)] font-black uppercase italic leading-[0.92] tracking-[-0.01em]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function HomeHeroSection({ hero }: { hero: HeroSection }) {
  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-[#1a1610] pt-20 text-[#ede9e1]">
      <Image
        src={hero.stageImage.url}
        alt={hero.stageImage.alt || ""}
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[rgba(10,8,6,0.58)]" />
      <SectionShell wide className="relative flex min-h-[calc(100vh-5rem)] items-center py-16">
        <HeroMotion
          tagline={hero.tagline}
          firstName={hero.firstName}
          lastName={hero.lastName}
          body={hero.body}
          primaryCta={
            <Link
              href={hero.primaryCta.href}
              className="inline-flex items-center rounded-[10px] bg-[#c4621a] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:opacity-90"
            >
              {hero.primaryCta.label}
            </Link>
          }
          secondaryCta={
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center rounded-[10px] border border-[rgba(237,233,225,0.35)] bg-[rgba(255,255,255,0.06)] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#ede9e1] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.12)]"
            >
              {hero.secondaryCta.label}
            </Link>
          }
        />
        <div className="pointer-events-none absolute inset-y-0 right-[3%] hidden items-end lg:flex">
          <div className="relative h-[min(70vh,640px)] w-[min(34vw,420px)]">
            <Image
              src={hero.standingImage.url}
              alt={hero.standingImage.alt || ""}
              fill
              className="object-contain object-bottom [mask-image:linear-gradient(to_top,transparent_0%,black_10%)]"
            />
          </div>
        </div>
      </SectionShell>
    </section>
  );
}

function HomeStatsSectionBlock({ section }: { section: HomeStatsSection }) {
  return (
    <SectionShell className="bg-white py-0">
      <div className="grid border-x border-b border-[#e0dbd0] md:grid-cols-4">
        {section.items.map((item, index) => (
          <div key={item.label} className={clsx("px-6 py-9", index < section.items.length - 1 && "border-b border-[#e0dbd0] md:border-b-0 md:border-r") }>
            <div className="font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(2.5rem,5vw,4rem)] font-black uppercase italic leading-none text-[#c4621a]">
              {item.value}
            </div>
            <div className="mt-2 text-[13px] font-bold uppercase tracking-[0.06em] text-[#7a7570]">{item.label}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function HomeServicesSectionBlock({ section }: { section: HomeServicesSection }) {
  return (
    <SectionShell className="py-24">
      <SectionEyebrow>What I Do</SectionEyebrow>
      <DisplayHeading className="text-[#111111]">{section.heading}</DisplayHeading>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {section.items.map((item) => (
          <article key={item.title} className="rounded-[16px] border border-[#e0dbd0] bg-white p-10 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="font-[var(--font-sofia-sans-extra-condensed)] text-[40px] font-black uppercase italic text-[#c4621a]">{item.icon}</div>
            <h3 className="mt-4 font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(2rem,4vw,2.6rem)] font-black uppercase italic leading-none text-[#111111]">{item.title}</h3>
            <p className="mt-4 text-[15px] leading-7 text-[#4d4a45]">{item.body}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function HomeProjectsSectionBlock({ section }: { section: HomeProjectsSection }) {
  return (
    <SectionShell className="bg-[#ede9e1] py-24">
      <SectionEyebrow>Selected Work</SectionEyebrow>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <DisplayHeading className="text-[#111111]">{section.heading}</DisplayHeading>
          <p className="mt-4 max-w-2xl text-[17px] leading-8 text-[#7a7570]">{section.body}</p>
        </div>
        <Link href="/projects" className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#c4621a] transition hover:opacity-80">
          View all projects
        </Link>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {section.items.map((project) => (
          <Link
            key={project.uid}
            href="/projects"
            className="overflow-hidden rounded-[20px] border border-[#e0dbd0] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
          >
            {project.hoverImage?.url && (
              <Image
                src={project.hoverImage.url}
                alt={project.hoverImage.alt || project.title}
                width={900}
                height={500}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-6">
              <div className="text-sm font-bold uppercase tracking-[0.08em] text-[#7a7570]">
                {project.clientName} · {project.date ? new Date(project.date).getFullYear() : ""}
              </div>
              <h3 className="mt-3 font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(2.2rem,5vw,3.6rem)] font-black uppercase italic leading-none text-[#111111]">
                {project.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.tags || []).slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#ece8df] px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.05em] text-[#666666]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

function AvatarBubble({ image, name }: { image: SiteImage; name: string }) {
  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#e0dbd0] bg-[#ede9e1]">
      <Image src={image.url} alt={image.alt || name} fill className="object-cover" />
    </div>
  );
}

function HomeTestimonialsSectionBlock({ section }: { section: HomeTestimonialsSection }) {
  return (
    <SectionShell className="py-24">
      <SectionEyebrow>Kind Words</SectionEyebrow>
      <DisplayHeading className="text-[#111111]">{section.heading}</DisplayHeading>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {section.items.map((item) => (
          <article key={item.name} className="rounded-[20px] border border-[#e0dbd0] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <p className="text-[20px] italic leading-9 text-[#111111]">“{item.quote}”</p>
            <div className="mt-8 flex items-center gap-4">
              <AvatarBubble image={item.avatar} name={item.name} />
              <div>
                <div className="font-bold uppercase tracking-[0.08em] text-[#111111]">{item.name}</div>
                <div className="text-sm text-[#7a7570]">{item.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function HomeContactCtaSectionBlock({ section }: { section: HomeContactCtaSection }) {
  return (
    <SectionShell className="bg-[#ede9e1] py-24">
      <div className="rounded-[24px] border border-[#e0dbd0] bg-white px-8 py-16 text-center shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:px-16">
        <DisplayHeading className="text-[#111111]">{section.heading}</DisplayHeading>
        <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-8 text-[#7a7570]">{section.body}</p>
        <Link
          href={section.cta.href}
          className="mt-8 inline-flex rounded-[10px] bg-[#c4621a] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:opacity-90"
        >
          {section.cta.label}
        </Link>
      </div>
    </SectionShell>
  );
}

function BiographySectionBlock({ biography }: { biography: BiographySection }) {
  return (
    <SectionShell className="py-24">
      <div className="grid gap-8 md:grid-cols-[300px,1fr]">
        <div>
          {biography.avatar?.url && (
            <div className="relative aspect-square overflow-hidden rounded-[16px] border border-[#e0dbd0] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <Image src={biography.avatar.url} alt={biography.avatar.alt || biography.heading} fill className="object-cover" />
            </div>
          )}
          <div className="mt-6 space-y-3 text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
            {biography.socialLinks.map((link) => (
              <Link key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block transition hover:text-[#c4621a]">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7a7570]">Certifications</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {biography.certifications.map((item) => (
                <span key={item} className="rounded-full bg-[#ece8df] px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.05em] text-[#666666]">{item}</span>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7a7570]">Languages</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {biography.languages.map((item) => (
                <span key={item} className="rounded-full bg-[#ece8df] px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.05em] text-[#666666]">{item}</span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <DisplayHeading className="text-[#111111]">{biography.heading}</DisplayHeading>
          <div className="mt-4 font-[var(--font-sofia-sans-condensed)] text-[16px] font-extrabold uppercase italic tracking-[0.2em] text-[#c4621a]">
            {biography.role}
          </div>
          <ul className="mt-8 space-y-4 text-[17px] leading-8 text-[#111111]">
            {biography.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-2 text-[#c4621a]">●</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={biography.primaryCta.href} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-[10px] bg-[#c4621a] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:opacity-90">
              {biography.primaryCta.label}
            </Link>
            <Link href={biography.secondaryCta.href} className="inline-flex rounded-[10px] border border-[#e0dbd0] bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#111111] transition hover:-translate-y-0.5 hover:border-[#bdb8ae]">
              {biography.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function SkillsSectionBlock({ skills }: { skills: SkillsSection }) {
  return (
    <SectionShell className="bg-[#ede9e1] py-24 overflow-x-clip">
      <SectionEyebrow>Skills</SectionEyebrow>
      <div className="hidden space-y-4 overflow-hidden md:block">
        {skills.marqueeRows.map((row, rowIndex) => {
          const items = [...row, ...row, ...row];
          return (
            <div key={rowIndex} className="overflow-hidden whitespace-nowrap border-y border-[#e0dbd0] py-3">
              <div
                className={clsx(
                  "inline-flex min-w-full gap-6 will-change-transform",
                  rowIndex === 0 ? "animate-[marquee_32s_linear_infinite]" : "animate-[marquee-reverse_26s_linear_infinite]",
                )}
              >
                {items.map((item, index) => (
                  <span
                    key={`${rowIndex}-${item}-${index}`}
                    className={clsx(
                      "inline-flex items-center gap-4 font-[var(--font-sofia-sans-extra-condensed)] text-[44px] font-black uppercase italic leading-none",
                      index % 5 === 4 ? "text-[#c4621a]" : "text-[#1e1e1e]",
                    )}
                  >
                    {item}
                    <span className="text-[#c4621a]">◆</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid gap-3 md:hidden">
        {skills.marqueeRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-2 border-y border-[#e0dbd0] py-4">
            {row.map((item) => (
              <span
                key={`${rowIndex}-${item}`}
                className="rounded-full border border-[#d9d2c6] bg-white px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#666666]"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {skills.pills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[#e0dbd0] bg-white px-3 py-2 text-[12px] font-extrabold uppercase tracking-[0.05em] text-[#666666]"
          >
            {skill}
          </span>
        ))}
      </div>
    </SectionShell>
  );
}

function ExperienceSection({ heading, items }: { heading: string; items: ExperienceItem[] }) {
  return (
    <SectionShell className="py-24">
      <SectionEyebrow>Career</SectionEyebrow>
      <DisplayHeading className="text-[#111111]">{heading}</DisplayHeading>
      <ExperienceAccordion items={items} />
    </SectionShell>
  );
}

function EducationSectionBlock({ section }: { section: EducationSection }) {
  return (
    <SectionShell className="bg-[#ede9e1] py-24">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[20px] border border-[#e0dbd0] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <SectionEyebrow>Education</SectionEyebrow>
          <ul className="space-y-4 text-[17px] leading-8 text-[#111111]">
            {section.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[20px] border border-[#e0dbd0] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <SectionEyebrow>Certifications</SectionEyebrow>
          <ul className="space-y-4 text-[17px] leading-8 text-[#111111]">
            {section.certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

function ReferencesSectionBlock({ section }: { section: ReferenceSection }) {
  return (
    <SectionShell className="py-24">
      <SectionEyebrow>References</SectionEyebrow>
      <div className="grid gap-4 md:grid-cols-2">
        {section.items.map((item) => (
          <article key={item.name} className="rounded-[20px] border border-[#e0dbd0] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <p className="text-[18px] italic leading-8 text-[#111111]">“{item.quote}”</p>
            <div className="mt-6 flex items-center gap-4">
              <AvatarBubble image={item.avatar} name={item.name} />
              <div>
                <div className="font-bold uppercase tracking-[0.08em] text-[#111111]">{item.name}</div>
                <div className="text-sm text-[#7a7570]">{item.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function ProjectsPageSectionBlock({ section }: { section: ProjectsPageSection }) {
  return (
    <SectionShell className="py-24">
      <SectionEyebrow>Project Archive</SectionEyebrow>
      <DisplayHeading className="text-[#111111]">Projects</DisplayHeading>
      <ProjectsExplorer categories={section.categories} items={section.items} />
    </SectionShell>
  );
}

function SilverTechHeroSectionBlock({ section }: { section: SilverTechHeroSection }) {
  return (
    <SectionShell className="py-24">
      <div className="grid gap-8 md:grid-cols-[1fr,1fr] md:items-center">
        <div>
          <SectionEyebrow>Silver Tech Help</SectionEyebrow>
          <h1 className="font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(4rem,9vw,9rem)] font-black uppercase italic leading-[0.9] tracking-[-0.01em] text-[#111111]">
            <span className="block">{section.headingTop}</span>
            <span className="block">{section.headingBottom}</span>
          </h1>
          <p className="mt-6 text-[20px] font-black leading-8 text-[#111111]">{section.lead}</p>
          <div className="mt-6 space-y-5 text-[17px] leading-8 text-[#4d4a45]">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link href={section.cta.href} className="mt-8 inline-flex rounded-[10px] bg-[#c4621a] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:opacity-90">
            {section.cta.label}
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-[20px] border border-[#e0dbd0] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          <Image src={section.image.url} alt={section.image.alt || ""} width={1200} height={900} className="h-auto w-full object-cover" />
        </div>
      </div>
    </SectionShell>
  );
}

function SilverTechServicesSectionBlock({ section }: { section: SilverTechServicesSection }) {
  return (
    <SectionShell className="bg-[#ede9e1] py-24">
      <div className="grid gap-4 md:grid-cols-3">
        {section.items.map((item) => (
          <article key={item.title} className="rounded-[16px] border border-[#e0dbd0] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <div className="text-[32px]">{item.icon}</div>
            <h3 className="mt-4 text-[17px] font-black text-[#111111]">{item.title}</h3>
            <p className="mt-3 text-[14.5px] leading-7 text-[#4d4a45]">{item.body}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function SilverTechQuoteSectionBlock({ section }: { section: SilverTechQuoteSection }) {
  return (
    <SectionShell className="py-24 overflow-x-clip">
      <div className="rounded-[24px] border border-[#e0dbd0] bg-white px-6 py-12 text-center shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:px-20 md:py-[72px]">
        <p className="font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(2.25rem,10vw,6rem)] font-black uppercase italic leading-[0.95] tracking-[-0.01em] text-[#111111] break-words">
          {section.quote}
        </p>
        <p className="mt-6 text-[14px] font-extrabold uppercase tracking-[0.14em] text-[#c4621a] md:text-[16px]">{section.attribution}</p>
      </div>
    </SectionShell>
  );
}

function ContactSectionBlock({ contact }: { contact: ContactSection }) {
  return (
    <SectionShell className="py-24">
      <div className="grid gap-12 md:grid-cols-[1fr,1fr] md:gap-20">
        <div>
          <h1 className="font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(4rem,8vw,8rem)] font-black uppercase italic leading-[0.9] tracking-[-0.01em] text-[#111111]">
            {contact.headingLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-8 text-[#4d4a45]">{contact.intro}</p>
          <div className="mt-8 space-y-4">
            {contact.cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center justify-between rounded-[16px] border border-[#e0dbd0] bg-white px-5 py-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition hover:translate-x-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
              >
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7a7570]">{card.label}</div>
                  <div className="mt-2 text-[16px] font-semibold text-[#111111]">{card.value}</div>
                </div>
                <span className="text-[#c4621a]">↗</span>
              </Link>
            ))}
          </div>
        </div>
        <ContactForm subjects={contact.formSubjects} />
      </div>
    </SectionShell>
  );
}

function TextSectionBlock({ section }: { section: SimpleTextSection }) {
  return (
    <SectionShell className="py-16">
      <div className="max-w-3xl text-[#111111]">
        {section.heading && <DisplayHeading className="text-[#111111]">{section.heading}</DisplayHeading>}
        <div className="mt-6 space-y-5 text-[17px] leading-8 text-[#4d4a45]">
          {section.text.map((block, index) => (
            <p key={index}>{block.text}</p>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function getPhaseOneContent(uid: string) {
  return pages[uid];
}

export function getPhaseOneStaticParams() {
  return Object.values(pages)
    .filter((page) => page.uid !== "home")
    .map((page) => ({ uid: page.uid }));
}

export function getPhaseOneMetadata(uid: string): Metadata | null {
  const page = pages[uid];
  if (!page) return null;

  const siteDefaults = getSiteDefaults({
    data: {
      name: siteSettings.name,
      meta_title: siteSettings.metaTitle,
      meta_description: siteSettings.metaDescription,
      og_image: siteSettings.ogImage,
    },
  });

  const pageDefaults = getPhaseOnePage(uid);
  const title = buildPageTitle(page.metaTitle, pageDefaults?.metaTitle, siteDefaults.title);
  const description = buildDescription(page.metaDescription, pageDefaults?.metaDescription, siteDefaults.description);
  const ogImage = buildOgImage(pageDefaults?.metaImage || siteSettings.ogImage);

  return {
    title,
    description,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(page.path),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export function renderPhaseOnePage(uid: string) {
  const page = pages[uid];
  if (!page) return null;

  return (
    <>
      {page.hero && <HomeHeroSection hero={page.hero} />}
      {page.homeStats && <HomeStatsSectionBlock section={page.homeStats} />}
      {page.homeServices && <HomeServicesSectionBlock section={page.homeServices} />}
      {page.homeProjects && <HomeProjectsSectionBlock section={page.homeProjects} />}
      {page.homeTestimonials && <HomeTestimonialsSectionBlock section={page.homeTestimonials} />}
      {page.homeContactCta && <HomeContactCtaSectionBlock section={page.homeContactCta} />}
      {page.biography && <BiographySectionBlock biography={page.biography} />}
      {page.skills && <SkillsSectionBlock skills={page.skills} />}
      {page.experiences && <ExperienceSection heading={page.experiences.heading} items={page.experiences.items} />}
      {page.educationSection && <EducationSectionBlock section={page.educationSection} />}
      {page.references && <ReferencesSectionBlock section={page.references} />}
      {page.projectsPage && <ProjectsPageSectionBlock section={page.projectsPage} />}
      {page.silverTechHero && <SilverTechHeroSectionBlock section={page.silverTechHero} />}
      {page.silverTechServices && <SilverTechServicesSectionBlock section={page.silverTechServices} />}
      {page.silverTechQuote && <SilverTechQuoteSectionBlock section={page.silverTechQuote} />}
      {page.contact && <ContactSectionBlock contact={page.contact} />}
      {page.textSections?.map((section, index) => (
        <TextSectionBlock key={`${page.uid}-text-${index}`} section={section} />
      ))}
    </>
  );
}
