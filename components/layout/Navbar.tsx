"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, Heart, User, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthModal } from "@/components/auth/AuthModal";
import { MobileNav } from "./MobileNav";

interface NavbarProps {
  variant?: "landing" | "store";
}

/**
 * Navbar Component
 * Two variants: landing (transparent with scroll transition) and store (solid background)
 * Height: 64px, sticky positioning with z-index 50
 */
export function Navbar({ variant = "store" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(variant === "store");
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  const user = useAuthStore((state) => state.user);
  const { items: cartItems, isOpen: cartIsOpen, setOpen: setCartOpen } = useCartStore();
  const wishlistIds = useWishlistStore((state) => state.ids);

  const isLanding = variant === "landing";
  const cartCount = cartItems.length;
  const hasWishlist = wishlistIds.length > 0;

  // Hide navbar when cart is open
  const showNavbar = isVisible && !cartIsOpen;

  // Handle scroll event for landing variant - hide on initial, show on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLanding) {
        setScrolled(window.scrollY > 80);
        setIsVisible(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding]);

  const bgClass = isLanding
    ? scrolled
      ? "bg-evol-light-grey border-b border-evol-grey"
      : "bg-transparent"
    : "bg-evol-light-grey border-b border-evol-grey";

  const textColor =
    isLanding && !scrolled ? "text-white" : "text-evol-dark-grey";

  return (
    <>
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ opacity: 0, y: -64 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -64 }}
            transition={{ duration: 0.3 }}
            className={`sticky top-0 z-50 h-16 transition-all duration-300 ${bgClass}`}
          >
            <div className="h-full px-6 lg:px-12 flex items-center justify-between">
              {/* Left - Logo */}
              <Link href="/" className="shrink-0">
                <Image
                  src="/logos/Evol Jewels Logo - Black.png"
                  alt="Evol Jewels"
                  width={56}
                  height={56}
                  className="h-14 w-auto"
                />
              </Link>

              {/* Centre - Desktop Nav Links */}
              {isDesktop && (
                <div className="flex-1 flex items-center justify-center gap-8">
                  <NavLink
                    href="/collections"
                    label="Shop"
                    textColor={textColor}
                  />
                  <NavLink
                    href="/collections/solitaire"
                    label="Solitaire"
                    textColor={textColor}
                  />
                  <NavLink
                    href="/ready-to-ship"
                    label="Ready to Ship"
                    textColor={textColor}
                  />
                  <NavLink
                    href="/customise"
                    label="Customise"
                    textColor={textColor}
                  />
                  <NavLink href="/gift" label="Gift" textColor={textColor} />
                  <NavLink
                    href="/try-at-home"
                    label="Try at Home"
                    textColor={textColor}
                  />
                  <NavLink
                    href="/gold-beans"
                    label="Gold Beans"
                    textColor={textColor}
                  />
                  <NavLink
                    href="/diamonds"
                    label="Know Your Diamonds"
                    textColor={textColor}
                  />
                  <NavLink
                    href="/our-story"
                    label="Our Story"
                    textColor={textColor}
                  />
                </div>
              )}

              {/* Right - Utility Icons */}
              <div className="flex items-center gap-4 ml-auto">
                <button
                  className={`p-2 transition-colors ${
                    textColor === "text-white"
                      ? "text-white hover:text-evol-red"
                      : "text-evol-dark-grey hover:text-evol-red"
                  }`}
                >
                  <Search size={20} />
                </button>

                <button
                  className={`p-2 transition-colors ${
                    hasWishlist
                      ? "text-evol-red"
                      : textColor === "text-white"
                        ? "text-white hover:text-evol-red"
                        : "text-evol-dark-grey hover:text-evol-red"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={hasWishlist ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={() => {
                    if (user) {
                      // Navigate to account dashboard
                      window.location.href = "/account/dashboard";
                    } else {
                      // Open auth modal
                      setShowAuthModal(true);
                    }
                  }}
                  className={`p-2 transition-colors ${
                    textColor === "text-white"
                      ? "text-white hover:text-evol-red"
                      : "text-evol-dark-grey hover:text-evol-red"
                  }`}
                >
                  <User size={20} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setCartOpen(true)}
                    className={`p-2 transition-colors ${
                      textColor === "text-white"
                        ? "text-white hover:text-evol-red"
                        : "text-evol-dark-grey hover:text-evol-red"
                    }`}
                  >
                    <ShoppingBag size={20} />
                  </button>
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-evol-red rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-sans font-medium">
                        {cartCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                {!isDesktop && (
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className={`p-2 transition-colors ${
                      textColor === "text-white"
                        ? "text-white hover:text-evol-red"
                        : "text-evol-dark-grey hover:text-evol-red"
                    } lg:hidden`}
                  >
                    <Menu size={24} />
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileNav onClose={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>
    </>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  textColor?: string;
}

/**
 * Navigation Link Component
 * Text: Inter 13px, #333, letter-spacing 0.02em
 * Hover: #9F0B10 with 150ms transition
 */
function NavLink({
  href,
  label,
  textColor = "text-evol-dark-grey",
}: NavLinkProps) {
  return (
    <a
      href={href}
      className={`text-sm font-sans ${textColor} hover:text-evol-red transition-colors duration-150`}
      style={{ letterSpacing: "0.02em" }}
    >
      {label}
    </a>
  );
}
