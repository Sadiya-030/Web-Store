import { CollectionPageClient } from "./CollectionPageClient";
import { getAllCollections, getCollectionProducts } from "@/lib/api/shopify";
import { getSubCollectionsForMajor } from "@/lib/utils/collectionGrouping";
import { getCollectionMetadata } from "@/lib/types/collectionMetadata";
import { logger } from "@/lib/utils/logger";
import type {
  ShopifyProduct,
  ShopifyCollectionData,
  MajorCollectionType,
} from "@/lib/types";
import type { Metadata } from "next";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params: paramsPromise,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const collectionMetadata = getCollectionMetadata(slug);

  const title = `${collectionMetadata.title} | Evol Jewels`;
  const description =
    collectionMetadata.descriptor ||
    `Browse Our Collection of ${collectionMetadata.title}. Premium Jewellery from Evol Jewels.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CollectionPage({
  params: paramsPromise,
}: CollectionPageProps) {
  const { slug } = await paramsPromise;

  let allCollections: ShopifyCollectionData[] = [];
  try {
    allCollections = await getAllCollections();
  } catch (error) {
    logger.error(`Failed to Fetch All Collections for "${slug}"`, error);
  }

  const majorType = (slug.charAt(0).toUpperCase() +
    slug.slice(1)) as MajorCollectionType;
  const subCollections = getSubCollectionsForMajor(majorType, allCollections);

  // Fetch only primary collection products initially
  let primaryProducts: ShopifyProduct[] = [];
  let endCursor: string | null = null;
  let hasNextPage = false;
  try {
    const result = await getCollectionProducts(slug);
    primaryProducts = result.products;
    endCursor = result.endCursor;
    hasNextPage = result.hasNextPage;
  } catch (error) {
    logger.error(`Failed to Fetch Primary Collection "${slug}"`, error);
  }

  const collectionData = getCollectionMetadata(slug);
  const subCollectionHandles = subCollections?.map((sc) => sc.handle) || [];

  return (
    <CollectionPageClient
      slug={slug}
      products={primaryProducts}
      collectionData={collectionData}
      subCollections={subCollections}
      subCollectionHandles={subCollectionHandles}
      initialCursor={endCursor}
      initialHasNextPage={hasNextPage}
    />
  );
}
