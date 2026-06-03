"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef, useState, useMemo, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { parseShippingInfo } from "@/lib/utils/deliveryDate";
import { ProductUnavailableDialog } from "./ProductUnavailableDialog";
import type { ShopifyProduct } from "@/lib/types";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  index: number;
}

const COLOR_ORDER: Record<string, number> = {
  "yellow gold": 0,
  "white gold": 1,
  "rose gold": 2,
  gold: 3,
  silver: 4,
  platinum: 5,
};

export function ShopifyProductCard({
  product,
  index,
}: ShopifyProductCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { isInWishlist, toggle } = useWishlistStore();
  const { add: addToCart, setOpen: setCartOpen } = useCartStore();
  const isFavorite = isInWishlist(product.id);
  const [selectedColorValue, setSelectedColorValue] = useState<string | null>(
    null,
  );
  const [showUnavailableDialog, setShowUnavailableDialog] = useState(false);

  // Extract delivery days from product metafields
  const deliveryDays = useMemo(() => {
    const shippingInfoField = product.metafields?.find(
      (f) => f.key.toLowerCase() === "shipping_info",
    );
    return parseShippingInfo(shippingInfoField?.value);
  }, [product.metafields]);

  // Extract unique color variants
  const colorVariants = product.variants
    .map((variant) => {
      // Look for color in selected options
      const colorOption = variant.selectedOptions?.find(
        (opt) =>
          opt.name.toLowerCase() === "color" ||
          opt.name.toLowerCase() === "metal color",
      );
      return colorOption
        ? {
            label: colorOption.value,
            value: colorOption.value,
            variant,
          }
        : null;
    })
    .filter((v) => v !== null);

  // Get unique colors and sort by predefined order
  const uniqueColors = Array.from(
    new Map(colorVariants.map((cv) => [cv?.label, cv])).values(),
  ).sort((a, b) => {
    const orderA = COLOR_ORDER[a?.label?.toLowerCase() || ""] ?? 999;
    const orderB = COLOR_ORDER[b?.label?.toLowerCase() || ""] ?? 999;
    return orderA - orderB;
  });

  // Set default color to first available color on mount
  useEffect(() => {
    if (selectedColorValue === null && uniqueColors.length > 0) {
      setSelectedColorValue(uniqueColors[0]?.label || null);
    }
  }, [uniqueColors.length, selectedColorValue]);

  const selectedVariant = selectedColorValue
    ? colorVariants.find((cv) => cv?.label === selectedColorValue)?.variant
    : product.variants[0];

  // Check if product has color options (for gold beans and similar products)
  const hasColorOptions = uniqueColors.length > 0;

  const price = parseInt(selectedVariant?.price || "0");
  const imageUrl = selectedVariant?.image?.url || product.images[0]?.url;

  // Get color swatches - map common colors to Evol color scheme
  const getColorSwatch = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      "yellow gold": "#D4AF37",
      "white gold": "#E8E8E8",
      "rose gold": "#D4917D",
      gold: "#D4AF37",
      silver: "#E8E8E8",
      platinum: "#E8E8E8",
    };
    return colorMap[colorName.toLowerCase()] || "#D4AF37";
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariant) {
      setShowUnavailableDialog(true);
      return;
    }

    // Only require selectedColorValue if product has color options
    if (hasColorOptions && !selectedColorValue) return;

    // Check if selected variant is available for sale
    if (!selectedVariant.availableForSale) {
      setShowUnavailableDialog(true);
      return;
    }

    // For products without color options, check if there are ANY available variants
    // This handles cases like gold beans where we might not have a specific size selected
    if (!hasColorOptions) {
      const hasAnyAvailableVariant = product.variants.some((v) => v.availableForSale);
      if (!hasAnyAvailableVariant) {
        setShowUnavailableDialog(true);
        return;
      }
    }

    addToCart({
      productId: product.id,
      name: product.title,
      image: imageUrl || "",
      price,
      color: selectedColorValue || "Standard",
      quantity: 1,
      deliveryDays,
    });

    setCartOpen(true);
  };

  const handleColorSelect = (e: React.MouseEvent, colorLabel: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorValue(colorLabel);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ y: 16, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.6,
        ease: "easeOut",
      }}
      className="h-full"
    >
      <Link href={`/products/${product.handle}`}>
        <div className="h-full flex flex-col cursor-pointer">
          {/* Image Container with Overlays */}
          <div className="relative aspect-4/5 overflow-hidden bg-evol-light-grey group rounded-lg">
            {/* Product Image */}
            {imageUrl && (
              <motion.div
                className="w-full h-full relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* Hover shadow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              whileHover={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            />

            {/* Wishlist Button */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                toggle(product.id);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
              aria-label={
                isFavorite ? "Remove from Wishlist" : "Add to Wishlist"
              }
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorite
                    ? "fill-evolRed text-evolRed"
                    : "text-evol-dark-grey"
                }`}
              />
            </Button>

            {/* Color Bubbles - Above Add to Cart */}
            {uniqueColors.length > 0 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                {uniqueColors.map((colorVar) => (
                  <motion.button
                    key={colorVar?.label}
                    onClick={(e) => handleColorSelect(e, colorVar?.label || "")}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColorValue === colorVar?.label
                        ? "border-white ring-2 ring-evolRed scale-110"
                        : "border-white hover:scale-110"
                    }`}
                    style={{
                      backgroundColor: getColorSwatch(colorVar?.label || ""),
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                    title={colorVar?.label}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            )}

            {/* Add to Cart Button - Bottom of Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAddToCart}
                className="w-full bg-evolRed hover:bg-red-700 text-white font-sans font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-start pt-3 md:pt-4 px-1">
            {/* Product Name */}
            <h3 className="font-serif text-gray-900 line-clamp-2 text-base md:text-lg">
              {product.title}
            </h3>

            {/* Price */}
            <p className="font-sans font-medium text-gray-900 text-sm md:text-base mt-2">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </Link>

      <ProductUnavailableDialog
        open={showUnavailableDialog}
        onOpenChange={setShowUnavailableDialog}
        productTitle={product.title}
      />
    </motion.div>
  );
}
