"use client";

import type { ShopifyMetafield } from "@/lib/types";

interface ProductAboutSectionProps {
  metafields?: ShopifyMetafield[];
  description?: string;
  descriptionHtml?: string;
}

export function ProductAboutSection({
  metafields,
  description,
  descriptionHtml,
}: ProductAboutSectionProps) {
  if (!metafields || metafields.length === 0) return null;

  // Extract metafield values
  const getMetafieldValue = (key: string): string | null => {
    const field = metafields.find(
      (f) => f.key.toLowerCase() === key.toLowerCase(),
    );
    return field?.value || null;
  };

  // Extract specific fields for "About This Product"
  const bottomDescription = getMetafieldValue("bottom_description");
  const diamondWeight = getMetafieldValue("diamond_weight");
  const netWeight = getMetafieldValue("net_weight");
  const totalWeight = getMetafieldValue("total_weight");
  const deliveryTime = getMetafieldValue("delivery_time");

  // Check if there's any content to display
  const hasDescriptionContent =
    bottomDescription || description || descriptionHtml;
  const hasSpecs = diamondWeight || netWeight || totalWeight || deliveryTime;

  if (!hasDescriptionContent && !hasSpecs) return null;

  return (
    <div className="space-y-8 py-8">
      {/* Main Description */}
      {hasDescriptionContent && (
        <div>
          <h3 className="font-sans text-sm tracking-wider text-gray-500 uppercase mb-4">
            About This Product
          </h3>
          {descriptionHtml ? (
            <div
              className="prose prose-sm max-w-none text-gray-700 space-y-4"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <p className="font-body text-sm text-gray-700 leading-relaxed">
              {bottomDescription || description}
            </p>
          )}
        </div>
      )}

      {/* Product Specifications */}
      {hasSpecs && (
        <div>
          <h3 className="font-sans text-sm tracking-wider text-gray-500 uppercase mb-4">
            Specifications
          </h3>
          <div className="space-y-3">
            {diamondWeight && (
              <div className="flex justify-between items-start">
                <span className="font-body text-sm text-gray-600">
                  Diamond Weight:
                </span>
                <span className="font-body text-sm text-gray-900 font-medium">
                  {diamondWeight}
                </span>
              </div>
            )}
            {netWeight && (
              <div className="flex justify-between items-start">
                <span className="font-body text-sm text-gray-600">
                  Net Weight:
                </span>
                <span className="font-body text-sm text-gray-900 font-medium">
                  {netWeight}
                </span>
              </div>
            )}
            {totalWeight && !netWeight && (
              <div className="flex justify-between items-start">
                <span className="font-body text-sm text-gray-600">
                  Total Weight:
                </span>
                <span className="font-body text-sm text-gray-900 font-medium">
                  {totalWeight}
                </span>
              </div>
            )}
            {deliveryTime && (
              <div className="flex justify-between items-start">
                <span className="font-body text-sm text-gray-600">
                  Delivery Time:
                </span>
                <span className="font-body text-sm text-gray-900 font-medium">
                  {deliveryTime}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
