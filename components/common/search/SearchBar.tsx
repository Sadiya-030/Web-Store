"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SearchBarProps {
  /** Callback fired when search value changes */
  onSearch: (query: string) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether to show the container wrapper (defaults to true) */
  showContainer?: boolean;
  /** CSS class for the outer container */
  containerClassName?: string;
  /** CSS class for the inner content wrapper */
  innerClassName?: string;
  /** CSS class for the input wrapper */
  inputWrapperClassName?: string;
  /** Focus border color class (defaults to "border-evolRed") */
  focusBorderColor?: string;
  /** Focus ring color class (defaults to "ring-evolRed") */
  focusRingColor?: string;
  /** Border color class (defaults to "border-evol-grey") */
  borderColor?: string;
}

/**
 * SearchBar Component
 *
 * A reusable search input component with clear button and debounced callback.
 *
 * @example
 * // Default - full-width with container
 * <SearchBar onSearch={handleSearch} placeholder="Search..." />
 *
 * @example
 * // Inline without container
 * <SearchBar onSearch={handleSearch} showContainer={false} />
 *
 * @example
 * // Custom styling
 * <SearchBar
 *   onSearch={handleSearch}
 *   containerClassName="bg-gray-100"
 *   focusBorderColor="border-blue-500"
 * />
 */
export function SearchBar({
  onSearch,
  placeholder = "Search Products...",
  showContainer = true,
  containerClassName = "",
  innerClassName = "",
  inputWrapperClassName = "",
  focusBorderColor = "border-evolRed",
  focusRingColor = "ring-evolRed",
  borderColor = "border-evol-grey",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  const inputElement = (
    <div className={`relative ${inputWrapperClassName}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-evol-dark-grey" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-10 py-2.5 border ${borderColor} rounded-lg text-base font-body focus:outline-none focus:${focusBorderColor} focus:ring-1 focus:${focusRingColor} transition-colors`}
      />
      {query && (
        <Button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-evol-dark-grey hover:text-evolRed transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </Button>
      )}
    </div>
  );

  if (!showContainer) {
    return inputElement;
  }

  return (
    <div className={`w-full bg-white border-b ${borderColor} px-4 md:px-6 py-4 ${containerClassName}`}>
      <div className={`max-w-7xl mx-auto ${innerClassName}`}>
        {inputElement}
      </div>
    </div>
  );
}
