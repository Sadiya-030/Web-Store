"use client";

import { Loader2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export interface PageLoaderProps {
  /** Loading message to display */
  message?: string;
  /** Loading variant style */
  variant?: "spinner" | "text" | "dots";
  /** Size of the loader */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Whether to use full screen container (defaults to true) */
  fullscreen?: boolean;
}

/**
 * PageLoader Component
 *
 * A reusable full-page or inline loading state component with multiple variants.
 *
 * @example
 * // Full-page text loading
 * <PageLoader message="Loading..." variant="text" fullscreen />
 *
 * @example
 * // Inline spinner
 * <PageLoader variant="spinner" fullscreen={false} />
 *
 * @example
 * // Bouncing dots
 * <PageLoader message="Processing" variant="dots" />
 */
export function PageLoader({
  message = "Loading...",
  variant = "text",
  size = "md",
  className = "",
  fullscreen = true,
}: PageLoaderProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const spinnerSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const contentClass = fullscreen
    ? "min-h-screen bg-evol-light-grey flex items-center justify-center"
    : "flex items-center justify-center py-8";

  const wrapperClass = `${contentClass} ${className}`;

  if (variant === "spinner") {
    return (
      <div className={wrapperClass}>
        <div className="text-center">
          <Spinner className={spinnerSizeClasses[size]} />
          {message && (
            <p className={`${sizeClasses[size]} text-evol-grey mt-4`}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={wrapperClass}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-evolRed animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-evolRed animate-bounce animation-delay-100" />
            <div className="w-2 h-2 rounded-full bg-evolRed animate-bounce animation-delay-200" />
          </div>
          {message && (
            <p className={`${sizeClasses[size]} text-evol-grey`}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default: text variant
  return (
    <div className={wrapperClass}>
      <div className="text-center">
        <p className={`${sizeClasses[size]} text-evol-grey`}>
          {message}
        </p>
      </div>
    </div>
  );
}
