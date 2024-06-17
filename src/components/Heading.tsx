import clsx from "clsx";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xl" | "lg" | "md" | "sm";
  children: React.ReactNode;
  className?: string;
  style?: any;
  ref?: any;
};

export default function Heading({
  as: Comp = "h1",
  className,
  children,
  size = "lg",
  style,
  ref,
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        className,
        "font-bold leading-tight",
        size === "xl" && "global-text-xl",
        size === "lg" && "global-text-lg",
        size === "md" && "global-text-md",
        size === "sm" && "global-text-sm",
      )}
      style={style}
      ref={ref}
    >
      {children}
    </Comp>
  );
}
