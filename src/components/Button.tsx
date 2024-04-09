import { PrismicNextLink } from "@prismicio/next";
import React from "react";
import { CgArrowBottomRight } from "react-icons/cg";
import clsx from "clsx";
import { KeyTextField, LinkField } from "@prismicio/client";

type ButtonProps = {
  linkField: LinkField;
  label: KeyTextField;
  showIcon?: boolean;
  className?: string;
};

export default function Button({
  linkField,
  label,
  showIcon = true,
  className,
}: ButtonProps) {
  return (
    <PrismicNextLink
      field={linkField}
      className={clsx(
        "sofia group relative flex w-fit items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-slate-700 px-4 py-2 font-bold tracking-wide text-slate-50 transition-transform ease-out  hover:scale-105",
        className,
      )}
    >
      <span
        className={clsx(
          "group-hover: absolute inset-0 z-0 h-full translate-y-9 bg-sky-600  transition-transform duration-300 ease-in-out group-hover:translate-y-0",
        )}
      />
      <span className="relative flex items-center justify-center gap-2">
        {label}
        {/* {showIcon && <CgArrowBottomRight className="inline-block" />} */}
      </span>
    </PrismicNextLink>
  );
}
