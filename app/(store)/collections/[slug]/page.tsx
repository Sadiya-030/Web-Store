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

  // Fetch primary collection products
  let primaryProducts: ShopifyProduct[] = [];
  try {
    primaryProducts = await getCollectionProducts(slug);
  } catch (error) {
    logger.error(`Failed to Fetch Primary Collection "${slug}"`, error);
  }

  // Fetch all subcollection products upfront to enable category filtering
  let allSubcollectionProducts: ShopifyProduct[] = [];
  try {
    const subcollectionPromises = subCollections.map((sc) =>
      getCollectionProducts(sc.handle).then((products) =>
        products.map((p) => ({
          ...p,
          __subCollectionHandle: sc.handle,
          __subCollectionTitle: sc.title,
        })),
      ),
    );
    const subcollectionResults = await Promise.all(subcollectionPromises);
    allSubcollectionProducts = subcollectionResults.flat();
  } catch (error) {
    logger.error(`Failed to Fetch Subcollection Products for "${slug}"`, error);
  }

  const collectionData = getCollectionMetadata(slug);
  const subCollectionHandles = subCollections?.map((sc) => sc.handle) || [];

  return (
    <CollectionPageClient
      slug={slug}
      products={[...allSubcollectionProducts, ...primaryProducts]}
      collectionData={collectionData}
      subCollections={subCollections}
      subCollectionHandles={subCollectionHandles}
    />
  );
}
