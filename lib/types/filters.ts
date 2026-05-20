export type SortOption =
  | "featured"
  | "newest"
  | "price-low-to-high"
  | "price-high-to-low";

export interface FilterState {
  categories: string[];
  shape: string[];
  priceRange: [number, number] | null;
  forWhom: string[];
  size: string[];
  occasion: string[];
  grossWeight: string[];
  currentSort: SortOption;
}

export type FilterKey = keyof FilterState;

export type FilterValue = string[] | [number, number] | null | SortOption;

export interface FilterOption<T = string | number> {
  label: string;
  value: T;
  priceModifier?: number;
  imageUrl?: string;
}

export interface FilterOptions {
  shape: string[];
  occasion: string[];
  forWhom: string[];
  size: string[];
  priceRange: FilterOption<string>[];
  grossWeight: FilterOption<string>[];
}

export interface FilterBarProps {
  resultCount: number;
  subCollections?: SubCollection[];
  filterOptions?: FilterOptions;
}

export interface SubCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
}
