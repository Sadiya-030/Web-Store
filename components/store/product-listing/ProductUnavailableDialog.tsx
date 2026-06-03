"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProductUnavailableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle: string;
}

export function ProductUnavailableDialog({
  open,
  onOpenChange,
  productTitle,
}: ProductUnavailableDialogProps) {
  const [showCustomizationRequest, setShowCustomizationRequest] =
    useState(false);

  const handlePlaceRequest = () => {
    setShowCustomizationRequest(true);
  };

  const handleCloseSuccess = () => {
    setShowCustomizationRequest(false);
    onOpenChange(false);
  };

  if (showCustomizationRequest) {
    return (
      <AnimatePresence>
        {showCustomizationRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
            onClick={handleCloseSuccess}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full p-8 shadow-xl"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="font-serif text-2xl text-gray-900 mb-2">
                  Request received
                </h2>
                <p className="font-sans text-base text-gray-600 mb-6">
                  Thank you for your interest! Our jewelry experts will contact you shortly to help you customize this beautiful piece.
                </p>
                <p className="font-sans text-sm text-gray-500 mb-6">
                  Expected response time: 1-2 business days
                </p>
                <Button
                  onClick={handleCloseSuccess}
                  className="w-full bg-evolRed hover:bg-red-700 text-white font-sans font-medium py-2 rounded"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <DialogTitle>Product not available</DialogTitle>
          </div>
          <DialogDescription className="pt-2 font-sans text-base">
            The selected variant of <span className="font-semibold">{productTitle}</span> is currently out of stock.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="font-sans text-base text-gray-700">
            Would you like us to notify you when this product becomes available, or place a custom request for a similar piece?
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePlaceRequest}
            className="flex-1 bg-evolRed hover:bg-red-700 text-white"
          >
            Place Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
