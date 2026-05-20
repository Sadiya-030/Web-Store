/**
 * Bidirectional mapping between FilterState and URL parameters
 */

import type { FilterState } from "@/lib/types";
import { FILTER_PARAM_MAPPING } from "@/lib/types/filterConfig";

/**
 * Convert FilterState to URL search parameters
 */
export function filtersToURLParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.categories.length > 0) {
    params.set(FILTER_PARAM_MAPPING.categories, filters.categories.join(","));
  }

  if (filters.shape.length > 0) {
    params.set(FILTER_PARAM_MAPPING.shape, filters.shape.join(","));
  }

  if (filters.priceRange) {
    params.set(
      FILTER_PARAM_MAPPING.priceRange,
      `${filters.priceRange[0]}-${filters.priceRange[1]}`
    );
  }

  if (filters.forWhom.length > 0) {
    params.set(FILTER_PARAM_MAPPING.forWhom, filters.forWhom.join(","));
  }

  if (filters.size.length > 0) {
    params.set(FILTER_PARAM_MAPPING.size, filters.size.join(","));
  }

  if (filters.occasion.length > 0) {
    params.set(FILTER_PARAM_MAPPING.occasion, filters.occasion.join(","));
  }

  if (filters.grossWeight.length > 0) {
    params.set(FILTER_PARAM_MAPPING.grossWeight, filters.grossWeight.join(","));
  }

  return params;
}
