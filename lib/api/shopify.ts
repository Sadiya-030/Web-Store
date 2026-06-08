import type { ShopifyProduct, ShopifyCollectionData } from "../types";
import { logger } from "../utils/logger";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const COLLECTION_HANDLE_MAP: Record<string, string> = {
  goldbeans: "gold-beans",
};

function getShopifyCollectionHandle(slug: string): string {
  // Normalize slug: remove spaces, convert to lowercase
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "");
  return COLLECTION_HANDLE_MAP[normalizedSlug] || slug;
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, any>,
  retries = 3,
) {
  const url = `https://${domain}/admin/api/2024-01/graphql.json`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token || "",
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
        next: {
          revalidate: 3600,
        },
        signal: AbortSignal.timeout(15000),
      } as any);

      const data = await response.json();

      if (data.errors) {
        logger.error(
          "Shopify GraphQL Errors:",
          new Error(JSON.stringify(data.errors)),
        );
        throw new Error(`Shopify API Error: ${data.errors[0]?.message}`);
      }

      return data as T;
    } catch (error: any) {
      if (error?.message?.includes("Failed to Set Fetch Cache")) {
        logger.warn(
          "Response Too Large for Next.js Cache, Returning Uncached Data",
        );
        // Re-fetch without cache
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": token || "",
            },
            body: JSON.stringify({
              query,
              variables: variables || {},
            }),
            signal: AbortSignal.timeout(15000),
          } as any);

          const data = await response.json();

          if (data.errors) {
            throw new Error(`Shopify API Error: ${data.errors[0]?.message}`);
          }

          return data as T;
        } catch (innerError) {
          logger.error("Failed to Fetch Without Cache:", innerError);
          throw innerError;
        }
      }

      const isLastAttempt = attempt === retries - 1;

      if (!isLastAttempt) {
        const delay = Math.pow(2, attempt) * 1000;
        logger.warn(
          `[Shopify API] Attempt ${attempt + 1}/${retries} failed. Retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        logger.error(`[Shopify API] All ${retries} attempts failed`, error);
        throw error;
      }
    }
  }
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query GetProducts {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            images(first: 20) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  price
                  title
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                  }
                }
              }
            }
            tags
            description
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query);

    const products = response.data.products.edges
      .filter((edge: any) => {
        const title = edge.node.title?.toLowerCase() || "";
        return !title.includes("customise your own");
      })
      .map((edge: any) => {
        const product = edge.node;
        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          vendor: product.vendor,
          productType: product.productType,
          images:
            product.images?.edges?.map((img: any) => ({
              url: img.node.url,
              alt: img.node.altText,
            })) || [],
          variants:
            product.variants?.edges?.map((variant: any) => ({
              id: variant.node.id,
              price: variant.node.price,
              title: variant.node.title,
              availableForSale: variant.node.availableForSale,
              image: variant.node.image,
              selectedOptions:
                variant.node.selectedOptions?.map((opt: any) => ({
                  name: opt.name,
                  value: opt.value,
                })) || [],
            })) || [],
          tags: product.tags || [],
          description: product.description,
        } as ShopifyProduct;
      });

    return products;
  } catch (error) {
    logger.error("Failed to Fetch Products:", error);
    return [];
  }
}

export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const query = `
   query GetProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    handle
    vendor
    productType
    description
    descriptionHtml
    createdAt
    updatedAt
    publishedAt
    status
    tags
    totalInventory
    onlineStoreUrl

    seo {
      title
      description
    }

    featuredImage {
      url
      altText
    }

    options {
      id
      name
      values
    }

    priceRangeV2 {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }

    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }

    images(first: 20) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }

    variants(first: 50) {
      edges {
        node {
          id
          title
          sku
          barcode
          price
          compareAtPrice
          availableForSale
          inventoryQuantity

          selectedOptions {
            name
            value
          }

          image {
            url
          }
        }
      }
    }

    metafields(first: 20) {
  edges {
    node {
      namespace
      key
      value
      type

      reference {
        ... on MediaImage {
          image {
            url
          }
        }

        ... on Video {
          sources {
            url
            mimeType
            format
          }
        }

        ... on GenericFile {
          url
        }
      }
    }
  }
}
  }
}
  `;

  try {
    const response = await shopifyFetch<any>(query, { handle });

    if (!response.data.productByHandle) {
      return null;
    }

    const product = response.data.productByHandle;
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      productType: product.productType,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      publishedAt: product.publishedAt,
      status: product.status,
      totalInventory: product.totalInventory,
      onlineStoreUrl: product.onlineStoreUrl,
      seo: product.seo,
      tags: product.tags || [],
      featuredImage: product.featuredImage
        ? {
            url: product.featuredImage.url,
            altText: product.featuredImage.altText,
          }
        : undefined,
      options: product.options || [],
      priceRangeV2: product.priceRangeV2,
      collections:
        product.collections?.edges?.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
        })) || [],
      images:
        product.images?.edges?.map((img: any) => ({
          url: img.node.url,
          altText: img.node.altText,
          width: img.node.width,
          height: img.node.height,
        })) || [],
      variants:
        product.variants?.edges?.map((variant: any) => ({
          id: variant.node.id,
          price: variant.node.price,
          title: variant.node.title,
          sku: variant.node.sku,
          barcode: variant.node.barcode,
          compareAtPrice: variant.node.compareAtPrice,
          availableForSale: variant.node.availableForSale,
          inventoryQuantity: variant.node.inventoryQuantity,
          image: variant.node.image,
          selectedOptions:
            variant.node.selectedOptions?.map((opt: any) => ({
              name: opt.name,
              value: opt.value,
            })) || [],
        })) || [],
      metafields:
        product.metafields?.edges?.map((edge: any) => ({
          namespace: edge.node.namespace,
          key: edge.node.key,
          value: edge.node.value,
          type: edge.node.type,
          reference: edge.node.reference,
        })) || [],
    } as ShopifyProduct;
  } catch (error) {
    logger.error("Failed to Fetch Product:", error);
    return null;
  }
}

export async function getProductCollections(
  productId: string,
): Promise<Array<{ handle: string; title: string }>> {
  const query = `
    query GetProductCollections($id: ID!) {
      product(id: $id) {
        collections(first: 10) {
          edges {
            node {
              handle
              title
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query, { id: productId });

    if (!response.data.product || !response.data.product.collections) {
      return [];
    }

    const collections = response.data.product.collections.edges.map(
      (edge: any) => ({
        handle: edge.node.handle,
        title: edge.node.title,
      }),
    );

    return collections;
  } catch (error) {
    logger.error("Failed to Fetch Product Collections:", error);
    return [];
  }
}

export async function getCollectionProducts(
  collectionHandle: string,
  cursor?: string,
): Promise<{
  products: ShopifyProduct[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  const query = `
    query GetCollectionProducts($handle: String!, $cursor: String) {
      collectionByHandle(handle: $handle) {
        products(first: 20, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              vendor
              productType
              description
              descriptionHtml
              totalInventory
              onlineStoreUrl
              seo {
                title
                description
              }
              featuredImage {
                url
                altText
              }
              tags
              options {
                id
                name
                values
              }
              priceRangeV2 {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 20) {
                edges {
                  node {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    sku
                    barcode
                    price
                    compareAtPrice
                    availableForSale
                    inventoryQuantity
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      url
                    }
                  }
                }
              }
              collections(first: 10) {
                edges {
                  node {
                    id
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const shopifyHandle = getShopifyCollectionHandle(collectionHandle);
    const response = await shopifyFetch<any>(query, {
      handle: shopifyHandle,
      cursor: cursor || null,
    });

    if (!response.data.collectionByHandle) {
      logger.error("Collection Not Found:", new Error(collectionHandle));
      return { products: [], hasNextPage: false, endCursor: null };
    }

    const pageInfo = response.data.collectionByHandle.products.pageInfo;
    const products = response.data.collectionByHandle.products.edges.map(
      (edge: any) => {
        const product = edge.node;
        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          vendor: product.vendor,
          productType: product.productType,
          description: product.description,
          descriptionHtml: product.descriptionHtml,
          totalInventory: product.totalInventory,
          onlineStoreUrl: product.onlineStoreUrl,
          seo: product.seo,
          tags: product.tags || [],
          featuredImage: product.featuredImage
            ? {
                url: product.featuredImage.url,
                altText: product.featuredImage.altText,
              }
            : undefined,
          options: product.options || [],
          priceRangeV2: product.priceRangeV2,
          collections:
            product.collections?.edges?.map((edge: any) => ({
              id: edge.node.id,
              title: edge.node.title,
              handle: edge.node.handle,
            })) || [],
          images:
            product.images?.edges?.map((img: any) => ({
              url: img.node.url,
              altText: img.node.altText,
              width: img.node.width,
              height: img.node.height,
            })) || [],
          variants:
            product.variants?.edges?.map((variant: any) => ({
              id: variant.node.id,
              price: variant.node.price,
              title: variant.node.title,
              sku: variant.node.sku,
              barcode: variant.node.barcode,
              compareAtPrice: variant.node.compareAtPrice,
              availableForSale: variant.node.availableForSale,
              inventoryQuantity: variant.node.inventoryQuantity,
              image: variant.node.image,
              selectedOptions:
                variant.node.selectedOptions?.map((opt: any) => ({
                  name: opt.name,
                  value: opt.value,
                })) || [],
            })) || [],
        } as ShopifyProduct;
      },
    );

    return {
      products,
      hasNextPage: pageInfo.hasNextPage,
      endCursor: pageInfo.endCursor,
    };
  } catch (error) {
    logger.error("Failed to Fetch Collection Products:", error);
    return { products: [], hasNextPage: false, endCursor: null };
  }
}

export async function getProductsByType(
  productType: string,
): Promise<ShopifyProduct[]> {
  const query = `
    query GetProductsByType($productType: String!) {
      products(first: 100, query: $productType) {
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            description
            descriptionHtml
            totalInventory
            onlineStoreUrl
            seo {
              title
              description
            }
            featuredImage {
              url
              altText
            }
            tags
            options {
              id
              name
              values
            }
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 20) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  sku
                  barcode
                  price
                  compareAtPrice
                  availableForSale
                  inventoryQuantity
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                  }
                }
              }
            }
            collections(first: 10) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query, {
      productType: `productType:${productType}`,
    });

    const products = response.data.products.edges.map((edge: any) => {
      const product = edge.node;
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        vendor: product.vendor,
        productType: product.productType,
        description: product.description,
        descriptionHtml: product.descriptionHtml,
        totalInventory: product.totalInventory,
        onlineStoreUrl: product.onlineStoreUrl,
        seo: product.seo,
        tags: product.tags || [],
        featuredImage: product.featuredImage
          ? {
              url: product.featuredImage.url,
              altText: product.featuredImage.altText,
            }
          : undefined,
        options: product.options || [],
        priceRangeV2: product.priceRangeV2,
        collections:
          product.collections?.edges?.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle,
          })) || [],
        images:
          product.images?.edges?.map((img: any) => ({
            url: img.node.url,
            altText: img.node.altText,
            width: img.node.width,
            height: img.node.height,
          })) || [],
        variants:
          product.variants?.edges?.map((variant: any) => ({
            id: variant.node.id,
            price: variant.node.price,
            title: variant.node.title,
            sku: variant.node.sku,
            barcode: variant.node.barcode,
            compareAtPrice: variant.node.compareAtPrice,
            availableForSale: variant.node.availableForSale,
            inventoryQuantity: variant.node.inventoryQuantity,
            image: variant.node.image,
            selectedOptions:
              variant.node.selectedOptions?.map((opt: any) => ({
                name: opt.name,
                value: opt.value,
              })) || [],
          })) || [],
      } as ShopifyProduct;
    });

    return products;
  } catch (error) {
    logger.error("Failed to Fetch Products by Type:", error);
    return [];
  }
}

export async function getAllCollections(): Promise<ShopifyCollectionData[]> {
  const query = `
    query GetAllCollections {
      collections(first: 250) {
        edges {
          node {
            id
            handle
            title
            description
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query);

    const collections = response.data.collections.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      description: edge.node.description || "",
    }));

    return collections;
  } catch (error) {
    logger.error("Failed to Fetch Collections:", error);
    return [];
  }
}

export async function getCollectionFirstProductImage(
  collectionHandle: string,
): Promise<string> {
  const query = `
    query GetCollectionFirstImage($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 1) {
          edges {
            node {
              id
              title
              productType
              featuredImage {
                url
              }
            }
          }
        }
      }
    }
  `;

  try {
    const shopifyHandle = getShopifyCollectionHandle(collectionHandle);
    const response = await shopifyFetch<any>(query, {
      handle: shopifyHandle,
    });

    if (!response.data.collectionByHandle?.products?.edges?.[0]) {
      return "";
    }

    const product = response.data.collectionByHandle.products.edges[0].node;

    return product.featuredImage?.url || "";
  } catch (error) {
    logger.error("Failed to Fetch Collection First Image:", error);
    return "";
  }
}
