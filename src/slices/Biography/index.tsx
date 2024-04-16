"use client";

import Avatar from "@/components/Avatar";
import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import { Content, KeyTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { BsFillPersonFill, BsPersonLinesFill } from "react-icons/bs";

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

  const textLeftColumn = slice.primary.text_left_column === true;
  const resumeButton = slice.primary.resume_button === true;

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div
        className={`grid gap-x-8 gap-y-6 md:grid-cols-[${textLeftColumn ? "2fr,1fr" : "1fr,2fr"}]`}
        data-speed=".2"
      >
        {!textLeftColumn && (
          <Avatar
            image={slice.primary.avatar}
            className="row-start-1 max-w-sm md:col-start-1 md:row-end-1"
          />
        )}
        <div className={`${!textLeftColumn && "md:col-start-2"}`}>
          <h1
            className="mb-4 text-[clamp(4rem,9vmin,20rem)] font-extrabold leading-none tracking-tight md:mb-8"
            aria-label={
              slice.primary.first_name + " " + slice.primary.last_name
            }
          >
            <span className="text-yellow-50">
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            <span className="block text-yellow-50 md:ml-4 md:inline">
              {renderLetters(slice.primary.last_name, "last")}
            </span>
          </h1>

          <span className="sofia-cond job-title block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-3xl font-bold uppercase italic tracking-wide text-transparent opacity-0 md:text-4xl">
            {slice.primary.title}
          </span>

          <div className="prose prose-xl prose-slate prose-invert col-start-1 mt-4 text-yellow-50 md:prose-2xl md:mt-10">
            <PrismicRichText field={slice.primary.description} />
          </div>

          <Button
            linkField={slice.primary.button_link}
            label={slice.primary.button_text}
            className="mx-auto mt-10 md:mx-0"
            icon={
              resumeButton ? (
                <BsPersonLinesFill className="-mt-1 inline-block" />
              ) : (
                <BsFillPersonFill className="-mt-1 inline-block" />
              )
            }
            target={resumeButton ? "_blank" : undefined}
          />
        </div>
        {textLeftColumn && (
          <Avatar
            image={slice.primary.avatar}
            className="row-start-1 max-w-sm md:col-start-2 md:row-end-3"
          />
        )}
      </div>
    </Bounded>
  );
};

export default Biography;
