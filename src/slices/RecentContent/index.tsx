import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import ContentList from "../ContentIndex/ContentList";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import Button from "@/components/Button";

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
  const blogPosts = await client.getAllByType("blog_post");
  const projects = await client.getAllByType("project");

  const contentType = slice.primary.content_type || "Blog";

  let items = contentType === "Blog" ? blogPosts : projects;

  // Filter the items to only include the first three
  items = items.slice(0, 3);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading size="md" className="mb-8">
        {slice.primary.heading}
      </Heading>
      {isFilled.richText(slice.primary.description) && (
        <div className="prose prose-xl prose-invert mb-10">
          <PrismicRichText field={slice.primary.description} />
        </div>
      )}
      <ContentList
        items={items}
        contentType={slice.primary.content_type}
        viewMoreText={slice.primary.view_more_text}
        fallbackItemImage={slice.primary.fallback_item_image}
      />
      <Button
        linkField={slice.primary.button_link}
        label={slice.primary.button_text}
        className="mt-6"
      />
    </Bounded>
  );
};

export default RecentContent;
