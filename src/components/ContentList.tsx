"use client";

import { Content, asImageSrc, isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { FiEye } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

type ContentListProps = {
  items: (Content.BlogPostDocument | Content.ProjectDocument)[];
  contentType: Content.ContentIndexSlice["primary"]["content_type"];
  fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
  viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"];
};

export default function ContentList({
  items,
  contentType,
  fallbackItemImage,
  viewMoreText = "Read More",
}: ContentListProps) {
  const component = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const revealRef = useRef(null);

  const [currentItem, setCurrentItem] = useState<null | number>(null);
  const [hovering, setHovering] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const urlPrefix = contentType === "Blog" ? "/blog" : "/projects";

  useEffect(() => {
    // Animate list-items in with a stagger
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            stagger: 0.2,
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          },
        );
      });

      return () => ctx.revert(); // cleanup!
    }, component);
  }, []);

  useEffect(() => {
    // Mouse move event listener
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };
      // Calculate speed and direction
      const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2));

      let ctx = gsap.context(() => {
        // Animate the image holder
        if (currentItem !== null) {
          const maxY = window.scrollY + window.innerHeight - 360;
          const maxX = window.innerWidth - 320;

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1), // Apply rotation based on speed and direction
            ease: "back.out(2)",
            duration: 1.3,
          });
          gsap.to(revealRef.current, {
            opacity: hovering ? 1 : 0,
            visibility: "visible",
            ease: "power3.out",
            duration: 0.4,
          });
        }
        lastMousePos.current = mousePos;
        return () => ctx.revert(); // cleanup!
      }, component);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hovering, currentItem]);

  const onMouseEnter = (index: number) => {
    setCurrentItem(index);
    if (!hovering) setHovering(true);
  };

  const onMouseLeave = () => {
    setHovering(false);
    setCurrentItem(null);
  };

  const contentImages = items.map((item) => {
    const image = isFilled.image(item.data.hover_image)
      ? item.data.hover_image
      : fallbackItemImage;
    return asImageSrc(image, {
      fit: "crop",
      w: 220,
      h: 140,
      exp: -1,
    });
  });

  // Preload images
  useEffect(() => {
    contentImages.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [contentImages]);

  return (
    <>
      <ul ref={component} className="-z-20 grid" onMouseLeave={onMouseLeave}>
        {items.map((post, index) => (
          <li
            key={index}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            onMouseEnter={() => onMouseEnter(index)}
            className="list-item opacity-0"
          >
            <a
              href={`${urlPrefix}/${post.uid}`}
              className="global-text-lg bg-gray-900 my-4 flex flex-col gap-1 rounded-xl border-t-2 border-t-gray-700 px-8 py-10 text-gray-50 md:flex-row md:justify-between"
              aria-label={post.data.title || ""}
            >
              <div>
                <div className="z-20 font-extrabold tracking-wide text-gray-50">
                  {post.data.title}
                </div>
                <div className="global-text-sm mt-5 flex flex-row flex-wrap gap-2 text-gray-50 md:gap-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="w-fit whitespace-nowrap rounded-full bg-gray-700 px-3 font-bold tracking-wide md:px-4"
                    >
                      {tag}
                    </span>
                  ))}
                  {isFilled.richText(post.data.tags) && (
                    <span className="global-text-sm tags">
                      <PrismicRichText field={post.data.tags} />
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 global-text-mdsm flex h-fit items-center gap-2 whitespace-nowrap tracking-wide text-gray-50 md:mt-0">
                {viewMoreText} <FiEye className="global-text-mdsm" />
              </div>
            </a>
          </li>
        ))}

        {/* Hover element */}
        <div
          className="hover-reveal pointer-events-none absolute left-0 top-0 z-10 h-[140px] w-[220px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
          style={{
            backgroundImage:
              currentItem !== null ? `url(${contentImages[currentItem]})` : "",
          }}
          ref={revealRef}
        ></div>
      </ul>
    </>
  );
}
