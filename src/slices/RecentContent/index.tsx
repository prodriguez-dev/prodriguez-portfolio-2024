import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `RecentContent`.
 */
export type RecentContentProps =
  SliceComponentProps<Content.RecentContentSlice>;

/**
 * Component for "RecentContent" Slices.
 */
const RecentContent = ({ slice }: RecentContentProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for recent_content (variation: {slice.variation})
      Slices
    </section>
  );
};

export default RecentContent;
