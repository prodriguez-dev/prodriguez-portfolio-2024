"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import dynamic from "next/dynamic";
import s from "./Testimonials.module.scss";
import clsx from "clsx";

// Dynamically import Carousel with SSR disabled
const Carousel = dynamic(
  async () => {
    const mod = await import("nuka-carousel");
    return mod.default || mod.Carousel || mod; // Adjust this line as needed based on the actual exports
  },
  {
    ssr: false,
  },
);

export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

const Testimonials = ({ slice }: TestimonialsProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="wrapper overflow-hidden"
    >
      <Bounded as="div" className="mb-8">
        {isFilled.keyText(slice.primary.heading) && (
          <Heading
            as="h3"
            size="xl"
            className="sofia-extra-cond mt-4 uppercase italic tracking-wide text-gray-50"
          >
            {slice.primary.heading}
          </Heading>
        )}

        {slice.items && (
          <Carousel
            autoplay
            autoplayInterval={3000}
            wrapAround
            speed={1000}
            renderCenterLeftControls={({
              previousSlide,
            }: {
              previousSlide: () => void;
            }) => (
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={previousSlide}
              >
                ◀
              </button>
            )}
            renderCenterRightControls={({
              nextSlide,
            }: {
              nextSlide: () => void;
            }) => (
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={nextSlide}
              >
                ▶
              </button>
            )}
            renderBottomCenterControls={({
              currentSlide,
            }: {
              currentSlide: number;
            }) => (
              <div
                style={{
                  padding: "10px",
                  background: "#fff",
                  borderRadius: "10px",
                }}
              >
                {currentSlide + 1} / {slice.items.length}
              </div>
            )}
          >
            {slice.items.map((item, index) => (
              <div key={index} className={clsx(s.testimonial, "")}>
                {isFilled.keyText(item.name) && (
                  <Heading as="h4" className="">
                    {item.name}
                  </Heading>
                )}
              </div>
            ))}
          </Carousel>
        )}
      </Bounded>
    </section>
  );
};

export default Testimonials;
