// ── Category / Subcategory / Condition constants ───────────────────────────────

export const CATEGORIES = [
  "Appliances",
  "Automotive",
  "Baby & Kids",
  "Books & Magazines",
  "Clothing & Shoes",
  "Collectibles",
  "Electronics & Media",
  "Furniture",
  "Home & Garden",
  "Jewelry & Accessories",
  "Tools & Machinery",
  "Office Supplies",
  "Services",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SUBCATEGORY_MAP: Record<string, string[]> = {
  Appliances: [
    "Household Appliances",
    "Washers & Dryers",
    "Refrigerators",
    "Other",
  ],
  Automotive: ["Cars & Trucks", "Motorcycles", "Parts & Accessories", "Other"],
  "Baby & Kids": ["Clothing", "Toys", "Strollers", "Car Seats", "Other"],
  "Books & Magazines": ["Fiction", "Non-Fiction", "Textbooks", "Other"],
  "Clothing & Shoes": [
    "Men's Clothing",
    "Women's Clothing",
    "Children's Clothing",
    "Shoes",
    "Other",
  ],
  Collectibles: ["Art", "Antiques", "Trading Cards", "Other"],
  "Electronics & Media": [
    "Cell Phones",
    "Computers",
    "Cameras",
    "Video Games",
    "TVs",
    "Other",
  ],
  Furniture: ["Sofas", "Tables", "Beds", "Office Furniture", "Other"],
  "Home & Garden": ["Gardening Tools", "Home Decor", "Furniture", "Other"],
  "Jewelry & Accessories": ["Watches", "Jewelry", "Bags", "Other"],
  "Tools & Machinery": [
    "Handheld Tools",
    "Heavy Machinery",
    "Lawn Mowers",
    "Other",
  ],
  "Office Supplies": ["Office Chairs", "Desks", "Printers", "Other"],
  Services: [
    "HVAC",
    "Plumbing",
    "Electrical",
    "Painting",
    "Roofing",
    "Landscaping",
    "Cleaning",
    "Handyman",
    "Other",
  ],
};

export const CONDITIONS = [
  "New",
  "Used — Good",
  "Used — Fair",
  "Used — Normal Wear",
] as const;

export type Condition = (typeof CONDITIONS)[number];

// ── Encoding / decoding helpers ────────────────────────────────────────────────
// We encode the 5 new fields into the single `category` string the backend holds.
// Format: "category\x1fsubcategory\x1fcondition\x1fbrand\x1ftypeModel"
// We use ASCII Unit Separator (0x1F) which never appears in natural text.
const SEP = "\x1f";

export interface ListingCategoryFields {
  category: string;
  subcategory: string;
  condition: string;
  brand: string;
  typeModel: string;
}

export function encodeCategory(fields: ListingCategoryFields): string {
  return [
    fields.category,
    fields.subcategory,
    fields.condition,
    fields.brand,
    fields.typeModel,
  ].join(SEP);
}

export function decodeCategory(raw: string | undefined): ListingCategoryFields {
  if (!raw) {
    return {
      category: "",
      subcategory: "",
      condition: "",
      brand: "",
      typeModel: "",
    };
  }
  const parts = raw.split(SEP);
  return {
    category: parts[0] ?? "",
    subcategory: parts[1] ?? "",
    condition: parts[2] ?? "",
    brand: parts[3] ?? "",
    typeModel: parts[4] ?? "",
  };
}

/** Return just the display category (first segment) for places that need only the category label */
export function getDisplayCategory(raw: string | undefined): string {
  return decodeCategory(raw).category;
}
