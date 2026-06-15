import { BrandConfig, Product, Collection, Order, SalesDataPoint, CategoryDataPoint } from './types';

export const HERO_BANNER_IMAGE = "/src/assets/images/luxury_fashion_banner_1781515210940.jpg";

export const INITIAL_BRAND_CONFIG: BrandConfig = {
  brandName: "AURA",
  tagline: "The Art of Haute Couture & Timeless Refinement",
  currencySymbol: "€",
  shippingFee: 25,
  freeShippingThreshold: 750,
  taxRate: 0.12, // 12% luxury VAT rate
  premiumPackagingFee: 15,
  discountCodes: [
    { code: "VOGUE20", percentage: 20, description: "20% Off - Editorial Showcase Promotion" },
    { code: "AURALEATHER", percentage: 15, description: "15% Off - Premium Leather Goods Exclusive" },
    { code: "WELCOME10", percentage: 10, description: "10% Off - First Order Welcoming Invitation" },
    { code: "HAUTE50", percentage: 50, description: "50% Off - Special VVIP Private Invitation (Super Discount)" }
  ]
};

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: "ready-to-wear",
    name: "Ready-To-Wear",
    description: "Impeccably tailored silhouettes crafted from finest cashmere, silk, and wool.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "leather-goods",
    name: "Leather Goods",
    description: "Saddle-stitched absolute calfskin bags, portfolios, and refined travel trunks.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Architectural sunglasses, heirloom silk twills, and exquisite chronometers.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Belvedere Cashmere Chesterfield Coat",
    sku: "AURA-RTW-CO-01",
    category: "Ready-To-Wear",
    price: 2450,
    description: "The epitome of cold-weather elegance. Cut from double-faced, sustainably sourced Mongolian cashmere. Softly structured draft shoulders, hand-finished pick-stitching along the lapel, and lined in pure Italian jacquard cupro. Provides unparalleled insulation with a featherlight drape.",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Camel", value: "#C19A6B" },
      { name: "Charcoal", value: "#36454F" },
      { name: "Alabaster", value: "#F4F0EA" }
    ],
    rating: 4.9,
    reviews: [
      {
        id: "rev-1-1",
        userName: "Eleanora V.",
        rating: 5,
        comment: "An absolute masterpiece. The fabric is unbelievably soft and the tailoring elevates any look instantly. A heritage investment.",
        date: "2026-05-12"
      },
      {
        id: "rev-1-2",
        userName: "Charles de M.",
        rating: 5,
        comment: "Excellent cut, drape is perfection. Warm but has zero bulk.",
        date: "2026-06-02"
      }
    ],
    stock: 8,
    isFeatured: true
  },
  {
    id: "prod-2",
    name: "Atelier Silk Pleated Gown",
    sku: "AURA-RTW-GO-02",
    category: "Ready-To-Wear",
    price: 1890,
    description: "Fluid motion captured in silk. Featuring delicate hand-folded pleats that cascade effortlessly from an architectural empire waist. Designed with an elegant open cowl-back and asymmetric fluid hemline. Features structured internal boning for subtle contour support.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["XXS", "XS", "S", "M", "L"],
    colors: [
      { name: "Emerald", value: "#0F52BA" },
      { name: "Midnight Rose", value: "#800020" },
      { name: "Onyx Black", value: "#0F0F0F" }
    ],
    rating: 4.8,
    reviews: [
      {
        id: "rev-2-1",
        userName: "Isabella G.",
        rating: 5,
        comment: "Wore this to an opera gala in Milan. I felt like royalty. The way the Silk moves under lights is sheer magic.",
        date: "2026-05-24"
      }
    ],
    stock: 4, // High demand / Low stock to trigger alert in admin
    isFeatured: true
  },
  {
    id: "prod-3",
    name: "Monogram Sartorial Leather Duffle",
    sku: "AURA-LG-DF-03",
    category: "Leather Goods",
    price: 3200,
    description: "Crafted for the discerning traveler. Fully saddle-stitched by hand from grade-A French full-grain calfskin with subtle grain de poudre embossing. Features solid brushed brass hardware, a key-bell lock mechanism, hand-rolled double handles, and an ergonomic leather shoulder strap. Meets strict global carry-on cabin specifications.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Ebene Cognac", value: "#7B3F00" },
      { name: "Noir", value: "#1A1A1A" }
    ],
    rating: 5.0,
    reviews: [
      {
        id: "rev-3-1",
        userName: "Marc-Antoine R.",
        rating: 5,
        comment: "Unmatched craftsmanship. Every stitch is perfect, and the leather smells magnificent. Truly a lifetime bag.",
        date: "2026-04-18"
      }
    ],
    stock: 3, // Low stock, highly prestigious
    isFeatured: true
  },
  {
    id: "prod-4",
    name: "Sienna Croco-Embossed Calfskin Chelsea Boots",
    sku: "AURA-LG-BT-04",
    category: "Leather Goods",
    price: 1150,
    description: "A striking fusion of rugged silhouette and refined detail. Exceptional croco-embossed hand-painted calfskin with a Goodyear welt construction. Elasticated side gussets, full glove-leather linings, and double-layered stacked leather heels. Provides immediate luxury comforts and long-term durability.",
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["37", "38", "39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Mahogany", value: "#4A2C11" },
      { name: "Nero Carbon", value: "#121212" }
    ],
    rating: 4.7,
    reviews: [
      {
        id: "rev-4-1",
        userName: "Arthur K.",
        rating: 4,
        comment: "Excellent boots. Take a few wears to break in because the leather is incredibly robust, but now they fit like a second skin.",
        date: "2026-03-30"
      }
    ],
    stock: 12,
    isFeatured: false
  },
  {
    id: "prod-5",
    name: "Architectural Acetate Oversized Sunglasses",
    sku: "AURA-AC-SG-05",
    category: "Accessories",
    price: 420,
    description: "Bold geometric lines meet vintage Riviera vibes. Cut from organic Japanese cotton acetate block. Finished with hand-polished beveling, double-pinned safety hinges, and 100% UVA/UVB Carl Zeiss reflective-dampening polarized lenses. The golden inner temple engraving details the signature 'A' monograph.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard Fit"],
    colors: [
      { name: "Tortoise Amber", value: "#A87C43" },
      { name: "Gloss Obsidian", value: "#080808" }
    ],
    rating: 4.6,
    reviews: [],
    stock: 15,
    isFeatured: false
  },
  {
    id: "prod-6",
    name: "Vanderbilt Tourbillon Steel Chronometer",
    sku: "AURA-AC-WT-06",
    category: "Accessories",
    price: 6800,
    description: "Heirloom mechanical horology. Comprising a beautifully hand-finished automatic calibre visible through a skeletonized scratch-resistant sapphire exhibition window. Surrounded by a marine-grade 316L high-polish stainless steel casing and integrated crocodile strap with deployant buckle. Chronometer-grade certified accuracy.",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["40mm Case"],
    colors: [
      { name: "Imperial Obsidian/Steel", value: "#CCCCCC" },
      { name: "Gentleman Ivory/Rosegold", value: "#E5C1A7" }
    ],
    rating: 4.95,
    reviews: [
      {
        id: "rev-6-1",
        userName: "Dr. Nicholas P.",
        rating: 5,
        comment: "An exceptional piece of micro-engineering. The sweep of the hand is breathtaking, and the detailing stands proudly alongside top Swiss manufacture.",
        date: "2026-02-14"
      }
    ],
    stock: 2, // Ultraniche, perfect for highlighting
    isFeatured: true
  },
  {
    id: "prod-7",
    name: "Empress Silk Twill Monogram Scarf",
    sku: "AURA-AC-SC-07",
    category: "Accessories",
    price: 390,
    description: "Our signature monogram crest screen-printed on premium Italian 90cm mulberry silk twill. Generous hand-rolled edges sewn by seasoned artisans in Lyon. An incredibly versatile item that can be worn styled as a standard neck scarf, draped elegantly on leather top-handles, or worn as an exquisite head covering.",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["90cm x 90cm"],
    colors: [
      { name: "Burgundy/Cream", value: "#800020" },
      { name: "Navy/Gold", value: "#000080" },
      { name: "Taupe/Ivory", value: "#B38B6D" }
    ],
    rating: 4.85,
    reviews: [],
    stock: 25,
    isFeatured: false
  },
  {
    id: "prod-8",
    name: "Atelier Wool-Blend Tailored Double-Breasted Blazer",
    sku: "AURA-RTW-BL-08",
    category: "Ready-To-Wear",
    price: 1350,
    description: "Impeccably tailored double-breasted structure inspired by modern Savile Row draping. Made from superfine virgin wool with a touch of elastane for slight luxury yield. Sharply peaked lapels, custom structured shoulder pads, horn-stamped buttons, and functional patch-flap hip pockets.",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["36", "38", "40", "42", "44"],
    colors: [
      { name: "Sartorial Navy", value: "#1B2A47" },
      { name: "Midnight Charcoal", value: "#2C3539" }
    ],
    rating: 4.8,
    reviews: [
      {
        id: "rev-8-1",
        userName: "Sophia W.",
        rating: 5,
        comment: "Breathtaking fit on shoulders. Feels commanding and elegant all at once. True to size.",
        date: "2026-06-05"
      }
    ],
    stock: 9,
    isFeatured: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "AURA-10023",
    date: "2026-06-12T14:32:00Z",
    customer: {
      name: "Victoria C. Sterling",
      email: "victoria.sterling@luxeclov.com",
      address: "142 Avenue Montaigne",
      city: "Paris",
      zip: "75008"
    },
    items: [
      {
        id: "prod-1",
        name: "Belvedere Cashmere Chesterfield Coat",
        price: 2450,
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Camel"
      }
    ],
    subtotal: 2450,
    discount: 490, // VOGUE20 used
    tax: 235.2,
    premiumPackaging: true,
    shipping: 0, // Free shipping threshold crossed
    total: 2195.2,
    status: "Delivered"
  },
  {
    id: "AURA-10022",
    date: "2026-06-13T09:12:00Z",
    customer: {
      name: "Sir Alistair Cunningham",
      email: "alistair@cunninghamestate.co.uk",
      address: "42 Berkeley Square",
      city: "London",
      zip: "W1J 5AW"
    },
    items: [
      {
        id: "prod-6",
        name: "Vanderbilt Tourbillon Steel Chronometer",
        price: 6800,
        quantity: 1,
        selectedSize: "40mm Case",
        selectedColor: "Imperial Obsidian/Steel"
      }
    ],
    subtotal: 6800,
    discount: 0,
    tax: 816,
    premiumPackaging: true,
    shipping: 0,
    total: 7616,
    status: "Shipped"
  },
  {
    id: "AURA-10021",
    date: "2026-06-14T18:44:00Z",
    customer: {
      name: "Jean-Pierre Laurent",
      email: "jp.laurent@rivegauche.fr",
      address: "71 Boulevard Saint-Germain",
      city: "Paris",
      zip: "75006"
    },
    items: [
      {
        id: "prod-5",
        name: "Architectural Acetate Oversized Sunglasses",
        price: 420,
        quantity: 1,
        selectedSize: "Standard Fit",
        selectedColor: "Tortoise Amber"
      },
      {
        id: "prod-7",
        name: "Empress Silk Twill Monogram Scarf",
        price: 390,
        quantity: 1,
        selectedSize: "90cm x 90cm",
        selectedColor: "Burgundy/Cream"
      }
    ],
    subtotal: 810,
    discount: 121.5, // AURALEATHER used
    tax: 82.62,
    premiumPackaging: false,
    shipping: 0, // > 750
    total: 771.12,
    status: "Processing"
  },
  {
    id: "AURA-10020",
    date: "2026-06-15T01:05:00Z",
    customer: {
      name: "Clarissa Fontaine",
      email: "clarissa.fontaine@vienna-arts.org",
      address: "Herrengasse 19",
      city: "Vienna",
      zip: "1010"
    },
    items: [
      {
        id: "prod-2",
        name: "Atelier Silk Pleated Gown",
        price: 1890,
        quantity: 1,
        selectedSize: "S",
        selectedColor: "Emerald"
      }
    ],
    subtotal: 1890,
    discount: 0,
    tax: 226.8,
    premiumPackaging: true,
    shipping: 0,
    total: 2116.8,
    status: "Pending"
  }
];

export const INITIAL_SALES_TRENDS: SalesDataPoint[] = [
  { date: "June 9", sales: 4800, orders: 3 },
  { date: "June 10", sales: 7200, orders: 4 },
  { date: "June 11", sales: 5120, orders: 3 },
  { date: "June 12", sales: 2195.2, orders: 1 },
  { date: "June 13", sales: 7616, orders: 1 },
  { date: "June 14", sales: 771.12, orders: 1 },
  { date: "June 15", sales: 2116.8, orders: 1 }
];

export const INITIAL_CATEGORY_DATA: CategoryDataPoint[] = [
  { name: "Ready-To-Wear", value: 4340 },
  { name: "Leather Goods", value: 3200 },
  { name: "Accessories", value: 7610 }
];
