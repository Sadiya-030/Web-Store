"use client";

import { useEffect, useRef } from "react";
import type { ShopifyMetafield } from "@/lib/types";
import { getBestVideoSource } from "@/lib/utils/videoQuality";

interface ProductSpecificationVideoProps {
  metafields?: ShopifyMetafield[];
  featuredImageUrl?: string;
}

export function ProductSpecificationVideo({
  metafields,
  featuredImageUrl,
}: ProductSpecificationVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Setup autoplay when video enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {
            // Autoplay might be blocked by browser
          });
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.5 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  // First, look for video references in metafields
  let videoSources: Array<{
    url: string;
    mimeType: string;
    format: string;
  }> | null = null;

  if (metafields) {
    for (const field of metafields) {
      if (!field.value) continue;

      const keyLower = field.key.toLowerCase();

      // Check for video-related keys with file_reference type
      if (
        (keyLower.includes("video") || keyLower.includes("specification")) &&
        field.type === "file_reference" &&
        field.reference?.sources
      ) {
        videoSources = field.reference.sources;
        break;
      }
    }
  }

  if (videoSources && videoSources.length > 0) {
    const bestSource = getBestVideoSource(videoSources);

    if (bestSource) {
      return (
        <div className="py-8 border-b border-evol-grey">
          <h3 className="font-sans text-sm tracking-wider text-gray-500 uppercase mb-6">
            Product Showcase
          </h3>
          <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              controls
              muted
              className="w-full h-full"
              title="Product Specification Video"
              suppressHydrationWarning
            >
              <source src={bestSource.url} type={bestSource.mimeType} suppressHydrationWarning />
              Your Browser Does Not Support the Video Tag.
            </video>
          </div>
        </div>
      );
    }
  }

  // Fallback to featured image if no video found
  if (featuredImageUrl) {
    return (
      <div className="py-8 border-b border-evol-grey">
        <h3 className="font-sans text-sm tracking-wider text-gray-500 uppercase mb-6">
          Product Showcase
        </h3>
        <div className="flex justify-start rounded-lg bg-white p-4">
          <img
            src={featuredImageUrl}
            alt="Product showcase"
            className="h-auto max-h-125 w-auto max-w-full object-contain"
          />
        </div>
      </div>
    );
  }

  return null;
}
