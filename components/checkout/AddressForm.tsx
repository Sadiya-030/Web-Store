"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AddressFormSchema,
  type AddressFormInput,
} from "@/lib/validation/address";
import { getPinCodeData } from "@/lib/pinCodeData";
import type { AddressFormData } from "@/lib/stores/checkoutStore";
import { ZodError } from "zod";

interface AddressFormProps {
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => void;
  isLoading?: boolean;
}

export function AddressForm({
  initialData,
  onSubmit,
  isLoading = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>(
    initialData || {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
      saveAddress: false,
    },
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pinCodeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced PIN code lookup
  useEffect(() => {
    if (formData.pinCode.length === 6 && /^\d{6}$/.test(formData.pinCode)) {
      // Clear any previous timeout
      if (pinCodeTimeoutRef.current) {
        clearTimeout(pinCodeTimeoutRef.current);
      }

      // Set a new timeout for debouncing (500ms)
      pinCodeTimeoutRef.current = setTimeout(async () => {
        try {
          const pinData = await getPinCodeData(formData.pinCode);
          if (pinData) {
            setFormData((prev) => ({
              ...prev,
              city: pinData.city,
              state: pinData.state,
            }));
          }
        } catch (error) {
          console.error("Failed to Fetch PIN Code Data:", error);
        }
      }, 500);
    }

    return () => {
      if (pinCodeTimeoutRef.current) {
        clearTimeout(pinCodeTimeoutRef.current);
      }
    };
  }, [formData.pinCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validated = AddressFormSchema.parse(formData);
      onSubmit(validated as AddressFormData);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof AddressFormData, string>> = {};
        const flattened = error.flatten();
        Object.entries(flattened.fieldErrors).forEach(([key, messages]) => {
          const msgs = messages as string[] | undefined;
          if (msgs && msgs.length > 0) {
            fieldErrors[key as keyof AddressFormData] = msgs[0];
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-13px font-inter">
          Full Name <span className="text-evolRed">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Your Full Name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className={`w-full h-10 px-3 py-2 text-13px border rounded text-evol-dark-grey ${
            errors.fullName
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-[#E5E5E5] focus-visible:ring-black/5"
          }`}
          required
        />
        {errors.fullName && (
          <p className="text-12px text-red-500 font-medium">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-13px font-inter">
          Phone <span className="text-evolRed">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="1234567890"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          autoComplete="tel"
          className={`w-full h-10 px-3 py-2 text-13px border rounded text-evol-dark-grey ${
            errors.phone
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-[#E5E5E5] focus-visible:ring-black/5"
          }`}
          required
        />
        {errors.phone && (
          <p className="text-12px text-red-500 font-medium">{errors.phone}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div className="space-y-2">
        <Label htmlFor="address1" className="text-13px font-inter">
          Address Line 1 <span className="text-evolRed">*</span>
        </Label>
        <Input
          id="address1"
          placeholder="42, Banjara Hills"
          value={formData.addressLine1}
          onChange={(e) =>
            setFormData({ ...formData, addressLine1: e.target.value })
          }
          className={`w-full h-10 px-3 py-2 text-13px border rounded text-evol-dark-grey ${
            errors.addressLine1
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-[#E5E5E5] focus-visible:ring-black/5"
          }`}
          required
        />
        {errors.addressLine1 && (
          <p className="text-12px text-red-500 font-medium">
            {errors.addressLine1}
          </p>
        )}
      </div>

      {/* Address Line 2 */}
      <div className="space-y-2">
        <Label htmlFor="address2" className="text-13px font-inter">
          Apartment, Floor, Etc. (Optional)
        </Label>
        <Input
          id="address2"
          placeholder="Apt 301, Building B"
          value={formData.addressLine2}
          onChange={(e) =>
            setFormData({ ...formData, addressLine2: e.target.value })
          }
          className="w-full h-10 px-3 py-2 text-13px border border-[#E5E5E5] rounded text-evol-dark-grey focus-visible:ring-black/5"
        />
      </div>

      {/* City, State, PIN - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-13px font-inter">
            City <span className="text-evolRed">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Hyderabad"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full h-10 px-3 py-2 text-13px border rounded text-evol-dark-grey ${
              errors.city
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#E5E5E5] focus-visible:ring-black/5"
            }`}
            required
          />
          {errors.city && (
            <p className="text-12px text-red-500 font-medium">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state" className="text-13px font-inter">
            State <span className="text-evolRed">*</span>
          </Label>
          <Input
            id="state"
            placeholder="State (Auto-Filled from PIN)"
            value={formData.state}
            readOnly
            className={`w-full h-10 px-3 py-2 text-13px border rounded text-evol-dark-grey bg-gray-50 cursor-not-allowed ${
              errors.state
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#E5E5E5]"
            }`}
            required
          />
          {errors.state && (
            <p className="text-12px text-red-500 font-medium">{errors.state}</p>
          )}
        </div>

        {/* PIN Code */}
        <div className="space-y-2">
          <Label htmlFor="pinCode" className="text-13px font-inter">
            PIN Code <span className="text-evolRed">*</span>
          </Label>
          <Input
            id="pinCode"
            placeholder="500034"
            value={formData.pinCode}
            onChange={(e) =>
              setFormData({ ...formData, pinCode: e.target.value })
            }
            maxLength={6}
            className={`w-full h-10 px-3 py-2 text-13px border rounded text-evol-dark-grey ${
              errors.pinCode
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#E5E5E5] focus-visible:ring-black/5"
            }`}
            required
          />
          {errors.pinCode && (
            <p className="text-12px text-red-500 font-medium">
              {errors.pinCode}
            </p>
          )}
        </div>
      </div>

      {/* Save Address */}
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="saveAddress"
          checked={formData.saveAddress || false}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, saveAddress: Boolean(checked) })
          }
        />
        <Label
          htmlFor="saveAddress"
          className="text-13px font-inter cursor-pointer"
        >
          Save This Address to My Account
        </Label>
      </div>

      {/* Delivery Estimate */}
      <div className="pt-2 flex items-center gap-3 text-13px font-dmsans text-evol-dark-grey">
        <ArrowUp className="w-5 h-5 shrink-0" />
        Estimated Delivery:{" "}
        {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
          "en-IN",
          {
            weekday: "short",
            month: "short",
            day: "numeric",
          },
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full h-12 bg-evolRed hover:bg-red-700 text-white font-sans font-medium"
      >
        {isSubmitting ? "Processing..." : "Continue To Review →"}
      </Button>
    </form>
  );
}
