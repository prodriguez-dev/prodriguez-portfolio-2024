import { SliceZone } from "@prismicio/react";
import { Content } from "@prismicio/client";

import { components } from "@/slices";
import Heading from "@/components/Heading";
import Bounded from "@/components/Bounded";
import { formatDate } from "@/utils/formatDate";

export default function ContentBody({
  page,
}: {
  page: Content.BlogPostDocument | Content.ProjectDocument;
}) {
  const formattedDate = formatDate(page.data.date);
  return (
    <Bounded as="article">
      <div className="px-4">
        <Heading as="h1" className="tracking-normal">
          {page.data.title}
        </Heading>
        <div className="mb-3 mt-3 flex flex-row flex-wrap gap-2 text-sky-600 md:gap-4">
          {page.tags.map((tag, index) => (
            <span
              key={index}
              className="w-fit whitespace-nowrap rounded-full bg-slate-900 px-2 text-sm font-bold tracking-wide md:px-3 md:text-lg"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-8 border-b border-slate-600 text-xl font-medium text-slate-300">
          {formattedDate}
        </p>
        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}
