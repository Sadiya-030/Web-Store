"use client";

import { Truck, Clock } from "lucide-react";
import { motion } from "motion/react";

interface DeliveryTimelineHighlightProps {
  deliveryDays?: string;
}

export function DeliveryTimelineHighlight({
  deliveryDays = "18-20",
}: DeliveryTimelineHighlightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-linear-to-r from-red-50 to-rose-50 border-2 border-evolRed rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
    >
      <div className="shrink-0">
        <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100">
          <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-evolRed" />
        </div>
      </div>
      <div className="flex-1">
        <p className="font-sans text-sm tracking-wider text-gray-600 uppercase mb-0.5">
          Delivery Timeline
        </p>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-evolRed" />
          <p className="font-serif text-base sm:text-lg text-gray-900 font-semibold">
            {deliveryDays} Days
          </p>
        </div>
        <p className="font-sans text-sm text-gray-600 mt-0.5">
          Crafted and Shipped With Care
        </p>
      </div>
    </motion.div>
  );
}
