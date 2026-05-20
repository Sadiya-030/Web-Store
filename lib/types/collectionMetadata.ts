/**
 * Collection metadata with titles, descriptions, and breadcrumbs
 */

export type CollectionDataKey =
  | "shop"
  | "rings"
  | "earrings"
  | "necklaces"
  | "pendants"
  | "bracelets"
  | "goldbeans";

export interface CollectionDataItem {
  title: string;
  descriptor: string;
  breadcrumb: string;
  hasFilters?: boolean;
}

export const COLLECTION_METADATA: Record<
  CollectionDataKey,
  CollectionDataItem
> = {
  shop: {
    title: "Shop",
    descriptor:
      "Discover Our Curated Collection of Lab-Grown Diamond Jewellery",
    breadcrumb: "Home / Shop",
    hasFilters: true,
  },
  rings: {
    title: "Rings",
    descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Rings",
    breadcrumb: "Home / Shop / Rings",
    hasFilters: true,
  },
  earrings: {
    title: "Earrings",
    descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Earrings",
    breadcrumb: "Home / Shop / Earrings",
    hasFilters: true,
  },
  necklaces: {
    title: "Necklaces",
    descriptor:
      "Discover Our Curated Collection Of Lab-Grown Diamond Necklaces",
    breadcrumb: "Home / Shop / Necklaces",
    hasFilters: true,
  },
  pendants: {
    title: "Pendants",
    descriptor: "Discover Our Curated Collection Of Lab-Grown Diamond Pendants",
    breadcrumb: "Home / Shop / Pendants",
    hasFilters: true,
  },
  bracelets: {
    title: "Bracelets",
    descriptor:
      "Discover Our Curated Collection Of Lab-Grown Diamond Bracelets",
    breadcrumb: "Home / Shop / Bracelets",
    hasFilters: true,
  },
  goldbeans: {
    title: "Gold Beans",
    descriptor: "Discover Our Curated Collection Of Pure Gold Beans",
    breadcrumb: "Home / Shop / Gold Beans",
    hasFilters: false,
  },
};

/**
 * Get collection metadata by slug
 */
export function getCollectionMetadata(slug: string): CollectionDataItem {
  return (
    COLLECTION_METADATA[slug as CollectionDataKey] || COLLECTION_METADATA.shop
  );
}
