"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseMetafieldKeyValues } from "@/lib/utils/deliveryDate";
import type { ShopifyMetafield } from "@/lib/types";

interface ProductAboutSectionProps {
  metafields?: ShopifyMetafield[];
  description?: string;
}

export function ProductAboutSection({
  metafields,
  description,
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
  const stoneDetails = getMetafieldValue("stone_details");
  const topDetails = getMetafieldValue("top_details");

  // Parse the metafield content into key-value pairs
  const stonePairs = parseMetafieldKeyValues(stoneDetails);
  const topPairs = parseMetafieldKeyValues(topDetails);

  // Check if there's any content to display
  const hasDescriptionContent = bottomDescription || description;

  if (!hasDescriptionContent && stonePairs.length === 0 && topPairs.length === 0) return null;

  return (
    <div className="space-y-8 py-8">
      <div>
        <h3 className="font-sans text-sm tracking-wider text-gray-500 uppercase mb-4">
          About This Product
        </h3>
        {hasDescriptionContent && (
          <p className="font-sans text-sm text-gray-700 leading-relaxed mb-6">
            {bottomDescription || description}
          </p>
        )}

        {/* Stone Details Table */}
        {stonePairs.length > 0 && (
          <div className="mb-8">
            <h4 className="font-serif text-lg font-semibold text-gray-900 mb-4">
              Stone Details
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans font-medium">
                    Property
                  </TableHead>
                  <TableHead className="font-sans font-medium">
                    Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stonePairs.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-sans text-sm text-gray-600">
                      {key}
                    </TableCell>
                    <TableCell className="font-sans text-sm text-gray-900 font-medium">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Top Details Table */}
        {topPairs.length > 0 && (
          <div>
            <h4 className="font-serif text-lg font-semibold text-gray-900 mb-4">
              Weight & Specifications
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans font-medium">
                    Property
                  </TableHead>
                  <TableHead className="font-sans font-medium">
                    Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPairs.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-sans text-sm text-gray-600">
                      {key}
                    </TableCell>
                    <TableCell className="font-sans text-sm text-gray-900 font-medium">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
