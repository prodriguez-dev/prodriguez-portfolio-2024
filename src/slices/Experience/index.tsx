"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";
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
      // create as many GSAP animations and/or ScrollTriggers here as you want...
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
              ? gsap.utils.random(30, 30)
              : gsap.utils.random(-30, -30);
          },
        },
        {
          x: (index) => {
            return index % 2 === 0
              ? gsap.utils.random(-30, -30)
              : gsap.utils.random(30, 30);
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
      <Bounded as="div">
        <Heading
          as="h3"
          size="md"
          className="sofia-extra-cond uppercase italic tracking-wide text-slate-400"
        >
          {slice.primary.heading}
        </Heading>
        {slice.items.map((item, index) => (
          <div
            key={index}
            className={`experience ml-6 mt-8 flex max-w-prose rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 px-8 py-7 md:mt-16`}
          >
            <div className="w-full">
              <Heading
                as="h3"
                size="sm"
                className="font-extrabold italic tracking-wide text-sky-100"
              >
                {item.title}
              </Heading>

              <div className="mt-1 flex w-fit items-center justify-start gap-1 text-xl font-light italic tracking-wider text-sky-300 md:text-3xl">
                {item.institution}
              </div>

              <div className="mt-2 flex flex-col text-lg font-extrabold tracking-widest text-slate-600 md:flex-row md:justify-between md:text-xl">
                {Boolean(item.location) && (
                  <span className="uppercase ">{item.location}</span>
                )}
                {Boolean(item.time_period) && (
                  <span className="font-normal text-sky-600">
                    {item.time_period}
                  </span>
                )}
              </div>
              <div className="prose prose-xl prose-invert -ml-2 mt-4">
                <PrismicRichText field={item.description} />
              </div>
            </div>
          </div>
        ))}
      </Bounded>
    </section>
  );
};

export default Experience;
