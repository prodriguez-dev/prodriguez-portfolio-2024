import { DateField } from "@prismicio/client";

export function formatDate(dateStr: DateField): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);

  // Options for formatting
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Format the date to parts
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  // Build the custom date string, handling commas appropriately
  let customDateString = "";
  let previousType = "";
  for (const part of parts) {
    if (part.type === "weekday") {
      customDateString += part.value + " "; // Add space after weekday
    } else if (part.type === "day") {
      customDateString += part.value + ","; // Add comma after day
    } else if (part.type === "literal" && part.value.trim() === ",") {
      continue; // Skip the original comma
    } else {
      customDateString += " " + part.value;
    }
    previousType = part.type;
  }

  return customDateString.trim(); // Trim any trailing spaces
}
