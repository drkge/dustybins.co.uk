// Global site data. Anything that appears both as visible copy and in
// structured data lives here so the two can't drift apart.

export const SITE_URL = "https://dustybins.co.uk";

export const SITE_TITLE = "Dusty Bins";
export const SITE_TAGLINE = "Every bin you'll ever need";
export const SITE_DESCRIPTION =
  "Recycling bins, litter bins and steel and plastic wheelie bins for businesses, councils and homes. Browse the range and ask us for a quote.";

/** Default social sharing card. 1200x630, lives in `public/`. */
export const OG_IMAGE = {
  src: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Dusty Bins — every bin you'll ever need",
};

export const BUSINESS = {
  name: "Dusty Bins",
  legalName: "Dusty Bins Limited",
  email: "dustybinsuk@outlook.com",
  /** As a UK visitor would read it. */
  telephoneDisplay: "07981 883340",
  /** E.164, for tel: links and structured data. */
  telephoneIntl: "+447981883340",
  address: {
    street: "1 Cameron Street",
    locality: "Coatbridge",
    region: "North Lanarkshire",
    postalCode: "ML5 2EJ",
    country: "GB",
  },
  /** Address as display lines, for the contact page and footer. */
  addressLines: ["1 Cameron Street", "Coatbridge", "ML5 2EJ"],
};

export const TEL_HREF = `tel:${BUSINESS.telephoneIntl}`;
export const MAILTO_HREF = `mailto:${BUSINESS.email}`;

/**
 * Top-level departments, in menu order, by category id. Each one's blurb is
 * the category's own `description` in `src/content/categories.json`.
 */
export const DEPARTMENTS = ["recycle-hub", "steel-wheelie-bins", "plastic-wheelie-bins", "skip-parts-and-services"];

/** Waste streams on the home page: an icon in src/assets/streams/ and the category it links to. */
export const WASTE_STREAMS = [
  { name: "Paper", icon: "paper", category: "recycle-hub/paper-recycling-bins" },
  { name: "Plastic", icon: "plastic", category: "recycle-hub/plastic-recycling-bins" },
  { name: "Food", icon: "food", category: "recycle-hub/food-waste-bins" },
  { name: "Mixed recycling", icon: "mixed-recycling", category: "recycle-hub/mixed-recycling-bins" },
  { name: "Cups", icon: "cups", category: "recycle-hub/internal-bins/cup-bins" },
  { name: "Clinical waste", icon: "clinical-waste", category: "recycle-hub/clinical-waste" },
  { name: "Aluminium cans", icon: "cans", category: "recycle-hub/aluminium-cans-recycling-bins" },
  { name: "Mixed glass", icon: "glass", category: "recycle-hub/glass-recycling-bins" },
  { name: "Crisp packets", icon: "crisps", category: "recycle-hub/crisp-bins" },
  { name: "General waste", icon: "general-waste", category: "recycle-hub/general-waste-bins" },
];

/** Products shown on the home page, by file name in src/content/products/. */
export const FEATURED_PRODUCTS = [
  "1100-litre-galvanised-steel-wheelie-bin",
  "envirobank-240l-recycling-bin",
  "heritage-square-litter-bin",
  "240-litre-plastic-wheelie-bin",
  "envirobin-maxi-140l-recycling-bin",
  "1100-litre-blue-planet-container",
  "grit-bin",
  "envirostep-90-litre-3x30l-recycling-bin-triple",
];
