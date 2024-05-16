import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";
import { KeyTextField } from "@prismicio/client";

gsap.registerPlugin(SplitText);

export function NameLogo({ name }: { name: KeyTextField | null }) {
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const [hovering, setHovering] = useState(false);
  let splitTextRef = useRef<SplitText | null>(null);

  useEffect(() => {
    const logoElement = logoRef.current;

    if (!logoElement) return;

    splitTextRef.current = new SplitText(logoElement, {
      type: "chars",
      charsClass: "char",
    });

    const startTypewritingAnimation = () => {
      const chars = splitTextRef.current?.chars;
      if (chars) {
        gsap.fromTo(
          chars,
          {
            x: gsap.utils.random(-30, 30),
            y: gsap.utils.random(-20, 20),
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.08,
            stagger: 0.08,
            ease: "expoScale(0.5,7,none)",
          },
        );
      }
    };

    const stopTypewritingAnimation = () => {
      const chars = splitTextRef.current?.chars;
      if (chars) {
        gsap.killTweensOf(chars);
      }
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

    // Cleanup function
    return () => {
      logoElement.removeEventListener("mouseenter", handleMouseEnter);

      stopTypewritingAnimation();
    };
  }, []);

  const logoName = name ? name : "Logo";

  return (
    <Link
      href="/"
      aria-label="Home page"
      className="namelogo font-extrabold tracking-normal text-[#f7efd8]"
      ref={logoRef}
    >
      {logoName}
    </Link>
  );
}

export default NameLogo;
