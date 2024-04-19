import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `ImageBlock`.
 */
export type ImageBlockProps = SliceComponentProps<Content.ImageBlockSlice>;

/**
 * Component for "ImageBlock" Slices.
 */
const ImageBlock = ({ slice }: ImageBlockProps): JSX.Element => {
  return (
    <div className="my-10 block px-4 md:my-14 md:flex md:px-6 lg:my-16">
      {isFilled.link(slice.primary.image_link) ? (
        <PrismicNextLink field={slice.primary.image_link}>
          <PrismicNextImage
            field={slice.primary.image}
            imgixParams={{ w: 1200, q: 70 }}
            className="lazyload not-prose rounded-lg"
          />
        </PrismicNextLink>
      ) : (
        <PrismicNextImage
          field={slice.primary.image}
          imgixParams={{ w: 1200, q: 70 }}
          className="lazyload not-prose rounded-lg"
        />
      )}
    </div>
  );
};

export default ImageBlock;
