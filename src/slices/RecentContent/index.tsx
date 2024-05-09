import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import ContentList from "@/components/ContentList";
import Heading from "@/components/Heading";
import { createClient } from "@/prismicio";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { MdViewList } from "react-icons/md";

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
  const client = createClient();
  const contentType = slice.primary.content_type || "Blog";

  let items: Array<Content.BlogPostDocument | Content.ProjectDocument>;

  if (contentType === "Blog") {
    items = await client.getAllByType("blog_post");
  } else {
    items = await client.getAllByType("project");
  }

  items = items
    .filter((item) => item.data.date) // Continue filtering out null dates
    .sort((a, b) => {
      return (
        new Date(b.data.date!.toString()).getTime() -
        new Date(a.data.date!.toString()).getTime()
      );
    })
    .slice(0, 3); // Get only the first three items from the sorted array

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="bg-blue-400 pb-10 md:rounded-xl">
        <Heading
          size="md"
          className="stroke-headline sofia-extra-cond mb-8 uppercase italic tracking-wide text-blue-50"
        >
          {slice.primary.heading}
        </Heading>
        <div className="">
          {isFilled.richText(slice.primary.description) && (
            <div className="prose prose-xl mb-10">
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
          <ContentList
            items={items}
            contentType={slice.primary.content_type}
            viewMoreText={slice.primary.view_more_text}
            fallbackItemImage={slice.primary.fallback_item_image}
          />
          <div className="mx-auto w-fit">
            <Button
              linkField={slice.primary.button_link}
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
