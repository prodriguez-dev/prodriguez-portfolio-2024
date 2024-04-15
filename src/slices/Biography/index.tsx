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
      gsap
        .timeline()
        .fromTo(
          ".name-animation",
          {
            x: -100,
            opacity: 0,

            scaleX: 0,
          },
          {
            x: 0,
            opacity: 1,

            scaleX: 1,
            ease: "elastic.inOut",
            duration: 1,
            transformOrigin: "left top",
            stagger: {
              each: 0.05,
              from: "start",
            },
          },
        )

        .fromTo(
          ".job-title",
          {
            y: 33,
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
    return () => ctx.revert(); // Cleanup
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
      {slice.primary.text_left_column === true ? (
        <div
          className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]"
          data-speed=".2"
        >
          <div>
            <h1
              className="mb-8 text-[clamp(4rem,9vmin,20rem)] font-extrabold leading-none tracking-tight"
              aria-label={
                slice.primary.first_name + " " + slice.primary.last_name
              }
            >
              <span className="text-slate-300">
                {renderLetters(slice.primary.first_name, "first")}
              </span>
              <span className="block text-slate-300 md:ml-3 md:inline">
                {renderLetters(slice.primary.last_name, "last")}
              </span>
            </h1>
            <span className="sofia-cond job-title block bg-gradient-to-tr from-sky-500 via-sky-100 to-sky-500 bg-clip-text text-2xl font-bold uppercase italic tracking-wide text-transparent opacity-0 md:text-4xl">
              {slice.primary.title}
            </span>

            <div className="type-animation prose prose-2xl prose-slate prose-invert col-start-1 mt-10">
              <PrismicRichText field={slice.primary.description} />
            </div>

            <Button
              linkField={slice.primary.button_link}
              label={slice.primary.button_text}
              className="mt-10"
            />
          </div>
          <Avatar
            image={slice.primary.avatar}
            className="row-start-1 max-w-sm md:col-start-2 md:row-end-3"
          />
        </div>
      ) : (
        <div
          className="grid gap-x-8 gap-y-6 md:grid-cols-[1fr,2fr]"
          data-speed=".2"
        >
          <Avatar
            image={slice.primary.avatar}
            className="row-start-1 max-w-sm md:col-start-1 md:row-end-1"
          />
          <div>
            <h1
              className="mb-8 text-[clamp(4rem,9vmin,20rem)] font-extrabold leading-none tracking-tight"
              aria-label={
                slice.primary.first_name + " " + slice.primary.last_name
              }
            >
              <span className="text-slate-300">
                {renderLetters(slice.primary.first_name, "first")}
              </span>
              <span className="block text-slate-300 md:ml-3 md:inline">
                {renderLetters(slice.primary.last_name, "last")}
              </span>
            </h1>
            <span className="sofia-cond job-title block bg-gradient-to-tr from-sky-500 via-sky-100 to-sky-500 bg-clip-text text-2xl font-bold uppercase italic tracking-wide text-transparent opacity-0 md:text-4xl">
              {slice.primary.title}
            </span>

            <div className="type-animation prose prose-2xl prose-slate prose-invert col-start-1 mt-10">
              <PrismicRichText field={slice.primary.description} />
            </div>

            <Button
              linkField={slice.primary.button_link}
              label={slice.primary.button_text}
              className="mt-10 text-xl font-medium text-slate-300"
            />
          </div>
        </div>
      )}
    </Bounded>
  );
};

export default Biography;
