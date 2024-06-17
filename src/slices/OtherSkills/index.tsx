"use client";

import Bounded from "@/components/Bounded";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef } from "react";
import { MdCircle } from "react-icons/md";
import s from "./OtherSkills.module.scss";

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
      className={clsx("overflow-hidden")}
      ref={component}
    >
      <Bounded as="div" className="relative">
        <div className="md:mb-12">
        {isFilled.image(slice.primary.background) && (
          <PrismicNextImage
            field={slice.primary.background}
            className="mb-6 md:mb-10"
            placeholder="empty"
            priority
          />
        )}
        <div className={clsx(s.wrapper, "flex flex-col justify-center")}>
          <h3
            className={clsx(
              s.headline,
              "mx-auto mb-1 justify-self-center font-black uppercase tracking-wide text-gray-900",
            )}
          >
            {slice.primary.heading}
          </h3>
        </div>
        <div
        className={clsx(
          s.skills,
          "sofia-extra-cond mx-auto flex flex-col justify-between gap-3 overflow-hidden font-black uppercase text-gray-900 opacity-70 mix-blend-hard-light",
        )}
      >
        {renderRepeatedSkills(firstThird)}
        {renderRepeatedSkills(secondThird)}
        {renderRepeatedSkills(thirdThird)}
      </div>
        </div>
      </Bounded>
    </section>
  );

  function renderRepeatedSkills(skills: Skill[]) {
    return (
      <div
        className={clsx(
          s.tech_row,
          "tech-row flex items-center justify-center gap-1 md:gap-4",
        )}
      >
        {[...Array(4)].map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex}>
            {skills.map(({ skill_name }, index) => (
              <React.Fragment key={index}>
                <span className="tech-item flex items-center whitespace-nowrap">
                  {skill_name}
                </span>
                <span className={s.bullet}>
                  <MdCircle className="-mt-1 md:mt-0" />
                </span>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  }
};

export default OtherSkills;
