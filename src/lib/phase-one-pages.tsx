import Avatar from "@/components/Avatar";
import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import type { ContentEntry, RichTextBlock, SiteImage } from "@/lib/content-types";
import { absoluteUrl, buildDescription, buildOgImage, buildPageTitle, getSiteDefaults } from "@/lib/metadata";
import { getPhaseOnePage, siteSettings } from "@/lib/site-content";
import { projects } from "@/content/projects";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { MdCircle, MdEmail } from "react-icons/md";

type HeroSection = {
  firstName: string;
  lastName: string;
  introLines: string[];
  stageImage: SiteImage;
};

type HomeSkillMarqueeSection = {
  heading: string;
  items: string[];
};

type HomeProjectsSection = {
  heading: string;
  items: ContentEntry[];
};

type HomeTestimonialsSection = {
  heading: string;
  items: Array<{
    quote: string;
    name: string;
    role: string;
  }>;
};

type BiographySection = {
  firstName: string;
  lastName: string;
  title: string;
  description: RichTextBlock[];
  buttonText?: string;
  buttonHref?: string;
  buttonTarget?: string;
  avatar?: SiteImage;
  textLeftColumn?: boolean;
};

type ExperienceItem = {
  title: string;
  institution: string;
  location?: string;
  timePeriod?: string;
  description: string[];
};

type SkillsSection = {
  columns: string[][];
};

type SimpleTextSection = {
  heading?: string;
  text: RichTextBlock[];
};

type ImageSection = {
  image: SiteImage;
  href?: string;
};

type ContactSection = {
  heading: string;
  intro: RichTextBlock[];
};

type PhaseOnePageContent = {
  uid: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  hero?: HeroSection;
  homeSkillsMarquee?: HomeSkillMarqueeSection;
  homeProjects?: HomeProjectsSection;
  homeTestimonials?: HomeTestimonialsSection;
  biography?: BiographySection;
  experiences?: {
    heading: string;
    items: ExperienceItem[];
  };
  skills?: SkillsSection;
  textSections?: SimpleTextSection[];
  imageSection?: ImageSection;
  contact?: ContactSection;
};

const avatarImage: SiteImage = {
  url: "https://images.prismic.io/prodriguez-portfolio-2024/79f09c3d-03f8-49c8-95d2-bf53ad2f8d75_paul-rodriguez-headshot.jpg?auto=format,compress",
  alt: "Paul Rodriguez headshot",
  dimensions: { width: 1200, height: 1200 },
};

const stageImage: SiteImage = {
  url: "https://images.prismic.io/prodriguez-portfolio-2024/86065c82-49c3-4f1b-81f0-2b60e0e2f0ba_paul-rodriguez-stage.jpg?auto=format,compress",
  alt: "Paul Rodriguez speaking on stage",
  dimensions: { width: 1600, height: 1200 },
};

const latestProjects = [...projects]
  .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
  .slice(0, 3);

