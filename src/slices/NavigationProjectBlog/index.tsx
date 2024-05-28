import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

/**
 * Props for `NavigationProjectBlog`.
 */
export type NavigationProjectBlogProps =
  SliceComponentProps<Content.NavigationProjectBlogSlice>;

/**
 * Component for "NavigationProjectBlog" Slices.
 */
const NavigationProjectBlog = ({
  slice,
}: NavigationProjectBlogProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="flex justify-between">
        {isFilled.link(slice.primary.prev_link) && (
          <Button
            linkField={slice.primary.prev_link}
            label={`Prev ${slice.primary.nav_type}`}
            className="nav-proj-blog global-text-sm"
            icon={<FaArrowLeft />}
            iconPosition="left"
          />
        )}
        {isFilled.link(slice.primary.next_link) && (
          <Button
            linkField={slice.primary.next_link}
            label={`Next ${slice.primary.nav_type}`}
            className="nav-proj-blog global-text-sm"
            icon={<FaArrowRight />}
          />
        )}
      </div>
    </Bounded>
  );
};

export default NavigationProjectBlog;
