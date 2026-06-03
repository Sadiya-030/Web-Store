"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

export interface Step {
  /** Unique identifier for the step */
  id: string;
  /** Display label for the step */
  label: string;
  /** Optional step number (auto-generated if not provided) */
  number?: number;
}

export interface StepProgressProps {
  /** Array of step definitions */
  steps: Step[];
  /** ID of the current step */
  currentStepId: string;
  /** Whether to use mobile layout (defaults to false) */
  isMobile?: boolean;
  /** Color for active step background (defaults to "#9F0B10" - evolRed) */
  activeColor?: string;
  /** Color for completed step background (defaults to "#333333") */
  completedColor?: string;
  /** Color for inactive step background (defaults to "#C0C0C0") */
  inactiveColor?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StepProgress Component
 *
 * A reusable step progress indicator component that works for multi-step flows.
 *
 * @example
 * // Checkout flow
 * const steps = [
 *   { id: "delivery", label: "Delivery" },
 *   { id: "review", label: "Review" },
 *   { id: "payment", label: "Payment" }
 * ];
 * <StepProgress steps={steps} currentStepId="delivery" />
 *
 * @example
 * // Onboarding flow with custom colors
 * const steps = [
 *   { id: "profile", label: "Profile" },
 *   { id: "preferences", label: "Preferences" },
 *   { id: "complete", label: "Complete" }
 * ];
 * <StepProgress
 *   steps={steps}
 *   currentStepId="profile"
 *   activeColor="#3b82f6"
 *   completedColor="#10b981"
 * />
 */
export function StepProgress({
  steps,
  currentStepId,
  isMobile = false,
  activeColor = "#9F0B10",
  completedColor = "#333333",
  inactiveColor = "#C0C0C0",
  className = "",
}: StepProgressProps) {
  // Find current step index
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);

  // Assign numbers if not provided
  const stepsWithNumbers = steps.map((step, index) => ({
    ...step,
    number: step.number ?? index + 1,
  }));

  if (isMobile) {
    return (
      <div
        className={`bg-white border-b border-evol-grey px-4 py-4 ${className}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 flex-1 bg-evol-grey rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: activeColor }}
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentIndex + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-medium text-evol-dark-grey whitespace-nowrap">
              Step {currentIndex + 1} of {steps.length}
            </span>
          </div>
          <p className="text-14px font-inter text-evol-dark-grey">
            {stepsWithNumbers[currentIndex]?.label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-b border-evol-grey py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8">
        {stepsWithNumbers.map((step, index) => {
          const isCompleted = currentIndex > index;
          const isActive = currentIndex === index;

          return (
            <div key={step.id} className="flex items-center gap-4">
              {/* Circle */}
              <div className="relative">
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  animate={{
                    backgroundColor: isCompleted
                      ? completedColor
                      : isActive
                        ? activeColor
                        : inactiveColor,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <span
                      className={`flex items-center justify-center leading-none font-bold ${
                        isActive ? "text-white" : "text-evol-grey"
                      } text-2xl -mt-0.75`}
                    >
                      {step.number}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Label and Connector */}
              <div className="flex flex-col gap-2">
                <p
                  className={`text-12px font-inter uppercase tracking-wider ${
                    isCompleted || isActive
                      ? "text-evol-dark-grey"
                      : "text-evol-grey"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector line */}
              {index < stepsWithNumbers.length - 1 && (
                <motion.div
                  className="w-16 h-0.5 ml-4"
                  animate={{
                    backgroundColor: isCompleted
                      ? completedColor
                      : inactiveColor,
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
