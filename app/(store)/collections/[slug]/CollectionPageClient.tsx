"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filterStore";
import {
  extractFilterOptions,
  extractProductOptions,
  extractCollections,
} from "@/lib/utils/filterOptionExtractor";
import { filterProductsByType } from "@/lib/utils/collectionFilters";
import { analyzeSubcategoriesWithProducts } from "@/lib/utils/categoryAnalyzer";
import { METAL_COLORS, SORT_OPTIONS } from "@/lib/types";
import { CollectionHeroBanner } from "@/components/store/product-listing/CollectionHeroBanner";
import { FilterBar } from "@/components/store/product-listing/FilterBar";
import { SearchBar } from "@/components/common/search/SearchBar";
import { SortBar } from "@/components/common/data/SortBar";
import { ShopifyProductGrid } from "@/components/store/product-listing/ShopifyProductGrid";
import { ProductGridSkeleton } from "@/components/store/product-listing/ProductGridSkeleton";
import { EmptyState } from "@/components/common/feedback/EmptyState";
import { InfiniteScroll } from "@/components/common/loaders/InfiniteScroll";
import { fetchSubcollectionProducts, fetchMoreCollectionProducts } from "./actions";
import type { ShopifyProduct, CollectionPageClientProps } from "@/lib/types";

const ITEMS_PER_PAGE = 12;

