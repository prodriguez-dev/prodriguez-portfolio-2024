import Bounded from "@/components/Bounded";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import type { ContentEntry, ContentSlice, RichTextBlock } from "@/lib/content-types";

function renderRichText(blocks: RichTextBlock[]) {
  return blocks.map((block, index) => {
    if (block.type === "heading2") {
      return (
        <Heading key={index} as="h2" size="md" className="mb-4 text-blue-50">
          {block.text}
        </Heading>
      );
    }

    if (block.type === "heading3") {
      return (
        <Heading key={index} as="h3" size="sm" className="mb-3 text-blue-50">
          {block.text}
        </Heading>
      );
    }

    if (block.type === "list-item") {
      return (
        <li key={index} className="ml-5 list-disc text-gray-50">
          {block.text}
        </li>
      );
    }

    return (
      <p key={index} className="mb-4 text-gray-50 last:mb-0">
        {block.text}
      </p>
    );
  });
}

function renderSlice(slice: ContentSlice, index: number) {
  if (slice.type === "text") {
    return (
      <div key={index} className="max-w-prose text-blue-50">
        {renderRichText(slice.blocks)}
      </div>
    );
  }

  if (slice.type === "image") {
    const image = (
      <Image
        src={slice.image.url}
        alt={slice.image.alt || ""}
        width={slice.image.dimensions?.width || 1200}
        height={slice.image.dimensions?.height || 800}
        className="lazyload not-prose rounded-lg"
      />
    );

    return (
      <div key={index} className="my-10 block px-4 md:my-14 md:flex md:px-6 lg:my-16">
        {slice.href ? <Link href={slice.href}>{image}</Link> : image}
      </div>
    );
  }

  return (
    <Bounded key={index}>
      <div className="flex justify-between">
        {slice.prev && (
          <Button
            href={slice.prev.href}
            label={slice.prev.label || `Prev ${slice.navType}`}
            className="nav-proj-blog global-text-sm"
            icon={<FaArrowLeft />}
            iconPosition="left"
            target={slice.prev.external ? "_blank" : undefined}
          />
        )}
        {slice.next && (
          <Button
            href={slice.next.href}
            label={slice.next.label || `Next ${slice.navType}`}
            className="nav-proj-blog global-text-sm"
            icon={<FaArrowRight />}
            target={slice.next.external ? "_blank" : undefined}
          />
        )}
      </div>
    </Bounded>
  );
}

export function renderContentEntry(entry: ContentEntry) {
  const formattedDate = entry.date ? formatDate(entry.date) : undefined;

  return (
    <Bounded as="article">
      <div className="rounded-xl bg-gray-900 px-0 py-4 md:px-4">
        <Heading as="h1" className="border-b border-gray-100 pb-3 text-gray-50" size="lg">
          {entry.title}
        </Heading>
        {!!entry.tags?.length && (
          <div className="global-text-sm mt-6 flex flex-row flex-wrap gap-2 text-gray-900 md:gap-4">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="global-text-sm w-fit whitespace-nowrap rounded-full bg-gray-500 px-2 font-bold tracking-wide md:px-3"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-col px-4 tracking-wide md:mt-14 md:flex-row md:px-6">
          <div>
            {formattedDate && <p className="global-text-md font-bold text-gray-50">{formattedDate}</p>}
            {entry.clientName && (
              <p className="global-text-md mt-2 font-light text-gray-50 md:mt-3">
                Client: <span className="ml-1 font-extrabold text-gray-400">{entry.clientName}</span>
              </p>
            )}
            {!!entry.description?.length && (
              <div className="global-text-sm bullet-markers prose prose-lg prose-invert col-start-1 -ml-2 mt-1 text-gray-50 md:mt-5">
                {renderRichText(entry.description)}
              </div>
            )}
            {entry.link && (
              <Button
                href={entry.link.href}
                label={entry.link.label || "Visit Site"}
                className="mx-auto mt-8 md:mx-0"
                target={entry.link.external ? "_blank" : undefined}
              />
            )}
          </div>
          {entry.hoverImage?.url && (
            <div className="col-span-1 mt-8 block md:ml-auto md:mt-0 md:flex">
              {entry.link?.href ? (
                <Link href={entry.link.href} className="img-shine" target={entry.link.external ? "_blank" : undefined}>
                  <Image
                    src={entry.hoverImage.url}
                    alt={entry.hoverImage.alt || ""}
                    width={entry.hoverImage.dimensions?.width || 600}
                    height={entry.hoverImage.dimensions?.height || 400}
                    className="lazy-load not-prose rounded-lg"
                  />
                </Link>
              ) : (
                <Image
                  src={entry.hoverImage.url}
                  alt={entry.hoverImage.alt || ""}
                  width={entry.hoverImage.dimensions?.width || 600}
                  height={entry.hoverImage.dimensions?.height || 400}
                  className="lazy-load not-prose rounded-lg"
                />
              )}
            </div>
          )}
        </div>
        {!!entry.slices?.length && (
          <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
            {entry.slices.map((slice, index) => renderSlice(slice, index))}
          </div>
        )}
      </div>
    </Bounded>
  );
}
