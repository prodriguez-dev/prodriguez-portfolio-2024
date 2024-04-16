"use client";

import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdCircle } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  skill_name: string | null;
}

/**
 * Props for `OtherSkills`.
 */
export type OtherSkillsProps = SliceComponentProps<Content.OtherSkillsSlice>;

/**
 * Component for "OtherSkills" Slices.
 */
const OtherSkills = ({ slice }: OtherSkillsProps): JSX.Element => {
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
        ".tech-row",
        {
          x: (index) => {
            return index % 2 === 0
              ? gsap.utils.random(600, 400)
              : gsap.utils.random(-600, -400);
          },
        },
        {
          x: (index) => {
            return index % 2 === 0
              ? gsap.utils.random(-600, -400)
              : gsap.utils.random(600, 400);
          },
          ease: "power1.inOut",
        },
      );
    }, component);
    return () => ctx.revert(); // cleanup!
  }, []);

  const midPoint = Math.ceil(slice.items.length / 2);
  const firstHalf = slice.items.slice(0, midPoint);
  const secondHalf = slice.items.slice(midPoint);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="wrapper overflow-hidden"
      ref={component}
    >
      <Bounded as="div">
        <Heading
          size="md"
          className="sofia-extra-cond mb-1 uppercase italic tracking-wide text-slate-400"
          as="h2"
        >
          {slice.primary.heading}
        </Heading>
      </Bounded>

      <div className="text-1xl flex flex-col justify-between gap-1 font-extrabold uppercase italic text-sky-900 md:gap-3 md:text-3xl">
        {renderRepeatedSkills(firstHalf)}
        {renderRepeatedSkills(secondHalf)}
      </div>
    </section>
  );

  function renderRepeatedSkills(skills: Skill[]) {
    return (
      <div className="tech-row flex items-center justify-center gap-1 md:gap-5">
        {[...Array(3)].map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex}>
            {skills.map(({ skill_name }, index) => (
              <>
                <span
                  key={index}
                  className="tech-item flex items-center whitespace-nowrap"
                >
                  {skill_name}
                </span>
                <span className="text-xs">
                  <MdCircle />
                </span>
              </>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  }
};

export default OtherSkills;
