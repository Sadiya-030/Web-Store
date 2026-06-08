"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "motion/react";

export interface InfiniteScrollProps {
  /** Whether data is currently loading */
  isLoading?: boolean;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Callback fired when component comes into view and more items exist */
  onLoadMore: () => void;
  /** Optional children to render */
  children?: React.ReactNode;
  /** Color class for loading dots (defaults to "bg-evolRed") */
  dotColor?: string;
}

/**
 * InfiniteScroll Component
 *
 * Automatically triggers onLoadMore when the element comes into view.
 * The trigger fires when element is 100px before entering viewport.
 *
 * @example
 * <InfiniteScroll
 *   hasMore={hasMore}
 *   isLoading={isLoading}
 *   onLoadMore={loadMore}
 * />
 *
 * @example
 * // With custom dot color
 * <InfiniteScroll
 *   hasMore={hasMore}
 *   isLoading={isLoading}
 *   onLoadMore={loadMore}
 *   dotColor="bg-blue-500"
 * />
 */
export function InfiniteScroll({
  isLoading = false,
  hasMore,
  onLoadMore,
  children,
  dotColor = "bg-evolRed",
}: InfiniteScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isInView, hasMore, isLoading, onLoadMore]);

  if (!hasMore) {
    return null;
  }

  return (
    <div ref={ref} className="flex items-center justify-center py-8 md:py-12">
      {isLoading && (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotColor} animate-bounce`} />
          <div
            className={`w-2 h-2 rounded-full ${dotColor} animate-bounce animation-delay-100`}
          />
          <div
            className={`w-2 h-2 rounded-full ${dotColor} animate-bounce animation-delay-200`}
          />
        </div>
      )}
      {children}
    </div>
  );
}
