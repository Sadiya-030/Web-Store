"use server";

import { getCollectionProducts } from "@/lib/api/shopify";
import { logger } from "@/lib/utils/logger";
import type { ShopifyProduct } from "@/lib/types";

/**
 * Server action to fetch subcollection products on demand
 * Called by InfiniteScroll when user scrolls down
 * Enriches products with their source collection handle for filtering
 */
export async function fetchMoreProducts(
  handles: string[],
): Promise<ShopifyProduct[]> {
  try {
    const results = await Promise.all(
      handles.map(async (handle) => {
        try {
          const products = await getCollectionProducts(handle);
          return products.map((product) => ({
            ...product,
            __subCollectionHandle: handle,
          }));
        } catch (error) {
          logger.error(`Failed to Fetch Products for Handle: ${handle}`, error);
          return [];
        }
      }),
    );
    return results.flat();
  } catch (error) {
    logger.error("Failed to Fetch More Products", error);
    return [];
  }
}