export function CollectionPageClient({
  slug,
  products,
  collectionData,
  subCollections,
  initialCursor,
  initialHasNextPage,
}: CollectionPageClientProps) {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>(products);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor || null);
  const [hasMoreProducts, setHasMoreProducts] = useState(initialHasNextPage || false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { filters, setSort, clearAll } = useFilterStore();
  const searchParams = useSearchParams();

  // Hide skeleton after initial render
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Fetch subcollection products when categories filter changes
  useEffect(() => {
    if (filters.categories.length === 0) {
      // No subcollection selected, use only primary products
      setAllProducts(products);
      return;
    }

    // User selected specific subcollections, fetch their products
    const fetchSubcollections = async () => {
      const newProducts = [...products];
      for (const categoryHandle of filters.categories) {
        const subcollectionProducts = await fetchSubcollectionProducts(
          categoryHandle,
        );
        // Tag products with their subcollection handle
        const taggedProducts = subcollectionProducts.map((p) => ({
          ...p,
          __subCollectionHandle: categoryHandle,
        }));
        newProducts.push(...taggedProducts);
      }
      setAllProducts(newProducts);
    };

    fetchSubcollections();
  }, [filters.categories, products]);

  // Check if collection has filters enabled
  const hasFiltersEnabled = collectionData?.hasFilters !== false;

  // Always show all subcollections for filtering, regardless of product availability
  const filteredSubCollections = useMemo(() => {
    if (!subCollections || subCollections.length === 0) return [];

    return subCollections.map((sc) => ({
      id: sc.id,
      title: sc.title,
      handle: sc.handle,
      description: sc.description || "",
    }));
  }, [subCollections]);

  const filterOptions = useMemo(() => {
    const collectionProducts = filterProductsByType(allProducts, slug);

    if (!hasFiltersEnabled) {
      // Return empty filter options for collections without filters
      return {
        shape: [],
        occasion: [],
        forWhom: [],
        size: [],
        priceRange: [],
        grossWeight: [],
      };
    }

    const baseFilters = extractFilterOptions(allProducts, slug);

    // Add dynamic product options (Color, Purity, Metal, etc.)
    const productOptions = extractProductOptions(collectionProducts);

    // Add collections as a filter option
    const collections = extractCollections(collectionProducts);

    return {
      ...baseFilters,
      productOptions,
      collections,
    } as any;
  }, [allProducts, slug, hasFiltersEnabled]);

  // Reset display count when filters or search changes
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filters, searchQuery]);

  const filteredProducts = useMemo(() => {
    // Deduplicate products while preserving subcollection handles
    const productMap = new Map<string, ShopifyProduct>();
    const handlesByProductId = new Map<string, Set<string>>();

    for (const product of allProducts) {
      const existing = productMap.get(product.id);
      const handles = handlesByProductId.get(product.id) || new Set<string>();

      if (product.__subCollectionHandle) {
        handles.add(product.__subCollectionHandle);
      }

      // Keep the product, preferring the one with a handle
      if (
        !existing ||
        (product.__subCollectionHandle && !existing.__subCollectionHandle)
      ) {
        productMap.set(product.id, product);
      }

      handlesByProductId.set(product.id, handles);
    }

    const uniqueProducts = Array.from(productMap.values());
    let filtered: ShopifyProduct[] = [];

    if (filters.categories.length > 0) {
      // User selected specific subcollections - show only products from those subcollections
      filtered = uniqueProducts.filter((p) => {
        const productHandles =
          handlesByProductId.get(p.id) ||
          new Set(p.__subCollectionHandle ? [p.__subCollectionHandle] : []);
        return Array.from(productHandles).some((handle) =>
          filters.categories.includes(handle),
        );
      });
    } else {
      // No subcollection selected - show only primary collection products
      filtered = uniqueProducts.filter((p) => !p.__subCollectionHandle);
    }

    // Filter by search query (if any)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      );
    }

    // Filter by shape (if any shapes are selected)
    if (filters.shape.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.shape.some((shape) => {
          // Match tags like "stone_shape_Round", "stone_shape_Oval", etc.
          return tags.some((tag: string) =>
            tag.toLowerCase().includes(`stone_shape_${shape.toLowerCase()}`),
          );
        });
      });
    }

    // Filter by price range (if set)
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter((p) => {
        try {
          const priceStr = p.variants?.[0]?.price;
          if (!priceStr) return false;
          const price = parseInt(String(priceStr).replace(/[^\d]/g, ""));
          if (isNaN(price)) return false;
          return price >= min && price <= max;
        } catch (error) {
          return false;
        }
      });
    }

    // Filter by occasion (if any are selected)
    if (filters.occasion.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.occasion.some((occ) => {
          const occLower = occ.toLowerCase();
          // Match tags like "Ocassion_Engagement", "Ocassion_Wedding", etc. (note: Shopify uses "Ocassion" spelling)
          return tags.some((tag: string) => {
            const tagLower = tag.toLowerCase();
            // Check for Ocassion_* tags (Shopify's spelling)
            if (tagLower.startsWith("ocassion_")) {
              const value = tagLower.substring(9);
              return (
                value === occLower || value.includes(occLower.replace(" ", ""))
              );
            }
            // Also check for collection tags like collection_evol_Dailywear, newcollection_dailywear
            if (
              tagLower.includes("collection_") ||
              tagLower.includes("newcollection_")
            ) {
              return tagLower.includes(occLower.replace(" ", ""));
            }
            return false;
          });
        });
      });
    }

    // Filter by forWhom (if any are selected)
    if (filters.forWhom.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        return filters.forWhom.some((whom) => {
          const whomLower = whom.toLowerCase();
          return tags.some((tag: string) => {
            const tagLower = tag.toLowerCase();
            // Match Gender_* tags and direct for_* tags
            if (tagLower.startsWith("gender_")) {
              const value = tagLower.substring(7);
              return (
                value.includes(whomLower) ||
                value.includes(whomLower.replace(" ", ""))
              );
            } else if (tagLower.startsWith("for_")) {
              const value = tagLower.substring(4);
              return (
                value.includes(whomLower) ||
                value.includes(whomLower.replace(" ", ""))
              );
            } else {
              return (
                tagLower === whomLower ||
                tagLower === whomLower.replace(" ", "")
              );
            }
          });
        });
      });
    }

    if (filters.size.length > 0) {
      const selectedSizes = filters.size;
      const slugLower = slug.toLowerCase();
      const isBraceletCollection = slugLower.includes("bracelet");
      const isRingCollection = slugLower === "rings" || slugLower === "ring";

      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        const variants = p.variants || [];
        const productType = (p.productType || "").toLowerCase();
        const isRingProduct = productType.includes("ring");
        const isBraceletProduct = productType.includes("bracelet");

        // Check tag-based size matching
        const tagMatch = tags.some((tag: string) => {
          const tagLower = tag.toLowerCase();
          if (!tagLower.includes("size")) return false;

          const match = tagLower.match(/(?:ring_)?size_(.+)/);
          if (!match) return false;

          const sizeValue = match[1];
          return selectedSizes.some(
            (selectedSize) =>
              sizeValue.toLowerCase().includes(selectedSize.toLowerCase()) ||
              sizeValue.toLowerCase() === selectedSize.toLowerCase(),
          );
        });

        if (tagMatch) return true;

        // Check variant-based size matching
        const variantMatch = variants.some((variant) => {
          if (!variant.title) return false;

          const title = variant.title;
          const titleLower = title.toLowerCase();

          // For ring collection or ring products
          if (isRingCollection || isRingProduct) {
            const ringPatterns = [
              /\/\s*(\d+)\s*$/,
              /\/\s*(\d+)\s*,/,
              /(?:ring\s+)?size[:\s-]*(\d+)/i,
              /\b(\d+)\s*(?:us\s+)?(?:ring|size)\b/i,
            ];

            for (const pattern of ringPatterns) {
              const match = titleLower.match(pattern);
              if (match) {
                const sizeValue = match[1];
                if (selectedSizes.includes(sizeValue)) {
                  return true;
                }
              }
            }
            return false;
          }

          // For bracelet collection or bracelet products
          if (isBraceletCollection || isBraceletProduct) {
            const parts = title.split("/");
            if (parts.length < 2) return false;

            let extractedSize = parts[parts.length - 1]?.trim();
            if (!extractedSize) return false;

            if (
              METAL_COLORS.some((color) =>
                extractedSize.toLowerCase().includes(color),
              )
            ) {
              return false;
            }

            const numMatch = extractedSize.match(/^(\d+)(?:\.\d+)?/);
            if (numMatch && !extractedSize.includes("anna")) {
              extractedSize = extractedSize.includes(".")
                ? extractedSize.split(/\s/)[0]
                : `${numMatch[1]}.0`;
            }

            const matched = selectedSizes.some(
              (s) => s.toLowerCase() === extractedSize.toLowerCase(),
            );
            return matched;
          }

          return false;
        });

        return variantMatch;
      });
    }

    // Filter by gross weight (if any are selected)
    if (filters.grossWeight.length > 0) {
      filtered = filtered.filter((p) => {
        const tags = p.tags || [];
        // Match tags like "Gross_Total_Weight_Range_1g-3g", "Gross_Total_Weight_Range_10g & more"
        return tags.some((tag: string) => {
          const tagLower = tag.toLowerCase();
          if (tagLower.startsWith("gross_total_weight_range_")) {
            const weightValue = tag.substring(25); // Remove "Gross_Total_Weight_Range_" prefix
            // Check if this weight value matches any selected weight
            return filters.grossWeight.some((selected) => {
              return (
                weightValue.toLowerCase() === selected.toLowerCase() ||
                weightValue.toLowerCase().replace(/_/g, " ") ===
                  selected.toLowerCase()
              );
            });
          }
          return false;
        });
      });
    }

    return filtered;
  }, [filters, allProducts, searchQuery, filteredSubCollections]);

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    switch (filters.currentSort) {
      case "featured":
        // Show products with "bestseller" or "tag_bestseller" tag first
        sorted.sort((a, b) => {
          const aHasBestseller = (a.tags || []).some((tag: string) => {
            const tagLower = tag.toLowerCase();
            return tagLower.includes("bestseller");
          });
          const bHasBestseller = (b.tags || []).some((tag: string) => {
            const tagLower = tag.toLowerCase();
            return tagLower.includes("bestseller");
          });
          if (aHasBestseller === bHasBestseller) return 0;
          return aHasBestseller ? -1 : 1;
        });
        break;

      case "newest":
        // Sort by creation date - newest first
        sorted.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate; // Descending (newest first)
        });
        break;

      case "price-low-to-high":
        sorted.sort((a, b) => {
          const aPriceStr = a.variants?.[0]?.price;
          const bPriceStr = b.variants?.[0]?.price;
          const aPrice = aPriceStr
            ? parseInt(String(aPriceStr).replace(/[^\d]/g, ""))
            : 0;
          const bPrice = bPriceStr
            ? parseInt(String(bPriceStr).replace(/[^\d]/g, ""))
            : 0;
          return (isNaN(aPrice) ? 0 : aPrice) - (isNaN(bPrice) ? 0 : bPrice);
        });
        break;

      case "price-high-to-low":
        sorted.sort((a, b) => {
          const aPriceStr = a.variants?.[0]?.price;
          const bPriceStr = b.variants?.[0]?.price;
          const aPrice = aPriceStr
            ? parseInt(String(aPriceStr).replace(/[^\d]/g, ""))
            : 0;
          const bPrice = bPriceStr
            ? parseInt(String(bPriceStr).replace(/[^\d]/g, ""))
            : 0;
          return (isNaN(bPrice) ? 0 : bPrice) - (isNaN(aPrice) ? 0 : aPrice);
        });
        break;

      default:
        break;
    }

    return sorted;
  }, [filteredProducts, filters.currentSort]);

  // Display products with infinite scroll
  const displayedProducts = sortedProducts.slice(0, displayCount);
  const hasMore = displayCount < sortedProducts.length || hasMoreProducts;

  const handleLoadMore = useCallback(async () => {
    // If we're displaying all loaded products but there are more in Shopify, fetch them
    if (displayCount >= sortedProducts.length && hasMoreProducts && nextCursor) {
      setIsLoadingMore(true);
      const result = await fetchMoreCollectionProducts(slug, nextCursor);

      if (result.products.length > 0) {
        // Add new products to the list
        const newProducts = result.products.map((p) => ({
          ...p,
          // Don't tag as subcollection since they're primary products
        }));
        setAllProducts((prev) => [...prev, ...newProducts]);
        setNextCursor(result.endCursor);
        setHasMoreProducts(result.hasNextPage);
      }
      setIsLoadingMore(false);
    } else {
      // Just increase the display count
      setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
    }
  }, [displayCount, sortedProducts.length, hasMoreProducts, nextCursor, slug]);

  return (
    <div className="min-h-screen bg-evol-light-grey">
      {/* Hero Banner */}
      <CollectionHeroBanner
        title={collectionData.title}
        descriptor={collectionData.descriptor}
        breadcrumb={collectionData.breadcrumb}
      />

      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} placeholder="Search Products..." />

      {/* Filter Bar - Only show for collections with filters enabled */}
      {hasFiltersEnabled && (
        <FilterBar
          resultCount={filteredProducts.length}
          subCollections={filteredSubCollections}
          filterOptions={filterOptions}
        />
      )}

      {/* Main Content */}
      <div className="bg-evol-light-grey px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <ProductGridSkeleton count={ITEMS_PER_PAGE} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="Nothing Here Yet."
              description="Try Adjusting Your Filters."
              actionLabel="Clear All Filters"
              onAction={clearAll}
              actionVariant="outline"
            />
          ) : (
            <>
              {/* Sort Bar */}
              <SortBar
                options={SORT_OPTIONS}
                currentSort={filters.currentSort}
                onSortChange={(value) => setSort(value as any)}
                resultCount={filteredProducts.length}
                resultLabel="Pieces"
                showResultCount={true}
              />

              {/* Product Grid */}
              <ShopifyProductGrid products={displayedProducts} />

              {/* Infinite Scroll Trigger */}
              <InfiniteScroll
                hasMore={hasMore}
                isLoading={isLoadingMore}
                onLoadMore={handleLoadMore}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
