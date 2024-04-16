import { KeyTextField } from "@prismicio/client";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function NameLogo({ name }: { name: KeyTextField }) {
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const logoElement = logoRef.current;

    if (!logoElement) return;

    // Function to start the typewriting animation
    const startTypewritingAnimation = () => {
      gsap.fromTo(
        logoElement.querySelectorAll("span"),
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
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
      gsap.killTweensOf(logoElement.querySelectorAll("span")); // Kill the animation
    };

    // Mouse enter event
    const handleMouseEnter = () => {
      setHovering(true);
      startTypewritingAnimation();
    };

    // Mouse leave event
    const handleMouseLeave = () => {
      setHovering(false);
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
    ? name.split("").map((letter, index) => <span key={index}>{letter}</span>)
    : null;

  return (
    <Link
      href="/"
      aria-label="Home page"
      className="text-2xl font-extrabold tracking-normal text-slate-300"
      ref={logoRef}
    >
      {logoLetters}
    </Link>
  );
}

export default NameLogo;
