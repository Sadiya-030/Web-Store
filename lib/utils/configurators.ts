/**
 * Configurator types and utilities for jewelry customization
 */

// Universal type definitions
export type MetalColor = "Yellow Gold" | "White Gold" | "Rose Gold";
export type Purity = "14 KT" | "18 KT";
export type StoneShape =
  | "Round"
  | "Oval"
  | "Pear"
  | "Emerald"
  | "Radiant"
  | "Marquise"
  | "Asscher"
  | "Heart"
  | "Shield"
  | "Kite"
  | "Trillion"
  | "Cushion"
  | "Baguette"
  | "Princess";
export type SettingType =
  | "Prong"
  | "Pave"
  | "Bezel"
  | "Half Bezel"
  | "Prong Pave";

// Ring specific
export type RingSize = 5 | 6 | 7 | 8 | 9 | 10;

// Earring specific
export type EarringStyle =
  | "Studs"
  | "Hoops"
  | "Drops"
  | "Huggie"
  | "Jhumkas"
  | "Solitaire";
export type BackType = "Pushback" | "Leverback" | "Clip-On" | "Hug";

// Necklace specific
export type ChainLength = '16"' | '18"' | '20"' | '22"';
export type LayeringStyle = "Solo" | "Layered" | "Convertible";

// Bracelet specific
export type BraceletLength = "Small" | "Medium" | "Large" | "Adjustable";
export type TennisStyle = "Classic" | "Contemporary" | "Mixed";
export type ClaspType = "Box" | "Lobster" | "Spring Ring";

// Pendant specific
export type PendantSize = "Small" | "Medium" | "Large";

// Configurator option types
export interface ConfiguratorOption<T = string> {
  label: string;
  value: T;
  variant?: string; // For matching with Shopify selectedOptions
  imageUrl?: string; // For swatches/visual selections
  priceModifier?: number;
}

export interface ConfiguratorSection {
  id: string;
  label: string;
  type:
    | "swatch"
    | "toggle"
    | "chips"
    | "cards"
    | "slider"
    | "dropdown"
    | "text"
    | "image-grid";
  options: ConfiguratorOption<string | number>[];
  required: boolean;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
}

export interface CategoryConfigurator {
  category: string;
  sections: ConfiguratorSection[];
}

// Extract available configurator options from product variants
export interface ShopifyVariant {
  id: string;
  title: string;
  selectedOptions?: Array<{ name: string; value: string }>;
  price?: string;
  availableForSale?: boolean;
}

export function extractConfiguratorOptions(
  variants: ShopifyVariant[],
  category: string,
): Record<string, Set<string>> {
  const options: Record<string, Set<string>> = {};

  variants.forEach((variant) => {
    if (!variant.selectedOptions) return;

    variant.selectedOptions.forEach((opt) => {
      const key = opt.name.toLowerCase();
      if (!options[key]) {
        options[key] = new Set();
      }
      options[key].add(opt.value);
    });
  });

  return options;
}

// Metal color swatches
export const METAL_COLORS: ConfiguratorOption<MetalColor>[] = [
  {
    label: "Yellow Gold",
    value: "Yellow Gold",
    imageUrl: "linear-gradient(135deg, #D4AF37 0%, #F0D97A 100%)",
    priceModifier: -3000,
  },
  {
    label: "White Gold",
    value: "White Gold",
    imageUrl: "linear-gradient(135deg, #E8E8E8 0%, #F5F5F5 100%)",
    priceModifier: 0,
  },
  {
    label: "Rose Gold",
    value: "Rose Gold",
    imageUrl: "linear-gradient(135deg, #B76E79 0%, #D4917D 100%)",
    priceModifier: 5000,
  },
];

// Purity options
export const PURITY_OPTIONS: ConfiguratorOption<Purity>[] = [
  { label: "14 KT", value: "14 KT", priceModifier: -8000 },
  { label: "18 KT", value: "18 KT", priceModifier: 0 },
];

// Stone shapes with images
export const STONE_SHAPES: ConfiguratorOption<StoneShape>[] = [
  "Round",
  "Oval",
  "Pear",
  "Emerald",
  "Radiant",
  "Marquise",
  "Asscher",
  "Heart",
  "Shield",
  "Kite",
  "Trillion",
  "Cushion",
  "Baguette",
  "Princess",
].map((shape) => ({
  label: shape,
  value: shape as StoneShape,
  imageUrl: `/shapes/${shape}.png`,
}));

// Setting types
export const SETTING_TYPES: ConfiguratorOption<SettingType>[] = [
  { label: "Prong", value: "Prong" },
  { label: "Pave", value: "Pave" },
  { label: "Bezel", value: "Bezel" },
  { label: "Half Bezel", value: "Half Bezel" },
  { label: "Prong Pave", value: "Prong Pave" },
];

// Ring sizes
export const RING_SIZES: ConfiguratorOption<RingSize>[] = [
  5, 6, 7, 8, 9, 10,
].map((size) => ({
  label: String(size),
  value: size as RingSize,
}));

