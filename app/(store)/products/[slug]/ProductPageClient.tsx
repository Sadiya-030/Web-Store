"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Shield, Truck, RotateCcw, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/common/media/ImageGallery";
import { ExpertConsultation } from "@/components/store/product-details/ExpertConsultation";
import { RingSizeGuide } from "@/components/store/product-details/RingSizeGuide";
import { CartDrawer } from "@/components/store/CartDrawer";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useCartStore } from "@/lib/stores/cartStore";
import {
  getConfiguratorSections,
  buildDynamicConfiguratorSections,
} from "@/lib/utils/configurators";
import type { ShopifyProduct, AddToCartStatus } from "@/lib/types";

interface ProductPageClientProps {
  shopifyProduct: ShopifyProduct;
}

// Find matching variant based on selected options
const findMatchingVariant = (
  variants: ShopifyProduct["variants"],
  selectedOptions: Record<string, any>,
) => {
  return variants.find((variant) => {
    if (!variant.selectedOptions) return false;

    // Create a map of option names to values (case-insensitive)
    const variantOptions = new Map(
      variant.selectedOptions.map((opt) => [
        opt.name.toLowerCase(),
        opt.value.toLowerCase(),
      ]),
    );

    // Check each selected option against variant
    for (const [key, value] of Object.entries(selectedOptions)) {
      if (value === null || value === undefined) continue;

      const variantValue = variantOptions.get(key.toLowerCase());
      if (!variantValue) continue;

      // Convert selected value to string for comparison
      const selectedValueStr = String(value).toLowerCase().trim();

      // Check if variant value matches
      if (
        !variantValue.includes(selectedValueStr) &&
        variantValue !== selectedValueStr
      ) {
        return false;
      }
    }

    return true;
  });
};

