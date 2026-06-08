"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Mail, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

interface AuthModalOTPProps {
  email: string;
  onBack: () => void;
  onComplete: () => void;
}

const TEST_EMAIL = "sadiya.siddiqui@evoljewels.com";

/**
 * AuthModalOTP Component
 * Shows "Check your email" confirmation screen
 * Users click the magic link sent to their email to authenticate
 */
export function AuthModalOTP({ email, onBack, onComplete }: AuthModalOTPProps) {
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Resend timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(60);
    setError("");
    setIsResending(true);

    try {
      await signIn.magicLink({
        email,
        callbackURL: "/account/dashboard",
      });
    } catch (err) {
      setError("Failed to resend magic link");
      console.error(err);
      setCanResend(true);
      setResendTimer(0);
    } finally {
      setIsResending(false);
    }
  };

  const handleTestClick = () => {
    // Store test login flag and user data for dashboard
    localStorage.setItem('isTestLogin', 'true');
    localStorage.setItem('testUserEmail', email);
    onComplete();
  };

  return (
    <div className="p-6 md:p-8">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <Mail size={48} className="text-evol-red" />
        </motion.div>
      </div>

      {/* Heading */}
      <h2 className="font-sans text-2xl font-semibold text-center text-evol-dark-grey mb-2">
        Check your Inbox
      </h2>
      <p className="font-sans text-sm text-gray-600 text-center mb-6">
        We Sent a Magic Link to{" "}
        <span className="font-medium text-evol-dark-grey">{email}</span>
      </p>

      {/* Back Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={onBack}
          className="font-sans text-xs text-evol-red hover:underline uppercase tracking-wide transition-colors"
        >
          Not You? Go Back
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-50 border border-evol-red rounded text-evol-red font-sans text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-evol-grey rounded p-4 mb-6">
        <p className="font-sans text-sm text-gray-700 text-center">
          Click the Link in Your Email to Sign In to Your Account.
        </p>
      </div>

      {/* Test Magic Link Button */}
      {email === TEST_EMAIL && (
        <motion.button
          onClick={handleTestClick}
          whileHover={{ scale: 1.02 }}
          className="w-full h-10 mb-6 font-sans text-sm font-medium bg-evol-red text-white rounded hover:opacity-90 transition-opacity"
        >
          ✓ Use Test Magic Link
        </motion.button>
      )}

      {/* Resend Section */}
      <div className="text-center">
        <p className="font-sans text-sm text-gray-600 mb-3">Didn't Get It?</p>
        {canResend ? (
          <Button
            onClick={handleResend}
            disabled={isResending}
            variant="ghost"
            size="sm"
            className="font-sans text-xs uppercase tracking-wide h-8"
          >
            {isResending ? (
              <>
                <Loader2 size={12} className="animate-spin mr-1" />
                Sending...
              </>
            ) : (
              "Resend link"
            )}
          </Button>
        ) : (
          <p className="font-sans text-xs text-evol-dark-grey uppercase tracking-wide">
            Resend in 0:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
          </p>
        )}
      </div>
    </div>
  );
}
