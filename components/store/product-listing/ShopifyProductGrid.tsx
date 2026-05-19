"use client";

import { ShopifyProductCard } from "./ShopifyProductCard";
import type { ShopifyProduct } from "@/lib/types";

interface ShopifyProductGridProps {
  products: ShopifyProduct[];
}

export function ShopifyProductGrid({ products }: ShopifyProductGridProps) {
  const uniqueProducts = Array.from(
    new Map(products.map((p) => [p.id, p])).values(),
  );

  if (uniqueProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-7">
      {uniqueProducts.map((product, index) => (
        <ShopifyProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
