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

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface PlatformDraftSummary {
  draftId: string;
  platform: Platform;
  status: DraftStatus;
  completenessPercent: number;
  isValid: boolean;
  lastEditedAt: bigint; // ICP timestamps are BigInt
}

export interface MasterListingSummary {
  id: string;
  title: string;
  description: string;
  price: string | null;
  category: string | null;
  tags: string[];
  photos: Uint8Array[]; // first photo used as thumbnail
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
  }
> = {
  facebook: {
    name: "Facebook",
    icon: "📘",
    color: "#1877F2",
    maxTitle: 200,
    maxDesc: 5000,
  },
  mercari: {
    name: "Mercari",
    icon: "🛒",
    color: "#d62f7d",
    maxTitle: 80,
    maxDesc: 1000,
  },
  ebay: {
    name: "eBay",
    icon: "🔨",
    color: "#e53238",
    maxTitle: 80,
    maxDesc: 4000,
  },
  poshmark: {
    name: "Poshmark",
    icon: "👗",
    color: "#BF0626",
    maxTitle: 141,
    maxDesc: 2000,
  },
  depop: {
    name: "Depop",
    icon: "🎨",
    color: "#FF4040",
    maxTitle: 70,
    maxDesc: 500,
  },
  etsy: {
    name: "Etsy",
    icon: "🛍",
    color: "#F16521",
    maxTitle: 140,
    maxDesc: 10000,
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
