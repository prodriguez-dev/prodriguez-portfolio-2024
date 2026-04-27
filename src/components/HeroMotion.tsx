"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import clsx from "clsx";

type HeroMotionProps = {
  tagline: string;
  firstName: string;
  lastName: string;
  body: string;
  primaryCta: React.ReactNode;
  secondaryCta: React.ReactNode;
};

export default function HeroMotion({
  tagline,
  firstName,
  lastName,
  body,
  primaryCta,
  secondaryCta,
}: HeroMotionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const nameRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const ctaWrapRef = useRef<HTMLDivElement | null>(null);
  const [typedCount, setTypedCount] = useState(0);

  const taglineChars = useMemo(() => Array.from(tagline), [tagline]);
  const typedTagline = taglineChars.slice(0, typedCount).join("");
  const isTypingDone = typedCount >= taglineChars.length;

  useEffect(() => {
    setTypedCount(0);
    const startDelay = window.setTimeout(() => {
      let index = 0;
      const interval = window.setInterval(() => {
        index += 1;
        setTypedCount(index);
        if (index >= taglineChars.length) {
          window.clearInterval(interval);
        }
      }, 38);

      return () => window.clearInterval(interval);
    }, 300);

    return () => window.clearTimeout(startDelay);
  }, [taglineChars]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(nameRefs.current, {
        y: 80,
        rotate: -3,
        opacity: 0,
      });

      gsap.set([bodyRef.current, ctaWrapRef.current], {
        y: 24,
        opacity: 0,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(nameRefs.current[0], {
        y: 0,
        rotate: 0,
        opacity: 1,
        duration: 0.85,
        ease: "elastic.out(1, 0.7)",
        delay: 0.05,
      })
        .to(
          nameRefs.current[1],
          {
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.85,
            ease: "elastic.out(1, 0.7)",
          },
          0.17,
        )
        .to(
          bodyRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          0.38,
        )
        .to(
          ctaWrapRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          0.55,
        );

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!cursorRef.current || !isTypingDone) return;
    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.25,
      overwrite: true,
    });
  }, [isTypingDone]);

  return (
    <div ref={containerRef} className="relative z-10 w-full max-w-[860px] lg:max-w-[660px] xl:max-w-[700px] 2xl:max-w-[760px] xl:pl-4 2xl:pl-8">
      <p
        ref={taglineRef}
        className="mb-6 flex min-h-[24px] items-center font-[var(--font-sofia-sans-condensed)] text-[16px] font-extrabold uppercase italic tracking-[0.18em] text-[#f3ab68]"
      >
        <span>{typedTagline}</span>
        <span
          ref={cursorRef}
          className={clsx("ml-1 inline-block h-5 w-[2px] bg-[#f0a05a]", isTypingDone && "opacity-0")}
        />
      </p>
      <h1 className="font-[var(--font-sofia-sans-extra-condensed)] text-[clamp(3.9rem,12vw,10rem)] font-black uppercase italic leading-[0.9] tracking-[-0.01em] text-[#ede9e1] sm:text-[clamp(5.5rem,10vw,11.5rem)] lg:text-[clamp(6.5rem,9vw,12rem)]">
        {[firstName, lastName].map((part, index) => (
          <span
            key={part}
            ref={(node) => {
              nameRefs.current[index] = node;
            }}
            className="block whitespace-nowrap"
          >
            {part}
          </span>
        ))}
      </h1>
      <p ref={bodyRef} className="mt-6 max-w-[34rem] text-[18px] font-medium leading-8 text-[rgba(237,233,225,0.86)] sm:text-[19px]">
        {body}
      </p>
      <div ref={ctaWrapRef} className="mt-10 flex flex-wrap gap-4 sm:gap-5">
        {primaryCta}
        {secondaryCta}
      </div>
    </div>
  );
}
