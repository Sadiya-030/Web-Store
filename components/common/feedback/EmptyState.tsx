"use client";

import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  /** Title text (defaults to "Nothing Here Yet.") */
  title?: string;
  /** Description text (defaults to "No items to display.") */
  description?: string;
  /** Optional icon to display above the title */
  icon?: React.ReactNode;
  /** Label for the action button */
  actionLabel?: string;
  /** Callback when action button is clicked */
  onAction?: () => void;
  /** Button variant */
  actionVariant?: "primary" | "outline";
  /** Additional CSS classes */
  className?: string;
}

/**
 * EmptyState Component
 *
 * A reusable empty state component for displaying when no content is available.
 * Can be used for filtered results, empty lists, search results, etc.
 *
 * @example
 * // Default empty state
 * <EmptyState />
 *
 * @example
 * // With custom content and action
 * <EmptyState
 *   title="No Results Found"
 *   description="Try adjusting your search terms"
 *   actionLabel="Clear Search"
 *   onAction={() => setSearch("")}
 * />
 *
 * @example
 * // With icon
 * <EmptyState
 *   icon={<SearchIcon className="w-12 h-12" />}
 *   title="No Orders"
 *   description="Start Shopping to See Your Orders"
 *   actionLabel="Browse Products"
 *   onAction={() => router.push("/shop")}
 * />
 */
export function EmptyState({
  title = "Nothing Here Yet.",
  description = "No Items to Display.",
  icon,
  actionLabel,
  onAction,
  actionVariant = "outline",
  className = "",
}: EmptyStateProps) {
  const buttonClasses =
    actionVariant === "primary"
      ? "px-6 md:px-8 py-2 md:py-3 bg-evolRed text-white font-sans font-medium text-sm md:text-base rounded-full hover:bg-red-700 transition-colors"
      : "px-6 md:px-8 py-2 md:py-3 border-2 border-evolRed text-evolRed font-sans font-medium text-sm md:text-base rounded-full hover:bg-evolRed hover:text-white transition-colors";

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 md:py-20 ${className}`}
    >
      {icon && <div className="mb-4 md:mb-6">{icon}</div>}
      <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2 md:mb-3">
        {title}
      </h2>
      <p className="font-body text-sm md:text-base text-evol-dark-grey mb-6 md:mb-8">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className={buttonClasses}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
