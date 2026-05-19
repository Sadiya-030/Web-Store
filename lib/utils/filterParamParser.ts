/**
 * Parse URL search parameters into filter updates
 */

import { ReadonlyURLSearchParams } from "next/navigation";
import { FILTER_PARAM_MAPPING } from "@/lib/types/filterConfig";

export interface FilterParamUpdates {
  categories?: string[];
  shape?: string[];
  priceRange?: [number, number];
  forWhom?: string[];
  size?: string[];
  occasion?: string[];
  grossWeight?: string[];
}

/**
 * Parse URL search parameters and return filter updates
 * Only returns filters that are present in the URL
 */
export function parseFilterParams(
  searchParams: ReadonlyURLSearchParams
): FilterParamUpdates {
  const updates: FilterParamUpdates = {};

  // Parse categories
  const categories = searchParams
    .get(FILTER_PARAM_MAPPING.categories)
    ?.split(",")
    .filter(Boolean);
  if (categories?.length) {
    updates.categories = categories;
  }

  // Parse shape
  const shape = searchParams
    .get(FILTER_PARAM_MAPPING.shape)
    ?.split(",")
    .filter(Boolean);
  if (shape?.length) {
    updates.shape = shape;
  }

  // Parse price range
  const priceStr = searchParams.get(FILTER_PARAM_MAPPING.priceRange);
  if (priceStr) {
    const [min, max] = priceStr.split("-").map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      updates.priceRange = [min, max];
    }
  }

  // Parse forWhom
  const forWhom = searchParams
    .get(FILTER_PARAM_MAPPING.forWhom)
    ?.split(",")
    .filter(Boolean);
  if (forWhom?.length) {
    updates.forWhom = forWhom;
  }

  // Parse size
  const size = searchParams
    .get(FILTER_PARAM_MAPPING.size)
    ?.split(",")
    .filter(Boolean);
  if (size?.length) {
    updates.size = size;
  }

  // Parse occasion
  const occasion = searchParams
    .get(FILTER_PARAM_MAPPING.occasion)
    ?.split(",")
    .filter(Boolean);
  if (occasion?.length) {
    updates.occasion = occasion;
  }

  // Parse grossWeight
  const weight = searchParams
    .get(FILTER_PARAM_MAPPING.grossWeight)
    ?.split(",")
    .filter(Boolean);
  if (weight?.length) {
    updates.grossWeight = weight;
  }

  return updates;
}