// Carat weights
export const CARAT_WEIGHTS: ConfiguratorOption<number>[] = [
  { label: "0.30 ct", value: 0.3, priceModifier: -40000 },
  { label: "0.50 ct", value: 0.5, priceModifier: -20000 },
  { label: "0.75 ct", value: 0.75, priceModifier: 0 },
  { label: "1.00 ct", value: 1.0, priceModifier: 30000 },
  { label: "1.50 ct", value: 1.5, priceModifier: 85000 },
];

// Chain lengths
export const CHAIN_LENGTHS: ConfiguratorOption<ChainLength>[] = [
  { label: '16"', value: '16"' },
  { label: '18"', value: '18"' },
  { label: '20"', value: '20"' },
  { label: '22"', value: '22"' },
];

// Earring styles
export const EARRING_STYLES: ConfiguratorOption<EarringStyle>[] = [
  "Studs",
  "Hoops",
  "Drops",
  "Huggie",
  "Jhumkas",
  "Solitaire",
].map((style) => ({
  label: style,
  value: style as EarringStyle,
}));

// Back types
export const BACK_TYPES: ConfiguratorOption<BackType>[] = [
  { label: "Pushback", value: "Pushback" },
  { label: "Leverback", value: "Leverback" },
  { label: "Clip-On", value: "Clip-On" },
  { label: "Hug", value: "Hug" },
];

// Layering styles
export const LAYERING_STYLES: ConfiguratorOption<LayeringStyle>[] = [
  { label: "Solo", value: "Solo" },
  { label: "Layered", value: "Layered" },
  { label: "Convertible", value: "Convertible" },
];

// Bracelet lengths
export const BRACELET_LENGTHS: ConfiguratorOption<BraceletLength>[] = [
  { label: "Small (6-7 inch)", value: "Small" },
  { label: "Medium (7-8 inch)", value: "Medium" },
  { label: "Large (8-9 inch)", value: "Large" },
  { label: "Adjustable", value: "Adjustable" },
];

// Tennis styles
export const TENNIS_STYLES: ConfiguratorOption<TennisStyle>[] = [
  { label: "Classic", value: "Classic" },
  { label: "Contemporary", value: "Contemporary" },
  { label: "Mixed", value: "Mixed" },
];

// Clasp types
export const CLASP_TYPES: ConfiguratorOption<ClaspType>[] = [
  { label: "Box Clasp", value: "Box" },
  { label: "Lobster Clasp", value: "Lobster" },
  { label: "Spring Ring", value: "Spring Ring" },
];

// Pendant sizes
export const PENDANT_SIZES: ConfiguratorOption<PendantSize>[] = [
  { label: "Small", value: "Small" },
  { label: "Medium", value: "Medium" },
  { label: "Large", value: "Large" },
];

