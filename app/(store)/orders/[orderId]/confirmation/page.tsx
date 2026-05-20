"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { useCheckoutStore } from "@/lib/stores/checkoutStore";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const { confirmedOrder } = useCheckoutStore();
  const [isAnimating, setIsAnimating] = useState(true);

  // Redirect to checkout if no confirmed order
  useEffect(() => {
    if (!confirmedOrder) {
      router.push("/checkout");
    }
    setIsAnimating(false);
  }, [confirmedOrder, router]);

  if (!confirmedOrder) {
    return null;
  }

  return (
    <div className="min-h-screen bg-evol-light-grey py-12 md:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Checkmark Animation */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <CheckCircle className="w-24 h-24 mx-auto text-evolRed mb-6" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-28px font-playfair text-evol-dark-grey mb-3">
            Your Order is Placed.
          </h1>
          <p className="text-14px font-inter text-evol-grey mb-2">
            Order #{confirmedOrder.orderId}
          </p>
          <p className="text-15px font-dmsans text-evol-dark-grey">
            We'll Send a Confirmation to Your Email. Expect Your Piece in{" "}
            {Math.ceil(
              (new Date(confirmedOrder.estimatedDelivery).getTime() -
                Date.now()) /
                (1000 * 60 * 60 * 24),
            )}{" "}
            Days.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          className="bg-white rounded-lg border border-evol-grey overflow-hidden mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-evol-off-white p-6 md:p-8 space-y-6">
            {/* Delivery Section */}
            <div>
              <h3 className="text-12px font-inter uppercase tracking-widest text-evol-dark-grey mb-3">
                Delivering To
              </h3>
              <p className="text-14px font-inter font-medium text-evol-dark-grey">
                {confirmedOrder.address.fullName}
              </p>
              <p className="text-13px font-dmsans text-evol-dark-grey mt-2">
                {confirmedOrder.address.addressLine1}
                {confirmedOrder.address.addressLine2 && (
                  <>, {confirmedOrder.address.addressLine2}</>
                )}
              </p>
              <p className="text-13px font-dmsans text-evol-dark-grey">
                {confirmedOrder.address.city}, {confirmedOrder.address.state}{" "}
                {confirmedOrder.address.pinCode}
              </p>
              <p className="text-13px font-dmsans text-evol-dark-grey">
                +91 {confirmedOrder.address.phone}
              </p>
            </div>

            <div className="border-t border-evol-grey" />

            {/* Items Section */}
            <div>
              <h3 className="text-12px font-inter uppercase tracking-widest text-evol-dark-grey mb-3">
                Items Ordered
              </h3>
              <div className="space-y-3">
                {confirmedOrder.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded border border-evol-grey"
                      />
                      {item.quantity > 1 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-evol-dark-grey rounded-full flex items-center justify-center text-white text-10px font-medium">
                          {item.quantity}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-13px font-inter font-medium text-evol-dark-grey truncate">
                        {item.title}
                      </p>
                      <p className="text-11px font-dmsans text-evol-grey mt-1">
                        {item.configuration}
                      </p>
                      <p className="text-13px font-inter text-evol-dark-grey mt-1">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-evol-grey" />

            {/* Payment Section */}
            <div>
              <h3 className="text-12px font-inter uppercase tracking-widest text-evol-dark-grey mb-3">
                Payment
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-13px font-inter">
                  <span className="text-evol-dark-grey">Subtotal</span>
                  <span className="text-evol-dark-grey">
                    ₹{confirmedOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-13px font-inter">
                    <span className="text-evol-dark-grey">Discount</span>
                    <span className="text-evolRed">
                      - ₹{confirmedOrder.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-evol-light-grey flex justify-between">
                  <span className="text-13px font-inter text-evol-dark-grey">
                    Total
                  </span>
                  <span className="text-16px font-inter font-medium text-evol-dark-grey">
                    ₹{confirmedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-12px font-dmsans text-evol-dark-grey mt-3">
                Paid Via Razorpay · Ref: {confirmedOrder.paymentRef}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Button
            onClick={() =>
              router.push(`/orders/${confirmedOrder.orderId}/track`)
            }
            className="w-full h-12 bg-evolRed hover:bg-red-700 text-white font-sans font-medium"
          >
            Track Your Order →
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/collections/shop")}
            className="w-full h-12 text-evolRed"
          >
            Continue Shopping
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-12px font-dmsans text-evol-grey"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Questions?{" "}
          <a
            href="mailto:sadiya.siddiqui@evoljewels.com"
            className="text-evolRed hover:underline"
          >
            sadiya.siddiqui@evoljewels.com
          </a>
        </motion.p>
      </div>
    </div>
  );
}
