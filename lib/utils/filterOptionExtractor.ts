import type { ShopifyProduct, FilterOptions } from "../types";
import { FOR_WHOM_MAPPING, RING_SIZES } from "../types";

// Cache for memoizing size extraction results
const sizeExtractionCache = new Map<string, string[]>();
const filterOptionsCache = new Map<string, FilterOptions>();

/**
 * Generate a cache key from product IDs and category
 */
function getCacheKey(products: ShopifyProduct[], category?: string): string {
  const productIds = products.map((p) => p.id).join(",");
  return `${productIds}:${category || ""}`;
}

/**
 * Extract all unique shape values from product tags
 */
function extractShapes(products: ShopifyProduct[]): string[] {
  const shapes = new Set<string>();
  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const match = tag.match(/stone_shape_(.+)/i);
      if (match) {
        shapes.add(match[1]);
      }
    });
  });
  return Array.from(shapes).sort();
}

/**
 * Extract all unique occasion values from product tags
 */
function extractOccasions(products: ShopifyProduct[]): string[] {
  const occasions = new Set<string>();
  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const match = tag.match(/ocassion_(.+)/i);
      if (match) {
        occasions.add(match[1]);
      }
    });
  });
  return Array.from(occasions).sort();
}

/**
 * Extract all unique "For Whom" values from product tags
 */
function extractForWhom(products: ShopifyProduct[]): string[] {
  const forWhom = new Set<string>();
  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const tagLower = tag.toLowerCase();
      if (tagLower.startsWith("gender_")) {
        const value = tagLower.substring(7);
        const normalized =
          FOR_WHOM_MAPPING[`gender_${value}`] || FOR_WHOM_MAPPING[value];
        if (normalized) forWhom.add(normalized);
      } else if (tagLower.startsWith("for_")) {
        const value = tagLower.substring(4);
        const normalized =
          FOR_WHOM_MAPPING[`for_${value}`] || FOR_WHOM_MAPPING[value];
        if (normalized) forWhom.add(normalized);
      } else {
        const normalized = FOR_WHOM_MAPPING[tagLower];
        if (normalized) forWhom.add(normalized);
      }
    });
  });
  return Array.from(forWhom).sort();
}

/**
 * Extract category-specific sizes from product options
 * Returns the union of all size values available for the category
 * Results are memoized to avoid repeated extraction
 */
function extractSizes(products: ShopifyProduct[], category?: string): string[] {
  if (
    category === "earrings" ||
    category === "pendants" ||
    category === "necklaces"
  ) {
    return [];
  }

  // Check cache first
  const cacheKey = getCacheKey(products, category);
  if (sizeExtractionCache.has(cacheKey)) {
    return sizeExtractionCache.get(cacheKey)!;
  }

  const categoryLower = category?.toLowerCase();
  const sizes = new Set<string>();

  // Filter products by category type
  let productsToProcess = products;

  if (categoryLower === "rings" || categoryLower === "ring") {
    // Get all ring products
    productsToProcess = products.filter((p) => {
      const productType = (p.productType || "").toLowerCase();
      return productType.includes("ring");
    });
  } else if (categoryLower === "bracelets" || categoryLower === "bracelet") {
    // Get all bracelet products
    productsToProcess = products.filter((p) => {
      const productType = (p.productType || "").toLowerCase();
      return productType.includes("bracelet");
    });
  }

  productsToProcess = productsToProcess.slice(0, 5);

  // Extract sizes from product options (the reliable source)
  productsToProcess.forEach((product) => {
    if (!product.options || product.options.length === 0) return;

    product.options.forEach((option) => {
      const optionNameLower = option.name.toLowerCase();
      if (optionNameLower === "size") {
        option.values.forEach((value) => {
          if (categoryLower === "rings" || categoryLower === "ring") {
            const numMatch = value.match(/^(\d+)$/);
            if (numMatch) {
              sizes.add(value);
            }
          } else if (
            categoryLower === "bracelets" ||
            categoryLower === "bracelet"
          ) {
            sizes.add(value);
          }
        });
      }
    });
  });

  // Sort: numeric values first (ascending), then text values (alphabetical)
  const finalSizes = Array.from(sizes).sort((a, b) => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    if (!isNaN(aNum)) return -1;
    if (!isNaN(bNum)) return 1;

    return a.localeCompare(b);
  });

  // Store in cache
  sizeExtractionCache.set(cacheKey, finalSizes);

  return finalSizes;
}

/**
 * Extract price range from product variants
 */
