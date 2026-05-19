"use client";

import { useMemo } from "react";
import { ShopifyProductCard } from "@/components/store/product-listing/ShopifyProductCard";
import { getIntelligentRecommendations } from "@/lib/utils/productRecommendations";
import type { ShopifyMetafield, ShopifyProduct } from "@/lib/types";

interface RelatedProductsProps {
  metafields?: ShopifyMetafield[];
  allProducts?: ShopifyProduct[];
  currentProduct?: ShopifyProduct;
}

export function RelatedProducts({
  metafields,
  allProducts,
  currentProduct,
}: RelatedProductsProps) {
  if (!allProducts || allProducts.length === 0) return null;

  // Get related products - either from metafield or via intelligent recommendations
  const relatedProducts = useMemo(() => {
    let products: ShopifyProduct[] = [];

    if (metafields) {
      // Find related products metafield
      const relatedField = metafields.find(
        (field) => field.key === "related_products",
      );

      if (relatedField && relatedField.value) {
        // Parse the JSON array of product GIDs
        try {
          const parsed = JSON.parse(relatedField.value);
          const relatedProductIds = Array.isArray(parsed) ? parsed : [];

          // Filter products that match the related product IDs
          products = allProducts.filter((product) =>
            relatedProductIds.includes(product.id),
          );
        } catch {
          // Fall through to intelligent recommendations
        }
      }
    }

    // If no metafield products found or metafield missing, use intelligent recommendations
    if (products.length === 0 && currentProduct) {
      products = getIntelligentRecommendations(currentProduct, allProducts, 5);
    }

    // Trim to nearest multiple of 3 only if we have more than 3 products
    const remainder = products.length % 3;
    if (remainder !== 0 && products.length > 3) {
      const trimmedCount = products.length - remainder;
      products = products.slice(0, trimmedCount);
    }
    return products;
  }, [metafields, allProducts, currentProduct]);

  return (
    <div className="py-8 md:py-12 border-b border-evol-grey">
      <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-gray-900 mb-6 md:mb-8">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-7">
        {relatedProducts.map((product, index) => (
          <ShopifyProductCard
            key={product.id}
            product={product}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
