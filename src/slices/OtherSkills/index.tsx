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

/**
 * Props for `OtherSkills`.
 */
export type OtherSkillsProps = SliceComponentProps<Content.OtherSkillsSlice>;

/**
 * Component for "OtherSkills" Slices.
 */
const OtherSkills = ({ slice }: OtherSkillsProps): JSX.Element => {
  const component = useRef(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after the component mounts to indicate client-side rendering
    setIsClient(true);
  }, []);

  // Function to generate a random number between min (inclusive) and max (inclusive)
  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a random number only on the client side
  const randomLength = isClient ? getRandomNumber(14, 22) : 16; // Fallback to a default value on the server

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

      {slice.items.map(({ skill_color, skill_name }, index) => (
        <div
          key={index}
          className="tech-row mb-1 flex items-center justify-center gap-1 font-extrabold italic text-slate-800 md:gap-5"
          aria-label={skill_name || ""}
        >
          {Array.from({ length: randomLength }, (_, index) => (
            <React.Fragment key={index}>
              <span
                className={
                  "tech-item whitespace-nowrap text-2xl font-normal uppercase md:text-4xl"
                }
                style={{
                  color: index === 8 && skill_color ? skill_color : "inherit",
                  fontWeight: index === 8 ? 800 : "inherit",
                }}
              >
                {skill_name}
              </span>
              <span className="md:text-1xl text-xs">
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default OtherSkills;
