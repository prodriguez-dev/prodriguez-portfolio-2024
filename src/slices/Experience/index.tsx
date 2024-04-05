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
              ? gsap.utils.random(50, 50)
              : gsap.utils.random(-50, -50);
          },
        },
        {
          x: (index) => {
            return index % 2 === 0
              ? gsap.utils.random(-50, -50)
              : gsap.utils.random(50, 50);
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
        <Heading as="h3" size="md">
          {slice.primary.heading}
        </Heading>
        {slice.items.map((item, index) => (
          <div
            key={index}
            className={`experience ml-6 mt-8 max-w-prose ${index % 2 === 0 ? "md:ml-12" : "md:m6-12 md:ml-auto"} flex md:mt-16`}
          >
            <div className={`w-full ${index % 2 === 0 ? "" : "text-left"}`}>
              <Heading as="h3" size="sm">
                {item.title}
              </Heading>

              <div className="mt-1 flex w-fit items-center justify-start gap-1 text-2xl font-semibold tracking-tight text-slate-400 md:text-3xl">
                {item.institution}
              </div>
              <div className="text-1xl mt-1 flex justify-start gap-4 text-yellow-400 md:text-2xl">
                {item.time_period}
              </div>
              <div className="prose prose-lg prose-invert mt-4">
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
