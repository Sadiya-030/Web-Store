"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";
import { AuthModalEntry } from "./AuthModalEntry";
import { AuthModalOTP } from "./AuthModalOTP";
import { AuthModalSuccess } from "./AuthModalSuccess";

type AuthView = "entry" | "otp" | "success";

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * AuthModal Component
 * Three-view modal for authentication flow
 * Views: entry (email/OAuth) -> otp (6-digit code) -> success
 * Desktop: 480px wide, centered overlay
 * Mobile: bottom-sheet style with rounded top corners
 */
export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("entry");
  const [email, setEmail] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleEntryComplete = (userEmail: string) => {
    setEmail(userEmail);
    setView("otp");
  };

  const handleOTPComplete = () => {
    setView("success");
  };

  const handleSuccessClose = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 z-40 flex items-end md:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        {/* Modal Card */}
        <motion.div
          className={`relative bg-white w-full md:w-96 md:rounded-2xl shadow-lg ${
            isMobile
              ? "rounded-t-2xl rounded-b-none"
              : "rounded-2xl border border-evol-grey"
          }`}
          initial={
            isMobile
              ? { y: "100%", opacity: 0 }
              : { scale: 0.97, opacity: 0 }
          }
          animate={
            isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }
          }
          exit={
            isMobile
              ? { y: "100%", opacity: 0 }
              : { scale: 0.97, opacity: 0 }
          }
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-600 hover:text-gray-900 transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Modal Content - View Switcher */}
          <AnimatePresence mode="wait">
            {view === "entry" && (
              <motion.div
                key="entry"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AuthModalEntry onComplete={handleEntryComplete} />
              </motion.div>
            )}

            {view === "otp" && (
              <motion.div
                key="otp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AuthModalOTP
                  email={email}
                  onBack={() => setView("entry")}
                  onComplete={handleOTPComplete}
                />
              </motion.div>
            )}

            {view === "success" && (
              <motion.div
                key="success"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AuthModalSuccess onClose={handleSuccessClose} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
