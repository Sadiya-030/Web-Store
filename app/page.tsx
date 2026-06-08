import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar variant="landing" />
      <main className="min-h-screen flex flex-col items-center justify-center bg-evol-light-grey pt-16">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center py-20">
          <h1 className="font-sans text-4xl md:text-5xl text-evol-dark-grey mb-6">
            Lab-Grown Diamonds. Designed Differently.
          </h1>
          <p className="font-sans text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Authentic Lab-Grown Diamonds with the Confidence of Certification.
            Each Piece is a Composition of Sustainability and Luxury.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/collections"
              className="px-8 py-4 bg-evol-red text-white font-sans text-sm rounded hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>
            <Link
              href="/our-story"
              className="px-8 py-4 border-2 border-evol-red text-evol-red font-sans text-sm rounded hover:bg-red-50 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
