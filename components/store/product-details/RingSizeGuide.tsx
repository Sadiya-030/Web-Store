"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RingSizeGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RING_SIZES = [
  { indian: 5, diameter: "14.9 mm", circumference: "47 mm" },
  { indian: 5.5, diameter: "15.2 mm", circumference: "48 mm" },
  { indian: 6, diameter: "15.6 mm", circumference: "49 mm" },
  { indian: 6.5, diameter: "15.9 mm", circumference: "50 mm" },
  { indian: 7, diameter: "16.3 mm", circumference: "51 mm" },
  { indian: 7.5, diameter: "16.6 mm", circumference: "52 mm" },
  { indian: 8, diameter: "17.0 mm", circumference: "53 mm" },
  { indian: 8.5, diameter: "17.3 mm", circumference: "54 mm" },
  { indian: 9, diameter: "17.7 mm", circumference: "55 mm" },
];

export function RingSizeGuide({ open, onOpenChange }: RingSizeGuideProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[95vw]!
          max-w-[80vw]!
          h-[90vh]
          max-h-[90vh]
          overflow-hidden
          flex
          flex-col
          bg-white
          p-0
          rounded-2xl
          border-0
        "
        suppressHydrationWarning
      >
        {/* Header */}
        <DialogHeader className="border-b border-evol-grey px-5 md:px-8 py-5 shrink-0">
          <DialogTitle className="font-serif text-2xl md:text-4xl text-gray-900">
            Ring Size Guide
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 md:py-8 space-y-8">
          {/* Instructions */}
          <div className="bg-evol-off-white rounded-2xl p-5 md:p-6">
            <h3 className="font-serif text-xl md:text-2xl text-gray-900 mb-4">
              How To Measure Your Ring Size
            </h3>

            <ol className="font-body text-sm md:text-base text-gray-700 space-y-3 list-decimal list-inside leading-relaxed">
              <li>Use A Ring That Fits You Well</li>
              <li>Place It On A Ruler Or Use A Ring Sizer</li>
              <li>Measure The Inner Diameter In Millimeters</li>
              <li>Match It To Your Size In The Chart Below</li>
            </ol>
          </div>

          {/* Size Table */}
          <div className="rounded-2xl border border-evol-grey overflow-hidden">
            <Table>
              <TableHeader className="bg-evol-off-white">
                <TableRow className="border-b border-evol-grey">
                  <TableHead className="font-sans font-semibold text-gray-900 text-left text-sm md:text-base whitespace-nowrap">
                    Indian Size
                  </TableHead>
                  <TableHead className="font-sans font-semibold text-gray-900 text-left text-sm md:text-base whitespace-nowrap">
                    Diameter (MM)
                  </TableHead>
                  <TableHead className="font-sans font-semibold text-gray-900 text-left text-sm md:text-base whitespace-nowrap">
                    Circumference (MM)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RING_SIZES.map((size) => (
                  <TableRow
                    key={size.indian}
                    className="border-b border-evol-grey transition-colors hover:bg-gray-50"
                  >
                    <TableCell className="font-sans text-gray-900 text-sm md:text-base">
                      {size.indian}
                    </TableCell>
                    <TableCell className="font-sans text-gray-600 text-sm md:text-base">
                      {size.diameter}
                    </TableCell>
                    <TableCell className="font-sans text-gray-600 text-sm md:text-base">
                      {size.circumference}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Additional Info */}
          <div className="bg-evol-off-white rounded-2xl p-5 md:p-6">
            <h3 className="font-serif text-xl md:text-2xl text-gray-900 mb-3">
              Complimentary Resizing
            </h3>

            <p className="font-body text-sm md:text-base text-gray-600 leading-relaxed">
              Ring Resizing Is Complimentary Within 30 Days Of Purchase. After
              30 Days, Resizing Costs Will Apply.
              <br className="hidden md:block" />
              <br className="hidden md:block" />
              Contact Our Concierge At{" "}
              <span className="text-evolRed font-medium">
                sadiya.siddiqui@evoljewels.com
              </span>{" "}
              for Assistance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
