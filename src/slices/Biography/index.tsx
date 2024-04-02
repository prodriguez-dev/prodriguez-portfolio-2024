"use client";

import Avatar from "@/components/Avatar";
import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import { Content, KeyTextField } from "@prismicio/client";

import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * Props for `Biography`.
 */
export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

/**
 * Component for "Biography" Slices.
 */
const Biography = ({ slice }: BiographyProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // create as many GSAP animations and/or ScrollTriggers here as you want...
      gsap
        .timeline()
        .fromTo(
          ".name-animation",
          { x: -100, opacity: 0, rotate: -10 },
          {
            x: 0,
            opacity: 1,
            rotate: 0,

            ease: "elastic.out(1,0.3)",
            duration: 1,
            transformOrigin: "left top",
            stagger: { each: 0.1, from: "random" },
          },
        )
        .fromTo(
          ".job-title",
          {
            y: 20,
            opacity: 0,
            scale: 1.2,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scale: 1,
            ease: "elastic.out(1,0.3)",
          },
        );
    }, component);
    return () => ctx.revert(); // cleanup!
  }, []);

  const renderLetters = (name: KeyTextField, key: string) => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <span
        key={index}
        className={`name-animation name-animation-${key}-index inline-block opacity-0 `}
      >
        {letter}
      </span>
    ));
  };

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div
        className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]"
        data-speed=".2"
      >
        <div>
          {/* <div className="col-start-1 md:row-start-1 " data-speed=".2"> */}
          <h1
            className="mb-8 text-[clamp(3rem,10vmin,20rem)] font-extrabold leading-none tracking-tighter"
            aria-label={
              slice.primary.first_name + " " + slice.primary.last_name
            }
          >
            <span className=" text-slate-300 ">
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            <span className="ml-6  text-slate-300">
              {renderLetters(slice.primary.last_name, "last")}
            </span>
          </h1>
          <span className="job-title block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-2xl font-bold uppercase text-transparent opacity-0 md:text-3xl">
            {slice.primary.title}
          </span>

          <div className="prose prose-xl prose-slate prose-invert col-start-1 mt-6">
            <PrismicRichText field={slice.primary.description} />
          </div>

          <Button
            linkField={slice.primary.button_link}
            label={slice.primary.button_text}
            className="mt-6"
          />
        </div>

        <Avatar
          image={slice.primary.avatar}
          className="row-start-1 max-w-sm md:col-start-2 md:row-end-3"
        />
      </div>
    </Bounded>
  );
};

export default Biography;
