"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";

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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePlaceRequest = () => {
    // TODO: Submit request to backend
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onOpenChange(false);
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="mb-3 text-center text-xl font-serif font-semibold text-gray-900">
              Request Received
            </h2>
            <p className="mb-6 text-center text-sm text-gray-600">
              Thank You for Your Interest! Our Jewelry Experts will Contact you
              Shortly to Help you Customize this Beautiful Piece.
            </p>
            <p className="mb-6 text-center text-xs font-medium text-gray-500">
              Expected Response Time: 1-2 Business Days
            </p>
            <Button
              onClick={handleClose}
              className="w-full bg-evolRed hover:bg-red-700 text-white"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <DialogTitle>Product Not Available</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            The selected variant of <span className="font-semibold">{productTitle}</span> is
            currently out of stock.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-700">
            Would you like us to notify you when this product becomes available,
            or place a custom request for a similar piece?
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
