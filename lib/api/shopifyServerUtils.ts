import { getProductCollections, getCollectionProducts } from "./shopify";
import type { ShopifyProduct } from "../types";

export async function getRelatedProducts(
  shopifyProduct: ShopifyProduct,
  limit: number = 4,
): Promise<ShopifyProduct[]> {
  try {
    const collections = await getProductCollections(shopifyProduct.id);

    if (collections.length === 0) {
      return [];
    }

    const productType = shopifyProduct.productType?.toLowerCase() || "";

    let relatedProducts: ShopifyProduct[] = [];

    for (const collection of collections) {
      const result = await getCollectionProducts(collection.handle);
      const sameTypeProducts = result.products.filter(
        (p) =>
          p.id !== shopifyProduct.id &&
          p.productType?.toLowerCase() === productType,
      );
      relatedProducts.push(...sameTypeProducts);

      if (relatedProducts.length >= limit) break;
    }

    if (relatedProducts.length < limit && collections.length > 0) {
      const firstCollectionResult = await getCollectionProducts(
        collections[0].handle,
      );
      const otherProducts = firstCollectionResult.products.filter(
        (p) =>
          p.id !== shopifyProduct.id &&
          !relatedProducts.find((rp) => rp.id === p.id),
      );
      relatedProducts.push(...otherProducts);
    }

    return relatedProducts.slice(0, limit);
  } catch (error) {
    console.error("Failed to Fetch Related Products:", error);
    return [];
  }
}
