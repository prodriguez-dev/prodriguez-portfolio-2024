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
};

export default function Button({
  linkField,
  label,
  className,
  icon,
  target,
}: ButtonProps) {
  return (
    <PrismicNextLink
      field={linkField}
      target={target}
      className={clsx(
        "border-master group relative flex w-fit items-center justify-center overflow-hidden rounded-md border-2 bg-yellow-800 px-4 py-2 font-bold tracking-wide text-yellow-50 transition-all duration-300 ease-out hover:scale-105 hover:text-yellow-950",
        className,
      )}
    >
      <span
        className={clsx(
          "group-hover: absolute inset-0 z-0 h-full translate-y-9 bg-yellow-500  transition-transform duration-300 ease-in-out group-hover:translate-y-0",
        )}
      />
      <span className="relative flex items-center justify-center gap-2">
        {label}
        {icon && icon}
      </span>
    </PrismicNextLink>
  );
}
