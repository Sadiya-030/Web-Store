import { getProductByHandle, getAllProducts } from "@/lib/api/shopify";
import { ProductPageClient } from "./ProductPageClient";
import { ProductSpecificationVideo } from "@/components/store/product-details/ProductSpecificationVideo";
import { ProductAboutSection } from "@/components/store/product-details/ProductAboutSection";
import { RelatedProducts } from "@/components/store/product-details/RelatedProducts";
import { TrustAndPromise } from "@/components/store/product-details/TrustAndPromise";
import { ExpertConsultation } from "@/components/store/product-details/ExpertConsultation";
import { notFound } from "next/navigation";
import { logger } from "@/lib/utils/logger";
import type { Metadata } from "next";
import type { ShopifyProduct } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params: paramsPromise,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await paramsPromise;
  const product = await getProductByHandle(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const seoTitle = product.seo?.title || product.title;
  const seoDescription = product.seo?.description || product.description || "";
  const productUrl =
    product.onlineStoreUrl ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`;
  const image = product.featuredImage?.url;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: productUrl,
      type: "website",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 1200,
              alt: product.featuredImage?.altText || product.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({
  params: paramsPromise,
}: ProductPageProps) {
  const { slug } = await paramsPromise;

  // Fetch product from Shopify
  const product = await getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  // Fetch all products for related products section
  let allProducts: ShopifyProduct[] = [];
  try {
    allProducts = await getAllProducts();
  } catch (error) {
    logger.error(
      `Failed to Fetch All Products for Related Items on Product "${slug}"`,
      error,
    );
  }

  return (
    <>
      <ProductPageClient shopifyProduct={product} />

      {/* Video and Details Section - Side by Side */}
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[62.5%_37.5%] gap-10 md:gap-14 items-start">
            {/* Left: Video */}
            <div>
              <div className="overflow-hidden">
                <ProductSpecificationVideo
                  metafields={product.metafields}
                  featuredImageUrl={product.featuredImage?.url}
                />
              </div>
            </div>

            {/* Right: About This Product */}
            <div>
              <ProductAboutSection
                metafields={product.metafields}
                description={product.description}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trust and Promise Section */}
      <div className="w-full px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="max-w-7xl mx-auto">
          <TrustAndPromise />
        </div>
      </div>

      {/* Expert Consultation Section */}
      <div className="w-full py-4 md:py-6">
        <ExpertConsultation />
      </div>

      {/* Related Products from Metafield */}
      <div className="w-full px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="max-w-7xl mx-auto">
          <RelatedProducts
            metafields={product.metafields}
            allProducts={allProducts}
            currentProduct={product}
          />
        </div>
      </div>
    </>
  );
}
