import { c as createLucideIcon } from "./index-CDYDluDX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
const PLATFORM_CONFIG = {
  facebook: {
    name: "Facebook",
    icon: "📘",
    color: "#1877F2",
    maxTitle: 200,
    maxDesc: 5e3,
    requiredFields: ["title", "price", "condition", "location", "category"]
  },
  mercari: {
    name: "Mercari",
    icon: "🛒",
    color: "#d62f7d",
    maxTitle: 80,
    maxDesc: 1e3,
    requiredFields: ["title", "price", "brand", "condition", "shipping_type"]
  },
  ebay: {
    name: "eBay",
    icon: "🔨",
    color: "#e53238",
    maxTitle: 80,
    maxDesc: 4e3,
    requiredFields: [
      "title",
      "price",
      "condition_id",
      "quantity",
      "listing_type",
      "shipping_service"
    ]
  },
  poshmark: {
    name: "Poshmark",
    icon: "👗",
    color: "#BF0626",
    maxTitle: 141,
    maxDesc: 2e3,
    requiredFields: [
      "title",
      "price",
      "original_price",
      "brand",
      "size",
      "department",
      "category"
    ]
  },
  depop: {
    name: "Depop",
    icon: "🎨",
    color: "#FF4040",
    maxTitle: 70,
    maxDesc: 500,
    requiredFields: ["title", "price", "brand", "size", "condition"]
  },
  etsy: {
    name: "Etsy",
    icon: "🛍",
    color: "#F16521",
    maxTitle: 140,
    maxDesc: 1e4,
    requiredFields: ["title", "price", "quantity", "who_made", "when_made"]
  }
};
const ALL_PLATFORMS = [
  "facebook",
  "mercari",
  "ebay",
  "poshmark",
  "depop",
  "etsy"
];
const VALID_PLATFORMS = [
  "facebook",
  "mercari",
  "ebay",
  "poshmark",
  "depop",
  "etsy"
];
function normalizePlatform(raw) {
  let key = "";
  if (typeof raw === "string") {
    key = raw.replace(/^#/, "").toLowerCase().trim();
  } else if (raw !== null && typeof raw === "object") {
    const firstKey = Object.keys(raw)[0];
    if (firstKey) key = firstKey.toLowerCase().trim();
  } else {
    return null;
  }
  if (key === "mecari") key = "mercari";
  if (VALID_PLATFORMS.includes(key)) {
    return key;
  }
  return null;
}
export {
  ALL_PLATFORMS as A,
  Pencil as P,
  PLATFORM_CONFIG as a,
  normalizePlatform as n
};
