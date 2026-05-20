import type { ShopifyProduct, MajorCollectionType } from "@/lib/types";

export interface SubcategoryAnalysis {
  id: string;
  title: string;
  handle: string;
  productCount: number;
  hasProducts: boolean;
}

export interface CategoryHierarchy {
  majorCategory: MajorCollectionType;
  subcategories: SubcategoryAnalysis[];
  totalProducts: number;
}

/**
 * Analyze products and return only subcategories that have products
 */
export function analyzeSubcategoriesWithProducts(
  products: ShopifyProduct[],
  subCollections: Array<{
    id: string;
    title: string;
    handle: string;
    description?: string;
  }>,
): SubcategoryAnalysis[] {
  // Count products per subcategory handle
  const productCountByHandle: Record<string, number> = {};

  for (const product of products) {
    const subCollectionHandle = product.__subCollectionHandle;
    if (subCollectionHandle) {
      productCountByHandle[subCollectionHandle] =
        (productCountByHandle[subCollectionHandle] || 0) + 1;
    }
  }

  // Map subcollections with product counts
  const analyzed = subCollections
    .map((sc) => ({
      id: sc.id,
      title: sc.title,
      handle: sc.handle,
      productCount: productCountByHandle[sc.handle] || 0,
      hasProducts: (productCountByHandle[sc.handle] || 0) > 0,
    }))
    .sort((a, b) => b.productCount - a.productCount); // Sort by product count descending

  return analyzed.filter((sc) => sc.hasProducts);
}

/**
 * Get subcategories filtered by product count
 * This is used in the collection page to only show relevant filters
 */
export function getFilteredSubcategories(
  products: ShopifyProduct[],
  subCollections: Array<{
    id: string;
    title: string;
    handle: string;
    description: string;
  }>,
): Array<{
  id: string;
  title: string;
  handle: string;
  description: string;
}> {
  const productCountByHandle: Record<string, number> = {};

  for (const product of products) {
    const subCollectionHandle = product.__subCollectionHandle;
    if (subCollectionHandle) {
      productCountByHandle[subCollectionHandle] =
        (productCountByHandle[subCollectionHandle] || 0) + 1;
    }
  }

  return subCollections.filter(
    (sc) => (productCountByHandle[sc.handle] || 0) > 0,
  );
}
