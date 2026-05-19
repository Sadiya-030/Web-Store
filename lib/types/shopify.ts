/**
 * Shopify-related type definitions
 */

export interface ShopifyImage {
  url: string;
  altText?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ShopifyOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyVariant {
  id: string;
  price: string;
  title: string;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
  sku?: string;
  barcode?: string;
  compareAtPrice?: string;
  availableForSale?: boolean;
  inventoryQuantity?: number;
  image?: {
    url: string;
  };
}

export interface ShopifyPriceRange {
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  };
  maxVariantPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
  reference?: {
    sources?: Array<{
      url: string;
      mimeType: string;
      format: string;
    }>;
    image?: {
      url: string;
    };
    url?: string;
  };
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  productType?: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  tags?: string[];
  description?: string;
  descriptionHtml?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  status?: string;
  totalInventory?: number;
  onlineStoreUrl?: string;
  featuredImage?: ShopifyImage;
  options?: ShopifyOption[];
  priceRangeV2?: ShopifyPriceRange;
  collections?: ShopifyCollection[];
  metafields?: ShopifyMetafield[];
  seo?: {
    title?: string;
    description?: string;
  };
  __subCollectionHandle?: string;
  __subCollectionTitle?: string;
}

export interface ShopifyCollectionData {
  id: string;
  handle: string;
  title: string;
  description: string;
}

export type MajorCollectionType =
  | "Rings"
  | "Earrings"
  | "Necklaces"
  | "Pendants"
  | "Bracelets"
  | "Gold Beans";
