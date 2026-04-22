import fs from "node:fs/promises";
import path from "node:path";
import * as prismic from "@prismicio/client";

const repository = "prodriguez-portfolio-2024";
const client = prismic.createClient(repository);

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function richTextToBlocks(field) {
  if (!Array.isArray(field)) return [];

  return field
    .filter((item) => item && typeof item === "object" && typeof item.text === "string")
    .map((item) => ({
      type:
        item.type === "heading2" || item.type === "heading3" || item.type === "list-item"
          ? item.type
          : "paragraph",
      text: item.text.trim(),
    }))
    .filter((item) => item.text);
}

function richTextToTags(field) {
  return richTextToBlocks(field).map((block) => block.text);
}

function imageFieldToImage(field) {
  if (!field || typeof field !== "object" || typeof field.url !== "string") return undefined;

  return {
    url: field.url,
    alt: typeof field.alt === "string" ? field.alt : "",
    dimensions:
      field.dimensions && typeof field.dimensions === "object"
        ? {
            width: typeof field.dimensions.width === "number" ? field.dimensions.width : undefined,
            height: typeof field.dimensions.height === "number" ? field.dimensions.height : undefined,
          }
        : undefined,
  };
}

function linkFieldToLink(field, fallbackLabel) {
  const href = prismic.asLink(field);
  if (!href) return undefined;

  const external = /^https?:\/\//.test(href);
  return {
    href,
    label: fallbackLabel,
    external,
  };
}

function mapSlice(slice) {
  if (!slice || typeof slice !== "object") return undefined;

  if (slice.slice_type === "text_block") {
    return {
      type: "text",
      blocks: richTextToBlocks(slice.primary?.text),
    };
  }

  if (slice.slice_type === "image_block") {
    const image = imageFieldToImage(slice.primary?.image);
    if (!image) return undefined;

    return {
      type: "image",
      image,
      href: prismic.asLink(slice.primary?.image_link) || undefined,
    };
  }

  if (slice.slice_type === "navigation_project_blog") {
    return {
      type: "navigation",
      navType: slice.primary?.nav_type === "Blog Post" ? "Blog Post" : "Project",
      prev: linkFieldToLink(slice.primary?.prev_link, `Prev ${slice.primary?.nav_type || "Project"}`),
      next: linkFieldToLink(slice.primary?.next_link, `Next ${slice.primary?.nav_type || "Project"}`),
    };
  }

  return undefined;
}

function mapEntry(doc, basePath) {
  return {
    uid: doc.uid,
    title: text(doc.data?.title) || doc.uid,
    date: doc.data?.date || undefined,
    clientName: text(doc.data?.client_name) || undefined,
    href: doc.url || `${basePath}/${doc.uid}`,
    metaTitle: text(doc.data?.meta_title) || undefined,
    metaDescription: text(doc.data?.meta_description) || undefined,
    metaImage: imageFieldToImage(doc.data?.meta_image),
    hoverImage: imageFieldToImage(doc.data?.hover_image),
    tags: richTextToTags(doc.data?.tags),
    description: richTextToBlocks(doc.data?.description),
    link: linkFieldToLink(doc.data?.link, "Visit Site"),
    slices: Array.isArray(doc.data?.slices)
      ? doc.data.slices.map(mapSlice).filter(Boolean)
      : [],
  };
}

function toModuleCode(name, data) {
  return `import type { ContentEntry } from "@/lib/content-types";\n\nexport const ${name}: ContentEntry[] = ${JSON.stringify(data, null, 2)};\n`;
}

async function main() {
  const [projects, blogPosts] = await Promise.all([
    client.getAllByType("project", { pageSize: 100 }),
    client.getAllByType("blog_post", { pageSize: 100 }),
  ]);

  const mappedProjects = projects.map((doc) => mapEntry(doc, "/projects"));
  const mappedBlogs = blogPosts.map((doc) => mapEntry(doc, "/blog"));

  const contentDir = path.join(process.cwd(), "src", "content");
  await fs.mkdir(contentDir, { recursive: true });
  await fs.writeFile(path.join(contentDir, "projects.ts"), toModuleCode("projects", mappedProjects));
  await fs.writeFile(path.join(contentDir, "blog.ts"), toModuleCode("blogPosts", mappedBlogs));

  console.log(JSON.stringify({ projects: mappedProjects.length, blogPosts: mappedBlogs.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
