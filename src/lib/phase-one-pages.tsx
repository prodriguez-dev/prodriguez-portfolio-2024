import Avatar from "@/components/Avatar";
import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { absoluteUrl, buildDescription, buildOgImage, buildPageTitle, getSiteDefaults } from "@/lib/metadata";
import { getPhaseOnePage, siteSettings, type SiteImage } from "@/lib/site-content";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

type RichTextBlock = {
  type: "paragraph" | "heading2" | "heading3" | "list-item";
  text: string;
};

type HeroSection = {
  firstName: string;
  lastName: string;
  tagLine: string;
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
      tagLine: "Solutions Architect",
    },
    biography: {
      firstName: "Paul",
      lastName: "Rodriguez",
      title: "Trusted technical partner for high-stakes enterprise work",
      description: [
        {
          type: "paragraph",
          text: "I work at the intersection of technical discovery, solution design, and stakeholder alignment. My focus is helping teams translate business goals into practical architecture decisions that can actually ship.",
        },
        {
          type: "paragraph",
          text: "My background spans client-facing engineering, enterprise platforms, APIs, security-aware systems, and implementation work where communication matters as much as the technical design.",
        },
      ],
      buttonText: "View Resume",
      buttonHref: "https://www.prodriguez.dev/resume",
      buttonTarget: "_blank",
      avatar: avatarImage,
    },
    experiences: {
      heading: "Experience",
      items: [
        {
          title: "Solutions Architect",
          institution: "Liberty Blume",
          location: "Denver, CO",
          timePeriod: "Starting May 2026",
          description: [
            "Supporting Blume Business Solutions with solutions architecture, technical discovery, and client-facing design work.",
            "Helping connect stakeholder goals, product requirements, and scalable implementation paths.",
          ],
        },
        {
          title: "Sales Engineer and Technical Advisor",
          institution: "Enterprise SaaS and platform teams",
          location: "Remote / Hybrid",
          timePeriod: "Recent years",
          description: [
            "Led discovery conversations, technical demos, and architecture discussions for complex buyer journeys.",
            "Worked across APIs, integrations, security questions, implementation planning, and cross-functional communication.",
          ],
        },
      ],
    },
    skills: {
      columns: [
        [
          "Technical discovery",
          "Solution architecture",
          "Enterprise systems",
          "API integrations",
        ],
        [
          "Stakeholder communication",
          "Pre-sales engineering",
          "Implementation strategy",
          "Business alignment",
        ],
        [
          "Security-aware design",
          "Client-facing delivery",
          "Cross-functional leadership",
          "English / Spanish",
        ],
      ],
    },
    textSections: [
      {
        heading: "What I do best",
        text: [
          {
            type: "paragraph",
            text: "I’m strongest in situations where the technical path is not obvious yet, the business stakes are real, and someone needs to turn ambiguity into a clear plan.",
          },
        ],
      },
    ],
    imageSection: {
      image: stageImage,
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

function HeroSection({ hero }: { hero: HeroSection }) {
  return (
    <Bounded>
      <div className="grid min-h-[70vh] grid-cols-1 items-center md:grid-cols-2">
        <div className="col-start-1 md:row-start-1">
          <h1
            className="mb-8 text-[clamp(3rem,10vmin,20rem)] font-extrabold leading-none"
            aria-label={`${hero.firstName} ${hero.lastName}`}
          >
            <span className="block text-blue-50">{hero.firstName}</span>
            <span className="-mt-[.2em] block text-blue-50">{hero.lastName}</span>
          </h1>
          <span className="md:text-4x1 block bg-gradient-to-tr from-blue-500 via-blue-200 to-blue-500 bg-clip-text text-4xl font-bold uppercase tracking-[.2em] text-transparent">
            {hero.tagLine}
          </span>
        </div>
      </div>
    </Bounded>
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
      {page.hero && <HeroSection hero={page.hero} />}
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
