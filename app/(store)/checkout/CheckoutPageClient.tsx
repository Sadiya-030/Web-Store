"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCheckoutStore } from "@/lib/stores/checkoutStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { PromiseGrid } from "@/components/common/feedback/PromiseGrid";
import { CartItemList } from "@/components/common/cart/CartItemList";
import {
  getMaxDeliveryDays,
  calculateDeliveryDate,
} from "@/lib/utils/deliveryDate";
import {
  AddressFormSchema,
  type AddressFormInput,
} from "@/lib/validation/address";
import { getPinCodeData } from "@/lib/pinCodeData";
import type { AddressFormData } from "@/lib/stores/checkoutStore";
import { ZodError } from "zod";

// AddressForm Component
interface AddressFormProps {
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => void;
  isLoading?: boolean;
  deliveryDays?: number;
}

function AddressForm({
  initialData,
  onSubmit,
  isLoading = false,
  deliveryDays = 20,
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
        <Label htmlFor="fullName" className="text-sm font-sans">
          Full Name <span className="text-evolRed">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Your Full Name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          className={`w-full h-10 px-3 py-2 text-sm border rounded text-evol-dark-grey font-sans ${
            errors.fullName
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-[#E5E5E5] focus-visible:ring-black/5"
          }`}
          required
        />
        {errors.fullName && (
          <p className="text-sm text-red-500 font-medium">{errors.fullName}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-sans">
          Phone <span className="text-evolRed">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="1234567890"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          autoComplete="tel"
          className={`w-full h-10 px-3 py-2 text-sm border rounded text-evol-dark-grey font-sans ${
            errors.phone
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-[#E5E5E5] focus-visible:ring-black/5"
          }`}
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-500 font-medium">{errors.phone}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div className="space-y-2">
        <Label htmlFor="address1" className="text-sm font-sans">
          Address Line 1 <span className="text-evolRed">*</span>
        </Label>
        <Input
          id="address1"
          placeholder="42, Banjara Hills"
          value={formData.addressLine1}
          onChange={(e) =>
            setFormData({ ...formData, addressLine1: e.target.value })
          }
          className={`w-full h-10 px-3 py-2 text-sm border rounded text-evol-dark-grey font-sans ${
            errors.addressLine1
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-[#E5E5E5] focus-visible:ring-black/5"
          }`}
          required
        />
        {errors.addressLine1 && (
          <p className="text-sm text-red-500 font-medium">
            {errors.addressLine1}
          </p>
        )}
      </div>

      {/* Address Line 2 */}
      <div className="space-y-2">
        <Label htmlFor="address2" className="text-sm font-sans">
          Apartment, Floor, Etc. (Optional)
        </Label>
        <Input
          id="address2"
          placeholder="Apt 301, Building B"
          value={formData.addressLine2}
          onChange={(e) =>
            setFormData({ ...formData, addressLine2: e.target.value })
          }
          className="w-full h-10 px-3 py-2 text-sm border border-[#E5E5E5] rounded text-evol-dark-grey focus-visible:ring-black/5 font-sans"
        />
      </div>

      {/* City, State, PIN - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-sans">
            City <span className="text-evolRed">*</span>
          </Label>
          <Input
            id="city"
            placeholder="Hyderabad"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full h-10 px-3 py-2 text-sm border rounded text-evol-dark-grey font-sans ${
              errors.city
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#E5E5E5] focus-visible:ring-black/5"
            }`}
            required
          />
          {errors.city && (
            <p className="text-sm text-red-500 font-medium">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-sans">
            State <span className="text-evolRed">*</span>
          </Label>
          <Input
            id="state"
            placeholder="State (Auto-Filled from PIN)"
            value={formData.state}
            readOnly
            className={`w-full h-10 px-3 py-2 text-sm border rounded text-evol-dark-grey bg-gray-50 cursor-not-allowed font-sans ${
              errors.state
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#E5E5E5]"
            }`}
            required
          />
          {errors.state && (
            <p className="text-sm text-red-500 font-medium">{errors.state}</p>
          )}
        </div>

        {/* PIN Code */}
        <div className="space-y-2">
          <Label htmlFor="pinCode" className="text-sm font-sans">
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
            className={`w-full h-10 px-3 py-2 text-sm border rounded text-evol-dark-grey font-sans ${
              errors.pinCode
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#E5E5E5] focus-visible:ring-black/5"
            }`}
            required
          />
          {errors.pinCode && (
            <p className="text-sm text-red-500 font-medium">{errors.pinCode}</p>
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
          className="text-sm font-sans cursor-pointer"
        >
          Save This Address to My Account
        </Label>
      </div>

      {/* Delivery Estimate */}
      <div className="pt-2 flex items-center gap-3 text-base font-sans text-evol-dark-grey">
        <ArrowUp className="w-5 h-5 shrink-0" />
        Estimated Delivery:{" "}
        {new Date(
          Date.now() + deliveryDays * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full h-12 bg-evolRed hover:bg-red-700 text-white font-sans font-semibold text-lg"
      >
        {isSubmitting ? "Processing..." : "Continue with Payment →"}
      </Button>
    </form>
  );
}

// OrderSummary Component
interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  discount: number;
  discountCode?: string | null;
  onRemoveDiscount?: () => void;
  onApplyDiscount?: (code: string) => void;
  onUpdateQty?: (productId: string, qty: number) => void;
  onRemove?: (productId: string) => void;
  isCollapsed?: boolean;
}

function OrderSummary({
  items,
  subtotal,
  discount,
  discountCode,
  onRemoveDiscount,
  onApplyDiscount,
  onUpdateQty,
  onRemove,
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
        className="p-2 md:p-4 border-b border-evol-grey flex items-center justify-between cursor-pointer md:cursor-default"
        onClick={() => setIsCollapsedLocal(!isCollapsedLocal)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-serif text-lg md:text-xl font-semibold text-gray-900">
            Order Summary
          </h3>
          <span className="px-3 py-2 bg-evol-light-grey rounded-full text-sm font-sans font-medium text-gray-700">
            {items.length} Item{items.length !== 1 ? "s" : ""}
          </span>
        </div>
        {isCollapsedLocal && (
          <span className="text-lg text-gray-600 md:hidden">▼</span>
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
            <div className="p-6 md:p-8 space-y-6">
              {/* Items */}
              <CartItemList
                items={items}
                variant="checkout"
                showQuantityControls={true}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
              />

              {/* Discount Code */}
              <div className="pt-6 border-t border-evol-light-grey">
                {discountCode ? (
                  <div className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="font-sans text-base font-medium text-green-700">
                      {discountCode} Applied - ₹{discount.toLocaleString()} Off
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
                        className="font-sans text-base font-medium text-evolRed hover:opacity-80"
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
                          className="flex-1 h-12 px-4 py-2 text-base font-sans border rounded-lg text-gray-900 border-evol-grey focus-visible:ring-black/5"
                          autoFocus
                        />
                        <Button
                          onClick={handleApplyDiscount}
                          variant="outline"
                          className="h-12 px-4 py-2 font-sans font-medium text-base text-evolRed border border-evol-grey hover:border-evolRed hover:bg-red-50 hover:text-evolRed transition-colors rounded-lg"
                        >
                          Apply
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-evol-light-grey space-y-2">
                <div className="flex justify-between">
                  <span className="font-sans text-base text-gray-600">
                    Subtotal
                  </span>
                  <span className="font-sans text-base font-medium text-gray-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="font-sans text-base text-gray-600">
                      Discount
                    </span>
                    <span className="font-sans text-base font-medium text-evolRed">
                      - ₹{discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-sans text-base text-gray-600">
                    Shipping
                  </span>
                  <span className="font-sans text-base font-medium text-gray-900">
                    Free
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-base text-gray-600">
                    Taxes
                  </span>
                  <span className="font-sans text-base font-medium text-gray-900">
                    Included
                  </span>
                </div>
                <div className="pt-4 -mb-1 border-t border-evol-grey flex justify-between">
                  <span className="font-serif text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="font-serif text-xl font-semibold text-gray-900">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promise Grid */}
              <div className="pt-4 border-t border-evol-grey space-y-2">
                <p className="font-sans text-sm tracking-wider text-gray-600 uppercase font-bold">
                  Our Promise to You
                </p>
                <PromiseGrid columns={4} rows={2} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CheckoutPageClient() {
  const router = useRouter();
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : undefined;

  // Get cart items from cart store
  const cartStoreItems = useCartStore((state) => state.items);

  const {
    deliveryAddress,
    setDeliveryAddress,
    discountCode,
    discountAmount,
    applyDiscount,
    clearDiscount,
    cartItems,
    setCartItems,
    setConfirmedOrder,
  } = useCheckoutStore();

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Sync cart items from cart store to checkout store on mount
  useEffect(() => {
    if (cartStoreItems && cartStoreItems.length > 0) {
      const mappedItems = cartStoreItems.map((item, index) => ({
        id: `${item.productId}-${index}`,
        productId: item.productId,
        title: item.name,
        image: item.image,
        color: item.color,
        configuration:
          `${item.purity || ""}${item.size && item.size > 0 ? ` · Size ${item.size}` : ""}`.trim(),
        price: item.price,
        quantity: item.quantity,
        deliveryDays: item.deliveryDays || 20,
      }));
      setCartItems(mappedItems);
    }
  }, [cartStoreItems, setCartItems]);

  // Redirect to shop page if cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0 && cartStoreItems.length === 0) {
      router.push("/collections/shop");
    }
  }, [cartItems.length, cartStoreItems.length, router]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal - discountAmount;

  // Calculate estimated delivery date based on maximum delivery days from all items
  const getEstimatedDelivery = () => {
    const maxDays = getMaxDeliveryDays(cartItems);
    return calculateDeliveryDate(maxDays);
  };

  const handleUpdateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      // Remove item if quantity is 0 or less
      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } else {
      // Update quantity
      setCartItems(
        cartItems.map((item) =>
          item.productId === productId ? { ...item, quantity: qty } : item,
        ),
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  const handleAddressSubmit = async (address: any) => {
    setIsPaymentProcessing(true);

    // Create order
    const orderId = `EVOL-${Date.now().toString().slice(-4)}${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    const confirmedOrder = {
      orderId,
      total,
      subtotal,
      discount: discountAmount,
      items: cartItems,
      address,
      placedAt: new Date().toISOString(),
      estimatedDelivery: getEstimatedDelivery(),
      paymentRef: `RZPY${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    };

    setConfirmedOrder(confirmedOrder);
    setDeliveryAddress(address);

    // Navigate to confirmation page
    setTimeout(() => {
      router.push(`/orders/${orderId}/confirmation`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-evol-light-grey">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-[58%_42%] gap-8">
          {/* Form Section - Left */}
          <div className="space-y-8">
            {/* Heading */}
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="font-sans text-lg text-gray-600">
                Complete your Purchase
              </p>
            </div>

            {/* Delivery Address Form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg border border-evol-grey p-6 md:p-8"
            >
              <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">
                Delivery Address
              </h2>
              <AddressForm
                initialData={deliveryAddress || undefined}
                onSubmit={handleAddressSubmit}
                isLoading={isPaymentProcessing}
                deliveryDays={getMaxDeliveryDays(cartItems)}
              />
            </motion.div>
          </div>

          {/* Order Summary - Right */}
          {!isMobile && (
            <div className="sticky top-22 h-fit">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                discount={discountAmount}
                discountCode={discountCode}
                onRemoveDiscount={clearDiscount}
                onApplyDiscount={applyDiscount}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveItem}
              />
            </div>
          )}

          {/* Mobile Order Summary - Accordion */}
          {isMobile && (
            <div className="md:hidden order-first">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                discount={discountAmount}
                discountCode={discountCode}
                onRemoveDiscount={clearDiscount}
                onApplyDiscount={applyDiscount}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveItem}
                isCollapsed={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
