"use client";

import React, { useRef, useState, useEffect } from "react";
import { asImageSrc, isFilled } from "@prismicio/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiEye } from "react-icons/fi";
import { Content } from "@prismicio/client";
import page from "@/app/page";
import { PrismicRichText } from "@prismicio/react";

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
      w: 300,
      h: 200,
      exp: -10,
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
      <ul
        ref={component}
        className="grid border-b border-b-slate-100"
        onMouseLeave={onMouseLeave}
      >
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
              className="flex flex-col gap-1 border-t border-t-slate-100 py-10 text-slate-200 md:flex-row md:justify-between"
              aria-label={post.data.title || ""}
            >
              <div>
                <span className="text-3xl font-bold tracking-wide transition-shadow hover:drop-shadow-xl md:text-4xl">
                  {post.data.title}
                </span>
                <div className="mt-5 flex flex-row flex-wrap gap-2 text-slate-900 md:gap-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="w-fit whitespace-nowrap rounded-full bg-sky-600 px-3 text-sm font-bold tracking-wide md:px-4 md:text-lg"
                    >
                      {tag}
                    </span>
                  ))}
                  {isFilled.richText(post.data.tags) && (
                    <span className="tags">
                      <PrismicRichText field={post.data.tags} />
                    </span>
                  )}
                </div>
              </div>
              <span className="mt-4 flex h-fit items-center gap-2 whitespace-nowrap text-lg font-medium tracking-wide transition-shadow hover:drop-shadow-xl md:mt-0">
                {viewMoreText} <FiEye className="text-xl" />
              </span>
            </a>
          </li>
        ))}

        {/* Hover element */}
        <div
          className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[200px] w-[300px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
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
