"use client";

import { motion } from "motion/react";
import { MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AddressFormData, CartItem } from "@/lib/stores/checkoutStore";

interface ReviewStepProps {
  address: AddressFormData;
  items: CartItem[];
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ReviewStep({
  address,
  items,
  onNext,
  onBack,
  isLoading = false,
}: ReviewStepProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-26px font-playfair text-evol-dark-grey mb-2">
          Everything Look Right?
        </h1>
        <p className="text-14px font-dmsans text-evol-grey">
          Review Your Order Details Before Payment
        </p>
      </div>

      {/* Delivery Block */}
      <motion.div
        className="bg-white rounded-lg border border-evol-grey p-6 md:p-8 space-y-4"
        layout
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-evol-dark-grey shrink-0 mt-0.5" />
            <div>
              <p className="text-12px font-inter uppercase tracking-widest text-evol-grey mb-2">
                Delivering To
              </p>
              <p className="text-14px font-inter font-medium text-evol-dark-grey">
                {address.fullName}
              </p>
              <p className="text-13px font-dmsans text-evol-grey mt-1">
                {address.addressLine1}
                {address.addressLine2 && <>, {address.addressLine2}</>}
              </p>
              <p className="text-13px font-dmsans text-evol-grey">
                {address.city}, {address.state} {address.pinCode}
              </p>
              <p className="text-13px font-dmsans text-evol-grey">
                +91 {address.phone}
              </p>
            </div>
          </div>
          <Button
            onClick={onBack}
            className="flex items-center gap-2 text-13px font-inter text-evolRed hover:opacity-80"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </motion.div>

      {/* Items Block */}
      <motion.div className="bg-white rounded-lg border border-evol-grey p-6 md:p-8">
        <h3 className="text-14px font-inter font-medium text-evol-dark-grey mb-4">
          Items Ordered
        </h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b border-evol-light-grey last:border-b-0 last:pb-0"
            >
              <div className="relative w-16 h-16 shrink-0">
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
              <div className="flex-1">
                <p className="text-14px font-inter font-medium text-evol-dark-grey">
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
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onNext}
          disabled={isLoading}
          className="w-full h-12 bg-evolRed hover:bg-red-700 text-white font-sans font-medium"
        >
          Proceed To Payment →
        </Button>
        <p className="text-12px font-dmsans text-evol-grey text-center">
          By Proceeding, You Agree To Our{" "}
          <a href="#" className="text-evolRed hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-evolRed hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </motion.div>
  );
}
