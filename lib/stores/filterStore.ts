import { create } from 'zustand';
import type {
  FilterState,
  FilterKey,
  FilterValue,
  SortOption,
  ShopifyProduct,
} from '@/lib/types';

interface FilterStore {
  filters: FilterState;
  setFilter: (key: FilterKey, values: FilterValue) => void;
  clearAll: () => void;
  setSort: (sort: SortOption) => void;
  getFilteredProducts: (products: ShopifyProduct[]) => ShopifyProduct[];
  hasActiveFilters: () => boolean;
}

const initialFilters: FilterState = {
  categories: [],
  shape: [],
  priceRange: null,
  forWhom: [],
  size: [],
  occasion: [],
  grossWeight: [],
  currentSort: 'featured',
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: initialFilters,

  setFilter: (key, values) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: values,
      },
    }));
  },

  clearAll: () => {
    set({ filters: initialFilters });
  },

  setSort: (sort) => {
    set((state) => ({
      filters: {
        ...state.filters,
        currentSort: sort,
      },
    }));
  },

  getFilteredProducts: (products: ShopifyProduct[]) => {
    const { filters } = get();
    let filtered = [...products];

    // Apply shape filter
    if (filters.shape.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.shape.some((shape) =>
          tags.some((tag) =>
            tag.toLowerCase().includes(`stone_shape_${shape.toLowerCase()}`)
          )
        );
      });
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter((p) => {
        const priceStr = p.variants?.[0]?.price;
        if (!priceStr) return false;
        const price = parseInt(String(priceStr).replace(/[^\d]/g, ''));
        return !isNaN(price) && price >= min && price <= max;
      });
    }

    // Apply occasion filter
    if (filters.occasion.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.occasion.some((occ) =>
          tags.some((tag) =>
            tag.toLowerCase().includes(`ocassion_${occ.toLowerCase()}`)
          )
        );
      });
    }

    // Apply sorting
    switch (filters.currentSort) {
      case 'price-low-to-high':
        filtered.sort((a, b) => {
          const aPrice = parseInt(String(a.variants?.[0]?.price || '0').replace(/[^\d]/g, ''));
          const bPrice = parseInt(String(b.variants?.[0]?.price || '0').replace(/[^\d]/g, ''));
          return aPrice - bPrice;
        });
        break;
      case 'price-high-to-low':
        filtered.sort((a, b) => {
          const aPrice = parseInt(String(a.variants?.[0]?.price || '0').replace(/[^\d]/g, ''));
          const bPrice = parseInt(String(b.variants?.[0]?.price || '0').replace(/[^\d]/g, ''));
          return bPrice - aPrice;
        });
        break;
      case 'featured':
      case 'newest':
      default:
        // Keep original order
        break;
    }

    return filtered;
  },

  hasActiveFilters: () => {
    const { filters } = get();
    return (
      filters.categories.length > 0 ||
      filters.shape.length > 0 ||
      filters.priceRange !== null ||
      filters.forWhom.length > 0 ||
      filters.size.length > 0 ||
      filters.occasion.length > 0 ||
      filters.grossWeight.length > 0
    );
  },
}));
