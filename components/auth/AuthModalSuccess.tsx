"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth/client";

interface AuthModalSuccessProps {
  onClose: () => void;
}

/**
 * AuthModalSuccess Component
 * Animated checkmark with auto-redirect to dashboard after 1800ms
 * Progress bar animates for 1800ms duration
 */
export function AuthModalSuccess({ onClose }: AuthModalSuccessProps) {
  const session = useSession();
  const userName = session.data?.user?.name || "There";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      // Use window.location for reliable navigation to dashboard
      window.location.href = "/account/dashboard";
    }, 1800);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="p-6 md:p-8 relative overflow-hidden flex flex-col">
      {/* Animated Checkmark */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
        >
          <CheckCircle2 size={80} className="text-evol-red" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Heading */}
      <h2 className="font-sans text-2xl font-semibold text-center text-evol-dark-grey mb-2">
        You're In.
      </h2>

      {/* Welcome Message */}
      <p className="font-sans text-sm text-gray-600 text-center mb-8 flex-1">
        Welcome Back, {userName}.
      </p>

      {/* Auto-close Progress Bar */}
      <motion.div
        className="h-1 bg-evol-red rounded-b-2xl"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.8, ease: "linear" }}
      />
    </div>
  );
}
