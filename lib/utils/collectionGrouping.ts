import type { MajorCollectionType } from "../types";

export interface MajorCollection {
  id: string;
  title: MajorCollectionType;
  description: string;
  handle: string;
}

// Keywords to match collection names to major categories
// Order matters: test more specific patterns (Bracelets with solitaire/oval) before broader ones (Rings with solitaire)
const COLLECTION_KEYWORDS_ORDERED: Array<[MajorCollectionType, RegExp]> = [
  ["Gold Beans", /goldbeans?|gold.?bean|gold.?bars?/i],
  [
    "Earrings",
    /earring|stud|dangle|hook|hoop|drop|ear.?drop|chandelier|jhumka|bali/i,
  ],
  ["Necklaces", /necklace|mangalsutra/i],
  ["Pendants", /pendant|drop.?pendant/i],
  [
    "Bracelets",
    /bracelet|bangle|tennis|chain.?bracelet|link.?bracelet|cuff|(?:solitaire|oval).?bracelet/i,
  ],
  [
    "Rings",
    /ring|solitaire|eternity|halo|stackable|three.?stone|infinity|engagement|multi.?row|tapered|band|cocktail|cluster|twist/i,
  ],
];

// Collections to exclude (irrelevant or system collections)
const EXCLUDED_COLLECTIONS_PATTERNS = [
  /smart.?products.?filter/i,
  /^shop$/i,
  /tryon|try.?on/i,
  /ready.?to.?ship/i,
  /made.?to.?order/i,
  /baguette.?rts|cushion.?rts|classic.?ready.?to.?ship/i,
];

/**
 * Determine the major collection type based on collection name
 */
export function getMajorCollectionType(
  collectionName: string,
): MajorCollectionType | null {
  // Check if collection should be excluded
  for (const pattern of EXCLUDED_COLLECTIONS_PATTERNS) {
    if (pattern.test(collectionName)) {
      return null;
    }
  }

  // Match against keywords in order (Earrings first to avoid "ring" substring matches)
  for (const [majorType, regex] of COLLECTION_KEYWORDS_ORDERED) {
    if (regex.test(collectionName)) {
      return majorType;
    }
  }

  return null;
}

/**
 * Group collections by major category
 */
export function groupCollectionsByType(
  collections: Array<{
    id: string;
    title: string;
    handle: string;
    description: string;
  }>,
): Record<MajorCollectionType, typeof collections> {
  const grouped: Record<MajorCollectionType, typeof collections> = {
    Rings: [],
    Earrings: [],
    Necklaces: [],
    Pendants: [],
    Bracelets: [],
    "Gold Beans": [],
  };

  for (const collection of collections) {
    const majorType = getMajorCollectionType(collection.title);
    if (majorType) {
      grouped[majorType].push(collection);
    }
  }

  return grouped;
}

/**
 * Get major collections with their sub-collections
 */
export function getMajorCollectionsWithSubcollections(
  collections: Array<{
    id: string;
    title: string;
    handle: string;
    description: string;
  }>,
): MajorCollection[] {
  const grouped = groupCollectionsByType(collections);

  const majorCollections: MajorCollection[] = [];

  for (const [majorType, subcollections] of Object.entries(grouped)) {
    if (subcollections.length > 0) {
      majorCollections.push({
        id: majorType.toLowerCase(),
        title: majorType as MajorCollectionType,
        description: `Discover Our Curated Collection Of Lab-Grown Diamond ${majorType}`,
        handle: majorType.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }

  return majorCollections;
}

/**
 * Get sub-collections for a major collection type
 */
export function getSubCollectionsForMajor(
  majorType: MajorCollectionType,
  collections: Array<{
    id: string;
    title: string;
    handle: string;
    description: string;
  }>,
): typeof collections {
  const grouped = groupCollectionsByType(collections);
  return grouped[majorType] || [];
}
