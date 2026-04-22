export type SiteLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type SiteImage = {
  url: string;
  alt?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
};

export type RichTextBlock = {
  type: "paragraph" | "heading2" | "heading3" | "list-item";
  text: string;
};

export type ContentSlice =
  | {
      type: "text";
      blocks: RichTextBlock[];
    }
  | {
      type: "image";
      image: SiteImage;
      href?: string;
    }
  | {
      type: "navigation";
      navType: "Project" | "Blog Post";
      prev?: SiteLink;
      next?: SiteLink;
    };

export type ContentEntry = {
  uid: string;
  title: string;
  date?: string;
  clientName?: string;
  href: string;
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: SiteImage;
  hoverImage?: SiteImage;
  tags?: string[];
  description?: RichTextBlock[];
  link?: SiteLink;
  slices?: ContentSlice[];
};
