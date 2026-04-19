function createPlaceholderImage(label, toneA, toneB) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${toneA}" />
          <stop offset="100%" stop-color="${toneB}" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" rx="48" fill="url(#bg)" />
      <circle cx="590" cy="240" r="132" fill="rgba(255,255,255,0.34)" />
      <circle cx="280" cy="550" r="180" fill="rgba(255,255,255,0.22)" />
      <rect x="110" y="120" width="580" height="560" rx="32" fill="rgba(255,255,255,0.45)" />
      <text x="400" y="390" text-anchor="middle" fill="#2b241d" font-size="56" font-family="Georgia, serif">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const cjProducts = [
  {
    id: "pleated-floor-lamp",
    source: "CJ verified",
    sku: "CJSN166907901AZ",
    cjUrl:
      "https://cjdropshipping.com/product/retro-light-luxury-wood-grain-simple-pleated-floor-lamp-bedroom-bedside-sofa-study-floor-lamp-p-1618899526436270080.html",
    sourceCostInCents: 902,
    priceInCents: 6900,
    shippingBufferInCents: 2100,
    handlingFeeInCents: 320,
    category: "lighting",
    collection: "Warm Light Edit",
    name: "Pleated Wood-Grain Floor Lamp",
    description:
      "Soft pleated shade silhouette with a warmer, softer look than the average utility lamp. Strong fit for neutral living rooms and reading corners.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Hero lamp for soft-modern rooms",
    fulfillmentNote: "Works best as a hero piece beside a sofa, lounge chair, or reading corner.",
    leadTime: "Oversized item, allow extra delivery time",
    visualLabel: "Pleated Lamp",
    tones: ["#d6b48a", "#f3e7d8"],
    image: "/images/products/pleated-floor-lamp.jpeg",
    imageFallback: createPlaceholderImage("Pleated Lamp", "#d6b48a", "#f3e7d8")
  },
  {
    id: "black-arc-floor-lamp",
    source: "CJ verified",
    sku: "CJYD246101702BY",
    cjUrl:
      "https://cjdropshipping.com/product/fishing-floor-lamp-modern-minimalist-living-room-vertical-table-lamp-p-2508190320451619300.html",
    sourceCostInCents: 1841,
    priceInCents: 9900,
    shippingBufferInCents: 2800,
    handlingFeeInCents: 420,
    category: "lighting",
    collection: "Warm Light Edit",
    name: "Black Arc Floor Lamp",
    description:
      "A cleaner, more architectural floor lamp option with better presence for content, PDP imagery, and living room bundles.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Higher AOV anchor product",
    fulfillmentNote: "A strong anchor piece for living rooms that need height and a cleaner silhouette.",
    leadTime: "Oversized item, allow extra delivery time",
    visualLabel: "Arc Lamp",
    tones: ["#84776e", "#d8d0c9"],
    image: "/images/products/black-arc-floor-lamp.jpeg",
    imageFallback: createPlaceholderImage("Arc Lamp", "#84776e", "#d8d0c9")
  },
  {
    id: "light-luxury-vase",
    source: "CJ verified",
    sku: "CJYD233996701AZ",
    cjUrl:
      "https://cjdropshipping.com/product/ceramic-vase-home-decoration-simple-and-light-luxury-p-2503281341051623400.html",
    sourceCostInCents: 763,
    priceInCents: 2900,
    shippingBufferInCents: 850,
    handlingFeeInCents: 180,
    category: "living",
    collection: "Shelf Styling",
    name: "Light Luxury Ceramic Vase",
    description:
      "Compact ceramic vase with an easy neutral profile. Good decorative filler for consoles, shelves, and coffee table styling bundles.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Small, giftable, easy to upsell",
    fulfillmentNote: "Pairs well with stems, books, and coffee-table styling.",
    leadTime: "Standard decor delivery window",
    visualLabel: "Ceramic Vase",
    tones: ["#c4ae96", "#eee2d4"],
    image: "/images/products/light-luxury-vase.jpeg",
    imageFallback: createPlaceholderImage("Ceramic Vase", "#c4ae96", "#eee2d4")
  },
  {
    id: "white-ceramic-vase",
    source: "CJ verified",
    sku: "CJJJJTJT38364-White-S",
    cjUrl:
      "https://cjdropshipping.com/product/simple-white-ceramic-vase-decoration-p-8F35A4A6-7F8A-4018-BA9D-985A89EF24E6.html",
    sourceCostInCents: 370,
    priceInCents: 2400,
    shippingBufferInCents: 760,
    handlingFeeInCents: 170,
    category: "living",
    collection: "Shelf Styling",
    name: "Simple White Ceramic Vase",
    description:
      "Minimal white vase that fits the niche better than louder decor pieces. Safe staple SKU for neutral interiors and UGC styling.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Neutral evergreen decor",
    fulfillmentNote: "Easy to style on shelves, consoles, or dining sideboards.",
    leadTime: "Standard decor delivery window",
    visualLabel: "White Vase",
    tones: ["#d7d1ca", "#f7f3ed"],
    image: "/images/products/white-ceramic-vase.jpeg",
    imageFallback: createPlaceholderImage("White Vase", "#d7d1ca", "#f7f3ed")
  },
  {
    id: "body-shape-vase",
    source: "CJ verified",
    sku: "CJCC121956401AZ",
    cjUrl:
      "https://cjdropshipping.com/product/human-body-shape-ceramic-vase-p-1417018457731502080.html",
    sourceCostInCents: 387,
    priceInCents: 2600,
    shippingBufferInCents: 780,
    handlingFeeInCents: 170,
    category: "living",
    collection: "Shelf Styling",
    name: "Body Shape Ceramic Vase",
    description:
      "A more editorial accent that still fits the decor niche when paired with softer basics. Useful for social creatives and styled bundle imagery.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Trend-led accent without overspending",
    fulfillmentNote: "Best used as an accent piece with softer shapes and neutral textures.",
    leadTime: "Standard decor delivery window",
    visualLabel: "Body Vase",
    tones: ["#bea89e", "#efe4dc"],
    image: "/images/products/body-shape-vase.jpeg",
    imageFallback: createPlaceholderImage("Body Vase", "#bea89e", "#efe4dc")
  },
  {
    id: "linen-pillow-cover",
    source: "CJ verified",
    sku: "CJZT102408801AZ",
    cjUrl:
      "https://cjdropshipping.com/product/solid-color-linen-sofa-pillow-cushion-living-room-pillow-cover-p-1365950473881915392.html",
    sourceCostInCents: 305,
    priceInCents: 1800,
    shippingBufferInCents: 520,
    handlingFeeInCents: 120,
    category: "textiles",
    collection: "Layered Textiles",
    name: "Solid Linen Pillow Cover",
    description:
      "Plain linen-style pillow cover in living-room-friendly colors. Strong low-ticket add-on that lifts conversion when paired with seating or rugs.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Basket builder SKU",
    fulfillmentNote: "Ideal for layering on neutral sofas, accent chairs, and benches.",
    leadTime: "Standard textile delivery window",
    visualLabel: "Linen Cover",
    tones: ["#c3b397", "#eee6d7"],
    image: "/images/products/linen-pillow-cover.jpeg",
    imageFallback: createPlaceholderImage("Linen Cover", "#c3b397", "#eee6d7")
  },
  {
    id: "chenille-pillow-cover",
    source: "CJ verified",
    sku: "CJZT228600101AZ",
    cjUrl:
      "https://cjdropshipping.com/product/thickened-chenille-simple-pure-color-soft-texture-pillow-cover-p-2502072129321603200.html",
    sourceCostInCents: 246,
    priceInCents: 1900,
    shippingBufferInCents: 520,
    handlingFeeInCents: 120,
    category: "textiles",
    collection: "Layered Textiles",
    name: "Soft Chenille Pillow Cover",
    description:
      "Textured chenille cover that adds depth to a neutral sofa without introducing pattern fatigue. Very good for mix-and-match pairs.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Texture-driven impulse item",
    fulfillmentNote: "Looks strongest when layered in pairs with simpler solid pillows.",
    leadTime: "Standard textile delivery window",
    visualLabel: "Chenille",
    tones: ["#bda892", "#ede1d0"],
    image: "/images/products/chenille-pillow-cover.jpeg",
    imageFallback: createPlaceholderImage("Chenille", "#bda892", "#ede1d0")
  },
  {
    id: "abstract-wall-art",
    source: "CJ verified",
    sku: "CJJJYSZS01985",
    cjUrl:
      "https://www.cjdropshipping.com/product/abstract-decorative-painting-p-0FEA5300-A900-4E9C-ADB2-050EB011DCB3.html",
    sourceCostInCents: 940,
    priceInCents: 3900,
    shippingBufferInCents: 980,
    handlingFeeInCents: 220,
    category: "wall",
    collection: "Gallery Wall",
    name: "Abstract Decorative Painting",
    description:
      "Simple abstract art is easier to brand than character or quote art. Good wall category starter for neutral living rooms and offices.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Wall category starter product",
    fulfillmentNote: "A good option for quiet gallery walls and softer office corners.",
    leadTime: "Flat-pack delivery window",
    visualLabel: "Wall Art",
    tones: ["#af9c8e", "#ebe0d7"],
    image: "/images/products/abstract-wall-art.jpeg",
    imageFallback: createPlaceholderImage("Wall Art", "#af9c8e", "#ebe0d7")
  },
  {
    id: "wall-shelf-unit",
    source: "CJ verified",
    sku: "CJJT225761301AZ",
    cjUrl:
      "https://cjdropshipping.com/product/5tiers-of-wall-shelves-p-1873941488902262786.html",
    sourceCostInCents: 4836,
    priceInCents: 12900,
    shippingBufferInCents: 3200,
    handlingFeeInCents: 480,
    category: "wall",
    collection: "Storage Decor",
    name: "5-Tier Wall Shelf Unit",
    description:
      "A larger-ticket storage decor piece that broadens the catalog beyond soft goods. Useful if you want a stronger average order value.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Large-item AOV booster",
    fulfillmentNote: "Useful for styling books, ceramics, and smaller accent pieces in one vertical zone.",
    leadTime: "Large parcel delivery window",
    visualLabel: "Wall Shelf",
    tones: ["#8f7c68", "#ddd4ca"],
    image: "/images/products/wall-shelf-unit.jpeg",
    imageFallback: createPlaceholderImage("Wall Shelf", "#8f7c68", "#ddd4ca")
  },
  {
    id: "couple-resin-statue",
    source: "CJ verified",
    sku: "CJJT193569901AZ",
    cjUrl:
      "https://cjdropshipping.com/product/heartwarming-loving-couple-resin-statue---a-timeless-modern-home-decor-accent-for-bookshelves-office-desks-and-nightstands-valentines-day-gift-p-1741366999604797440.html",
    sourceCostInCents: 470,
    priceInCents: 2500,
    shippingBufferInCents: 760,
    handlingFeeInCents: 160,
    category: "living",
    collection: "Shelf Styling",
    name: "Minimal Couple Resin Statue",
    description:
      "Emotion-led shelf decor piece for gifting angles, bedside styling, and softer relationship-focused campaigns.",
    compareAt: "Retail target built from CJ base cost",
    tagline: "Giftable emotional decor",
    fulfillmentNote: "A softer shelf accent for bedside tables, consoles, and gift-led room styling.",
    leadTime: "Standard decor delivery window",
    visualLabel: "Resin Duo",
    tones: ["#d0c2b2", "#f1e8de"],
    image: "/images/products/couple-resin-statue.jpeg",
    imageFallback: createPlaceholderImage("Resin Duo", "#d0c2b2", "#f1e8de")
  }
];

export const amazonEdit = [
  {
    id: "amazon-rug",
    category: "Textile",
    name: "Washable Area Rug",
    description:
      "A machine-washable, non-slip area rug in neutral tones — great for layering under a sofa or accent chair.",
    price: "From CA$89",
    href: "https://amzn.to/42luBxr",
    image: "https://m.media-amazon.com/images/I/81hc5A1YahL._AC_SL1500_.jpg",
    alt: "Washable area rug in a living room"
  },
  {
    id: "amazon-pleated-lamp",
    category: "Lighting",
    name: "Pleated Floor Lamp",
    description:
      "Soft pleated fabric shade on a slim pole — a warm accent lamp for reading corners and beside sofas.",
    price: "From CA$59",
    href: "https://amzn.to/4tNDHPs",
    image: "https://m.media-amazon.com/images/I/419InZnGtHL._AC_SL1500_.jpg",
    alt: "Pleated floor lamp with beige fabric shade"
  },
  {
    id: "amazon-pillow",
    category: "Textiles",
    name: "Linen Throw Pillow Covers",
    description:
      "Natural linen pillow covers in neutral beige — a quick upgrade for any sofa or accent chair.",
    price: "From CA$18",
    href: "https://amzn.to/4mAKPvW",
    image: "https://m.media-amazon.com/images/I/81acVMqDBqL._AC_UL320_.jpg",
    alt: "Neutral linen throw pillow covers on a sofa"
  },
  {
    id: "amazon-arc-lamp",
    category: "Lighting",
    name: "Black Arc Floor Lamp",
    description:
      "Modern arched floor lamp with adjustable hanging shade — a sculptural statement over a lounge chair or sofa.",
    price: "From CA$79",
    href: "https://amzn.to/4mDmIgo",
    image: "https://m.media-amazon.com/images/I/71oxEIQadtL._AC_SL1500_.jpg",
    alt: "Black arc floor lamp in a modern living room"
  },
  {
    id: "amazon-vase-set",
    category: "Living room",
    name: "Ceramic Vase Set of 3",
    description:
      "Matte neutral ceramic vases in three heights — easy to style on shelves, consoles, and mantels.",
    price: "From CA$32",
    href: "https://amzn.to/4tQ3F4M",
    image: "https://m.media-amazon.com/images/I/61lkdy0uAML._AC_SL1500_.jpg",
    alt: "Set of three neutral white ceramic vases on a shelf"
  },
  {
    id: "amazon-mirror",
    category: "Wall decor",
    name: "Round Wall Mirror",
    description:
      "A clean round mirror that adds depth and light — works in entryways, living rooms, and above consoles.",
    price: "From CA$45",
    href: "https://amzn.to/4tiIiJo",
    image: "https://m.media-amazon.com/images/I/81O5y5p+kXL._AC_SL1500_.jpg",
    alt: "Round wall mirror mounted in a living room"
  },
  {
    id: "amazon-pillow-covers-neutral",
    category: "Textiles",
    name: "MIULEE Linen Pillow Covers",
    description:
      "Set of 4 boho farmhouse pillow covers in soft neutral tones — pairs well with chenille and solid cushions.",
    price: "From CA$22",
    href: "https://amzn.to/4tjlZU1",
    image: "https://m.media-amazon.com/images/I/81Ez4LqQS2L._AC_SL1500_.jpg",
    alt: "Neutral linen pillow covers stacked on a sofa"
  },
  {
    id: "amazon-wall-art",
    category: "Wall decor",
    name: "Abstract Canvas Wall Art",
    description:
      "Framed neutral abstract print in warm brown and beige — a quiet gallery-wall anchor for living rooms.",
    price: "From CA$48",
    href: "https://amzn.to/485xwxN",
    image: "https://m.media-amazon.com/images/I/71iEop0+i8L._AC_SL1500_.jpg",
    alt: "Framed neutral abstract canvas wall art"
  },
  {
    id: "amazon-resin-statue",
    category: "Living room",
    name: "Romantic Resin Couple Statue",
    description:
      "Minimal modern sculpture — a giftable shelf accent for bedside tables, consoles, and bookshelf styling.",
    price: "From CA$28",
    href: "https://amzn.to/4tjKoZA",
    image: "https://m.media-amazon.com/images/I/714CXqpnKJL._AC_SL1500_.jpg",
    alt: "Romantic resin couple figurine on a shelf"
  }
];
