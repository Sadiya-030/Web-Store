"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/common/media/ImageGallery";
import { RingSizeGuide } from "@/components/store/product-details/RingSizeGuide";
import { CertificationsBadges } from "@/components/store/product-details/CertificationsBadges";
import { DeliveryTimelineHighlight } from "@/components/store/product-details/DeliveryTimelineHighlight";
import { ProductUnavailableDialog } from "@/components/store/product-listing/ProductUnavailableDialog";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useCartStore } from "@/lib/stores/cartStore";
import {
  getConfiguratorSections,
  buildDynamicConfiguratorSections,
} from "@/lib/utils/configurators";
import { parseShippingInfo } from "@/lib/utils/deliveryDate";
import type { ShopifyProduct, AddToCartStatus } from "@/lib/types";

interface ProductPageClientProps {
  shopifyProduct: ShopifyProduct;
}

// Extract color code from image URL (e.g., "SRNG332379-YG-PV.jpg" → "YG")
const extractColorCodeFromUrl = (url: string): string | null => {
  // Look for patterns like -YG-, -WG-, -RG- in the URL
  const colorMatch = url.match(/-(YG|WG|RG)(?:[-.]|_)/i);
  return colorMatch ? colorMatch[1].toUpperCase() : null;
};

// Filter images by color code
const filterImagesByColor = (
  images: string[],
  colorCode: string | null,
): string[] => {
  if (!colorCode) return images;
  return images.filter((url) => {
    const urlColorCode = extractColorCodeFromUrl(url);
    return urlColorCode === colorCode.toUpperCase();
  });
};

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

  const deliveryTimelineString = useMemo(() => {
    if (!shopifyProduct.metafields) {
      return "18-20";
    }
    const deliveryField = shopifyProduct.metafields.find(
      (f) => f.key.toLowerCase() === "shipping_info",
    );
    if (deliveryField?.value) {
      const match = deliveryField.value.match(/(\d+)-(\d+)/);
      if (match) {
        return `${match[1]}-${match[2]}`;
      }
      return deliveryField.value.replace(/[^0-9\-]/g, "") || "18-20";
    }
    return "18-20";
  }, [shopifyProduct.metafields]);

  // Extract numeric delivery days from shipping_info metafield
  const deliveryDaysNumeric = useMemo(() => {
    if (!shopifyProduct.metafields) {
      return 20;
    }
    const shippingField = shopifyProduct.metafields.find(
      (f) => f.key.toLowerCase() === "shipping_info",
    );
    return parseShippingInfo(shippingField?.value);
  }, [shopifyProduct.metafields]);

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

  // Auto-select color based on featured image and filter images by color
  useEffect(() => {
    if (shopifyProduct.featuredImage?.url) {
      const featuredColorCode = extractColorCodeFromUrl(
        shopifyProduct.featuredImage.url,
      );

      // If we detected a color code and there's a color option, auto-select it
      if (featuredColorCode) {
        setSelectedOptions((prev) => {
          // Look for color or metal color option in configurator sections
          const colorSection = configuratorSections.find(
            (section) =>
              section.id.toLowerCase().includes("color") ||
              section.id.toLowerCase().includes("metal"),
          );

          if (colorSection) {
            // Find the color option that matches the detected color code
            const matchingColorOption = colorSection.options.find((opt) => {
              const optValueStr = String(opt.value).toUpperCase();
              return (
                optValueStr.includes(featuredColorCode) ||
                extractColorCodeFromUrl(optValueStr)?.toUpperCase() ===
                  featuredColorCode
              );
            });

            if (matchingColorOption) {
              return {
                ...prev,
                [colorSection.id]: matchingColorOption.value,
              };
            }
          }

          return prev;
        });
      }
    }
  }, [shopifyProduct.featuredImage?.url, configuratorSections]);

  const isFavorite = isInWishlist(shopifyProduct.id);
  const basePrice = parseInt(shopifyProduct.variants[0]?.price || "0");

  // Check if product is in stock using totalInventory
  const isInStock = (shopifyProduct.totalInventory ?? 0) > 0;

  // Check if current variant combination is available
  const matchingVariant = useMemo(
    () => findMatchingVariant(shopifyProduct.variants, selectedOptions),
    [selectedOptions, shopifyProduct.variants],
  );

  // Build image array: variant-specific image first, then all product images filtered by color
  const imageUrls = useMemo(() => {
    const allProductImages = shopifyProduct.images.map((img) => img.url);
    const variantImage = matchingVariant?.image?.url;

    // Get the selected color code to filter images
    const colorSection = configuratorSections.find(
      (section) =>
        section.id.toLowerCase().includes("color") ||
        section.id.toLowerCase().includes("metal"),
    );
    const selectedColorValue = colorSection
      ? selectedOptions[colorSection.id]
      : null;

    // Extract color code from selected color value (e.g., "Yellow Gold" → "YG")
    let selectedColorCode: string | null = null;
    if (selectedColorValue) {
      const colorStr = String(selectedColorValue).toUpperCase();
      // Try to extract color code from value or use first letters
      if (colorStr.includes("YELLOW")) selectedColorCode = "YG";
      else if (colorStr.includes("WHITE")) selectedColorCode = "WG";
      else if (colorStr.includes("ROSE")) selectedColorCode = "RG";
      else {
        // Fallback: try to extract from URL pattern in value
        selectedColorCode = extractColorCodeFromUrl(colorStr);
      }
    }

    // Filter images by selected color code
    let filteredImages = selectedColorCode
      ? filterImagesByColor(allProductImages, selectedColorCode)
      : allProductImages;

    // If filtering by color resulted in no images, show all images
    if (filteredImages.length === 0) {
      filteredImages = allProductImages;
    }

    // If a variant is selected and it has a specific image, show it first
    if (variantImage) {
      // Put variant image first, then all other filtered images (excluding the variant image to avoid duplicates)
      const otherImages = filteredImages.filter((url) => url !== variantImage);
      return [variantImage, ...otherImages];
    }

    // Return filtered or all product images
    return filteredImages;
  }, [
    matchingVariant,
    shopifyProduct.images,
    selectedOptions,
    configuratorSections,
  ]);

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

  // Check if there are any available variants for the current configuration
  const isVariantAvailable = useMemo(() => {
    if (!matchingVariant) {
      // No variant matches the current selection
      return false;
    }
    if (!isInStock) {
      return false;
    }
    // Check if the matching variant is available for sale
    if (!matchingVariant.availableForSale) {
      return false;
    }
    return true;
  }, [matchingVariant, isInStock]);

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

    // Get color from matching variant's selected options
    let colorValue: string = "Gold";
    if (matchingVariant?.selectedOptions) {
      const colorOption = matchingVariant.selectedOptions.find(
        (opt) =>
          opt.name.toLowerCase() === "color" ||
          opt.name.toLowerCase() === "metal color",
      );
      if (colorOption?.value) {
        colorValue = colorOption.value;
      }
    }

    const cartItem: any = {
      productId: shopifyProduct.id,
      name: shopifyProduct.title,
      image: imageUrls[0],
      price: totalPrice,
      color: colorValue,
      quantity: 1,
      deliveryDays: deliveryDaysNumeric,
    };

    // Only add purity if it exists
    if (purityValue) {
      cartItem.purity = purityValue;
    }

    // Only add size if it's greater than 0 (product has size option)
    if (sizeValue && sizeValue > 0) {
      cartItem.size = sizeValue;
    }

    addToCart(cartItem);

    setCartOpen(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setCartStatus("idle");
  };

  return (
    <div className="min-h-screen bg-evol-light-grey">
      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 sm:gap-8 lg:gap-12">
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
            <div className="space-y-2 sm:space-y-4">
              {/* Header Block */}
              <div className="space-y-3 sm:space-y-4">
                <p className="font-sans text-sm tracking-wider text-gray-500 uppercase">
                  {shopifyProduct.productType || "Rings"}
                </p>

                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight">
                  {shopifyProduct.title}
                </h1>

                {/* Certifications Badges */}
                <CertificationsBadges />

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
                  <p className="font-body text-sm text-gray-600 mt-1">
                    Inclusive Of All Taxes · Free Insured Shipping
                  </p>
                </motion.div>
              </div>

              {/* Configurator - Dynamic based on product category */}
              <div className="space-y-4">
                {configuratorSections.map((section) => {
                  const selectedValue = selectedOptions[section.id];

                  // Render based on section type
                  if (section.type === "swatch") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-6 sm:mb-7">
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
                              <span className="font-sans text-sm text-gray-600 leading-tight text-center">
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
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-1 sm:mb-2">
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
                              className={`px-4 sm:px-6 py-2 rounded-full border font-sans text-sm transition-all ${
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
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-3 sm:mb-4">
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
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border font-sans text-sm transition-all ${
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

                  if (section.type === "image-grid") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-4 sm:mb-5">
                          {section.label}
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                          {section.options.map((option) => (
                            <motion.button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              whileHover={{ scale: 1.05 }}
                              className={`relative p-2 sm:p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                                selectedValue === option.value
                                  ? "border-evolRed bg-red-50"
                                  : "border-evol-grey hover:border-gray-400"
                              }`}
                            >
                              {option.imageUrl && (
                                <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                  <img
                                    src={option.imageUrl}
                                    alt={option.label}
                                    className="w-full h-full object-contain p-1"
                                  />
                                </div>
                              )}
                              <span className="font-sans text-sm text-gray-600 text-center leading-tight line-clamp-2">
                                {option.label}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === "dropdown") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-1 sm:mb-2">
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
                          className="w-full px-4 py-2 rounded-lg border border-evol-grey font-sans text-sm text-gray-600 focus:outline-none focus:border-gray-400"
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

                {/* Ring Size Guide Link */}
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

              {/* Delivery Timeline */}
              <DeliveryTimelineHighlight
                deliveryDays={deliveryTimelineString}
              />

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
                  className={`w-full h-11 sm:h-12 rounded border-2 font-sans font-medium text-sm transition-all flex items-center justify-center gap-2 ${
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
            </div>
          </div>
        </div>
      </div>

      {/* Ring Size Guide Modal */}
      {(configuratorSections.some((s) => s.id === "ringSize") ||
        (configuratorSections.some((s) => s.id === "size") &&
          shopifyProduct.productType?.toLowerCase().includes("ring"))) && (
        <RingSizeGuide open={showSizeGuide} onOpenChange={setShowSizeGuide} />
      )}

      {/* Product Unavailable / Customization Request Dialog */}
      <ProductUnavailableDialog
        open={showCustomizationRequest}
        onOpenChange={setShowCustomizationRequest}
        productTitle={shopifyProduct.title}
      />
    </div>
  );
}
