"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import type { ShopifyProduct } from "@/lib/types";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export function ShopifyProductCard({
  product,
  index,
}: ShopifyProductCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { isInWishlist, toggle } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);

  const price = parseInt(product.variants[0]?.price || "0");
  const firstImage = product.images[0]?.url;
  const secondImage = product.images[1]?.url;
  const imageUrl = isHovered && secondImage ? secondImage : firstImage;

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
          {/* Image Container */}
          <div
            className="relative aspect-4/5 overflow-hidden bg-evol-light-grey group rounded-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
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
              className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
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
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-start pt-3 md:pt-4 px-1">
            {/* Product Name */}
            <h3
              className="font-serif text-gray-900 line-clamp-2 text-base md:text-lg"
            >
              {product.title}
            </h3>

            {/* Price */}
            <p className="font-sans font-medium text-gray-900 text-sm md:text-base mt-2">
              ₹{price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