export function ProductPageClient({ shopifyProduct }: ProductPageClientProps) {
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const { add: addToCart, setOpen: setCartOpen } = useCartStore();
  const [cartStatus, setCartStatus] = useState<AddToCartStatus>("idle");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showCustomizationRequest, setShowCustomizationRequest] =
    useState(false);

  // Get configurator sections - use dynamic from Shopify or defaults
  const configuratorSections = useMemo(() => {
    if (shopifyProduct.options && shopifyProduct.options.length > 0) {
      return buildDynamicConfiguratorSections(
        shopifyProduct.options,
        shopifyProduct.productType || "",
      );
    }
    return getConfiguratorSections(shopifyProduct.productType || "");
  }, [shopifyProduct.options, shopifyProduct.productType]);

  // Dynamic configurator state - map section ID to selected value
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>(
    () => {
      const initial: Record<string, any> = {};
      configuratorSections.forEach((section) => {
        initial[section.id] = section.defaultValue || section.options[0]?.value;
      });
      return initial;
    },
  );

  const isFavorite = isInWishlist(shopifyProduct.id);
  const basePrice = parseInt(shopifyProduct.variants[0]?.price || "0");

  // Check if product is in stock using totalInventory
  const isInStock = (shopifyProduct.totalInventory ?? 0) > 0;

  // Check if current variant combination is available
  const matchingVariant = useMemo(
    () => findMatchingVariant(shopifyProduct.variants, selectedOptions),
    [selectedOptions, shopifyProduct.variants],
  );

  // Build image array: variant-specific image first, then all product images
  const imageUrls = useMemo(() => {
    const allProductImages = shopifyProduct.images.map((img) => img.url);
    const variantImage = matchingVariant?.image?.url;

    // If a variant is selected and it has a specific image, show it first
    if (variantImage) {
      // Put variant image first, then all other product images (excluding the variant image to avoid duplicates)
      const otherImages = allProductImages.filter((url) => url !== variantImage);
      return [variantImage, ...otherImages];
    }

    // No variant selected or variant has no specific image: show all product images
    return allProductImages;
  }, [matchingVariant, shopifyProduct.images]);

  // Calculate total price based on matching variant or base price
  const totalPrice = useMemo(() => {
    // If a matching variant exists, use its price
    if (matchingVariant && matchingVariant.price) {
      return parseInt(matchingVariant.price) || basePrice;
    }

    // Otherwise calculate with modifiers
    let price = basePrice;
    configuratorSections.forEach((section) => {
      const selectedValue = selectedOptions[section.id];
      const option = section.options.find((opt) => opt.value === selectedValue);
      if (option?.priceModifier) {
        price += option.priceModifier;
      }
    });

    return Math.max(0, price);
  }, [matchingVariant, basePrice, selectedOptions, configuratorSections]);

  const isVariantAvailable = !!matchingVariant && isInStock;

  const handleAddToCart = async () => {
    if (!isVariantAvailable) {
      // Place Request flow - show expert consultation or notification
      setShowCustomizationRequest(true);
      return;
    }

    // Place Order flow
    setCartStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCartStatus("success");
    await new Promise((resolve) => setTimeout(resolve, 400));
    setCartStatus("added");

    // Get size from matching variant's selected options
    let sizeValue: any = 0;
    if (matchingVariant?.selectedOptions) {
      const sizeOption = matchingVariant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === "size",
      );
      if (sizeOption?.value) {
        const parsed = parseInt(sizeOption.value);
        if (!isNaN(parsed)) {
          sizeValue = parsed;
        }
      }
    }

    // Fallback to configurator if no variant size found
    if (!sizeValue) {
      sizeValue =
        selectedOptions["ring-size"] ||
        selectedOptions.ringSize ||
        selectedOptions.size ||
        0;
      if (sizeValue && typeof sizeValue === "string") {
        const parsed = parseInt(sizeValue);
        if (!isNaN(parsed)) {
          sizeValue = parsed;
        } else {
          sizeValue = 0;
        }
      }
    }

    // Get purity from matching variant's selected options (14KT, 18KT, etc.)
    let purityValue: string | undefined;
    if (matchingVariant?.selectedOptions) {
      const purityOption = matchingVariant.selectedOptions.find(
        (opt) =>
          opt.name.toLowerCase() === "purity" ||
          opt.name.toLowerCase() === "gold purity",
      );
      if (purityOption?.value) {
        purityValue = purityOption.value;
      }
    }

    addToCart({
      productId: shopifyProduct.id,
      name: shopifyProduct.title,
      image: imageUrls[0],
      price: totalPrice,
      purity: purityValue,
      size: sizeValue || 0,
      quantity: 1,
    });

    setCartOpen(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setCartStatus("idle");
  };

  return (
    <div className="min-h-screen bg-evol-light-grey">
      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 sm:gap-8 lg:gap-12">
          {/* Left column - Image Gallery */}
          <div className="h-fit">
            <ImageGallery
              images={imageUrls}
              altTextBase={shopifyProduct.title}
              showThumbnails={true}
              thumbnailPosition="left"
              enableZoom={true}
              enableFullscreen={true}
            />
          </div>

          {/* Right column - Product Info (sticky on desktop) */}
          <div className="h-fit lg:sticky lg:top-20">
            <div className="space-y-6 sm:space-y-8">
              {/* Header Block */}
              <div className="space-y-3 sm:space-y-4">
                <p className="font-sans text-xs sm:text-sm tracking-wider text-gray-500 uppercase">
                  {shopifyProduct.productType || "Rings"}
                </p>

                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight">
                  {shopifyProduct.title}
                </h1>

                {/* Certification Badge */}
                <div className="flex items-center gap-2">
                  <Button className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full border border-evol-grey hover:border-gray-400 transition-colors">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="font-sans text-xs sm:text-sm text-gray-600">
                      IGI Certified
                    </span>
                  </Button>
                </div>

                {/* Price */}
                <motion.div
                  key={totalPrice}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-sans font-medium text-2xl sm:text-3xl md:text-4xl text-gray-900">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="font-body text-xs sm:text-sm text-gray-600 mt-1">
                    Inclusive Of All Taxes · Free Insured Shipping
                  </p>
                </motion.div>
              </div>

              {/* Configurator - Dynamic based on product category */}
              <div className="space-y-6">
                {configuratorSections.map((section) => {
                  const selectedValue = selectedOptions[section.id];

                  // Render based on section type
                  if (section.type === "swatch") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-xs sm:text-sm tracking-wider text-gray-500 uppercase block mb-5 sm:mb-6">
                          {section.label}
                        </label>
                        <div className="mb-8 flex flex-wrap gap-4 sm:gap-5">
                          {section.options.map((option) => (
                            <Button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              className="flex w-16 flex-col items-center gap-2 text-center transition-transform"
                            >
                              <motion.div
                                animate={{
                                  scale:
                                    selectedValue === option.value ? 1.15 : 1,
                                }}
                                className={`w-12 h-12 rounded-full border-2 transition-all shrink-0 ${
                                  selectedValue === option.value
                                    ? "border-gray-900 shadow-lg"
                                    : "border-gray-300 hover:border-gray-500"
                                }`}
                                style={{
                                  background: option.imageUrl,
                                }}
                              />
                              <span className="font-sans text-xs sm:text-sm text-gray-600 leading-tight text-center">
                                {option.label}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === "toggle") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-xs sm:text-sm tracking-wider text-gray-500 uppercase block mb-3 sm:mb-4">
                          {section.label}
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {section.options.map((option) => (
                            <Button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              className={`px-4 sm:px-6 py-2 rounded-full border font-sans text-xs sm:text-sm transition-all ${
                                selectedValue === option.value
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : "border-evol-grey text-gray-600 hover:border-gray-400"
                              }`}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === "chips") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-xs sm:text-sm tracking-wider text-gray-500 uppercase block mb-3 sm:mb-4">
                          {section.label}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {section.options.map((option) => (
                            <Button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border font-sans text-xs sm:text-sm transition-all ${
                                selectedValue === option.value
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : "border-evol-grey text-gray-600 hover:border-gray-400"
                              }`}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === "dropdown") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-xs sm:text-sm tracking-wider text-gray-500 uppercase block mb-3 sm:mb-4">
                          {section.label}
                        </label>
                        <select
                          value={selectedValue || ""}
                          onChange={(e) =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [section.id]: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 rounded-lg border border-evol-grey font-sans text-xs sm:text-sm text-gray-600 focus:outline-none focus:border-gray-400"
                        >
                          {section.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (section.type === "cards") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-3 sm:mb-4">
                          {section.label}
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {section.options.map((option) => (
                            <Button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              className={`px-4 py-2 rounded-lg border-2 font-sans text-sm transition-all ${
                                selectedValue === option.value
                                  ? "border-gray-900 bg-gray-50"
                                  : "border-evol-grey hover:border-gray-400"
                              }`}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}

                {/* Ring Size Guide Link - Show only for rings */}
                {(configuratorSections.some((s) => s.id === "ringSize") ||
                  (configuratorSections.some((s) => s.id === "size") &&
                    shopifyProduct.productType
                      ?.toLowerCase()
                      .includes("ring"))) && (
                  <Button
                    onClick={() => setShowSizeGuide(true)}
                    className="font-sans text-sm text-evolRed hover:opacity-80 transition-opacity"
                  >
                    Not Sure Of Your Size? Find It Here →
                  </Button>
                )}
              </div>

              {/* CTA Block */}
              <div className="space-y-2 sm:space-y-3">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={cartStatus !== "idle" && isVariantAvailable}
                  whileHover={{
                    backgroundColor:
                      cartStatus === "idle"
                        ? isVariantAvailable
                          ? "#7A0208"
                          : "#5a5a5a"
                        : undefined,
                  }}
                  className={`w-full h-11 sm:h-12 md:h-13 text-white font-serif text-sm sm:text-base rounded flex items-center justify-center transition-colors cursor-pointer ${
                    cartStatus === "idle"
                      ? isVariantAvailable
                        ? "bg-evolRed hover:bg-red-900"
                        : "bg-gray-600 hover:bg-gray-700"
                      : isVariantAvailable
                        ? "bg-evolRed"
                        : "bg-gray-600"
                  } ${cartStatus !== "idle" && isVariantAvailable ? "opacity-75" : ""}`}
                >
                  {cartStatus === "idle" &&
                    (isVariantAvailable ? "Place Order" : "Place Request")}
                  {cartStatus === "loading" && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  {cartStatus === "success" && <Check className="w-5 h-5" />}
                  {cartStatus === "added" && "Added"}
                </motion.button>

                <Button
                  onClick={() => toggleWishlist(shopifyProduct.id)}
                  className={`w-full h-11 sm:h-12 rounded border-2 font-sans font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                    isFavorite
                      ? "border-evolRed text-evolRed"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? "fill-evolRed" : "fill-none"
                    }`}
                  />
                  {isFavorite ? "Saved to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center justify-between pt-4 border-t border-evol-grey">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="font-body text-sm text-gray-600">
                    IGI Certified Diamond
                  </span>
                </div>
                <div className="w-px h-5 bg-evol-grey" />
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="font-body text-sm text-gray-600">
                    Free Insured Delivery
                  </span>
                </div>
                <div className="w-px h-5 bg-evol-grey" />
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-gray-600" />
                  <span className="font-body text-sm text-gray-600">
                    30-Day Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Consultation Section */}
      <ExpertConsultation />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Ring Size Guide Modal */}
      {(configuratorSections.some((s) => s.id === "ringSize") ||
        (configuratorSections.some((s) => s.id === "size") &&
          shopifyProduct.productType?.toLowerCase().includes("ring"))) && (
        <RingSizeGuide open={showSizeGuide} onOpenChange={setShowSizeGuide} />
      )}

      {/* Expert Consultation Confirmation Modal */}
      <AnimatePresence>
        {showCustomizationRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomizationRequest(false)}
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
                  Request Received
                </h2>
                <p className="font-body text-gray-600 mb-6">
                  Thank You for Your Interest! Our Jewelry Experts will Contact
                  you Shortly to Help you Customize this Beautiful Piece.
                </p>
                <p className="font-body text-sm text-gray-500 mb-6">
                  Expected Response Time: 1-2 Business Days
                </p>
                <Button
                  onClick={() => setShowCustomizationRequest(false)}
                  className="w-full bg-evolRed hover:bg-red-700 text-white font-sans font-medium py-2 rounded"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
