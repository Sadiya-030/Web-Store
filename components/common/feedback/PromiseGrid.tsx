"use client";

import {
  ShieldCheck,
  Gem,
  Award,
  Truck,
  MessageSquare,
  Sparkles,
  Heart,
  Hammer,
} from "lucide-react";

interface PromiseItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const promiseItems: PromiseItem[] = [
  { label: "IGI/SGL Certified", icon: ShieldCheck },
  { label: "Exceptional Clarity", icon: Gem },
  { label: "18K Hallmarked", icon: Award },
  { label: "Free Delivery", icon: Truck },
  { label: "Free Consultation", icon: MessageSquare },
  { label: "Free Cleaning", icon: Sparkles },
  { label: "Thoughtful Design", icon: Heart },
  { label: "Handcrafted", icon: Hammer },
];

interface PromiseGridProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function PromiseGrid({
  columns = 4,
  rows = 2,
  className = "",
}: PromiseGridProps) {
  const displayItems = promiseItems.slice(0, columns * rows);

  return (
    <div
      className={`grid gap-2 sm:gap-3 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {displayItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-all hover:bg-red-50"
          >
            <Icon className="text-evolRed shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-center font-sans font-medium text-gray-800 leading-tight text-sm">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
