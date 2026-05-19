"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filterStore";
import type { FilterBarProps } from "@/lib/types";
import { DEFAULT_FILTER_OPTIONS } from "@/lib/types/filterConfig";
import { filtersToURLParams } from "@/lib/utils/filterParamsMapping";
import { parseFilterParams } from "@/lib/utils/filterParamParser";
import { X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function FilterBar({
  resultCount,
  subCollections,
  filterOptions,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, setFilter, clearAll, hasActiveFilters } = useFilterStore();
  const options = filterOptions || DEFAULT_FILTER_OPTIONS;

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = filtersToURLParams(filters);
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, pathname, router]);

  useEffect(() => {
    const updates = parseFilterParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) setFilter(key as any, value);
    });
  }, [searchParams, setFilter]);

  const handleFilterChange = useCallback(
    (key: string, value: string, checked: boolean) => {
      if (key === "priceRange") {
        const [min, max] = value.split("-").map(Number);
        setFilter("priceRange", checked ? [min, max] : null);
        return;
      }

      const currentValues =
        (filters[key as keyof typeof filters] as string[]) || [];
      setFilter(
        key as any,
        checked
          ? [...currentValues, value]
          : currentValues.filter((v) => v !== value),
      );
    },
    [filters, setFilter],
  );

  const handleClearFilter = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFilter(key as any, key === "priceRange" ? null : []);
  };

  const categoryOptions = useMemo(
    () =>
      subCollections
        ? subCollections.map((sc) => ({ label: sc.title, value: sc.handle }))
        : ["Rings", "Earrings", "Necklaces", "Bracelets", "Pendants"].map(
            (v) => ({
              label: v,
              value: v,
            }),
          ),
    [subCollections],
  );

  const filterPills = useMemo(
    () => [
      ...(subCollections && subCollections.length > 0
        ? [
            {
              key: "categories",
              label: "Categories",
              options: categoryOptions,
              isActive: filters.categories.length > 0,
              values: filters.categories,
            },
          ]
        : []),
      {
        key: "shape",
        label: "Stone Shape",
        options: options.shape.map((v: string) => ({
          label: v,
          value: v,
        })),
        isActive: filters.shape.length > 0,
        values: filters.shape,
      },
      {
        key: "occasion",
        label: "Occasion",
        options: options.occasion.map((v: string) => ({
          label: v,
          value: v,
        })),
        isActive: filters.occasion.length > 0,
        values: filters.occasion,
      },
      {
        key: "forWhom",
        label: "For Whom?",
        options: options.forWhom.map((v: string) => ({
          label: v,
          value: v,
        })),
        isActive: filters.forWhom.length > 0,
        values: filters.forWhom,
      },
      ...(options.size.length > 0
        ? [
            {
              key: "size",
              label: "Size",
              options: options.size.map((v: string) => ({
                label: /^\d+(\.\d+)?$/.test(v) ? `${v}"` : v,
                value: v,
              })),
              isActive: filters.size.length > 0,
              values: filters.size,
            },
          ]
        : []),
      {
        key: "priceRange",
        label: "Price",
        options: options.priceRange,
        isActive: filters.priceRange !== null,
        values: filters.priceRange
          ? [`${filters.priceRange[0]}-${filters.priceRange[1]}`]
          : [],
      },
      {
        key: "grossWeight",
        label: "Gross Weight",
        options: options.grossWeight,
        isActive: filters.grossWeight.length > 0,
        values: filters.grossWeight,
      },
    ],
    [subCollections, filters, options],
  );

  return (
    <div className="w-full bg-white border-b border-evol-grey">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div
          className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 flex-wrap"
          suppressHydrationWarning
        >
          {/* Filter Pills */}
          {filterPills.map((pill) => (
            <div key={pill.key} className="relative" suppressHydrationWarning>
              {pill.isActive ? (
                <Button
                  onClick={(e) => handleClearFilter(pill.key, e)}
                  className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-md whitespace-nowrap text-sm md:text-base font-medium bg-evolRed text-white border border-evolRed shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-200"
                >
                  <span className="font-sans font-medium">{pill.label}</span>
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-md! whitespace-nowrap text-sm md:text-base font-medium bg-white border border-evol-grey text-evol-dark-grey hover:border-evolRed hover:shadow-sm transition-all duration-200">
                      {" "}
                      <span className="font-sans font-medium">
                        {pill.label}
                      </span>
                      <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="
                        w-56
                        md:w-64
                        bg-white
                        border
                        border-evol-grey
                        rounded-md!
                        shadow-lg
                        p-0
                        data-[state=open]:animate-none
                        data-[state=closed]:animate-none
                        data-[side=bottom]:slide-in-from-top-0
                      "
                    suppressHydrationWarning
                  >
                    <DropdownMenuLabel className="font-serif text-sm md:text-base px-3 py-2.5">
                      {pill.label}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    {pill.options.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={pill.values.includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleFilterChange(pill.key, option.value, checked)
                        }
                        className="
                          px-3
                          py-2.5
                          text-sm
                          md:text-base
                          cursor-pointer
                          transition-colors
                          rounded-none
                          border-0
                          outline-none
                          focus:outline-none
                          focus:bg-gray-50
                          focus:text-black
                          data-highlighted:bg-gray-50
                          data-highlighted:text-black
                          data-highlighted:outline-none
                          hover:bg-gray-50
                        "
                      >
                        <span className="font-body text-sm md:text-base">
                          {option.label}
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}

          {/* Clear all link */}
          {hasActiveFilters() && (
            <Button
              onClick={() => clearAll()}
              className="text-sm md:text-sm text-evolRed font-medium hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              Clear All
            </Button>
          )}

          {/* Results Count */}
          <div className="text-sm md:text-sm text-evol-dark-grey font-body whitespace-nowrap">
            {resultCount} Pieces
          </div>
        </div>
      </div>
    </div>
  );
}
