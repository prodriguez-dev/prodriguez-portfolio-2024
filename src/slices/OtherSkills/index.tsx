"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef } from "react";
import { MdCircle } from "react-icons/md";

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

  const thirdPoint = Math.ceil(slice.items.length / 3);
  const firstThird = slice.items.slice(0, thirdPoint);
  const secondThird = slice.items.slice(thirdPoint, thirdPoint * 2);
  const thirdThird = slice.items.slice(thirdPoint * 2);

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
          className="sofia-extra-cond stroke-headline mb-1 uppercase italic tracking-wide text-[#418a91]"
          as="h2"
        >
          {slice.primary.heading}
        </Heading>
      </Bounded>

      <div className="flex flex-col justify-between gap-0 text-lg font-bold uppercase italic text-[#418a91] opacity-65 mix-blend-darken md:text-7xl md:font-black">
        {renderRepeatedSkills(firstThird)}
        {renderRepeatedSkills(secondThird)}
        {renderRepeatedSkills(thirdThird)}
      </div>
    </section>
  );

  function renderRepeatedSkills(skills: Skill[]) {
    return (
      <div className="tech-row flex items-center justify-center gap-1 md:gap-3">
        {[...Array(4)].map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex}>
            {skills.map(({ skill_name }, index) => (
              <>
                <span
                  key={index}
                  className="tech-item flex items-center whitespace-nowrap"
                >
                  {skill_name}
                </span>
                <span className="text-[6px] md:text-xs">
                  <MdCircle className="-mt-1 md:mt-0" />
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
