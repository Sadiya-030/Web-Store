"use client";

import { ShopifyProductCard } from "./ShopifyProductCard";
import type { ShopifyProduct } from "@/lib/types";

interface ShopifyProductGridProps {
  products: ShopifyProduct[];
}

export function ShopifyProductGrid({ products }: ShopifyProductGridProps) {
  // Deduplicate products: keep first occurrence of each product ID
  const seenIds = new Set<string>();
  const uniqueProducts: Array<{ product: ShopifyProduct; originalIndex: number }> = [];

  products.forEach((product, index) => {
    if (!seenIds.has(product.id)) {
      seenIds.add(product.id);
      uniqueProducts.push({ product, originalIndex: index });
    }
  });

  if (uniqueProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-7">
      {uniqueProducts.map(({ product, originalIndex }) => (
        <ShopifyProductCard
          key={product.id}
          product={product}
          index={originalIndex}
        />
      ))}
    </div>
  );
}
