"use client";

import { Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExpertConsultation() {
  return (
    <div className="w-full bg-evol-off-white py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-4">
          Need A Closer Look? Talk To Our Experts
        </h2>
        <p className="font-sans text-gray-600 mb-8">
          Our Jewelry Experts Are Ready To Help You Find The Perfect Piece.
          Schedule A Consultation Or Give Us A Call.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-evolRed text-evolRed font-sans font-medium rounded hover:bg-evolRed hover:text-white transition-colors">
            <Phone className="w-5 h-5" />
            Live Consultation
          </Button>
          <Button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-evolRed text-evolRed font-sans font-medium rounded hover:bg-evolRed hover:text-white transition-colors">
            <Video className="w-5 h-5" />
            Schedule A Video Call
          </Button>
        </div>
      </div>
    </div>
  );
}
