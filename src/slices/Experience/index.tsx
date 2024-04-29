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
      <Bounded as="div">
        <Heading
          as="h3"
          size="md"
          className="sofia-extra-cond uppercase italic tracking-wide text-blue-50"
        >
          {slice.primary.heading}
        </Heading>
        {slice.items.map((item, index) => (
          <div
            key={index}
            className={`experience to-blue-[950] ml-6 mt-8 flex max-w-prose rounded-xl bg-gradient-to-b from-neutral-950 px-8 py-7 md:mt-16`}
          >
            <div className="w-full">
              <Heading
                as="h4"
                size="sm"
                className="font-extrabold italic tracking-wide text-blue-50"
              >
                {item.title}
              </Heading>

              <div className="mt-1 flex w-fit items-center justify-start gap-1 text-2xl font-medium italic tracking-wide text-blue-500 md:text-3xl">
                {item.institution}
              </div>

              <div className="mt-1 flex flex-col text-lg font-extrabold tracking-widest text-blue-800 md:mt-2 md:flex-row md:justify-between md:text-xl">
                {Boolean(item.location) && (
                  <span className="uppercase ">{item.location}</span>
                )}
                {Boolean(item.time_period) && (
                  <span className="font-normal text-blue-600">
                    {item.time_period}
                  </span>
                )}
              </div>
              <div className="prose-md bullet-markers prose prose-invert -ml-2 mt-0 tracking-wide text-blue-50 md:prose-xl md:mt-4">
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
