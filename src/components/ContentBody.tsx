import { PrismicRichText, SliceZone } from "@prismicio/react";
import { Content, isFilled } from "@prismicio/client";

import { components } from "@/slices";
import Heading from "@/components/Heading";
import Bounded from "@/components/Bounded";
import { formatDate } from "@/utils/formatDate";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import Button from "@/components/Button";

export default function ContentBody({
  page,
}: {
  page: Content.BlogPostDocument | Content.ProjectDocument;
}) {
  const formattedDate = formatDate(page.data.date);

  return (
    <Bounded as="article">
      <div className="px-4">
        <Heading as="h1" className="border-b border-slate-600 pb-3">
          {page.data.title}
        </Heading>
        <div className="mt-6 flex flex-row flex-wrap gap-2 text-sky-500 md:gap-4">
          {page.tags.map((tag, index) => (
            <span
              key={index}
              className="w-fit whitespace-nowrap rounded-full bg-slate-900 px-2 text-sm font-bold tracking-wide md:px-3 md:text-lg"
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
        <div className="flex md:flex-row">
          <div>
            <p className="mt-8 text-xl font-extrabold text-sky-400 md:text-2xl">
              {formattedDate}
            </p>
            {isFilled.keyText(page.data.client_name) && (
              <p className="mt-3 text-xl font-medium text-slate-300">
                Client:{" "}
                <span className="ml-1 font-extrabold text-sky-400 md:text-2xl">
                  {page.data.client_name}
                </span>
              </p>
            )}
            {isFilled.richText(page.data.description) && (
              <div className="prose prose-lg prose-slate prose-invert col-start-1 mt-3">
                <PrismicRichText field={page.data.description} />
              </div>
            )}
            {isFilled.link(page.data.link) && (
              <Button
                linkField={page.data.link}
                label="Visit Site"
                className="mt-8 text-xl font-medium text-slate-300"
              />
            )}
          </div>
          {isFilled.link(page.data.link) ? (
            <PrismicNextLink field={page.data.link}>
              {isFilled.image(page.data.hover_image) && (
                <PrismicNextImage
                  field={page.data.hover_image}
                  imgixParams={{ w: 600 }}
                  className="not-prose transition-transform hover:scale-105"
                />
              )}
            </PrismicNextLink>
          ) : (
            <>
              {isFilled.image(page.data.hover_image) && (
                <div>
                  <PrismicNextImage
                    field={page.data.hover_image}
                    imgixParams={{ w: 600 }}
                    className="not-prose"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}
