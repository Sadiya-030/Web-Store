/**
 * Utility functions for parsing and calculating delivery dates
 * based on product shipping information metafields
 */

/**
 * Parse shipping_info metafield to extract maximum delivery days
 * Expected format: "Delivery time: X-Y business days" or "Delivery time: X days"
 * Returns the maximum value from the range, or single value if only one number
 * @param shippingInfo - The shipping_info metafield value
 * @returns Maximum delivery days, defaults to 20 if unable to parse
 */
export function parseShippingInfo(
  shippingInfo: string | null | undefined,
): number {
  if (!shippingInfo) return 20;

  // Match "X-Y" format (range)
  const rangeMatch = shippingInfo.match(/(\d+)-(\d+)/);
  if (rangeMatch) {
    return parseInt(rangeMatch[2]); // Return maximum (Y)
  }

  // Match single number
  const singleMatch = shippingInfo.match(/(\d+)/);
  if (singleMatch) {
    return parseInt(singleMatch[1]);
  }

  return 20; // Default
}

/**
 * Get the maximum delivery days from all items in cart
 * @param items - Array of items with optional deliveryDays
 * @returns Maximum delivery days, defaults to 20 if no items or no valid values
 */
export function getMaxDeliveryDays(
  items: Array<{ deliveryDays?: number }>,
): number {
  if (!items || items.length === 0) return 20;

  const deliveryDays = items
    .map((item) => item.deliveryDays || 20)
    .filter((days) => days > 0);

  return deliveryDays.length > 0 ? Math.max(...deliveryDays) : 20;
}

/**
 * Calculate delivery date as ISO string
 * @param deliveryDays - Number of days for delivery
 * @returns ISO string of the calculated date
 */
export function calculateDeliveryDate(deliveryDays: number): string {
  const date = new Date(
    Date.now() + deliveryDays * 24 * 60 * 60 * 1000,
  );
  return date.toISOString();
}

/**
 * Format delivery date for display
 * @param isoDate - ISO format date string
 * @param locale - Locale for formatting (default: "en-IN")
 * @returns Formatted date string (e.g., "Wed, Dec 25")
 */
export function formatDeliveryDate(
  isoDate: string,
  locale: string = "en-IN",
): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Parse metafield content into key-value pairs
 * Handles formats with "Label: Value" separated by newlines or <br> tags
 * @param content - The metafield content to parse
 * @returns Array of [key, value] pairs
 */
export function parseMetafieldKeyValues(
  content: string | null | undefined,
): Array<[string, string]> {
  if (!content) return [];

  // Replace HTML <br> tags with newlines
  const normalized = content
    .replace(/<br\s*\/?>/gi, "\n")
    .trim();

  // Split by newlines and parse each line
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const pairs: Array<[string, string]> = [];

  for (const line of lines) {
    // Try to split by colon
    if (line.includes(":")) {
      const [key, ...valueParts] = line.split(":");
      const value = valueParts.join(":").trim();
      if (key.trim()) {
        pairs.push([key.trim(), value]);
      }
    }
  }

  return pairs;
}
