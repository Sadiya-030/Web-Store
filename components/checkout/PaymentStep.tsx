"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentStepProps {
  total: number;
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
  isProcessing?: boolean;
}

export function PaymentStep({
  total,
  onPaymentSuccess,
  onPaymentFailure,
  isProcessing = false,
}: PaymentStepProps) {
  const [paymentError, setPaymentError] = useState(false);
  const [isSimulatingSuccess, setIsSimulatingSuccess] = useState(false);
  const [isSimulatingFailure, setIsSimulatingFailure] = useState(false);

  const handleSimulateSuccess = async () => {
    setIsSimulatingSuccess(true);
    setPaymentError(false);
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onPaymentSuccess();
  };

  const handleSimulateFailure = async () => {
    setIsSimulatingFailure(true);
    setPaymentError(true);
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSimulatingFailure(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Security Notice */}
      <motion.div className="flex items-center gap-3 text-13px font-dmsans text-evol-grey p-4 bg-evol-light-grey rounded-lg">
        <Lock className="w-5 h-5 shrink-0" />
        <span>
          You're Paying Securely Via Razorpay. Your Card Details Never Touch Our
          Servers.
        </span>
      </motion.div>

      {/* Payment Error Alert */}
      <AnimatePresence>
        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-evolRed shrink-0 mt-0.5" />
            <div>
              <p className="text-13px font-inter text-evolRed font-medium">
                Payment Unsuccessful
              </p>
              <p className="text-12px font-dmsans text-evol-grey mt-1">
                Please Try Again or Use a Different Method.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Razorpay Mock Placeholder */}
      <motion.div
        className="bg-white rounded-lg border border-evol-grey p-8"
        animate={paymentError ? { x: [-4, 4, -2, 2, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-evol-light-grey rounded-lg p-8 text-center space-y-6 min-h-96 flex flex-col items-center justify-center">
          <div className="text-14px font-inter font-bold text-evol-grey">
            Razorpay Payment Gateway
          </div>

          <div className="space-y-4 w-full max-w-xs">
            <div className="space-y-2">
              <label className="block text-12px font-inter text-evol-grey uppercase">
                Payment Methods
              </label>
              <div className="flex gap-2 justify-center text-12px font-inter">
                <Button className="px-3 py-2 border border-evol-grey rounded text-evol-grey hover:border-evol-dark-grey">
                  Card
                </Button>
                <Button className="px-3 py-2 border border-evol-grey rounded text-evol-grey hover:border-evol-dark-grey">
                  UPI
                </Button>
                <Button className="px-3 py-2 border border-evol-grey rounded text-evol-grey hover:border-evol-dark-grey">
                  Net Banking
                </Button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Enter UPI ID"
              disabled
              className="w-full px-3 py-2 text-12px border border-evol-grey rounded bg-white text-evol-grey placeholder-evol-grey cursor-not-allowed"
            />

            <Button
              disabled
              className="w-full h-10 bg-blue-600 text-white text-13px font-medium rounded opacity-50 cursor-not-allowed"
            >
              Pay ₹{total.toLocaleString()}
            </Button>
          </div>

          <p className="text-11px font-dmsans text-evol-grey">
            This is a Demo Payment Gateway
          </p>
        </div>
      </motion.div>

      {/* Test Buttons - Development Only */}
      <div className="space-y-2 p-4 bg-evol-light-grey rounded-lg border border-evol-grey">
        <p className="text-11px font-dmsans text-evol-grey uppercase font-medium mb-3">
          Development: Simulate Payment
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSimulateSuccess}
            disabled={
              isSimulatingSuccess || isSimulatingFailure || isProcessing
            }
            className="flex-1 h-10"
          >
            {isSimulatingSuccess ? "Processing..." : "✓ Success"}
          </Button>
          <Button
            variant="outline"
            onClick={handleSimulateFailure}
            disabled={
              isSimulatingSuccess || isSimulatingFailure || isProcessing
            }
            className="flex-1 h-10"
          >
            {isSimulatingFailure ? "Processing..." : "✗ Failure"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
