"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import clsx from "clsx";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import s from "./Testimonials.module.scss";

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
          <div className={s.testimonial_wrapper}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={{ delay: 4000 }}
              loop
              pagination={{ clickable: true }}
              navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
              spaceBetween={50}
              slidesPerView={1}
              speed={1000}
            >
              {slice.items.map((item, index) => (
                <SwiperSlide key={index} className={clsx(s.testimonial, "tracking-wide")}>
                  {isFilled.image(item.picture) &&
                    <PrismicNextImage
                      field={item.picture}
                      className={clsx(s.image, "justify-self-center")}
                      imgixParams={{ w: 100, q: 90 }}
                      placeholder="empty"
                      priority
                    />
                  }
                  {isFilled.keyText(item.name) && (
                    <Heading as="h4" className="global-text-md w-fit justify-self-center text-gray-50">
                      {item.name}
                    </Heading>
                  )}
                  {isFilled.keyText(item.title) && (
                    <Heading as="h5" className={clsx(s.title, "global-text-mdsm w-fit justify-self-center text-amber-400")}>
                      {item.title}
                    </Heading>
                  )}
                  {isFilled.richText(item.testimonial) &&
                    <div className={s.info}>
                      <PrismicRichText field={item.testimonial} />
                    </div>
                  }
                </SwiperSlide>
              ))}
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
              <div className="swiper-pagination"></div>
            </Swiper>
          </div>
        )}
      </Bounded>
    </section>
  );
};

export default Testimonials;
