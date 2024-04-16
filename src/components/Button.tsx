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
        "group relative flex w-fit items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-slate-700 px-4 py-2 font-bold tracking-wide text-slate-50 transition-transform ease-out  hover:scale-105",
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
        {icon && icon}
      </span>
    </PrismicNextLink>
  );
}
