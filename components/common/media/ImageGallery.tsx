"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  /** URL of the image */
  url: string;
  /** Alt text for accessibility */
  alt?: string;
}

export interface ImageGalleryProps {
  /** Array of image URLs or GalleryImage objects */
  images: GalleryImage[] | string[];
  /** Base text for alt attributes (defaults to "Image") */
  altTextBase?: string;
  /** Index of the image to show first (defaults to 0) */
  featuredIndex?: number;
  /** Whether to show thumbnail carousel (defaults to true) */
  showThumbnails?: boolean;
  /** Position of thumbnails on desktop (defaults to "left") */
  thumbnailPosition?: "left" | "bottom";
  /** Whether to enable zoom on hover (defaults to true) */
  enableZoom?: boolean;
  /** Whether to enable fullscreen mode (defaults to true) */
  enableFullscreen?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional featured image to show first */
  featuredImage?: {
    url: string;
    alt?: string;
  };
}

/**
 * ImageGallery Component
 *
 * A feature-rich image gallery with zoom, fullscreen, thumbnails, and keyboard navigation.
 *
 * @example
 * // Simple gallery with strings
 * <ImageGallery
 *   images={["/img1.jpg", "/img2.jpg"]}
 *   altTextBase="Product"
 * />
 *
 * @example
 * // With structured images
 * <ImageGallery
 *   images={[
 *     { url: "/img1.jpg", alt: "Front view" },
 *     { url: "/img2.jpg", alt: "Back view" }
 *   ]}
 * />
 *
 * @example
 * // Custom configuration
 * <ImageGallery
 *   images={images}
 *   featuredIndex={1}
 *   showThumbnails={false}
 *   enableZoom={true}
 *   thumbnailPosition="bottom"
 * />
 */
