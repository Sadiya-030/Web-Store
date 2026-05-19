/**
 * UI component related type definitions
 */

import type { ShopifyProduct } from "./shopify";
import type { SubCollection } from "./filters";

export type AddToCartStatus = "idle" | "loading" | "success" | "added";

export interface CollectionData {
  title: string;
  descriptor: string;
  breadcrumb: string;
  hasFilters?: boolean;
}

export interface CollectionPageClientProps {
  slug: string;
  products: ShopifyProduct[];
  collectionData: CollectionData;
  subCollections?: SubCollection[];
  subCollectionHandles?: string[];
}

export type { ShopifyProduct, ShopifyImage, ShopifyVariant } from "./shopify";
export type { SubCollection } from "./filters";
