import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

export function NameLogo({ name }: { name: string }) {
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const logoElement = logoRef.current;

    if (!logoElement) return;

    let hoverAnimation: gsap.Tween | null = null;

    // Function to start the typewriting animation
    const startTypewritingAnimation = () => {
      hoverAnimation = gsap.fromTo(
        logoElement.querySelectorAll("span"),
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.2,
          ease: "power1.in",
          stagger: {
            amount: 0.2,
            from: "start",
          },
        },
      );
    };

    // Function to stop the typewriting animation
    const stopTypewritingAnimation = () => {
      if (hoverAnimation) {
        hoverAnimation.kill(); // Kill the animation
        hoverAnimation = null;
      }
    };

    // Mouse enter event
    const handleMouseEnter = () => {
      startTypewritingAnimation();
    };

    // Mouse leave event
    const handleMouseLeave = () => {
      stopTypewritingAnimation();
    };

    // Add event listeners
    logoElement.addEventListener("mouseenter", handleMouseEnter);
    logoElement.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup function
    return () => {
      // Remove event listeners
      logoElement.removeEventListener("mouseenter", handleMouseEnter);
      logoElement.removeEventListener("mouseleave", handleMouseLeave);

      // Stop the animation if component unmounts
      stopTypewritingAnimation();
    };
  }, []);

  // Wrap each letter in a span for animation
  const logoLetters = name
    .split("")
    .map((letter, index) => <span key={index}>{letter}</span>);

  return (
    <Link
      href="/"
      aria-label="Home page"
      className="text-xl font-extrabold tracking-normal text-slate-300"
      ref={logoRef}
    >
      {logoLetters}
    </Link>
  );
}

export default NameLogo;
