"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { ContentEntry, SiteImage } from "@/lib/content-types";

type ExperienceItem = {
  title: string;
  institution: string;
  location?: string;
  timePeriod?: string;
  description: string[];
};

type ProjectItem = ContentEntry & {
  category: string;
  yearLabel: string;
  award?: boolean;
  fullImage?: SiteImage;
};

export function ExperienceAccordion({ items }: { items: ExperienceItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-10 space-y-4">
      {items.map((item, index) => {
        const isOpen = index === openIndex;

        return (
          <article
            key={`${item.title}-${item.institution}`}
            className={clsx(
              "overflow-hidden rounded-[16px] border bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition duration-200",
              isOpen
                ? "-translate-y-[1px] border-[#bdb8ae] shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
                : "border-[#e0dbd0] hover:-translate-y-[1px] hover:border-[#bdb8ae] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full flex-col gap-3 px-6 py-6 text-left md:flex-row md:items-start md:justify-between"
            >
              <div>
                <h3 className="font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(2rem,4vw,3rem)] font-black uppercase italic leading-none text-[#111111]">
                  {item.title}
                </h3>
                <div className="mt-2 text-[20px] font-black italic text-[#c4621a]">{item.institution}</div>
              </div>
              <div className="flex items-start gap-6 md:text-right">
                <div className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#7a7570] md:text-[15px]">
                  {item.timePeriod && <div>{item.timePeriod}</div>}
                  {item.location && <div className="mt-1">{item.location}</div>}
                </div>
                <span
                  className={clsx(
                    "mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e0dbd0] text-[#c4621a] transition-transform duration-200",
                    isOpen && "rotate-180 border-[#c4621a]",
                  )}
                  aria-hidden="true"
                >
                  ˅
                </span>
              </div>
            </button>
            <div
              className={clsx(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
              )}
            >
              <div className="overflow-hidden">
                <ul className="px-6 pb-6 pt-1 space-y-3 text-[17px] leading-8 text-[#111111] md:text-[18px] md:leading-8">
                  {item.description.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-[0.5em] text-[12px] leading-none text-[#c4621a]">●</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ProjectsExplorer({ categories, items }: { categories: string[]; items: ProjectItem[] }) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || "All");
  const [openUid, setOpenUid] = useState<string | null>(items[0]?.uid || null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                const nextItems = category === "All" ? items : items.filter((item) => item.category === category);
                setOpenUid(nextItems[0]?.uid || null);
              }}
              className={clsx(
                "rounded-full border px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.08em] transition",
                isActive
                  ? "border-[#c4621a] bg-[#c4621a] text-white shadow-[0_8px_18px_rgba(196,98,26,0.18)]"
                  : "border-[#d8d2c7] bg-white text-[#5f5a54] hover:border-[#bdb8ae] hover:text-[#111111]",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="mt-8 space-y-4">
        {filteredItems.map((item) => {
          const isOpen = item.uid === openUid;
          return (
            <article key={item.uid} className="overflow-hidden rounded-[20px] border border-[#e0dbd0] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <button
                type="button"
                onClick={() => setOpenUid(isOpen ? null : item.uid)}
                className="grid w-full gap-4 border-b border-[#e0dbd0] px-5 py-5 text-left transition hover:bg-[#f7f4ee] md:grid-cols-[88px,1fr,120px] md:items-center"
              >
                <div className="relative h-14 overflow-hidden rounded-[12px] bg-[#ede9e1]">
                  {item.hoverImage?.url && <Image src={item.hoverImage.url} alt={item.title} fill className="object-cover" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(1.8rem,4vw,2.8rem)] font-black uppercase italic leading-none text-[#111111]">
                      {item.title}
                    </h3>
                    {item.award && (
                      <span className="rounded-full bg-[#ece8df] px-2.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#c4621a]">
                        Award winning
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(item.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full bg-[#ece8df] px-3.5 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.05em] text-[#666666]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[14px] font-extrabold uppercase tracking-[0.1em] text-[#67625c] md:block md:text-right md:text-[15px]">
                  <div>{item.yearLabel}</div>
                  <div className={clsx("mt-2 text-[#c4621a] transition-transform duration-200", isOpen && "translate-x-1")}>→</div>
                </div>
              </button>
              <div
                className={clsx(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
                )}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-6 p-6 md:grid-cols-[1fr,1.2fr]">
                    <div>
                      <div className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#67625c]">About this project</div>
                      <ul className="mt-4 space-y-3 text-[17px] leading-8 text-[#111111] md:text-[18px] md:leading-8">
                        {(item.description || []).map((line, index) => (
                          <li key={`${item.uid}-${index}`} className="flex items-start gap-3">
                            <span className="mt-[0.5em] text-[12px] leading-none text-[#c4621a]">●</span>
                            <span>{line.text}</span>
                          </li>
                        ))}
                      </ul>
                      {item.link?.href && (
                        <Link
                          href={item.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex rounded-[10px] bg-[#c4621a] px-5.5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:opacity-90"
                        >
                          Visit Site ↗
                        </Link>
                      )}
                    </div>
                    <div className="relative min-h-[260px] overflow-hidden rounded-[12px] bg-[#ede9e1]">
                      {item.fullImage?.url && <Image src={item.fullImage.url} alt={item.title} fill className="object-cover" />}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
