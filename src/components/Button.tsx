import { KeyTextField, LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import React from "react";

type ButtonProps = {
  linkField: LinkField;
  label: KeyTextField;
  className?: string;
  icon?: React.ReactNode;
  target?: string;
  iconPosition?: string;
};

export default function Button({
  linkField,
  label,
  className,
  icon,
  iconPosition = "right",
  target,
}: ButtonProps) {
  return (
    <PrismicNextLink
      field={linkField}
      target={target}
      className={clsx(
        className,
        "group relative flex w-fit items-center justify-center overflow-hidden rounded-md bg-green-800 px-4 py-2 text-xl font-bold tracking-wide no-underline drop-shadow-md transition-all duration-300 ease-out hover:scale-105 hover:text-green-950",
      )}
    >
      <span
        className={clsx(
          "group-hover: absolute inset-0 z-0 h-full translate-y-10 bg-green-500 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
        )}
      />
      <span className="relative flex items-center justify-center gap-2 text-green-50 ">
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
    </PrismicNextLink>
  );
}
