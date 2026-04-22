import Bounded from "@/components/Bounded";
import ContentList from "@/components/ContentList";
import Heading from "@/components/Heading";
import { getContentEntries } from "@/lib/content-data";
import type { SiteImage } from "@/lib/content-types";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
/**
 * Props for `ContentIndex`.
 */
export type ContentIndexProps = SliceComponentProps<Content.ContentIndexSlice>;

/**
 * Component for "ContentIndex" Slices.
 */
const ContentIndex = async ({
  slice,
}: ContentIndexProps): Promise<JSX.Element> => {
  const contentType = slice.primary.content_type || "Blog";
  const items = getContentEntries(contentType);
  const fallbackItemImage =
    isFilled.image(slice.primary.fallback_item_image)
      ? {
          url: slice.primary.fallback_item_image.url,
          alt: slice.primary.fallback_item_image.alt || "",
          dimensions: slice.primary.fallback_item_image.dimensions,
        }
      : undefined;

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="pb-10 md:rounded-xl">
        <Heading
          size="xl"
          className="sofia-extra-cond global-center-align my-10 uppercase italic tracking-wide text-gray-50"
        >
          {slice.primary.heading}
        </Heading>
        {isFilled.richText(slice.primary.description) && (
          <div className="prose prose-xl prose-invert mb-10 text-gray-50">
            <PrismicRichText field={slice.primary.description} />
          </div>
        )}
        <ContentList
          items={items}
          contentType={slice.primary.content_type}
          viewMoreText={slice.primary.view_more_text}
          fallbackItemImage={fallbackItemImage as SiteImage | undefined}
        />
      </div>
    </Bounded>
  );
};

export default ContentIndex;
