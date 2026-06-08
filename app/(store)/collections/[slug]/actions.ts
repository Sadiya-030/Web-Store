"use server";

import { getCollectionProducts } from "@/lib/api/shopify";
import type { ShopifyProduct } from "@/lib/types";

export async function fetchSubcollectionProducts(
  handle: string,
): Promise<ShopifyProduct[]> {
  try {
    const result = await getCollectionProducts(handle);
    return result.products;
  } catch (error) {
    console.error(
      `Failed to Fetch Subcollection Products for "${handle}":`,
      error,
    );
    return [];
  }
}

export async function fetchMoreCollectionProducts(
  collectionHandle: string,
  cursor: string,
): Promise<{
  products: ShopifyProduct[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  try {
    const result = await getCollectionProducts(collectionHandle, cursor);
    return result;
  } catch (error) {
    console.error(
      `Failed to Fetch More Products for "${collectionHandle}":`,
      error,
    );
    return { products: [], hasNextPage: false, endCursor: null };
  }
}
