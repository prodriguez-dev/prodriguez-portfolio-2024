"use client";

import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, useState } from "react";
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
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const bgBackgroundRef = useRef(null);
  const loadingTextRef = useRef(null);
  const [isPageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      console.log("Page fully loaded");
      setPageLoaded(true);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (isPageLoaded) {
      console.log("Initializing animations");
      const masterTimeline = gsap.timeline();

      // Fade out the loading text first
      if (loadingTextRef.current) {
        masterTimeline.to(loadingTextRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "Power1.easeOut",
          onComplete: () => {
            gsap.set(loadingTextRef.current, { display: "none" });
          },
        });
      }

      // Background animation
      if (bgBackgroundRef.current) {
        masterTimeline.fromTo(
          bgBackgroundRef.current,
          { opacity: 0, top: 800 },
          { opacity: 1, top: 0, duration: 0.7, ease: "Power3.easeIn" },
        );
      }

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
    }
  }, [isPageLoaded]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx(s.home_hero_section, "bg-[#3d7ef7]")}
    >
      <div
        ref={loadingTextRef}
        className="loading-text"
        style={{
          opacity: 1,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "2rem",
          color: "white",
        }}
      >
        Loading...
      </div>
      {isFilled.image(slice.primary.background) && (
        <div className={s.home_hero_bg_wrapper} ref={bgBackgroundRef}>
          <PrismicNextImage
            field={slice.primary.background}
            className={clsx(s.home_hero_bg, !isPageLoaded && "opacity-0")}
            placeholder="empty"
            priority
          />
        </div>
      )}
      <div className={clsx(s.hero_bounded, !isPageLoaded && "opacity-0")}>
        {isFilled.richText(slice.primary.description) && (
          <div ref={textRef} className={clsx(s.hero_text, "text-blue-950")}>
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
    </section>
  );
};

export default HomeHero1;
