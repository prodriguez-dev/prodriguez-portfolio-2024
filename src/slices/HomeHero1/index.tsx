import Bounded from "@/components/Bounded";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import gsap from "gsap";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

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
      className="home-hero-1 -mt-32 bg-[url('/bg/paul-stage-bg-blue-2.svg')] bg-cover bg-no-repeat object-cover pt-24"
    >
      <Bounded>
        <div className="mx-36 mb-36 mt-48 flex">
          {isFilled.keyText(slice.primary.description) && (
            <h2>{slice.primary.description}</h2>
          )}
          <PrismicNextImage
            field={slice.primary.avatar}
            className="object-fit w-36"
            imgixParams={{ q: 90 }}
            placeholder="empty"
            priority
          />
        </div>
      </Bounded>
    </section>
  );
};

export default HomeHero1;
