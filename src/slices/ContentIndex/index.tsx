import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import ContentList from "@/components/ContentList";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
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
  const client = createClient();
  const blogPosts = await client.getAllByType("blog_post");
  const projects = await client.getAllByType("project");

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
    });

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading
        size="xl"
        className="sofia-extra-cond mb-8 uppercase italic tracking-wide text-slate-400"
      >
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
    </Bounded>
  );
};

export default ContentIndex;
