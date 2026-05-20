"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { useCheckoutStore, type CheckoutStep } from "@/lib/stores/checkoutStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { StepProgress } from "@/components/common/feedback/StepProgress";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { DeliveryStep } from "@/components/checkout/DeliveryStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { useWindowSize } from "@/lib/hooks/useWindowSize";

const STEPS: CheckoutStep[] = ["delivery", "review", "payment"];

export function CheckoutPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : undefined;

  // Get cart items from cart store
  const cartStoreItems = useCartStore((state) => state.items);

  const {
    step,
    setStep,
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
        configuration: `${item.purity || ""}${item.size > 0 ? ` · Size ${item.size}` : ""}`.trim(),
        price: item.price,
        quantity: item.quantity,
      }));
      setCartItems(mappedItems);
    }
  }, [cartStoreItems, setCartItems]);

  // Initialize step from URL
  useEffect(() => {
    const stepParam = searchParams.get("step") as CheckoutStep | null;
    if (stepParam && STEPS.includes(stepParam)) {
      setStep(stepParam);
    }
  }, [searchParams, setStep]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discountAmount;

  // Handle step navigation
  const handleNextStep = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentIndex + 1];
      setStep(nextStep);
      // Update URL without full page reload
      const params = new URLSearchParams(searchParams);
      params.set("step", nextStep);
      router.push(`?${params.toString()}`, { scroll: false } as any);
    }
  };

  const handlePreviousStep = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex > 0) {
      const prevStep = STEPS[currentIndex - 1];
      setStep(prevStep);
      const params = new URLSearchParams(searchParams);
      params.set("step", prevStep);
      router.push(`?${params.toString()}`, { scroll: false } as any);
    }
  };

  const handlePaymentSuccess = async () => {
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
      address: deliveryAddress!,
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      paymentRef: `RZPY${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    };

    setConfirmedOrder(confirmedOrder);

    // Navigate to confirmation page
    setTimeout(() => {
      router.push(`/orders/${orderId}/confirmation`);
    }, 2000);
  };

  const steps = [
    { id: "delivery", label: "Delivery" },
    { id: "review", label: "Review" },
    { id: "payment", label: "Payment" },
  ];

  return (
    <div className="min-h-screen bg-evol-light-grey">
      {/* Step Progress */}
      <StepProgress steps={steps} currentStepId={step} isMobile={isMobile} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-[58%_42%] gap-8">
          {/* Form Section - Left */}
          <div className="min-h-screen md:min-h-auto">
            <AnimatePresence mode="wait">
              {step === "delivery" && (
                <DeliveryStep
                  key="delivery"
                  address={deliveryAddress}
                  onAddressChange={setDeliveryAddress}
                  onNext={handleNextStep}
                />
              )}

              {step === "review" && deliveryAddress && (
                <ReviewStep
                  key="review"
                  address={deliveryAddress}
                  items={cartItems}
                  onNext={handleNextStep}
                  onBack={handlePreviousStep}
                />
              )}

              {step === "payment" && (
                <PaymentStep
                  key="payment"
                  total={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentFailure={() => {}}
                  isProcessing={isPaymentProcessing}
                />
              )}
            </AnimatePresence>
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
                isCollapsed={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
