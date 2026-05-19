/**
 * Intelligent product recommendation system
 * Used when metafield-based related products aren't available
 */

import type { ShopifyProduct } from "@/lib/types";

export interface RecommendationCriteria {
  designFamily?: string;
  occasion?: string;
  stoneShape?: string;
  collection?: string;
  price?: number;
  productType?: string;
}

/**
 * Extract recommendation criteria from a product
 */
export function extractProductCriteria(
  product: ShopifyProduct,
): RecommendationCriteria {
  const tags = product.tags || [];
  const price = parseInt(product.variants[0]?.price || "0");

  // Extract design family from tags (e.g., "design_family_solitaire")
  const designFamilyTag = tags.find((tag: string) =>
    tag.toLowerCase().includes("design_family_"),
  );
  const designFamily = designFamilyTag?.split("_").pop()?.toLowerCase();

  // Extract occasion from tags (e.g., "Ocassion_Engagement")
  const occasionTag = tags.find((tag: string) =>
    tag.toLowerCase().includes("ocassion_"),
  );
  const occasion = occasionTag?.split("_").slice(1).join("_")?.toLowerCase();

  // Extract stone shape from tags (e.g., "stone_shape_Round")
  const stoneShapeTag = tags.find((tag: string) =>
    tag.toLowerCase().includes("stone_shape_"),
  );
  const stoneShape = stoneShapeTag?.split("_").pop()?.toLowerCase();

  // Extract collection from tags (e.g., "collection_evol_Dailywear")
  const collectionTag = tags.find(
    (tag: string) =>
      tag.toLowerCase().includes("collection_") ||
      tag.toLowerCase().includes("newcollection_"),
  );
  const collection = collectionTag?.toLowerCase();

  return {
    designFamily,
    occasion,
    stoneShape,
    collection,
    price,
    productType: product.productType?.toLowerCase(),
  };
}

export function calculateSimilarityScore(
  product: ShopifyProduct,
  targetCriteria: RecommendationCriteria,
  targetPrice: number,
): number {
  const criteria = extractProductCriteria(product);
  let score = 0;

  if (
    targetCriteria.designFamily &&
    criteria.designFamily === targetCriteria.designFamily
  ) {
    score += 25;
  }

  if (
    targetCriteria.occasion &&
    criteria.occasion === targetCriteria.occasion
  ) {
    score += 25;
  }

  if (
    targetCriteria.stoneShape &&
    criteria.stoneShape === targetCriteria.stoneShape
  ) {
    score += 20;
  }

  if (
    targetCriteria.collection &&
    criteria.collection === targetCriteria.collection
  ) {
    score += 20;
  }

  if (criteria.price !== undefined && targetPrice > 0) {
    const priceDifference = Math.abs(criteria.price - targetPrice);
    const priceThreshold = targetPrice * 0.2;
    if (priceDifference <= priceThreshold) {
      score += 15;
    }
  }

  if (
    targetCriteria.productType &&
    criteria.productType === targetCriteria.productType
  ) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Get intelligent product recommendations
 * Prioritizes by design family, occasion, stone shape, collection, and price
 */
export function getIntelligentRecommendations(
  currentProduct: ShopifyProduct,
  allProducts: ShopifyProduct[],
  limit: number = 3,
): ShopifyProduct[] {
  // Filter out the current product
  const candidates = allProducts.filter((p) => p.id !== currentProduct.id);

  if (candidates.length === 0) {
    return [];
  }

  const targetPrice = parseInt(currentProduct.variants[0]?.price || "0");
  const targetCriteria = extractProductCriteria(currentProduct);

  // Score all candidates
  const scored = candidates.map((product) => ({
    product,
    score: calculateSimilarityScore(product, targetCriteria, targetPrice),
  }));

  // Sort by score descending, then by creation date (newer first) for tiebreaker
  scored.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    const aDate = a.product.createdAt
      ? new Date(a.product.createdAt).getTime()
      : 0;
    const bDate = b.product.createdAt
      ? new Date(b.product.createdAt).getTime()
      : 0;
    return bDate - aDate;
  });

  return scored.slice(0, limit).map((s) => s.product);
}
