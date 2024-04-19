import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
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
    <PrismicNextImage
      field={slice.primary.image}
      imgixParams={{ w: 1200, q: 70 }}
      className="lazyload not-prose my-10 h-full w-full rounded-lg md:my-14 lg:my-16"
    />
  );
};

export default ImageBlock;
