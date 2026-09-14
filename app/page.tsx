import { ProductGrid } from "@/components";
import { getProducts } from "@/services/products";
import type { ProductWithDetails } from "@/types/database";

// Data produk kurasi luxury fashion (10 produk = pas 2 baris penuh di desktop 5 kolom)
const SAMPLE_PRODUCTS: ProductWithDetails[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Tailored Double-Breasted Wool Coat",
    slug: "tailored-double-breasted-wool-coat",
    tagline: "Timeless Parisian Tailoring",
    description: "Expertly tailored from Italian wool blend with peaked lapels and structured silhouette.",
    price: 3850000,
    compare_at_price: 4500000,
    features: ["100% Virgin Wool", "Horn Buttons", "Interior Pocket", "Full Satin Lining"],
    materials: "90% Virgin Wool, 10% Cashmere",
    care_instructions: "Dry clean only",
    fit_type: "Tailored",
    gender: "women",
    rating: 4.9,
    reviews_count: 28,
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: true,
    product_variants: [
      { id: "v-1", product_id: "prod-1", sku: "TWC-BLK-S", color_name: "Noir", color_hex: "#1A1A1A", size: "S", stock: 4 },
      { id: "v-2", product_id: "prod-1", sku: "TWC-BLK-M", color_name: "Noir", color_hex: "#1A1A1A", size: "M", stock: 7 },
    ],
  },
  {
    id: "prod-2",
    category_id: "cat-2",
    name: "Pure Cashmere Knit Sweater",
    slug: "pure-cashmere-knit-sweater",
    tagline: "Ultra-Soft Mongolian Fleece",
    description: "Knitted from long-staple Mongolian cashmere in a refined 12-gauge rib texture.",
    price: 1950000,
    compare_at_price: 2350000,
    features: ["Grade-A Cashmere", "Seamless Shoulders", "Ribbed Trims"],
    materials: "100% Cashmere",
    care_instructions: "Hand wash cold",
    fit_type: "Relaxed",
    gender: "unisex",
    rating: 4.8,
    reviews_count: 42,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: false,
    product_variants: [
      { id: "v-3", product_id: "prod-2", sku: "CKS-OAT-M", color_name: "Oatmeal", color_hex: "#E5DEC9", size: "M", stock: 12 },
    ],
  },
  {
    id: "prod-3",
    category_id: "cat-3",
    name: "Pleated Tencel Fluid Trousers",
    slug: "pleated-tencel-fluid-trousers",
    tagline: "Effortless Fluidity",
    description: "Flowing wide-leg cut made from sustainable lyocell with crisp front pleating.",
    price: 1450000,
    compare_at_price: 1800000,
    features: ["Double Pleat Front", "Deep Pockets", "High-Rise"],
    materials: "100% Tencel Lyocell",
    care_instructions: "Machine wash cold delicate",
    fit_type: "Wide Leg",
    gender: "women",
    rating: 4.7,
    reviews_count: 19,
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: false,
    is_new_release: true,
    product_variants: [
      { id: "v-4", product_id: "prod-3", sku: "PTT-SND-M", color_name: "Sand", color_hex: "#D8C7A5", size: "M", stock: 5 },
    ],
  },
  {
    id: "prod-4",
    category_id: "cat-4",
    name: "Architectural Calfskin Tote",
    slug: "architectural-calfskin-tote",
    tagline: "Minimalist Geometry",
    description: "Structured smooth calf leather tote bag with edge-dyed craftsmanship.",
    price: 4200000,
    compare_at_price: 4900000,
    features: ["Full Grain Italian Leather", "Suede Interior", "Hidden Magnetic Clasp"],
    materials: "100% Calf Leather",
    care_instructions: "Specialist leather clean",
    fit_type: "One Size",
    gender: "unisex",
    rating: 5.0,
    reviews_count: 36,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: true,
    product_variants: [
      { id: "v-5", product_id: "prod-4", sku: "ACT-COG-OS", color_name: "Cognac", color_hex: "#8B4513", size: "OS", stock: 3 },
    ],
  },
  {
    id: "prod-5",
    category_id: "cat-1",
    name: "Deconstructed Silk Blend Trench",
    slug: "deconstructed-silk-blend-trench",
    tagline: "Modern Drapery",
    description: "Lightweight silk-cotton blend trench with storm flap and removable waist belt.",
    price: 3650000,
    compare_at_price: 4200000,
    features: ["Storm Flap", "Belted Waist", "Water-Repellent Treatment"],
    materials: "65% Cotton, 35% Silk",
    care_instructions: "Dry clean only",
    fit_type: "Oversized",
    gender: "women",
    rating: 4.8,
    reviews_count: 14,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: true,
    product_variants: [
      { id: "v-6", product_id: "prod-5", sku: "SBT-KHK-M", color_name: "Khaki Stone", color_hex: "#BDB59D", size: "M", stock: 6 },
    ],
  },
  {
    id: "prod-6",
    category_id: "cat-2",
    name: "Merino Mock Neck Long Sleeve",
    slug: "merino-mock-neck-long-sleeve",
    tagline: "Refined Second Skin",
    description: "Superfine 19.5 micron merino wool crafted for year-round effortless layering.",
    price: 1250000,
    compare_at_price: 1500000,
    features: ["Non-Itch Merino", "Temperature Regulating", "Ribbed Neck"],
    materials: "100% Extra Fine Merino",
    care_instructions: "Hand wash cold",
    fit_type: "Slim Fit",
    gender: "men",
    rating: 4.9,
    reviews_count: 22,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: false,
    is_new_release: false,
    product_variants: [
      { id: "v-7", product_id: "prod-6", sku: "MMN-CHR-L", color_name: "Charcoal", color_hex: "#363636", size: "L", stock: 8 },
    ],
  },
  {
    id: "prod-7",
    category_id: "cat-3",
    name: "Tailored Straight Wool Slacks",
    slug: "tailored-straight-wool-slacks",
    tagline: "Sartorial Sharpness",
    description: "Pressed crease trousers cut from seasonless lightweight tropical wool.",
    price: 1850000,
    compare_at_price: 2100000,
    features: ["Sharp Crease", "Internal Hook Closure", "Split Waistband"],
    materials: "100% Tropical Wool",
    care_instructions: "Dry clean only",
    fit_type: "Straight Leg",
    gender: "men",
    rating: 4.6,
    reviews_count: 17,
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: false,
    is_new_release: true,
    product_variants: [
      { id: "v-8", product_id: "prod-7", sku: "TSW-NAV-32", color_name: "Navy", color_hex: "#162953", size: "32", stock: 5 },
    ],
  },
  {
    id: "prod-8",
    category_id: "cat-4",
    name: "Chelsea Boots in Waxed Suede",
    slug: "chelsea-boots-in-waxed-suede",
    tagline: "Artisanal Footwear",
    description: "Handcrafted Goodyear welted chelsea boots with elastic side gussets and Vibram soles.",
    price: 3200000,
    compare_at_price: 3800000,
    features: ["Goodyear Welted", "Vibram Rubber Half Sole", "Waxed Italian Suede"],
    materials: "100% Calf Suede",
    care_instructions: "Suede brush only",
    fit_type: "True to Size",
    gender: "men",
    rating: 4.9,
    reviews_count: 31,
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: false,
    product_variants: [
      { id: "v-9", product_id: "prod-8", sku: "CBW-EXP-42", color_name: "Espresso", color_hex: "#3B2F2F", size: "42", stock: 2 },
    ],
  },
  {
    id: "prod-9",
    category_id: "cat-1",
    name: "Cropped Collarless Bouclé Jacket",
    slug: "cropped-collarless-boucle-jacket",
    tagline: "Haute Couture Heritage",
    description: "Textured French bouclé weave framed by fringed edges and antique gold button accents.",
    price: 2950000,
    compare_at_price: 3500000,
    features: ["Custom Bouclé Weave", "Fringed Edges", "Silk Lining"],
    materials: "70% Cotton, 20% Wool, 10% Polyamide",
    care_instructions: "Dry clean only",
    fit_type: "Cropped Boxy",
    gender: "women",
    rating: 5.0,
    reviews_count: 18,
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: true,
    product_variants: [
      { id: "v-10", product_id: "prod-9", sku: "CBJ-IVR-S", color_name: "Ivory Gold", color_hex: "#FFFFF0", size: "S", stock: 3 },
    ],
  },
  {
    id: "prod-10",
    category_id: "cat-4",
    name: "Classic Silk Twill Square Scarf",
    slug: "classic-silk-twill-square-scarf",
    tagline: "Hand-Rolled 90x90cm Silk",
    description: "Lustrous heavy silk twill printed with subtle geometric monogram artwork.",
    price: 980000,
    compare_at_price: 1200000,
    features: ["18 Momme Mulberry Silk", "Hand-Rolled Hem", "Double-Sided Print"],
    materials: "100% Mulberry Silk",
    care_instructions: "Dry clean only",
    fit_type: "90cm x 90cm",
    gender: "unisex",
    rating: 4.8,
    reviews_count: 27,
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: false,
    is_new_release: true,
    product_variants: [
      { id: "v-11", product_id: "prod-10", sku: "STS-PLM-OS", color_name: "Plum Navy", color_hex: "#311744", size: "OS", stock: 9 },
    ],
  },
];

export default async function Home() {
  let products: ProductWithDetails[] = [];

  try {
    const response = await getProducts();
    if (response?.data && response.data.length > 0) {
      products = response.data;
    } else {
      products = SAMPLE_PRODUCTS;
    }
  } catch {
    products = SAMPLE_PRODUCTS;
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-10">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Seksi Katalog */}
        <header className="mb-8 sm:mb-12 text-center sm:text-left border-b border-[#ECE7E1] pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#8C827A] mb-1 font-semibold">
              Autumn / Winter Collection
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#000200] tracking-tight">
              Curated Essentials
            </h1>
          </div>
          <div className="text-xs text-[#5b4257] font-medium tracking-wide self-center sm:self-end">
            Menampilkan <span className="text-[#000200] font-semibold">{products.length}</span> produk eksklusif
          </div>
        </header>

        {/* Product Grid (Mobile: 2, Tablet: 3, Desktop: 5) */}
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
