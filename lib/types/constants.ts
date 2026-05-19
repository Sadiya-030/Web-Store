/**
 * Centralized constants for filtering, sizes, and product attributes
 */

import type { SortOption } from "./filters";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low-to-high", label: "Price: Low To High" },
  { value: "price-high-to-low", label: "Price: High To Low" },
];

export const FOR_WHOM_MAPPING: Record<string, string> = {
  for_her: "For Her",
  for_him: "For Him",
  "gender_for everyone": "For Everyone",
  gender_for_everyone: "For Everyone",
  mother: "Mother",
  father: "Father",
  wife: "Wife",
  sister: "Sister",
  brother: "Brother",
  friend: "Friend",
  daughter: "Daughter",
};

export const METAL_COLORS = [
  "yellow gold",
  "rose gold",
  "white gold",
];

export const RING_SIZES = [
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
];
