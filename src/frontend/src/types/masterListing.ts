// ─── Platform types ───────────────────────────────────────────────────────────

export type Platform =
  | "facebook"
  | "mercari"
  | "ebay"
  | "poshmark"
  | "depop"
  | "etsy";

export type DraftStatus =
  | "unsaved"
  | "saved"
  | "preparing"
  | "ready"
  | "posted";

// ─── Platform-specific draft field types ─────────────────────────────────────

export interface FacebookDraftFields {
  /** Max 200 chars */
  title: string;
  /** Max 5000 chars */
  description: string;
  price: string;
  condition: "new" | "used_like_new" | "used_good" | "used_fair";
  /** City, State or ZIP for local marketplace listing */
  location: string;
  /** Facebook Marketplace category name */
  category: string;
}

export interface MercariDraftFields {
  /** Max 80 chars */
  title: string;
  /** Max 1000 chars */
  description: string;
  price: string;
  brand: string;
  /** 1=New, 2=Like New, 3=Good, 4=Fair, 5=Poor */
  condition: 1 | 2 | 3 | 4 | 5;
  /** "mercari_prepaid_label" | "seller_arranges" | "bundled" */
  shipping_type: string;
  /** Expected days to ship (1–7) */
  delivery_days: number;
  category: string;
}

export interface EbayDraftFields {
  /** Max 80 chars */
  title: string;
  /** Max 4000 chars */
  description: string;
  price: string;
  /**
   * eBay condition IDs:
   * 1000=New, 1500=New (other), 2000=Certified Refurbished,
   * 2500=Seller Refurbished, 3000=Used, 4000=Very Good, 5000=Good,
   * 6000=Acceptable, 7000=For Parts
   */
  condition_id:
    | "1000"
    | "1500"
    | "2000"
    | "2500"
    | "3000"
    | "4000"
    | "5000"
    | "6000"
    | "7000";
  quantity: number;
  listing_type: "fixed_price" | "auction";
  /** eBay category ID (numeric string) */
  category_id: string;
  /** Auction start price (only when listing_type=auction) */
  start_price?: string;
  /** Auction end price / buy-it-now (only when listing_type=auction) */
  buy_it_now_price?: string;
  /** Shipping service code e.g. "USPSMedia" */
  shipping_service: string;
  shipping_cost: string;
}

export interface PoshmarkDraftFields {
  /** Max 141 chars */
  title: string;
  /** Max 2000 chars */
  description: string;
  price: string;
  original_price: string;
  brand: string;
  /** Poshmark size string e.g. "M", "8", "6.5 Women" */
  size: string;
  /** "Women" | "Men" | "Kids" | "Home" | "Pets" | "Electronics" */
  department: string;
  /** Poshmark category path e.g. "Tops > Blouses" */
  category: string;
  color: string;
  /** Secondary color */
  color2?: string;
  condition?: "NWT" | "NWOT" | "EUC" | "GUC" | "Fair";
}

export interface DepopDraftFields {
  /** Max 70 chars */
  title: string;
  /** Max 500 chars */
  description: string;
  price: string;
  brand: string;
  /** Depop size string e.g. "M", "34", "One Size" */
  size: string;
  /**
   * "New with tags" | "Like new" | "Good" | "Fair" | "Poor"
   */
  condition: "New with tags" | "Like new" | "Good" | "Fair" | "Poor";
  color: string;
  /** "Male" | "Female" | "Unisex" */
  gender?: string;
  category: string;
}

export interface EtsyDraftFields {
  /** Max 140 chars */
  title: string;
  /** Max 10000 chars */
  description: string;
  price: string;
  quantity: number;
  /** Up to 13 tags, each max 20 chars */
  tags: string[];
  /** e.g. ["cotton", "silver", "reclaimed wood"] */
  materials: string[];
  /** "i_did" | "someone_else" | "collective" */
  who_made: "i_did" | "someone_else" | "collective";
  /**
   * Year made — ISO year string e.g. "2020" or special values
   * "before_2000" | "2000_2004" | "2005_2009" etc.
   */
  when_made: string;
  /** True = craft supply/tool, false = finished product */
  is_supply: boolean;
  /** Etsy taxonomy ID (numeric string) */
  taxonomy_id?: string;
  /** Shipping profile ID */
  shipping_profile_id?: string;
  /** Personalization instructions (max 255 chars) */
  personalization_instructions?: string;
}

// ─── Unified PlatformDraft ────────────────────────────────────────────────────

export interface PlatformDraftFields {
  facebook: FacebookDraftFields;
  mercari: MercariDraftFields;
  ebay: EbayDraftFields;
  poshmark: PoshmarkDraftFields;
  depop: DepopDraftFields;
  etsy: EtsyDraftFields;
}

export interface PlatformDraft<P extends Platform = Platform> {
  draftId: string;
  listingId: string;
  platform: P;
  status: DraftStatus;
  fields: P extends keyof PlatformDraftFields
    ? PlatformDraftFields[P]
    : Record<string, unknown>;
  imageUrls: string[];
  completenessPercent: number;
  isValid: boolean;
  lastEditedAt: bigint;
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface PlatformDraftSummary {
  draftId: string;
  platform: Platform;
  status: DraftStatus;
  completenessPercent: number;
  isValid: boolean;
  lastEditedAt: bigint;
}

export interface MasterListingSummary {
  id: string;
  title: string;
  description: string;
  price: string | null;
  category: string | null;
  tags: string[];
  photos: Uint8Array[];
  status: "draft" | "active" | "archived";
  pinned: boolean;
  favoriteCount: number;
  platformDrafts: PlatformDraftSummary[];
  createdAt: bigint;
  updatedAt: bigint;
  expirationDate: bigint | null;
}

// ─── Platform config ──────────────────────────────────────────────────────────

export const PLATFORM_CONFIG: Record<
  Platform,
  {
    name: string;
    icon: string;
    color: string;
    maxTitle: number;
    maxDesc: number;
    requiredFields: string[];
  }
> = {
  facebook: {
    name: "Facebook",
    icon: "📘",
    color: "#1877F2",
    maxTitle: 200,
    maxDesc: 5000,
    requiredFields: ["title", "price", "condition", "location", "category"],
  },
  mercari: {
    name: "Mercari",
    icon: "🛒",
    color: "#d62f7d",
    maxTitle: 80,
    maxDesc: 1000,
    requiredFields: ["title", "price", "brand", "condition", "shipping_type"],
  },
  ebay: {
    name: "eBay",
    icon: "🔨",
    color: "#e53238",
    maxTitle: 80,
    maxDesc: 4000,
    requiredFields: [
      "title",
      "price",
      "condition_id",
      "quantity",
      "listing_type",
      "shipping_service",
    ],
  },
  poshmark: {
    name: "Poshmark",
    icon: "👗",
    color: "#BF0626",
    maxTitle: 141,
    maxDesc: 2000,
    requiredFields: [
      "title",
      "price",
      "original_price",
      "brand",
      "size",
      "department",
      "category",
    ],
  },
  depop: {
    name: "Depop",
    icon: "🎨",
    color: "#FF4040",
    maxTitle: 70,
    maxDesc: 500,
    requiredFields: ["title", "price", "brand", "size", "condition"],
  },
  etsy: {
    name: "Etsy",
    icon: "🛍",
    color: "#F16521",
    maxTitle: 140,
    maxDesc: 10000,
    requiredFields: ["title", "price", "quantity", "who_made", "when_made"],
  },
};

export const ALL_PLATFORMS: Platform[] = [
  "facebook",
  "mercari",
  "ebay",
  "poshmark",
  "depop",
  "etsy",
];