// Category-specific configurator definitions
export const CATEGORY_CONFIGURATORS: Record<string, ConfiguratorSection[]> = {
  rings: [
    {
      id: "metal",
      label: "Metal Color",
      type: "swatch",
      options: METAL_COLORS,
      required: true,
      defaultValue: "White Gold",
    },
    {
      id: "purity",
      label: "Purity",
      type: "toggle",
      options: PURITY_OPTIONS,
      required: true,
      defaultValue: "18 KT",
    },
    {
      id: "stoneShape",
      label: "Stone Shape",
      type: "image-grid",
      options: STONE_SHAPES,
      required: false,
    },
    {
      id: "settingType",
      label: "Setting Type",
      type: "cards",
      options: SETTING_TYPES,
      required: false,
    },
    {
      id: "carat",
      label: "Carat Weight",
      type: "slider",
      options: CARAT_WEIGHTS,
      required: true,
      defaultValue: 0.75,
      min: 0.3,
      max: 1.5,
    },
    {
      id: "ringSize",
      label: "Ring Size",
      type: "dropdown",
      options: RING_SIZES,
      required: true,
      defaultValue: 7,
    },
  ],
  earrings: [
    {
      id: "metal",
      label: "Metal Color",
      type: "swatch",
      options: METAL_COLORS,
      required: true,
      defaultValue: "White Gold",
    },
    {
      id: "purity",
      label: "Purity",
      type: "toggle",
      options: PURITY_OPTIONS,
      required: true,
      defaultValue: "18 KT",
    },
    {
      id: "stoneShape",
      label: "Stone Shape",
      type: "image-grid",
      options: STONE_SHAPES,
      required: false,
    },
    {
      id: "earringStyle",
      label: "Earring Style",
      type: "cards",
      options: EARRING_STYLES,
      required: false,
    },
    {
      id: "backType",
      label: "Back Type",
      type: "dropdown",
      options: BACK_TYPES,
      required: false,
    },
  ],
  necklaces: [
    {
      id: "metal",
      label: "Metal Color",
      type: "swatch",
      options: METAL_COLORS,
      required: true,
      defaultValue: "White Gold",
    },
    {
      id: "purity",
      label: "Purity",
      type: "toggle",
      options: PURITY_OPTIONS,
      required: true,
      defaultValue: "18 KT",
    },
    {
      id: "chainLength",
      label: "Chain Length",
      type: "dropdown",
      options: CHAIN_LENGTHS,
      required: true,
      defaultValue: '18"',
    },
    {
      id: "stoneShape",
      label: "Stone Shape",
      type: "image-grid",
      options: STONE_SHAPES,
      required: false,
    },
    {
      id: "layeringStyle",
      label: "Layering Style",
      type: "chips",
      options: LAYERING_STYLES,
      required: false,
    },
  ],
  bracelets: [
    {
      id: "metal",
      label: "Metal Color",
      type: "swatch",
      options: METAL_COLORS,
      required: true,
      defaultValue: "White Gold",
    },
    {
      id: "purity",
      label: "Purity",
      type: "toggle",
      options: PURITY_OPTIONS,
      required: true,
      defaultValue: "18 KT",
    },
    {
      id: "braceletLength",
      label: "Bracelet Length",
      type: "dropdown",
      options: BRACELET_LENGTHS,
      required: true,
      defaultValue: "Medium",
    },
    {
      id: "tennisStyle",
      label: "Tennis Style",
      type: "chips",
      options: TENNIS_STYLES,
      required: false,
    },
    {
      id: "claspType",
      label: "Clasp Type",
      type: "cards",
      options: CLASP_TYPES,
      required: false,
    },
  ],
  pendants: [
    {
      id: "metal",
      label: "Metal Color",
      type: "swatch",
      options: METAL_COLORS,
      required: true,
      defaultValue: "White Gold",
    },
    {
      id: "purity",
      label: "Purity",
      type: "toggle",
      options: PURITY_OPTIONS,
      required: true,
      defaultValue: "18 KT",
    },
    {
      id: "chainIncluded",
      label: "Chain Included",
      type: "toggle",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      required: false,
      defaultValue: "yes",
    },
    {
      id: "stoneShape",
      label: "Stone Shape",
      type: "image-grid",
      options: STONE_SHAPES,
      required: false,
    },
    {
      id: "pendantSize",
      label: "Pendant Size",
      type: "chips",
      options: PENDANT_SIZES,
      required: false,
    },
  ],
};

/**
 * Get configurator sections for a specific product category
 */
export function getConfiguratorSections(
  category: string,
): ConfiguratorSection[] {
  const categoryLower = category.toLowerCase();

  // Match category to configurator
  for (const [key, sections] of Object.entries(CATEGORY_CONFIGURATORS)) {
    if (categoryLower.includes(key)) {
      return sections;
    }
  }

  return CATEGORY_CONFIGURATORS.rings;
}

/**
 * Build configurator sections dynamically from Shopify product options
 * This allows products with custom options to display them in the configurator
 */
export function buildDynamicConfiguratorSections(
  shopifyOptions: Array<{ id: string; name: string; values: string[] }>,
  category: string,
): ConfiguratorSection[] {
  if (!shopifyOptions || shopifyOptions.length === 0) {
    // Fall back to default sections if no custom options
    return getConfiguratorSections(category);
  }

  const sections: ConfiguratorSection[] = [];

  shopifyOptions.forEach((option) => {
    const name = option.name.toLowerCase();

    // Skip carat/weight options - don't show them
    if (
      name.includes("carat") ||
      (name.includes("weight") && !name.includes("gross"))
    ) {
      return;
    }

    // Map Shopify option names to configurator IDs
    let id = name.replace(/\s+/g, "-");
    let type: ConfiguratorSection["type"] = "dropdown";
    let label = option.name;

    // Determine UI type based on option name and values
    if (name.includes("color")) {
      type = "swatch";
    } else if (name.includes("purity")) {
      type = "toggle";
    } else if (name.includes("size") || name.includes("length")) {
      type = "dropdown";
    } else if (name.includes("style") || name.includes("type")) {
      type = "cards";
    }

    // Create configurator options from Shopify values
    let configuratorOptions: ConfiguratorOption[] = option.values.map(
      (value) => ({
        label: value,
        value: value,
        variant: value,
      }),
    );

    // For color options, add imageUrl from METAL_COLORS
    if (type === "swatch" && name.includes("color")) {
      configuratorOptions = option.values.map((value) => {
        // Find matching color from METAL_COLORS
        const metalColor = METAL_COLORS.find(
          (m) => m.value === value || m.label === value,
        );
        return {
          label: value,
          value: value,
          variant: value,
          imageUrl: metalColor?.imageUrl,
        };
      });
    }

    sections.push({
      id,
      label,
      type,
      options: configuratorOptions,
      required: name.includes("color") || name.includes("purity"),
      defaultValue: configuratorOptions[0]?.value,
    });
  });

  return sections;
}
