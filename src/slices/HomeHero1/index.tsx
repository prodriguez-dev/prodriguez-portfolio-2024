import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import image from "next/image";

/**
 * Props for `HomeHero1`.
 */
export type HomeHero1Props = SliceComponentProps<Content.HomeHero1Slice>;

/**
 * Component for "HomeHero1" Slices.
 */
const HomeHero1 = ({ slice }: HomeHero1Props): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="home-hero-1 bg-no-repeat bg-cover object-fit -mt-32 w-100 pt-24 pb-48 bg-[url('/bg/paul-stage-bg-ext-optim.svg')]"
    >
      <h1 className="center">Hello</h1>
      <PrismicNextImage
        field={slice.primary.avatar}
        className="object-fit ml-auto w-36 mr-96"
        imgixParams={{ q: 90 }}
        placeholder="empty"
        priority
      />

      {/* <div className="background-gradient absolute inset-0 -z-50 max-h-screen" />
      <div className="pointer-events-none absolute inset-0 -z-40 h-full bg-[url('/bg/paul-stage-optim.svg')] opacity-80 mix-blend-soft-light md:-mt-4">
        Hello
      </div> */}
    </section>
  );
};

export default HomeHero1;
