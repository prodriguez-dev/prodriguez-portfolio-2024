import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import ContentList from "@/components/ContentList";
import Heading from "@/components/Heading";
import { getContentEntries } from "@/lib/content-data";
import type { SiteImage } from "@/lib/content-types";
import clsx from "clsx";
import { asLink, Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { MdViewList } from "react-icons/md";
import s from "./RecentContent.module.scss";

/**
 * Props for `RecentContent`.
 */
export type RecentContentProps =
  SliceComponentProps<Content.RecentContentSlice>;

/**
 * Component for "RecentContent" Slices.
 */
const RecentContent = async ({
  slice,
}: RecentContentProps): Promise<JSX.Element> => {
  const contentType = slice.primary.content_type || "Blog";
  const items = getContentEntries(contentType).slice(0, 3);
  const fallbackItemImage =
    isFilled.image(slice.primary.fallback_item_image)
      ? {
          url: slice.primary.fallback_item_image.url,
          alt: slice.primary.fallback_item_image.alt || "",
          dimensions: slice.primary.fallback_item_image.dimensions,
        }
      : undefined;
  const buttonHref = asLink(slice.primary.button_link) || undefined;

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="pb-10 md:rounded-xl md:mb-10">
        <Heading
          size="md"
          className={clsx(s.headline, "global-center-align sofia-extra-cond mb-8 uppercase italic tracking-wide text-gray-50")}
        >
          {slice.primary.heading}
        </Heading>
        <div className="">
          {isFilled.richText(slice.primary.description) && (
            <div className="prose prose-xl mb-10 text-gray-50">
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
          <ContentList
            items={items}
            contentType={slice.primary.content_type}
            viewMoreText={slice.primary.view_more_text}
            fallbackItemImage={fallbackItemImage as SiteImage | undefined}
          />
          <div className="mx-auto w-fit">
            <Button
              href={buttonHref}
              label={slice.primary.button_text}
              className="mt-10"
              icon={<MdViewList className="inline-block" />}
            />
          </div>
        </div>
      </div>
    </Bounded>
  );
};

export default RecentContent;
