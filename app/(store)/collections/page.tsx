import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  getAllCollections,
  getCollectionFirstProductImage,
} from "@/lib/api/shopify";
import {
  getMajorCollectionsWithSubcollections,
  getSubCollectionsForMajor,
} from "@/lib/utils/collectionGrouping";
import { logger } from "@/lib/utils/logger";

interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

async function getCollectionImages(): Promise<Collection[]> {
  try {
    let allCollections = [];
    try {
      allCollections = await getAllCollections();
    } catch (error) {
      logger.error("Failed to Fetch All Collections:", error);
      return [];
    }

    if (allCollections.length === 0) {
      return [];
    }

    const majorCollections =
      getMajorCollectionsWithSubcollections(allCollections);

    const collections: Collection[] = [];

    for (const majorCollection of majorCollections) {
      let foundImage = "";
      try {
        foundImage = await getCollectionFirstProductImage(
          majorCollection.handle,
        );
      } catch (error) {
        logger.warn(
          `Failed to Fetch Image for Collection "${majorCollection.title}"`,
        );
      }

      collections.push({
        id: majorCollection.id,
        title: majorCollection.title,
        description: majorCollection.description,
        image: foundImage,
        slug: majorCollection.handle,
      });
    }

    return collections;
  } catch (error) {
    logger.error("Failed to Load Collection Images:", error);
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getCollectionImages();

  return (
    <div className="min-h-screen bg-evol-light-grey">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80&fit=crop)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-evol-light-grey opacity-50" />
        <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
          <p className="font-sans text-sm md:text-sm tracking-wide text-white text-opacity-50 mb-4 md:mb-6">
            Explore Our Collections
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight max-w-2xl mb-3">
            All Collections
          </h1>
          <p className="font-body text-sm md:text-base text-white text-opacity-70 max-w-xl">
            Curated Selections Of Lab-Grown Diamond Jewellery For Every Moment
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="px-4 md:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
              >
                <div className="group h-full cursor-pointer">
                  {/* Image Container */}
                  <div className="relative w-full aspect-4/5 overflow-hidden rounded-lg bg-gray-100 mb-6">
                    {collection.image && collection.image.length > 0 && (
                      <>
                        <Image
                          src={collection.image}
                          alt={collection.title}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h2 className="font-serif text-2xl md:text-3xl text-gray-900 group-hover:text-evolRed transition-colors">
                      {collection.title}
                    </h2>
                    <p className="font-body text-sm md:text-base text-gray-600 line-clamp-2 leading-relaxed">
                      {collection.description}
                    </p>

                    {/* CTA Link */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="font-sans text-sm font-medium text-evolRed">
                        Explore Collection
                      </span>
                      <ArrowRight className="w-4 h-4 text-evolRed group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Shop All Section */}
      <div className="bg-evol-off-white px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
            Browse All Products
          </h2>
          <p className="font-body text-base md:text-lg text-gray-600">
            Explore Our Complete Collection Of Lab-Grown Diamond Jewellery.
            <br />
            Every Piece Is Crafted With Precision And Care.
          </p>
          <Link href="/collections/shop">
            <Button className="inline-flex items-center gap-3 px-8 py-3 bg-evolRed text-white font-sans font-medium rounded hover:bg-red-700 transition-colors">
              Shop All Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
