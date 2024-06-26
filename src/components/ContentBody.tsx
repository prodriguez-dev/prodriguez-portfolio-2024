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
      <div className="rounded-xl bg-gray-900 px-0 py-4 md:px-4">
        <Heading
          as="h1"
          className="border-b border-gray-100 pb-3 text-gray-50"
          size="lg"
        >
          {page.data.title}
        </Heading>
        <div className="global-text-sm mt-6 flex flex-row flex-wrap gap-2 text-gray-900 md:gap-4">
          {page.tags.map((tag, index) => (
            <span
              key={index}
              className="global-text-sm w-fit whitespace-nowrap rounded-full bg-gray-500 px-2  font-bold tracking-wide md:px-3"
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
        <div className="mt-5 flex flex-col px-4 tracking-wide md:mt-14 md:flex-row md:px-6">
          <div>
            <p className="global-text-md font-bold text-gray-50">
              {formattedDate}
            </p>
            {isFilled.keyText(page.data.client_name) && (
              <p className="global-text-md mt-2 font-light text-gray-50 md:mt-3">
                Client:{" "}
                <span className="ml-1 font-extrabold text-gray-400">
                  {page.data.client_name}
                </span>
              </p>
            )}
            {isFilled.richText(page.data.description) && (
              <div className="global-text-sm bullet-markers prose prose-lg prose-invert col-start-1 -ml-2 mt-1 text-gray-50 md:mt-5">
                <PrismicRichText field={page.data.description} />
              </div>
            )}
            {isFilled.link(page.data.link) && (
              <Button
                linkField={page.data.link}
                label="Visit Site"
                className="mx-auto mt-8 md:mx-0"
              />
            )}
          </div>
          {isFilled.image(page.data.hover_image) && (
            <div className="col-span-1 mt-8 block md:ml-auto md:mt-0 md:flex">
              {isFilled.link(page.data.link) ? (
                <PrismicNextLink field={page.data.link} className="img-shine">
                  <PrismicNextImage
                    field={page.data.hover_image}
                    imgixParams={{ w: 600, q: 70 }}
                    className="lazy-load not-prose rounded-lg"
                  />
                </PrismicNextLink>
              ) : (
                <PrismicNextImage
                  field={page.data.hover_image}
                  imgixParams={{ w: 600, q: 70 }}
                  className="lazy-load not-prose rounded-lg"
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
