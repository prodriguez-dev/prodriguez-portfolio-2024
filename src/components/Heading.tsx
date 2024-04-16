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
        "font-bold leading-tight tracking-tight  text-slate-300",
        size === "xl" && "text-7xl md:text-9xl",
        size === "lg" && "text-5xl md:text-8xl",
        size === "md" && "text-4xl md:text-6xl",
        size === "sm" && "text-2xl md:text-4xl",
        className,
      )}
      style={style}
      ref={ref}
    >
      {children}
    </Comp>
  );
}
