import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { components } from "@/slices";
import { formatDate } from "@/utils/formatDate";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceZone } from "@prismicio/react";

export default function ContentBody({
  page,
}: {
  page: Content.BlogPostDocument | Content.ProjectDocument;
}) {
  const formattedDate = formatDate(page.data.date);

  return (
    <Bounded as="article">
      <div className="px-0 md:px-4">
        <Heading
          as="h1"
          className="border-b border-yellow-100 pb-3 text-yellow-50"
          size="lg"
        >
          {page.data.title}
        </Heading>
        <div className="mt-6 flex flex-row flex-wrap gap-2 text-yellow-950 md:gap-4">
          {page.tags.map((tag, index) => (
            <span
              key={index}
              className="w-fit whitespace-nowrap rounded-full bg-yellow-600 px-2 text-sm font-bold tracking-wide md:px-3 md:text-lg"
            >
              {tag}
            </span>
          ))}
          {isFilled.richText(page.data.tags) && (
            <span className="tags">
              <PrismicRichText field={page.data.tags} />
            </span>
          )}
        </div>
        <div className="mt-5 flex flex-col tracking-wide md:mt-14 md:flex-row">
          <div className="col-span-1 md:w-[500px]">
            <p className="text-2xl font-extrabold text-yellow-50">
              {formattedDate}
            </p>
            {isFilled.keyText(page.data.client_name) && (
              <p className="mt-2 text-2xl text-yellow-50 md:mt-3">
                Client:{" "}
                <span className="ml-1 font-extrabold text-yellow-500">
                  {page.data.client_name}
                </span>
              </p>
            )}
            {isFilled.richText(page.data.description) && (
              <div className="bullet-markers prose prose-lg prose-invert col-start-1 -ml-2 mt-1 text-yellow-50 md:mt-5">
                <PrismicRichText field={page.data.description} />
              </div>
            )}
            {isFilled.link(page.data.link) && (
              <Button
                linkField={page.data.link}
                label="Visit Site"
                className="mt-8 text-xl"
              />
            )}
          </div>
          {isFilled.image(page.data.hover_image) && (
            <div className="col-span-1 mt-8 block md:ml-auto md:mt-0 md:flex">
              {isFilled.link(page.data.link) ? (
                <PrismicNextLink field={page.data.link}>
                  <PrismicNextImage
                    field={page.data.hover_image}
                    imgixParams={{ w: 600 }}
                    className="not-prose rounded-b-2xl transition-transform duration-700 hover:scale-105 md:rounded-b-3xl"
                  />
                </PrismicNextLink>
              ) : (
                <PrismicNextImage
                  field={page.data.hover_image}
                  imgixParams={{ w: 600 }}
                  className="not-prose"
                />
              )}
            </div>
          )}
        </div>
        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}
