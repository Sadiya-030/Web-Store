/**
 * Filter configuration and constants
 */

export const DEFAULT_FILTER_OPTIONS = {
  shape: [
    "Round",
    "Oval",
    "Emerald",
    "Pear",
    "Marquise",
    "Cushion",
    "Heart",
    "Radiant",
    "Asscher",
    "Trillion",
    "Solitaire",
  ],
  occasion: [
    "Dailywear",
    "Engagement",
    "Wedding",
    "Anniversary",
    "Fancy",
    "Birthday",
    "Festival",
  ],
  forWhom: ["Women", "Men", "Couples", "Unisex"],
  size: ["Small", "Medium", "Large"],
  priceRange: [
    { label: "₹0 - ₹50K", value: "0-50000" },
    { label: "₹50K - ₹100K", value: "50000-100000" },
    { label: "₹100K - ₹200K", value: "100000-200000" },
    { label: "₹200K+", value: "200000-9999999" },
  ],
  grossWeight: [
    { label: "Below 5g", value: "0-5" },
    { label: "5g - 10g", value: "5-10" },
    { label: "10g - 20g", value: "10-20" },
    { label: "Above 20g", value: "20-999" },
  ],
};

/**
 * Mapping between FilterState keys and URL parameter names
 */
export const FILTER_PARAM_MAPPING = {
  categories: "categories",
  shape: "shape",
  priceRange: "price",
  forWhom: "forWhom",
  size: "size",
  occasion: "occasion",
  grossWeight: "weight",
} as const;

export type FilterParamKey = keyof typeof FILTER_PARAM_MAPPING;
