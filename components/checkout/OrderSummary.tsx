"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/lib/stores/checkoutStore";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string | null;
  onRemoveDiscount?: () => void;
  onApplyDiscount?: (code: string) => void;
  isCollapsed?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  discount,
  discountCode,
  onRemoveDiscount,
  onApplyDiscount,
  isCollapsed = false,
}: OrderSummaryProps) {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountInputValue, setDiscountInputValue] = useState("");
  const [isCollapsedLocal, setIsCollapsedLocal] = useState(isCollapsed);

  const total = subtotal - discount;

  const handleApplyDiscount = () => {
    if (discountInputValue.trim()) {
      onApplyDiscount?.(discountInputValue);
      setDiscountInputValue("");
      setShowDiscountInput(false);
    }
  };

  return (
    <motion.div
      className="bg-white border border-evol-grey rounded-lg overflow-hidden"
      layout
    >
      {/* Header */}
      <div
        className="p-5 md:p-6 border-b border-evol-grey flex items-center justify-between cursor-pointer md:cursor-default"
        onClick={() => setIsCollapsedLocal(!isCollapsedLocal)}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-18px font-playfair text-evol-dark-grey">
            Order Summary
          </h3>
          <span className="px-2 py-1 bg-evol-light-grey rounded-full text-11px font-inter text-evol-dark-grey">
            {items.length} Item{items.length !== 1 ? "s" : ""}
          </span>
        </div>
        {isCollapsedLocal && (
          <span className="text-14px text-evol-grey md:hidden">▼</span>
        )}
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsedLocal && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 md:p-6 space-y-5">
              {/* Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-evol-light-grey last:border-b-0 last:pb-0"
                  >
                    <div className="relative w-18 h-18 shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded border border-evol-grey"
                      />
                      {item.quantity > 1 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-evol-dark-grey rounded-full flex items-center justify-center text-white text-11px font-medium">
                          {item.quantity}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-14px font-inter font-medium text-evol-dark-grey truncate">
                        {item.title}
                      </p>
                      <p className="text-12px font-dmsans text-evol-grey mt-1">
                        {item.configuration}
                      </p>
                      <p className="text-14px font-inter text-evol-dark-grey mt-2">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="pt-4 border-t border-evol-light-grey">
                {discountCode ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-green-50 rounded border border-green-200">
                    <span className="text-13px font-inter text-green-700">
                      {discountCode} applied — ₹{discount.toLocaleString()} off
                    </span>
                    <Button
                      onClick={onRemoveDiscount}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    {!showDiscountInput ? (
                      <Button
                        onClick={() => setShowDiscountInput(true)}
                        className="text-13px font-inter text-evolRed hover:opacity-80"
                      >
                        Have a Code?
                      </Button>
                    ) : (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-2"
                      >
                        <Input
                          type="text"
                          placeholder="Enter Code"
                          value={discountInputValue}
                          onChange={(e) =>
                            setDiscountInputValue(e.target.value.toUpperCase())
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleApplyDiscount();
                          }}
                          className="flex-1 h-10 px-3 py-2 text-13px border rounded text-evol-dark-grey border-[#E5E5E5] focus-visible:ring-black/5"
                          autoFocus
                        />
                        <Button
                          onClick={handleApplyDiscount}
                          variant="outline"
                          className="h-10 px-3 py-2 text-13px font-inter text-evolRed border border-evol-grey hover:border-evolRed hover:bg-evol-light-grey hover:text-evolRed transition-colors"
                        >
                          Apply
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-evol-light-grey space-y-3">
                <div className="flex justify-between text-13px font-inter">
                  <span className="text-evol-grey">Subtotal</span>
                  <span className="text-evol-dark-grey">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-13px font-inter">
                    <span className="text-evol-grey">Discount</span>
                    <span className="text-evolRed">
                      − ₹{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-13px font-inter">
                  <span className="text-evol-grey">Shipping</span>
                  <span className="text-evol-dark-grey">Free</span>
                </div>
                <div className="flex justify-between text-13px font-inter">
                  <span className="text-evol-grey">Taxes</span>
                  <span className="text-evol-dark-grey">Included</span>
                </div>
                <div className="pt-3 border-t border-evol-grey flex justify-between">
                  <span className="text-14px font-inter font-medium text-evol-dark-grey">
                    Total
                  </span>
                  <span className="text-16px font-inter font-medium text-evol-dark-grey">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Strip */}
              <div className="pt-5 border-t border-evol-grey space-y-3">
                <div className="flex items-center gap-3 text-12px font-dmsans text-evol-grey">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>IGI/GIA Certified</span>
                </div>
                <div className="flex items-center gap-3 text-12px font-dmsans text-evol-grey">
                  <Truck className="w-5 h-5 shrink-0" />
                  <span>Free Insured Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-12px font-dmsans text-evol-grey">
                  <RotateCcw className="w-5 h-5 shrink-0" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
