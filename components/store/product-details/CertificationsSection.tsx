"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ShopifyMetafield } from "@/lib/types";

interface CertificationsSectionProps {
  metafields?: ShopifyMetafield[];
}

const certifications = [
  { key: "bis_hallmark", label: "BIS Hallmark" },
  { key: "dgla_hallmark", label: "SGL (DGLA) Hallmark" },
  { key: "igi_hallmark", label: "IGI Hallmark" },
  { key: "jewellery_care", label: "Jewellery Care" },
];

export function CertificationsSection({
  metafields,
}: CertificationsSectionProps) {
  if (!metafields || metafields.length === 0) return null;

  // Extract metafield values
  const getMetafieldValue = (key: string): string | null => {
    const field = metafields.find(
      (f) => f.key.toLowerCase() === key.toLowerCase(),
    );
    return field?.value || null;
  };

  // Get available certifications
  const availableCerts = certifications
    .map((cert) => ({
      ...cert,
      value: getMetafieldValue(cert.key),
    }))
    .filter((cert) => cert.value);

  if (availableCerts.length === 0) return null;

  // Set default values to all keys so they're all open initially
  const defaultValues = availableCerts.map((cert) => cert.key);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-8">
          Certifications & Care
        </h2>

        <Accordion
          type="multiple"
          defaultValue={defaultValues}
          className="w-full space-y-3"
        >
          {availableCerts.map((cert) => (
            <AccordionItem
              key={cert.key}
              value={cert.key}
              className="border border-evol-grey rounded-lg px-4 py-2"
            >
              <AccordionTrigger className="font-sans text-lg text-gray-900 font-medium hover:text-evolRed transition-colors py-3">
                {cert.label}
              </AccordionTrigger>
              <AccordionContent className="font-body text-base text-gray-700 leading-relaxed pt-2 pb-3">
                {cert.value}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
