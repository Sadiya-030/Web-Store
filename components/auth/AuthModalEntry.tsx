"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Loader2, Mail } from "lucide-react";
import { signIn } from "@/lib/auth/client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailSchema = z.string().email("Please enter a valid email address");

interface AuthModalEntryProps {
  onComplete: (email: string) => void;
}

const TEST_EMAIL = "sadiya.siddiqui@evoljewels.com";

/**
 * AuthModalEntry Component
 * Email or Google OAuth entry
 * Magic link email OTP flow
 */
export function AuthModalEntry({ onComplete }: AuthModalEntryProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    try {
      emailSchema.parse(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      }
      return;
    }

    setIsLoading(true);
    try {
      await signIn.magicLink({
        email,
        callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/account/dashboard`,
      });
      onComplete(email);
    } catch (err) {
      setError("Failed to Send Magic Link. Please Try Again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/account/dashboard`,
      });
    } catch (err) {
      setError("Google Sign-In Failed. Please Try Again.");
      console.error(err);
    }
  };

  const handleTestLogin = () => {
    setEmail(TEST_EMAIL);
    setTimeout(() => {
      onComplete(TEST_EMAIL);
    }, 300);
  };

  return (
    <div className="p-6 md:p-8">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/logos/Evol Jewels Logo - Black.png"
          alt="EVOL Jewels"
          width={56}
          height={56}
          className="h-8 w-auto"
        />
      </div>

      {/* Heading */}
      <h2 className="font-sans text-2xl font-semibold text-center text-evol-dark-grey mb-2">
        Welcome Back.
      </h2>
      <p className="font-sans text-sm text-gray-600 text-center mb-6">
        Sign In or Create An Account.
      </p>

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

      {/* Google Button */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full mb-6 h-10 font-sans text-sm border-evol-grey hover:bg-gray-50"
        >
          <Mail className="w-4 h-4 mr-2" />
          Continue with Google
        </Button>
      </motion.div>

      {/* OR Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-evol-grey" />
        <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">
          or
        </span>
        <div className="flex-1 h-px bg-evol-grey" />
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block font-sans text-xs uppercase tracking-widest text-gray-600 mb-3">
            Email Address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            className="h-10 font-sans text-sm border-evol-grey"
          />
        </div>

        {/* Submit Button */}
        <motion.div whileHover={!isLoading ? { scale: 1.02 } : {}}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 font-sans text-sm font-medium bg-evol-red hover:opacity-90 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Magic Link"
            )}
          </Button>
        </motion.div>
      </form>

      {/* Test Login Button */}
      <button
        onClick={handleTestLogin}
        className="w-full h-10 font-sans text-xs uppercase tracking-widest text-evol-red hover:text-evol-dark-grey hover:bg-gray-50 rounded transition-colors border border-evol-grey mb-6"
      >
        Test Login: {TEST_EMAIL}
      </button>

      {/* Footer */}
      <p className="font-sans text-sm text-gray-600 text-center">
        By Continuing, You Agree to Our{" "}
        <a href="/terms" className="text-evol-red hover:underline font-medium">
          Terms
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="text-evol-red hover:underline font-medium"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
