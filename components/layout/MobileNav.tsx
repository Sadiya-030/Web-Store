"use client";

import { motion } from "motion/react";
import { X, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileNavProps {
  onClose: () => void;
}

/**
 * Mobile Navigation Component
 * Full-screen slide-in panel from left
 * Animated with Framer Motion: x: -100% → 0, 300ms ease-out
 */
export function MobileNav({ onClose }: MobileNavProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Mobile Nav Panel */}
      <motion.div
        className="fixed left-0 top-0 h-screen w-full bg-evol-light-grey z-50 flex flex-col overflow-y-auto"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Top Bar - Logo + Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-evol-grey">
          <Image
            src="/logos/Evol Jewels Logo - Black.png"
            alt="Evol Jewels"
            width={56}
            height={56}
            className="h-12 w-auto"
          />
          <button
            onClick={onClose}
            className="p-2 hover:text-evol-red transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-6 py-8">
          <Accordion type="single" collapsible className="w-full">
            {/* Shop Accordion */}
            <AccordionItem value="shop" className="border-b border-evol-grey">
              <AccordionTrigger className="text-2xl font-display text-evol-dark-grey py-4">
                Shop
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 py-4 pl-4">
                  <MobileNavLink href="/collections/rings">Rings</MobileNavLink>
                  <MobileNavLink href="/collections/earrings">
                    Earrings
                  </MobileNavLink>
                  <MobileNavLink href="/collections/pendants">
                    Pendants
                  </MobileNavLink>
                  <MobileNavLink href="/collections/bracelets">
                    Bracelets
                  </MobileNavLink>
                  <MobileNavLink href="/collections/necklaces">
                    Necklaces
                  </MobileNavLink>
                  <MobileNavLink href="/collections" className="font-medium">
                    View All
                  </MobileNavLink>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Solitaire Accordion */}
            <AccordionItem
              value="solitaire"
              className="border-b border-evol-grey"
            >
              <AccordionTrigger className="text-2xl font-display text-evol-dark-grey py-4">
                Solitaire
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 py-4 pl-4">
                  <MobileNavLink href="/collections/solitaire/rings">
                    Solitaire Rings
                  </MobileNavLink>
                  <MobileNavLink href="/collections/solitaire/earrings">
                    Solitaire Earrings
                  </MobileNavLink>
                  <MobileNavLink href="/collections/solitaire/pendants">
                    Solitaire Pendants
                  </MobileNavLink>
                  <MobileNavLink href="/collections/solitaire/bracelets">
                    Solitaire Bracelets
                  </MobileNavLink>
                  <MobileNavLink href="/collections/solitaire/necklaces">
                    Solitaire Necklaces
                  </MobileNavLink>
                  <MobileNavLink
                    href="/collections/solitaire"
                    className="font-medium"
                  >
                    View All
                  </MobileNavLink>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Regular Links */}
            <AccordionItem value="ready-to-ship" disabled>
              <MobileNavLink href="/ready-to-ship" className="py-4">
                Ready to Ship
              </MobileNavLink>
            </AccordionItem>

            <AccordionItem value="customise" disabled>
              <MobileNavLink href="/customise" className="py-4">
                Customise
              </MobileNavLink>
            </AccordionItem>

            <AccordionItem value="gift" disabled>
              <MobileNavLink href="/gift" className="py-4">
                Gift
              </MobileNavLink>
            </AccordionItem>

            <AccordionItem value="try-at-home" disabled>
              <MobileNavLink href="/try-at-home" className="py-4">
                Try at Home
              </MobileNavLink>
            </AccordionItem>

            <AccordionItem value="gold-beans" disabled>
              <MobileNavLink href="/gold-beans" className="py-4">
                Gold Beans
              </MobileNavLink>
            </AccordionItem>

            {/* Know Your Diamonds Accordion */}
            <AccordionItem
              value="diamonds"
              className="border-b border-evol-grey"
            >
              <AccordionTrigger className="text-2xl font-display text-evol-dark-grey py-4">
                Know Your Diamonds
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 py-4 pl-4">
                  <MobileNavLink href="/diamonds/shapes">
                    Find Your Diamond Shape
                  </MobileNavLink>
                  <MobileNavLink href="/diamonds/lab-grown">
                    Lab Grown Diamonds
                  </MobileNavLink>
                  <MobileNavLink href="/diamonds/4cs">
                    4Cs of Lab Grown Diamonds
                  </MobileNavLink>
                  <MobileNavLink href="/diamonds/care">
                    Caring for Your Diamond Jewellery
                  </MobileNavLink>
                  <MobileNavLink href="/diamonds/world">
                    World of Lab Grown Diamond
                  </MobileNavLink>
                  <MobileNavLink href="/diamonds/celebrity">
                    Celebrity Style Redefined
                  </MobileNavLink>
                  <MobileNavLink href="/diamonds/ear-stacks">
                    Effortless Ear Stacks
                  </MobileNavLink>
                  <MobileNavLink href="/blog" className="font-medium">
                    View All Blogs →
                  </MobileNavLink>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="our-story" disabled>
              <MobileNavLink href="/our-story" className="py-4">
                Our Story
              </MobileNavLink>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-evol-grey p-6">
          <MobileNavLink
            href="/account"
            className="block mb-6 text-lg font-display"
          >
            Account
          </MobileNavLink>

          {/* Social Icons */}
          <div className="flex gap-4 mb-6">
            <a
              href="https://facebook.com/evoljewels"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-evol-red transition-colors"
              title="Follow Us On Facebook"
            >
              <LinkIcon size={20} />
            </a>
            <a
              href="https://instagram.com/evoljewels"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-evol-red transition-colors"
              title="Follow Us On Instagram"
            >
              <LinkIcon size={20} />
            </a>
          </div>

          {/* Email */}
          <a
            href="mailto:hello@evoljewels.com"
            className="text-sm font-sans text-evol-dark-grey hover:text-evol-red transition-colors"
          >
            hello@evoljewels.com
          </a>
        </div>
      </motion.div>
    </>
  );
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function MobileNavLink({ href, children, className = "" }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-lg font-sans text-evol-dark-grey hover:text-evol-red transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}
