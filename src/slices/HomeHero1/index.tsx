"use client";

import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef } from "react";
import s from "./HomeHero1.module.scss";

gsap.registerPlugin(SplitText);

/**
 * Props for `HomeHero1`.
 */
export type HomeHero1Props = SliceComponentProps<Content.HomeHero1Slice>;

/**
 * Component for "HomeHero1" Slices.
 */
const HomeHero1 = ({ slice }: HomeHero1Props): JSX.Element => {
  const component = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const bgBackgroundRef = useRef(null);

  useEffect(() => {
    // Initialize animations immediately
    let ctx = gsap.context(() => {
      const masterTimeline = gsap.timeline();

      // Image animation
      masterTimeline.fromTo(
        imageRef.current,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          duration: 1.0,
          opacity: 1,
          scale: 1,
          ease: "Power3.easeOut",
        },
      );

      // Text animation
      if (textRef.current) {
        const split = new SplitText(textRef.current, { type: "words" });
        const textTimeline = gsap.timeline();
        split.words.forEach((word, index) => {
          textTimeline.from(
            word,
            {
              duration: 0.8,
              y: 50,
              opacity: 0,
              ease: "Power3.easeOut",
              force3D: true,
            },
            index * 0.1,
          );
        });
        masterTimeline.add(textTimeline, "+=0.5");
      }
    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx(s.home_hero_section, "bg-gray-800")}
    >
      {isFilled.image(slice.primary.background) && (
        <div className={s.home_hero_bg_wrapper} ref={bgBackgroundRef}>
          <PrismicNextImage
            field={slice.primary.background}
            className={clsx(s.home_hero_bg)}
            imgixParams={{ q: 70 }}
            placeholder="empty"
            priority
          />
        </div>
      )}
      <div className={clsx(s.hero_bounded_wrapper)}>
        <div className={s.hero_bounded}>
          {isFilled.richText(slice.primary.description) && (
            <div ref={textRef} className={clsx(s.hero_text, "text-gray-900")}>
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
          {isFilled.image(slice.primary.avatar) && (
            <div ref={imageRef}>
              <PrismicNextImage
                field={slice.primary.avatar}
                className={s.hero_image}
                imgixParams={{ q: 90 }}
                placeholder="empty"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeHero1;
