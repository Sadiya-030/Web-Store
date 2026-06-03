"use client";

import { motion } from "motion/react";
import {
  Check,
  Shield,
  Truck,
  RotateCcw,
  Droplets,
  Leaf,
  Mountain,
} from "lucide-react";

export function TrustAndPromise() {
  const promises = [
    {
      icon: Shield,
      title: "100% Certified",
      description: "IGI & SGL Certified Diamonds",
    },
    {
      icon: Check,
      title: "Lifetime Exchange",
      description: "Lifetime Exchange & Buyback",
    },
    {
      icon: RotateCcw,
      title: "10-Day Returns",
      description: "100% Refund, No Questions Asked",
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free Insured Shipping Across India",
    },
  ];

  const environmental = [
    {
      title: "Water Saved",
      value: "456 Liters",
      color: "from-red-50 to-rose-50",
      icon: Droplets,
    },
    {
      title: "CO₂ Reduced",
      value: "63 kg Emissions",
      color: "from-rose-50 to-red-50",
      icon: Leaf,
    },
    {
      title: "Minerals Saved",
      value: "250 Tonnes",
      color: "from-pink-50 to-rose-50",
      icon: Mountain,
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Promises Section */}
      <div>
        <h2 className="font-serif text-base sm:text-lg md:text-xl text-gray-900 mb-4 md:mb-5">
          Our Promise to You
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {promises.map((promise, idx) => {
            const Icon = promise.icon;
            return (
              <motion.div
                key={promise.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-2 sm:p-3 md:p-4 border border-evol-grey rounded-lg hover:border-evolRed hover:shadow-lg transition-all"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-red-100 flex items-center justify-center mb-2 sm:mb-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-evolRed" />
                </div>
                <h3 className="font-sans font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  {promise.title}
                </h3>
                <p className="font-sans text-sm text-gray-600 line-clamp-2">
                  {promise.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Environmental Impact Section */}
      <div>
        <h3 className="font-serif text-sm sm:text-base md:text-lg text-gray-900 mb-3 md:mb-4">
          Environmental Impact of Each Carat of Evol's Lab Grown Diamond
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {environmental.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-linear-to-br ${item.color} rounded-lg p-3 sm:p-4 md:p-5 border border-red-100`}
              >
                <div className="mb-2 sm:mb-3">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-evolRed" />
                </div>
                <p className="font-sans text-sm text-gray-600 mb-1">
                  {item.title}
                </p>
                <p className="font-serif text-sm sm:text-base md:text-lg text-gray-900 font-semibold">
                  {item.value}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
