"use client";

import { motion } from "motion/react";
import { AddressForm } from "./AddressForm";
import type { AddressFormData } from "@/lib/stores/checkoutStore";

interface DeliveryStepProps {
  address: AddressFormData | null;
  onAddressChange: (address: AddressFormData) => void;
  onNext: () => void;
  isLoading?: boolean;
}

export function DeliveryStep({
  address,
  onAddressChange,
  onNext,
  isLoading = false,
}: DeliveryStepProps) {
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
          Where Should We Send It?
        </h1>
        <p className="text-14px font-dmsans text-evol-grey">
          Add Your Delivery Address to Proceed
        </p>
      </div>

      <div className="bg-white rounded-lg border border-evol-grey p-6 md:p-8">
        <AddressForm
          initialData={address || undefined}
          onSubmit={(formData) => {
            onAddressChange(formData);
            onNext();
          }}
          isLoading={isLoading}
        />
      </div>
    </motion.div>
  );
}
