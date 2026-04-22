// Residual Slice Machine registry. Keep only slices still intentionally supported.

import dynamic from "next/dynamic";

export const components = {
  contact: dynamic(() => import("./ContactForm")),
  content_index: dynamic(() => import("./ContentIndex")),
  navigation_project_blog: dynamic(() => import("./NavigationProjectBlog")),
  recent_content: dynamic(() => import("./RecentContent")),
};
