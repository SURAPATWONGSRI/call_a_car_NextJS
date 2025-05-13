/**
 * Format a date string from ISO format to a readable Thai format
 * @param dateString ISO date string like "2025-05-09T19:08:55.876Z"
 * @returns Formatted date string in Thai locale
 */

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  try {
    // Parse the ISO date string
    const date = new Date(dateString);

    // Format the date in Thai format with correct time (no timezone adjustment needed)
    // ISO dates are already in UTC, so we just need to format them correctly
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "-";
  }
}

/**
 * Return the raw ISO date string for debugging
 */
export function getRawDate(dateString: string | null | undefined): string {
  return dateString || "-";
}
