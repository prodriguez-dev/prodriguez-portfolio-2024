import { KeyTextField, LinkField, asLink } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

type ButtonProps = {
  linkField?: LinkField | null;
  href?: string;
  label: KeyTextField | string | null;
  className?: string;
  icon?: React.ReactNode;
  target?: string;
  iconPosition?: string;
};

export default function Button({
  linkField,
  href,
  label,
  className,
  icon,
  iconPosition = "right",
  target,
}: ButtonProps) {
  const resolvedHref = href || (linkField ? asLink(linkField) : undefined) || "#";
  const isExternal = target === "_blank" || /^https?:\/\//.test(resolvedHref) || resolvedHref.startsWith("mailto:");
  const buttonClassName = clsx(
    className,
    "button-text group relative flex w-fit items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 py-2 font-bold tracking-wide no-underline drop-shadow-md transition-all duration-300 ease-out hover:scale-105 hover:text-gray-900",
  );
  const content = (
    <>
      <span
        className={clsx(
          "group-hover: absolute inset-0 z-0 h-full translate-y-12 bg-gray-500 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
        )}
      />
      <span className="relative flex items-center justify-center gap-2 text-gray-50 ">
        {iconPosition === "right" && (
          <>
            {label}
            {icon && icon}
          </>
        )}
        {iconPosition === "left" && (
          <>
            {icon && icon}
            {label}
          </>
        )}
      </span>
    </>
  );

  if (linkField) {
    return (
      <PrismicNextLink
        field={linkField}
        target={target}
        className={buttonClassName}
      >
        {content}
      </PrismicNextLink>
    );
  }

  return (
    <Link
      href={resolvedHref}
      target={target}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={buttonClassName}
    >
      {content}
    </Link>
  );
}
