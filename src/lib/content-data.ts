import { blogPosts } from "@/content/blog";
import { projects } from "@/content/projects";
import type { ContentEntry } from "@/lib/content-types";

export const projectEntries: ContentEntry[] = projects;

export const blogEntries: ContentEntry[] = blogPosts;

export function getProjectEntry(uid: string) {
  return projectEntries.find((entry) => entry.uid === uid);
}

export function getBlogEntry(uid: string) {
  return blogEntries.find((entry) => entry.uid === uid);
}

export function getContentEntries(contentType?: string) {
  const entries = contentType === "Blog" ? blogEntries : projectEntries;

  return [...entries]
    .filter((entry) => Boolean(entry.date))
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    });
}
