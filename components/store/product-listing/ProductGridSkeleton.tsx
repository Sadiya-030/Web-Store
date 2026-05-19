"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-7">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-full flex flex-col">
          {/* Image Skeleton */}
          <Skeleton className="aspect-4/5 rounded-lg mb-3" />

          {/* Title Skeleton */}
          <Skeleton className="h-6 w-full mb-2 rounded" />
          <Skeleton className="h-5 w-3/4 mb-3 rounded" />

          {/* Price Skeleton */}
          <Skeleton className="h-5 w-1/3 rounded" />
        </div>
      ))}
    </div>
  );
}
