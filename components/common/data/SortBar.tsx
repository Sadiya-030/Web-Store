"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SortOption {
  /** The value identifier for this sort option */
  value: string;
  /** Display label for this sort option */
  label: string;
}

export interface SortBarProps {
  /** Array of sort options available */
  options: SortOption[];
  /** Currently selected sort value */
  currentSort: string;
  /** Callback when a sort option is selected */
  onSortChange: (value: string) => void;
  /** Number of results to display count for */
  resultCount?: number;
  /** Label for results (defaults to "items") */
  resultLabel?: string;
  /** Whether to show result count (defaults to true) */
  showResultCount?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SortBar Component
 *
 * A flexible sort dropdown with optional result count display.
 *
 * @example
 * // Basic usage
 * <SortBar
 *   options={[
 *     { value: "newest", label: "Newest" },
 *     { value: "price-low", label: "Price: Low to High" }
 *   ]}
 *   currentSort="newest"
 *   onSortChange={handleSort}
 * />
 *
 * @example
 * // With result count
 * <SortBar
 *   options={options}
 *   currentSort={sort}
 *   onSortChange={setSort}
 *   resultCount={42}
 *   resultLabel="products"
 * />
 */
export function SortBar({
  options,
  currentSort,
  onSortChange,
  resultCount,
  resultLabel = "items",
  showResultCount = true,
  className = "",
}: SortBarProps) {
  const currentSortLabel =
    options.find((opt) => opt.value === currentSort)?.label || "Sort By";

  return (
    <div className={`flex items-center justify-between mb-6 md:mb-8 ${className}`}>
      {showResultCount && resultCount !== undefined && (
        <p className="font-body text-sm md:text-base text-evol-dark-grey">
          {resultCount} {resultLabel}
        </p>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded border border-evol-grey text-evol-dark-grey hover:border-evolRed hover:shadow-sm text-sm md:text-base font-medium transition-all duration-200 bg-white">
            <span className="font-sans font-medium">
              Sort By: {currentSortLabel}
            </span>
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 md:w-64 bg-white border border-evol-grey"
        >
          <DropdownMenuLabel className="font-serif text-sm md:text-base px-3 py-2.5">
            Sort By
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-3 py-2.5 text-sm md:text-base cursor-pointer transition-colors ${
                currentSort === option.value
                  ? "bg-evolRed bg-opacity-10 text-evolRed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-body text-sm md:text-base">
                {option.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