const pages: Record<string, PhaseOnePageContent> = {
  home: {
    uid: "home",
    path: "/",
    title: "Paul Rodriguez | Solutions Architect",
    metaTitle: "Paul Rodriguez | Solutions Architect",
    metaDescription:
      "Solutions Architect focused on technical discovery, enterprise platforms, and scalable system design across client-facing, high-stakes digital initiatives.",
    hero: {
      firstName: "Paul",
      lastName: "Rodriguez",
      introLines: [
        "Solutions architect.",
        "Technical translator.",
        "Client-facing builder for high-stakes digital work.",
      ],
      stageImage,
    },
    homeSkillsMarquee: {
      heading: "Skills",
      items: [
        "Solution Architecture",
        "Technical Discovery",
        "Enterprise Systems",
        "API Integrations",
        "Stakeholder Alignment",
        "Client-Facing Delivery",
        "GSAP",
        "React",
        "Next.js",
        "Accessibility",
      ],
    },
    homeProjects: {
      heading: "Latest Projects",
      items: latestProjects,
    },
    homeTestimonials: {
      heading: "Testimonials",
      items: [
        {
          quote:
            "Paul brings a rare mix of technical confidence, design instinct, and calm communication when the work gets complicated.",
          name: "Former teammate",
          role: "Client delivery / engineering",
        },
        {
          quote:
            "He can walk from implementation detail to business context without losing the room, which makes him incredibly effective with clients.",
          name: "Cross-functional collaborator",
          role: "Strategy and product",
        },
        {
          quote:
            "When projects get messy, Paul is the kind of person you want in the middle of it. He makes the next move obvious.",
          name: "Project partner",
          role: "Digital delivery",
        },
      ],
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
      firstName: "About",
      lastName: "Paul",
      title: "Solutions Architect, strategic advisor, and technical translator",
      description: [
        {
          type: "paragraph",
          text: "I help teams make better technical decisions by connecting product goals, buyer needs, and implementation reality. That work often lives somewhere between architecture, discovery, pre-sales, and delivery strategy.",
        },
        {
          type: "paragraph",
          text: "I care a lot about clarity. Good architecture is not just diagrams and systems. It is making sure the right people understand the tradeoffs, the risks, and the next move.",
        },
      ],
      avatar: avatarImage,
      textLeftColumn: false,
    },
    textSections: [
      {
        heading: "Approach",
        text: [
          {
            type: "paragraph",
            text: "My approach is practical, business-aware, and grounded in real delivery. I like work that requires both technical depth and judgment.",
          },
        ],
      },
    ],
  },
  contact: {
    uid: "contact",
    path: "/contact",
    title: "Contact Paul Rodriguez",
    metaTitle: "Contact Paul Rodriguez",
    metaDescription:
      "Get in touch with Paul Rodriguez about solutions architecture, technical discovery, enterprise platforms, and strategic technical consulting.",
    contact: {
      heading: "Let’s talk",
      intro: [
        {
          type: "paragraph",
          text: "If you need help with technical discovery, solution architecture, enterprise platforms, or client-facing technical strategy, send me a note.",
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
    textSections: [
      {
        heading: "Projects",
        text: [
          {
            type: "paragraph",
            text: "Selected work is being reorganized around solutions architecture, business impact, and implementation outcomes. More detailed case studies are coming next.",
          },
        ],
      },
    ],
  },
  "silver-tech-help": {
    uid: "silver-tech-help",
    path: "/silver-tech-help",
    title: "Silver Tech Help",
    metaTitle: "Silver Tech Help | Paul Rodriguez",
    metaDescription:
      "Silver Tech Help offers approachable, practical technology support for people who want calm guidance and clear next steps.",
    textSections: [
      {
        heading: "Silver Tech Help",
        text: [
          {
            type: "paragraph",
            text: "Silver Tech Help is practical, patient technology support for people who want less confusion and more confidence using the tools in front of them.",
          },
          {
            type: "paragraph",
            text: "This part of the site is being refreshed, but the core idea stays the same: real help, plain language, and no unnecessary jargon circus.",
          },
        ],
      },
    ],
  },
};

function imageToPrismicField(image?: SiteImage | null) {
  if (!image?.url) return { url: "", alt: "", dimensions: undefined };

  return {
    url: image.url,
    alt: image.alt ?? "",
    dimensions: image.dimensions,
  };
}

function renderRichText(blocks: RichTextBlock[], className?: string) {
  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "heading2") {
          return (
            <Heading key={index} as="h2" size="md" className="mb-4 text-gray-50">
              {block.text}
            </Heading>
          );
        }

        if (block.type === "heading3") {
          return (
            <Heading key={index} as="h3" size="sm" className="mb-3 text-gray-50">
              {block.text}
            </Heading>
          );
        }

        if (block.type === "list-item") {
          return (
            <li key={index} className="ml-5 list-disc text-gray-50">
              {block.text}
            </li>
          );
        }

        return (
          <p key={index} className="mb-4 text-gray-50 last:mb-0">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function HeroSectionBlock({ hero }: { hero: HeroSection }) {
  return (
    <section className="relative overflow-hidden bg-[#0b1117] px-4 py-16 md:px-6 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.16),transparent_30%)]" />
      <Bounded>
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Paul Rodriguez
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-7xl">
              <span className="block">{hero.firstName}</span>
              <span className="block text-cyan-300">{hero.lastName}</span>
            </h1>
            <div className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-black/30 p-6 shadow-2xl shadow-cyan-950/30">
              {hero.introLines.map((line) => (
                <div key={line} className="flex items-start gap-3 text-lg text-slate-100 md:text-2xl">
                  <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span>{line}</span>
                </div>
              ))}
              <div className="pt-2 font-mono text-sm uppercase tracking-[0.3em] text-cyan-200/80">
                typing on the screen behind it
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[2rem] bg-cyan-400/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <Image
                src={hero.stageImage.url}
                alt={hero.stageImage.alt || ""}
                width={hero.stageImage.dimensions?.width || 1600}
                height={hero.stageImage.dimensions?.height || 1200}
                className="h-auto w-full rounded-[1.5rem] object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-x-[12%] top-[10%] rounded-2xl border border-cyan-300/20 bg-slate-950/70 px-5 py-4 font-mono text-xs uppercase tracking-[0.25em] text-cyan-200 shadow-xl shadow-black/40 md:text-sm">
                <div className="mb-3 flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="space-y-2">
                  <div>{"> architecting digital systems"}</div>
                  <div>{"> aligning business and build reality"}</div>
                  <div className="text-amber-300">{"> typing..."}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Bounded>
    </section>
  );
}

function SkillsMarqueeSectionBlock({ section }: { section: HomeSkillMarqueeSection }) {
  const marqueeItems = [...section.items, ...section.items];

  return (
    <section className="overflow-hidden border-y border-white/10 bg-[#0d141b] py-8">
      <Bounded className="mb-4">
        <Heading as="h2" size="sm" className="uppercase tracking-[0.35em] text-cyan-200">
          {section.heading}
        </Heading>
      </Bounded>
      <div className="overflow-hidden whitespace-nowrap">
        <div className="inline-flex min-w-full animate-[marquee_24s_linear_infinite] gap-8 px-4 py-3 text-lg font-semibold uppercase tracking-[0.2em] text-slate-100 md:text-2xl">
          {marqueeItems.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
              <MdCircle className="text-amber-400" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeProjectsSectionBlock({ section }: { section: HomeProjectsSection }) {
  return (
    <section className="bg-[#0b1117] py-16 md:py-24">
      <Bounded>
        <div className="mb-10 flex items-end justify-between gap-6">
          <Heading as="h2" size="lg" className="text-white">
            {section.heading}
          </Heading>
          <Link href="/projects" className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200 transition hover:text-cyan-100">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {section.items.map((project) => (
            <Link
              key={project.uid}
              href={project.href}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.08]"
            >
              {project.hoverImage?.url && (
                <Image
                  src={project.hoverImage.url}
                  alt={project.hoverImage.alt || project.title}
                  width={project.hoverImage.dimensions?.width || 900}
                  height={project.hoverImage.dimensions?.height || 625}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              )}
              <div className="space-y-4 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  {project.clientName}
                </div>
                <Heading as="h3" size="sm" className="text-white">
                  {project.title}
                </Heading>
                <ul className="space-y-2 text-sm text-slate-200">
                  {(project.description ?? []).slice(0, 2).map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </Bounded>
    </section>
  );
}

function HomeTestimonialsSectionBlock({ section }: { section: HomeTestimonialsSection }) {
  return (
    <section className="bg-[#101820] py-16 md:py-24">
      <Bounded>
        <Heading as="h2" size="lg" className="mb-10 text-white">
          {section.heading}
        </Heading>
        <div className="grid gap-6 md:grid-cols-3">
          {section.items.map((item) => (
            <article
              key={`${item.name}-${item.role}`}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-lg shadow-black/20"
            >
              <p className="text-lg leading-8 text-slate-100">“{item.quote}”</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="font-semibold uppercase tracking-[0.18em] text-cyan-200">{item.name}</div>
                <div className="mt-1 text-sm text-slate-300">{item.role}</div>
              </div>
            </article>
          ))}
        </div>
      </Bounded>
    </section>
  );
}

function BiographySectionBlock({ biography }: { biography: BiographySection }) {
  const textLeftColumn = biography.textLeftColumn === true;
  const avatar = imageToPrismicField(biography.avatar);

  return (
    <Bounded className="">
      <div
        className={`mb-8 grid gap-x-8 gap-y-6 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-8 md:grid-cols-[${textLeftColumn ? "2fr,1fr" : "1fr,2fr"}] md:pl-16`}
        data-speed=".2"
      >
        {!textLeftColumn && biography.avatar?.url && (
          <Avatar image={avatar as never} className="row-start-1 max-w-sm md:col-start-1 md:row-end-1" />
        )}
        <div className={`${!textLeftColumn && "md:col-start-2"}`}>
          <h2 className="mb-4 font-extrabold leading-none tracking-tight text-gray-50 md:mb-8">
            <span className="text-gray-50">{biography.firstName}</span>
            <span className="inline text-gray-50 md:ml-4">{biography.lastName}</span>
          </h2>

          <span className="sofia-cond block bg-gradient-to-tr from-amber-600 via-amber-200 to-amber-600 bg-clip-text font-bold uppercase italic tracking-wide text-transparent">
            {biography.title}
          </span>

          <div className="prose col-start-1 mt-4 text-gray-50 md:mt-10 prose-p:text-gray-50">
            {renderRichText(biography.description)}
          </div>

          {biography.buttonText && biography.buttonHref && (
            <Button
              href={biography.buttonHref}
              label={biography.buttonText}
              className="mx-auto mt-10 md:mx-0"
              icon={<BsPersonLinesFill className="-mt-1 inline-block" />}
              target={biography.buttonTarget}
            />
          )}
        </div>
        {textLeftColumn && biography.avatar?.url && (
          <Avatar image={avatar as never} className="row-start-1 max-w-sm md:col-start-2 md:row-end-3" />
        )}
      </div>
    </Bounded>
  );
}

function ExperienceSection({ heading, items }: { heading: string; items: ExperienceItem[] }) {
  return (
    <section className="wrapper overflow-hidden">
      <Bounded as="div" className="mb-8">
        <Heading
          as="h3"
          size="xl"
          className="sofia-extra-cond global-center-align mt-4 uppercase italic tracking-wide text-gray-50"
        >
          {heading}
        </Heading>
        <div className="space-y-8 md:space-y-16">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex rounded-xl bg-gradient-to-b from-gray-900 to-gray-800 px-16 py-12"
            >
              <div className="w-full">
                <Heading as="h4" size="md" className="font-extrabold italic tracking-wide text-gray-50">
                  {item.title}
                </Heading>
                <div className="mt-1 text-lg font-medium italic tracking-wide text-amber-500">
                  {item.institution}
                </div>
                <div className="mt-1 flex flex-col font-semibold tracking-widest text-gray-400 md:mt-2 md:flex-row md:justify-between">
                  {item.location && <span className="uppercase">{item.location}</span>}
                  {item.timePeriod && <span className="font-normal text-gray-100">{item.timePeriod}</span>}
                </div>
                <ul className="bullet-markers prose mt-4 text-gray-50 prose-p:mb-0 prose-em:text-gray-50 prose-ul:w-full">
                  {item.description.map((line, lineIndex) => (
                    <li key={lineIndex}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Bounded>
    </section>
  );
}

function SkillsSectionBlock({ skills }: { skills: SkillsSection }) {
  const columnCount = Math.min(skills.columns.length, 4);

  return (
    <section>
      <Bounded as="div">
        <div
          className="mb-8 grid rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-8 md:px-16"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {skills.columns.map((column, i) => (
            <div key={i} className="p-2 text-gray-50">
              <ul className="space-y-3">
                {column.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Bounded>
    </section>
  );
}

function TextSectionBlock({ section }: { section: SimpleTextSection }) {
  return (
    <Bounded>
      <div className="max-w-prose text-blue-50">
        {section.heading && (
          <Heading as="h2" size="md" className="mb-4 text-blue-50">
            {section.heading}
          </Heading>
        )}
        {renderRichText(section.text)}
      </div>
    </Bounded>
  );
}

function ImageSectionBlock({ section }: { section: ImageSection }) {
  const image = (
    <Image
      src={section.image.url}
      alt={section.image.alt || ""}
      width={section.image.dimensions?.width || 1200}
      height={section.image.dimensions?.height || 800}
      className="lazyload not-prose rounded-lg"
    />
  );

  return (
    <div className="my-10 block px-4 md:my-14 md:flex md:px-6 lg:my-16">
      {section.href ? <Link href={section.href}>{image}</Link> : image}
    </div>
  );
}

function ContactSectionBlock({ contact }: { contact: ContactSection }) {
  return (
    <Bounded>
      <div className="grid grid-cols-1 items-center gap-6">
        <Heading size="lg" as="h1" className="text-blue-50">
          {contact.heading}
        </Heading>
        <div className="max-w-prose text-gray-50">{renderRichText(contact.intro)}</div>
        <div className="flex flex-wrap gap-4">
          <Button href="mailto:hello@prodriguez.dev" label="Email Paul" icon={<MdEmail />} />
          <Button href={siteSettings.socialLinks.find((link) => link.platform === "linkedin")?.href} label="LinkedIn" icon={<FaLinkedin />} target="_blank" />
          <Button href={siteSettings.socialLinks.find((link) => link.platform === "github")?.href} label="GitHub" icon={<FaGithub />} target="_blank" />
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<script type="text/javascript" src="https://form.jotform.com/jsform/240918105932152"></script>',
          }}
        />
      </div>
    </Bounded>
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
      {page.hero && <HeroSectionBlock hero={page.hero} />}
      {page.homeSkillsMarquee && <SkillsMarqueeSectionBlock section={page.homeSkillsMarquee} />}
      {page.homeProjects && <HomeProjectsSectionBlock section={page.homeProjects} />}
      {page.homeTestimonials && <HomeTestimonialsSectionBlock section={page.homeTestimonials} />}
      {page.biography && <BiographySectionBlock biography={page.biography} />}
      {page.experiences && (
        <ExperienceSection heading={page.experiences.heading} items={page.experiences.items} />
      )}
      {page.skills && <SkillsSectionBlock skills={page.skills} />}
      {page.textSections?.map((section, index) => (
        <TextSectionBlock key={`${page.uid}-text-${index}`} section={section} />
      ))}
      {page.imageSection && <ImageSectionBlock section={page.imageSection} />}
      {page.contact && <ContactSectionBlock contact={page.contact} />}
    </>
  );
}
