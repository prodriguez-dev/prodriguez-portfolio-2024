"use client";

import Avatar from "@/components/Avatar";
import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import { Content, KeyTextField, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { BsFillPersonFill, BsPersonLinesFill } from "react-icons/bs";
import s from "./Biography.module.scss";

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
      className=""
    >
      <div
        className={`mb-8 grid gap-x-8 gap-y-6 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-8 md:grid-cols-[${textLeftColumn ? "2fr,1fr" : "1fr,2fr"}] md:pl-16`}
        data-speed=".2"
      >
        {!textLeftColumn && (
          <Avatar
            image={slice.primary.avatar}
            className="row-start-1 max-w-sm md:col-start-1 md:row-end-1"
          />
        )}
        <div className={`${!textLeftColumn && "md:col-start-2"}`}>
          <h2
            className={clsx(
              s.bio_headline,
              "mb-4 font-extrabold leading-none tracking-tight text-gray-50 md:mb-8",
            )}
            aria-label={
              slice.primary.first_name + " " + slice.primary.last_name
            }
          >
            <span className="text-gray-50">
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            <span className="inline text-gray-50 md:ml-4">
              {renderLetters(slice.primary.last_name, "last")}
            </span>
          </h2>

          <span
            className={clsx(
              s.job_title,
              "sofia-cond job-title block bg-gradient-to-tr from-amber-600 via-amber-200 to-amber-600 bg-clip-text font-bold uppercase italic tracking-wide text-transparent opacity-0",
            )}
          >
            {slice.primary.title}
          </span>

          <div
            className={clsx(
              s.bio_text,
              "prose col-start-1 mt-4 text-gray-50 md:mt-10",
            )}
          >
            <PrismicRichText field={slice.primary.description} />
          </div>

          {isFilled.keyText(slice.primary.button_text) && isFilled.link(slice.primary.button_link) &&
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
          }
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
