"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromiseGrid } from "@/components/common/feedback/PromiseGrid";
import { CartItemList } from "@/components/common/cart/CartItemList";
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
            <div className="flex items-center justify-between p-4 border-b border-evol-grey">
              <h2 className="font-serif text-lg md:text-xl font-semibold text-gray-900">
                Your Bag
              </h2>
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
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="font-serif text-2xl font-semibold text-gray-900 mb-2">
                    Your Bag Is Empty
                  </p>
                  <p className="font-sans text-base text-gray-600">
                    Add Some Beautiful Pieces To Get Started
                  </p>
                </div>
              </div>
            ) : (
              <CartItemList
                items={items}
                onUpdateQty={updateQty}
                onRemove={remove}
                variant="cart"
              />
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-evol-grey p-4 space-y-2">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-base text-gray-600 font-medium">
                    Subtotal
                  </span>
                  <span className="font-serif font-semibold text-lg text-gray-900">
                    ₹{total().toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Promise Grid */}
                <div className="space-y-1">
                  <p className="font-sans text-sm tracking-wider text-gray-500 uppercase font-semibold">
                    Our Promise
                  </p>
                  <PromiseGrid columns={4} rows={2} />
                </div>

                {/* Checkout Button */}
                <a href="/checkout" className="block">
                  <Button className="w-full h-12 bg-evolRed hover:bg-red-700 text-white font-sans font-semibold text-base transition-all">
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