function extractPriceRange(
  products: ShopifyProduct[],
): Array<{ label: string; value: string }> {
  const prices = products
    .flatMap((p) => p.variants || [])
    .map((v) => {
      const price = parseInt(String(v.price).replace(/[^\d]/g, ""));
      return isNaN(price) ? 0 : price;
    })
    .filter((p) => p > 0)
    .sort((a, b) => a - b);

  if (prices.length === 0) {
    // Return default ranges if no prices found
    return [
      { label: "₹0 - ₹50K", value: "0-50000" },
      { label: "₹50K - ₹100K", value: "50000-100000" },
      { label: "₹100K - ₹200K", value: "100000-200000" },
      { label: "₹200K+", value: "200000-9999999" },
    ];
  }

  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];

  // Create 4 price buckets based on actual data
  const ranges: Array<{ label: string; value: string }> = [];
  const quarter = Math.floor((maxPrice - minPrice) / 4);

  if (quarter === 0) {
    // All products have the same price
    ranges.push({
      label: `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`,
      value: `${minPrice}-${maxPrice}`,
    });
  } else {
    ranges.push({
      label: `₹0 - ₹${(minPrice + quarter).toLocaleString()}`,
      value: `0-${minPrice + quarter}`,
    });
    ranges.push({
      label: `₹${(minPrice + quarter).toLocaleString()} - ₹${(minPrice + quarter * 2).toLocaleString()}`,
      value: `${minPrice + quarter}-${minPrice + quarter * 2}`,
    });
    ranges.push({
      label: `₹${(minPrice + quarter * 2).toLocaleString()} - ₹${(minPrice + quarter * 3).toLocaleString()}`,
      value: `${minPrice + quarter * 2}-${minPrice + quarter * 3}`,
    });
    ranges.push({
      label: `₹${(minPrice + quarter * 3).toLocaleString()}+`,
      value: `${minPrice + quarter * 3}-9999999`,
    });
  }

  return ranges;
}

/**
 * Extract gross weight options from product tags
 */
function extractGrossWeightOptions(
  products: ShopifyProduct[],
): Array<{ label: string; value: string }> {
  const weights = new Set<string>();

  products.forEach((p) => {
    (p.tags || []).forEach((tag) => {
      const match = tag.match(/gross_total_weight_range_(.+)/i);
      if (match) {
        const weightStr = match[1];
        weights.add(weightStr);
      }
    });
  });

  if (weights.size === 0) {
    // Return default options if no weights found
    return [
      { label: "1g-3g", value: "1g-3g" },
      { label: "3g-5g", value: "3g-5g" },
      { label: "5g-7g", value: "5g-7g" },
      { label: "7g-10g", value: "7g-10g" },
      { label: "10g-20g", value: "10g-20g" },
      { label: "10g & more", value: "10g & more" },
    ];
  }

  // Convert to array, sort by first number in weight string
  const sortedWeights = Array.from(weights).sort((a, b) => {
    const aNum = parseInt(a.match(/\d+/)?.[0] || "0");
    const bNum = parseInt(b.match(/\d+/)?.[0] || "0");
    return aNum - bNum;
  });

  return sortedWeights.map((weight) => ({
    label: weight.replace(/_/g, " "),
    value: weight,
  }));
}

/**
 * Get default sizes for a category if extraction fails
 */
function getDefaultSizesForCategory(category?: string): string[] {
  const categoryLower = category?.toLowerCase();

  if (categoryLower === "rings") return RING_SIZES;
  if (categoryLower === "necklaces") return [];
  if (categoryLower === "bracelets") return [];

  // For shop and other categories, don't show default sizes
  return [];
}

/**
 * Extract options from product options (e.g., Color, Purity, Metal Type)
 */
export function extractProductOptions(
  products: ShopifyProduct[],
): Record<string, string[]> {
  const optionsMap: Record<string, Set<string>> = {};

  products.forEach((product) => {
    if (!product.options || product.options.length === 0) return;

    product.options.forEach((option) => {
      if (!optionsMap[option.name]) {
        optionsMap[option.name] = new Set();
      }
      option.values.forEach((value) => {
        optionsMap[option.name].add(value);
      });
    });
  });

  // Convert Sets to sorted Arrays
  const result: Record<string, string[]> = {};
  for (const [key, values] of Object.entries(optionsMap)) {
    result[key] = Array.from(values).sort();
  }

  return result;
}

/**
 * Extract collections from products
 */
export function extractCollections(
  products: ShopifyProduct[],
): Array<{ id: string; title: string; handle: string }> {
  const collectionsMap = new Map<
    string,
    { id: string; title: string; handle: string }
  >();

  products.forEach((product) => {
    if (!product.collections || product.collections.length === 0) return;

    product.collections.forEach((collection) => {
      if (!collectionsMap.has(collection.id)) {
        collectionsMap.set(collection.id, collection);
      }
    });
  });

  return Array.from(collectionsMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

/**
 * Extract all filter options from products
 * Results are memoized to avoid repeated extraction across re-renders
 */
export function extractFilterOptions(
  products: ShopifyProduct[],
  category?: string,
): FilterOptions {
  // Check cache first
  const cacheKey = getCacheKey(products, category);
  if (filterOptionsCache.has(cacheKey)) {
    return filterOptionsCache.get(cacheKey)!;
  }

  const sizes = extractSizes(products, category);

  // If no sizes found and category is specific, use defaults as fallback
  const finalSizes =
    sizes.length === 0 && category && category !== "shop"
      ? getDefaultSizesForCategory(category)
      : sizes;

  const filterOptions: FilterOptions = {
    shape: extractShapes(products),
    occasion: extractOccasions(products),
    forWhom: extractForWhom(products),
    size: finalSizes,
    priceRange: extractPriceRange(products),
    grossWeight: extractGrossWeightOptions(products),
  };

  // Store in cache
  filterOptionsCache.set(cacheKey, filterOptions);

  return filterOptions;
}