export function ImageGallery({
  images,
  altTextBase = "Image",
  featuredIndex = 0,
  showThumbnails = true,
  thumbnailPosition = "left",
  enableZoom = true,
  enableFullscreen = true,
  className = "",
  featuredImage,
}: ImageGalleryProps) {
  const [mainImageIndex, setMainImageIndex] = useState(featuredIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Normalize images to GalleryImage format
  const normalizedImages = useMemo(() => {
    return images.map((img) => {
      if (typeof img === "string") {
        return { url: img, alt: altTextBase };
      }
      return { ...img, alt: img.alt || altTextBase };
    });
  }, [images, altTextBase]);

  // Prepare display images - featured image first if provided
  const displayImages = useMemo(() => {
    if (featuredImage) {
      const featured = { url: featuredImage.url, alt: featuredImage.alt || altTextBase };
      const others = normalizedImages.filter((img) => img.url !== featuredImage.url);
      return [featured, ...others];
    }
    return normalizedImages;
  }, [normalizedImages, featuredImage, altTextBase]);

  const handleThumbnailClick = (index: number) => {
    setMainImageIndex(index);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || !mainImageRef.current) return;

    const rect = mainImageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setZoomPos({ x, y });
    setShowZoom(true);
  }, [enableZoom]);

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const handleFullscreenNext = () => {
    setMainImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handleFullscreenPrev = () => {
    setMainImageIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  useEffect(() => {
    if (!enableFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === "ArrowRight") {
          handleFullscreenNext();
        } else if (e.key === "ArrowLeft") {
          handleFullscreenPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayImages.length, isFullscreen, enableFullscreen]);

  if (!displayImages.length) {
    return null;
  }

  const thumbnails = showThumbnails ? (
    <div className={`w-25 shrink-0 ${thumbnailPosition === "left" ? "" : "hidden"}`}>
      <div className="flex h-195 flex-col items-center gap-3 overflow-y-auto pr-1 pt-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {displayImages.map(
          (img, idx) =>
            img && (
              <Button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md transition-all ${
                  mainImageIndex === idx
                    ? "ring-2 ring-gray-900"
                    : "ring-1 ring-evol-grey hover:ring-gray-400"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `View ${idx + 1}`}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              </Button>
            ),
        )}
      </div>
    </div>
  ) : null;

  const mainImage = displayImages[mainImageIndex];

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Layout */}
      <div className={`hidden lg:flex gap-4 ${thumbnailPosition === "bottom" ? "flex-col" : ""}`}>
        {thumbnailPosition === "left" && thumbnails}

        {/* Main image */}
        <div className="flex-1">
          <div
            ref={mainImageRef}
            className="relative w-full aspect-square bg-evol-light-grey overflow-hidden group cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => enableFullscreen && setIsFullscreen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mainImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative"
              >
                {mainImage && (
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt || `View ${mainImageIndex + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover"
                    priority
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Zoom lens */}
            {enableZoom && showZoom && mainImage && (
              <motion.div
                className="absolute top-4 right-4 w-44 h-44 border border-evol-grey bg-white bg-opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `url(${mainImage.url})`,
                  backgroundPosition: `${(zoomPos.x / (mainImageRef.current?.offsetWidth || 1)) * 100}% ${(zoomPos.y / (mainImageRef.current?.offsetHeight || 1)) * 100}%`,
                  backgroundSize: "200%",
                  backgroundRepeat: "no-repeat",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            {/* Fullscreen Button */}
            {enableFullscreen && (
              <Button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 p-2 bg-white rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Fullscreen gallery"
              >
                <Expand className="w-5 h-5 text-gray-900" />
              </Button>
            )}
          </div>
        </div>

        {/* Bottom thumbnails for desktop */}
        {showThumbnails && thumbnailPosition === "bottom" && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {displayImages.map((img, idx) =>
              img ? (
                <Button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative shrink-0 w-20 h-20 rounded transition-all ${
                    mainImageIndex === idx
                      ? "ring-2 ring-gray-900"
                      : "ring-1 ring-evol-grey"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `View ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                </Button>
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Main image */}
        <div
          className={`w-full aspect-square bg-evol-light-grey overflow-hidden mb-3 rounded relative ${enableFullscreen ? "cursor-pointer" : ""}`}
          onClick={() => enableFullscreen && setIsFullscreen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mainImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              {mainImage && (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || `View ${mainImageIndex + 1}`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover"
                  priority
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnails horizontal */}
        {showThumbnails && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {displayImages.map((img, idx) =>
              img ? (
                <Button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative shrink-0 w-16 h-16 rounded transition-all ${
                    mainImageIndex === idx
                      ? "ring-2 ring-gray-900"
                      : "ring-1 ring-evol-grey"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `View ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-cover"
                  />
                </Button>
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {enableFullscreen && (
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFullscreen(false)}
            >
              {/* Close Button */}
              <Button
                onClick={() => setIsFullscreen(false)}
                className="
                  absolute top-6 right-6 z-10
                  p-3 rounded-full
                  text-white
                  bg-white/5
                  border border-white/10
                  backdrop-blur-md
                  transition-all duration-300
                  hover:bg-white/15
                  hover:border-white/20
                  hover:scale-105
                  active:scale-95
                  "
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Main image */}
              <div
                className="relative w-11/12 h-5/6 max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainImageIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full relative"
                  >
                    {mainImage && (
                      <Image
                        src={mainImage.url}
                        alt={mainImage.alt || `View ${mainImageIndex + 1}`}
                        fill
                        unoptimized
                        sizes="90vw"
                        className="object-contain"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullscreenPrev();
                  }}
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    p-3 rounded-full
                    text-white
                    bg-white/5
                    border border-white/10
                    backdrop-blur-md
                    shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                    transition-all duration-300
                    hover:bg-white/15
                    hover:border-white/20
                    hover:scale-105
                    active:scale-95
                    "
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullscreenNext();
                  }}
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    p-3 rounded-full
                    text-white
                    bg-white/5
                    border border-white/10
                    backdrop-blur-md
                    shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                    transition-all duration-300
                    hover:bg-white/15
                    hover:border-white/20
                    hover:scale-105
                    active:scale-95
                    "
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                  {mainImageIndex + 1} / {displayImages.length}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
