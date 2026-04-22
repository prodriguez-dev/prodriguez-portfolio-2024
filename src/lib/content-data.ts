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
