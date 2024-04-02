import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Contact`.
 */
export type ContactProps = SliceComponentProps<Content.ContactSlice>;

/**
 * Component for "Contact" Slices.
 */
const ContactForm = ({ slice }: ContactProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid grid-cols-1 items-center">
        <Heading size="lg" as="h1">
          {slice.primary.heading}
        </Heading>
        <div className="flex">
          <PrismicRichText field={slice.primary.form} />
        </div>
      </div>
    </Bounded>
  );
};

export default ContactForm;
