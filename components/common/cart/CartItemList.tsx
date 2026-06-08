"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { CartItem as CartStoreItem } from "@/lib/stores/cartStore";
import type { CartItem as CheckoutCartItem } from "@/lib/stores/checkoutStore";

type CartItem = CartStoreItem | CheckoutCartItem;

interface CartItemListProps {
  items: CartItem[];
  onUpdateQty?: (productId: string, qty: number, config?: any) => void;
  onRemove?: (productId: string, config?: any) => void;
  variant?: "cart" | "checkout" | "confirmation";
  showQuantityControls?: boolean;
}

export function CartItemList({
  items,
  onUpdateQty,
  onRemove,
  variant = "cart",
  showQuantityControls = true,
}: CartItemListProps) {
  const isCart = variant === "cart";

  // Type guard to differentiate between cart and checkout items
  const getColor = (item: CartItem) => {
    if ("color" in item) return item.color;
    return "Gold";
  };

  const getConfiguration = (item: CartItem) => {
    if ("configuration" in item) return item.configuration;

    // For cart store items, build configuration from purity and size
    if ("purity" in item || "size" in item) {
      const parts = [];
      if ("purity" in item && item.purity) parts.push(item.purity);
      if ("size" in item && item.size && item.size > 0) {
        parts.push(`Size ${item.size}`);
      }
      return parts.join(" · ");
    }

    return "";
  };

  const getPrice = (item: CartItem) => {
    return item.price;
  };

  const getQuantity = (item: CartItem) => {
    return item.quantity;
  };

  const getName = (item: CartItem) => {
    if ("name" in item) return item.name;
    if ("title" in item) return item.title;
    return "";
  };

  const getImage = (item: CartItem) => {
    return item.image;
  };

  const getKey = (item: CartItem) => {
    if ("id" in item) {
      return item.id;
    }
    return `${item.productId}-${item.color}`;
  };

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {items.map((item, idx) => (
        <div
          key={getKey(item)}
          className="flex gap-2 pb-2 border-b border-evol-grey"
        >
          {/* Image */}
          <div className="relative w-32 h-32 rounded-lg shrink-0 bg-evol-light-grey overflow-hidden">
            <Image
              src={getImage(item)}
              alt={getName(item)}
              fill
              sizes="128px"
              priority={idx === 0}
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg text-gray-900 line-clamp-2">
              {getName(item)}
            </h3>
            <div className="flex items-center gap-2 text-md text-gray-600 font-sans">
              <span className="text-gray-700 font-medium">
                {getColor(item)}
              </span>

              {getConfiguration(item) && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>{getConfiguration(item)}</span>
                </>
              )}
            </div>
            <p className="font-serif font-semibold text-lg text-gray-900 mt-1">
              ₹{getPrice(item).toLocaleString("en-IN")}
            </p>

            {/* Quantity Controls - Only show in cart drawer */}
            {showQuantityControls && onUpdateQty && onRemove && (
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateQty(item.productId, getQuantity(item) - 1, {
                      color: getColor(item),
                    })
                  }
                  aria-label="Decrease quantity"
                >
                  -
                </Button>
                <span className="font-sans text-sm w-6 text-center font-medium">
                  {getQuantity(item)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onUpdateQty(item.productId, getQuantity(item) + 1, {
                      color: getColor(item),
                    })
                  }
                  aria-label="Increase quantity"
                >
                  +
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onRemove(item.productId, { color: getColor(item) })
                  }
                  className="ml-auto text-md text-evolRed font-sans"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
