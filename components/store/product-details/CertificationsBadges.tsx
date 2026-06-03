"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface CertificationBadgeProps {
  title: string;
  description: string;
  website: string;
}

const certifications: CertificationBadgeProps[] = [
  {
    title: "BIS Hallmark",
    description:
      "The BIS Hallmark is a System that Provides Certification of Gold as well as Silver Jewellery that Indicates the Purity of the Metal. This Certification Authenticates that a Piece of Gold Jewellery Purchased Conforms to the Standards as Laid by the Bureau of Indian Standards, which is the National Standards Organization in India. This Hallmarking of Gold Jewellery was Established in April 2000. The Hallmark Itself Consists of a BIS Logo, a 3 Digit Number that Indicates the Gold Purity, the Logo of the Assaying Center along with the Logo or the Code of the Jeweller, and the Code that Indicates the Hallmarking Date. The BIS Hallmarking has a High Reputation among the Jewellery Trading Industry in India and is Widely Accepted by Consumers.",
    website: "www.bis.gov.in",
  },
  {
    title: "SGL (DGLA) Hallmark",
    description:
      "SGL is an Independent International Gem Testing Laboratory. Trusted by Jewellers and Consumers Alike, SGL Reports Represent the Highest Standard of Reliability, Consistency and Integrity. Committed to High Certification Standards, They Serve the Interests of the Gems and Jewellery Industry and Support Gemmological Research Worldwide through Their Centers in London, Mumbai (Bombay), Bangalore, Chennai, Hyderabad, Thrissur, Coimbatore, Pune and Jaipur. An SGL Certificate Offers Unmatched Assurance of a Diamond's Quality and Authenticity.",
    website: "www.sgl-labs.com",
  },
  {
    title: "IGI Hallmark",
    description:
      "International Gemological Institute (IGI) is the Result of Continuous Research, Support and Synergy with Professionals and Consumers Alike. Around the World, IGI Certificates Bring Confidence when Buying or Selling Diamonds, Gemstones and Jewellery. Total Commitment to Understanding Consumer Concerns has Motivated IGI to Develop Comprehensive Analysis and Clear Documentation for Consumers. This Empowers Jewellery Buyers to Focus on Finding Precisely What They Want, with Full Assurance in the Integrity and Quality of the IGI Certification. IGI is the Largest Organization of Its Kind, with Offices in Antwerp, New York, Hong Kong, Mumbai, Bangkok, Tokyo, Dubai, Tel Aviv, Cavalese, Toronto, Los Angeles, Kolkata, New Delhi, Thrissur, Surat, Chennai and Shanghai.",
    website: "www.igiworldwide.com",
  },
];

export function CertificationsBadges() {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {certifications.map((cert, idx) => (
          <motion.button
            key={cert.title}
            onClick={() => setSelectedCert(selectedCert === idx ? null : idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-evolRed text-evolRed font-sans font-semibold text-sm transition-all hover:bg-evolRed hover:text-white"
          >
            {cert.title}
          </motion.button>
        ))}
      </div>

      {/* Certification Details Modal */}
      <AnimatePresence>
        {selectedCert !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 border-2 border-evolRed rounded-lg p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-serif font-bold text-gray-900 text-base sm:text-lg">
                {certifications[selectedCert].title}
              </h4>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-sans text-sm text-gray-700 leading-relaxed">
              {certifications[selectedCert].description}
            </p>
            <a
              href={`https://${certifications[selectedCert].website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-sans text-sm text-evolRed hover:underline font-semibold"
            >
              Visit {certifications[selectedCert].website} →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
