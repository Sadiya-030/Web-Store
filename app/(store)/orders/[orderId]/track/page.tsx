"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/lib/stores/checkoutStore";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ExternalLink } from "lucide-react";

interface Milestone {
  id: string;
  label: string;
  status: "completed" | "active" | "upcoming";
  timestamp?: string;
}

export default function OrderTrackingPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const { confirmedOrder } = useCheckoutStore();

  if (!confirmedOrder) {
    return (
      <div className="min-h-screen bg-evol-light-grey flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-evol-dark-grey mb-4">
            Order Not Found
          </h1>
          <Button
            onClick={() => router.push("/collections/shop")}
            className="h-12 bg-evolRed hover:bg-red-700 text-white font-sans font-semibold text-base"
          >
            Back To Shop
          </Button>
        </div>
      </div>
    );
  }

  const placedDate = new Date(confirmedOrder.placedAt);
  const estimatedDelivery = new Date(confirmedOrder.estimatedDelivery);

  const milestones: Milestone[] = [
    {
      id: "confirmed",
      label: "Order Confirmed",
      status: "completed",
      timestamp: placedDate.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      id: "crafting",
      label: "Crafting Your Piece",
      status: "active",
      timestamp: "In Progress",
    },
    {
      id: "quality",
      label: "Quality Check",
      status: "upcoming",
    },
    {
      id: "dispatch",
      label: "Dispatched",
      status: "upcoming",
    },
    {
      id: "delivered",
      label: "Delivered",
      status: "upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-evol-light-grey py-12 md:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-evol-dark-grey mb-2">
            Track Your Order
          </h1>
          <p className="text-lg font-sans text-evol-grey">
            Order #{confirmedOrder.orderId} · Placed{" "}
            {placedDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="bg-white rounded-lg border border-evol-grey p-6 md:p-8 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className="flex gap-6"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.1 + 0.2 }}
              >
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center gap-2">
                  {/* Dot */}
                  <motion.div
                    className={`w-3 h-3 rounded-full relative ${
                      milestone.status === "completed"
                        ? "bg-evol-dark-grey"
                        : milestone.status === "active"
                          ? "bg-evolRed"
                          : "bg-evol-grey"
                    }`}
                    animate={
                      milestone.status === "active"
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(159, 11, 16, 0.3)",
                              "0 0 0 8px rgba(159, 11, 16, 0)",
                            ],
                          }
                        : {}
                    }
                    transition={
                      milestone.status === "active"
                        ? { duration: 1.5, repeat: Infinity }
                        : {}
                    }
                  />

                  {/* Connector line */}
                  {index < milestones.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        milestone.status === "completed"
                          ? "bg-evol-dark-grey"
                          : "border-l border-dashed border-evol-grey"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pt-0.5 flex-1">
                  <p
                    className={`text-base font-sans font-medium ${
                      milestone.status === "upcoming"
                        ? "text-evol-grey"
                        : "text-evol-dark-grey"
                    }`}
                  >
                    {milestone.label}
                  </p>
                  {milestone.timestamp && (
                    <p className="text-sm font-sans text-evol-grey mt-1">
                      {milestone.timestamp}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Courier Details */}
        <motion.div
          className="bg-white rounded-lg border border-evol-grey p-6 md:p-8 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <h3 className="text-base font-sans font-medium text-evol-dark-grey mb-4">
            Courier Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-sans uppercase tracking-widest text-evol-grey">
                Carrier
              </p>
              <p className="text-base font-sans text-evol-dark-grey mt-1">
                Delhivery
              </p>
            </div>
            <div>
              <p className="text-sm font-sans uppercase tracking-widest text-evol-grey">
                Tracking ID
              </p>
              <p className="text-base font-sans text-evol-dark-grey mt-1">
                DEL9182736450
              </p>
            </div>
            <Button
              variant="ghost"
              className="h-auto p-0 justify-start text-sm font-sans text-evolRed flex items-center gap-1"
            >
              Open Carrier Website
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Estimated Delivery */}
        <motion.div
          className="flex items-center gap-3 text-base font-sans text-evol-dark-grey"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 }}
        >
          <CalendarCheck className="w-5 h-5 text-evol-dark-grey shrink-0" />
          <span>
            Estimated Delivery:{" "}
            {estimatedDelivery.toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </motion.div>

        {/* Footer Buttons */}
        <motion.div
          className="mt-12 space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.5 }}
        >
          <Button
            onClick={() => router.push("/collections/shop")}
            className="w-full h-12 bg-evolRed hover:bg-red-700 text-white font-sans font-semibold text-base"
          >
            Continue Shopping
          </Button>
          <p className="text-center text-sm font-sans text-evol-grey">
            Questions?{" "}
            <a
              href="mailto:sadiya.siddiqui@evoljewels.com"
              className="text-evolRed hover:underline"
            >
              sadiya.siddiqui@evoljewels.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
