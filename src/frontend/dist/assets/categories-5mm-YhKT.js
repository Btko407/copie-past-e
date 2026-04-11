const CATEGORIES = [
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
  "Services"
];
const SUBCATEGORY_MAP = {
  Appliances: [
    "Household Appliances",
    "Washers & Dryers",
    "Refrigerators",
    "Other"
  ],
  Automotive: ["Cars & Trucks", "Motorcycles", "Parts & Accessories", "Other"],
  "Baby & Kids": ["Clothing", "Toys", "Strollers", "Car Seats", "Other"],
  "Books & Magazines": ["Fiction", "Non-Fiction", "Textbooks", "Other"],
  "Clothing & Shoes": [
    "Men's Clothing",
    "Women's Clothing",
    "Children's Clothing",
    "Shoes",
    "Other"
  ],
  Collectibles: ["Art", "Antiques", "Trading Cards", "Other"],
  "Electronics & Media": [
    "Cell Phones",
    "Computers",
    "Cameras",
    "Video Games",
    "TVs",
    "Other"
  ],
  Furniture: ["Sofas", "Tables", "Beds", "Office Furniture", "Other"],
  "Home & Garden": ["Gardening Tools", "Home Decor", "Furniture", "Other"],
  "Jewelry & Accessories": ["Watches", "Jewelry", "Bags", "Other"],
  "Tools & Machinery": [
    "Handheld Tools",
    "Heavy Machinery",
    "Lawn Mowers",
    "Other"
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
    "Other"
  ]
};
const CONDITIONS = [
  "New",
  "Used — Good",
  "Used — Fair",
  "Used — Normal Wear"
];
const SEP = "";
function encodeCategory(fields) {
  return [
    fields.category,
    fields.subcategory,
    fields.condition,
    fields.brand,
    fields.typeModel
  ].join(SEP);
}
function decodeCategory(raw) {
  if (!raw) {
    return {
      category: "",
      subcategory: "",
      condition: "",
      brand: "",
      typeModel: ""
    };
  }
  const parts = raw.split(SEP);
  return {
    category: parts[0] ?? "",
    subcategory: parts[1] ?? "",
    condition: parts[2] ?? "",
    brand: parts[3] ?? "",
    typeModel: parts[4] ?? ""
  };
}
export {
  CATEGORIES as C,
  SUBCATEGORY_MAP as S,
  CONDITIONS as a,
  decodeCategory as d,
  encodeCategory as e
};
