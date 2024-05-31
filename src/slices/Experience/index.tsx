"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";
import clsx from "clsx";
import s from "./Experience.module.scss";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Props for `Experience`.
 */
export type ExperienceProps = SliceComponentProps<Content.ExperienceSlice>;

/**
 * Component for "Experience" Slices.
 */
const Experience = ({ slice }: ExperienceProps): JSX.Element => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          pin: true, // pin the trigger element while active
          start: "top bottom",
          end: "bottom top",
          scrub: 4,
        },
      });

      tl.fromTo(
        ".experience",
        {
          x: (index) => {
            return index % 2 === 0
              ? gsap.utils.random(20, 20)
              : gsap.utils.random(-20, -20);
          },
        },
        {
          x: (index) => {
            return index % 2 === 0
              ? gsap.utils.random(-20, -20)
              : gsap.utils.random(20, 20);
          },
          ease: "power2.inOut",
        },
      );
    }, component);
    return () => ctx.revert(); // cleanup!
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="wrapper overflow-hidden"
      ref={component}
    >
      <Bounded as="div" className="mb-8">
        <Heading
          as="h3"
          size="xl"
          className="sofia-extra-cond mt-4 uppercase italic tracking-wide text-gray-50"
        >
          {slice.primary.heading}
        </Heading>
        <div className="space-y-8 md:space-y-16">
          {slice.items.map((item, index) => (
            <div
              key={index}
              className={clsx(
                s.container,
                "experience flex rounded-xl bg-gradient-to-b from-gray-900 to-gray-800 px-16 py-12",
              )}
            >
              <div className="w-full">
                <Heading
                  as="h4"
                  size="md"
                  className="font-extrabold italic tracking-wide text-gray-50"
                >
                  {item.title}
                </Heading>

                <div
                  className={clsx(
                    s.institution,
                    "mt-1 text-lg font-medium italic tracking-wide text-amber-500",
                  )}
                >
                  {item.institution}
                </div>

                <div
                  className={clsx(
                    s.location,
                    "mt-1 flex flex-col font-semibold tracking-widest text-gray-400 md:mt-2 md:flex-row md:justify-between",
                  )}
                >
                  {Boolean(item.location) && (
                    <span className="uppercase">{item.location}</span>
                  )}
                  {Boolean(item.time_period) && (
                    <span className="font-normal text-gray-100">
                      {item.time_period}
                    </span>
                  )}
                </div>
                <div
                  className={clsx(
                    s.description,
                    "bullet-markers prose mt-4 text-gray-50",
                  )}
                >
                  <PrismicRichText field={item.description} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Bounded>
    </section>
  );
};

export default Experience;
