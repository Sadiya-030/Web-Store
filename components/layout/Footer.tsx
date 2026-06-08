"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Footer Component
 * Background: #333333
 * Desktop: 4-column grid layout
 * Mobile: 1-column responsive
 * Includes newsletter subscription
 */
export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // TODO: Call Your Newsletter API Endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-evol-dark-grey text-white">
      {/* Main Content */}
      <div className="px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-12 lg:gap-12">
          {/* Column 1 - Brand */}
          <div>
            <Image
              src="/logos/Evol Jewels Logo - White.png"
              alt="Evol Jewels"
              width={56}
              height={56}
              className="h-7 w-auto mb-6"
            />
            <p className="font-sans text-md text-evol-light-grey leading-relaxed max-w-xs mb-6">
              Jewellery as Compositions. Designed for the Self-Aware.
            </p>
            <div className="flex gap-6">
              <a
                href="https://facebook.com/evoljewels"
                target="_blank"
                rel="noopener noreferrer"
                className="text-evol-light-grey hover:text-white transition-colors duration-150"
                title="Follow us on Facebook"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://instagram.com/evoljewels"
                target="_blank"
                rel="noopener noreferrer"
                className="text-evol-light-grey hover:text-white transition-colors duration-150"
                title="Follow us on Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Explore */}
          <div>
            <h3 className="text-sm font-sans uppercase tracking-widest text-evol-light-grey mb-6">
              Explore
            </h3>
            <ul className="space-y-4">
              <li>
                <FooterLink href="/collections">Shop</FooterLink>
              </li>
              <li>
                <FooterLink href="/collections/solitaire">Solitaire</FooterLink>
              </li>
              <li>
                <FooterLink href="/customise">Customise a Piece</FooterLink>
              </li>
              <li>
                <FooterLink href="/gift">Gift</FooterLink>
              </li>
              <li>
                <FooterLink href="/try-at-home">Try at Home</FooterLink>
              </li>
              <li>
                <FooterLink href="/gold-beans">Gold Beans</FooterLink>
              </li>
              <li>
                <FooterLink href="/investment">Diamond Investment</FooterLink>
              </li>
              <li>
                <FooterLink href="/our-story">Our Story</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="text-sm font-sans uppercase tracking-widest text-evol-light-grey mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <FooterLink href="/shipping">Shipping Policy</FooterLink>
              </li>
              <li>
                <FooterLink href="/returns">Returns & Exchanges</FooterLink>
              </li>
              <li>
                <FooterLink href="/ring-sizing">Ring Sizing Guide</FooterLink>
              </li>
              <li>
                <FooterLink href="/faq">FAQs</FooterLink>
              </li>
              <li>
                <FooterLink href="/care">Care Instructions</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Contact Us</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h2 className="font-sans text-xl text-white mb-4">
              Stay in the Know.
            </h2>
            <p className="font-sans text-sm text-gray-400 mb-6">
              New Pieces, Stories, and the Occasional Offer.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm border rounded font-sans"
              />

              <motion.div
                whileHover={!isLoading && !subscribed ? { scale: 1.02 } : {}}
              >
                <Button
                  type="submit"
                  disabled={isLoading || subscribed}
                  variant="outline"
                  className="
                    w-full
                    h-10
                    font-sans
                    text-sm
                    tracking-wide
                    text-evolRed!
                    border-evol-light-grey
                    hover:bg-evol-light-grey
                    transition-all
                    duration-300
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Subscribing...
                    </>
                  ) : subscribed ? (
                    "Subscribed ✓"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </motion.div>
            </form>

            <p className="font-sans text-sm text-evol-light-grey mt-3">
              No Spam. Unsubscribe Anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 px-6 md:px-12 lg:px-20 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-sans text-sm text-evol-light-grey">
            © 2026 Evol Jewels, Banjara Hills, Hyderabad. All Rights Reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <FooterLink href="/privacy" className="text-sm">
              Privacy Policy
            </FooterLink>
            <FooterLink href="/terms" className="text-sm">
              Terms & Conditions
            </FooterLink>
            <FooterLink href="/sitemap" className="text-sm">
              Sitemap
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function FooterLink({ href, children, className = "" }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className={`font-sans text-sm text-gray-400 hover:text-white transition-colors duration-150 ${className}`}
    >
      {children}
    </Link>
  );
}
