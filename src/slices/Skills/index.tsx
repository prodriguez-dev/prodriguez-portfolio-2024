import Bounded from "@/components/Bounded";
import { Content, isFilled } from "@prismicio/client";
import clsx from "clsx";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import s from "./Skills.module.scss";

/**
 * Props for `Skills`.
 */
export type SkillsProps = SliceComponentProps<Content.SkillsSlice>;

/**
 * Component for "Skills" Slices.
 */
const Skills = ({ slice }: SkillsProps): JSX.Element => {
  // Filter the items to count only those that have content
  const filledItems = slice.items.filter((item) =>
    isFilled.richText(item.skills_list),
  );

  // Calculate the number of columns based on the number of items
  const columnCount = Math.min(filledItems.length, 4); // Adjust the maximum columns as needed

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Bounded as="div" className="">
        <div
          className="mb-8 grid rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-8 md:px-16"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {filledItems.map((item, i) => (
            <div key={i} className={clsx(s.skills_list, "p-2 text-gray-50")}>
              <PrismicRichText field={item.skills_list} />
            </div>
          ))}
        </div>
      </Bounded>
    </section>
  );
};

export default Skills;
