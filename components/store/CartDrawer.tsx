"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cartStore";

export function CartDrawer() {
  const { items, isOpen, setOpen, total, remove, updateQty } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-evol-grey">
              <h2 className="font-serif text-xl text-gray-900">Your Bag</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <p className="font-serif text-lg text-gray-900 mb-2">
                    Your Bag Is Empty
                  </p>
                  <p className="font-body text-sm text-gray-600">
                    Add Some Beautiful Pieces To Get Started
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 pb-4 border-b border-evol-grey"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded shrink-0 bg-evol-light-grey overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                        {item.purity && <span>{item.purity}</span>}
                        {item.size && item.size > 0 && <span>·</span>}
                        {item.size && item.size > 0 && (
                          <span>Size {item.size}</span>
                        )}
                      </div>
                      <p className="font-sans font-medium text-sm text-gray-900 mt-2">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQty(item.productId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          -
                        </Button>
                        <span className="font-sans text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQty(item.productId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(item.productId)}
                          className="ml-auto text-sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-evol-grey p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-gray-600">Subtotal</span>
                  <span className="font-sans font-medium text-gray-900">
                    ₹{total().toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="font-body text-sm text-gray-600">
                  Shipping And Taxes Calculated At Checkout
                </p>
                <a href="/checkout" className="block">
                  <Button className="w-full h-12 bg-evolRed hover:bg-red-700 text-white font-sans font-medium">
                    Proceed To Checkout
                  </Button>
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
