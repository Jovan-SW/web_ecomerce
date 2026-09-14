import ProductCard from "@/components/productCard/ProductCard";
import { getProducts } from "@/services/products";
import type { ProductWithDetails } from "@/types/database";

// Data mock cadangan agar UI tetap tampil rapi saat database Supabase kosong atau permission RLS belum aktif
const SAMPLE_PRODUCTS: ProductWithDetails[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Double-Breasted Wool Coat",
    slug: "double-breasted-wool-coat",
    tagline: "Timeless Parisian Tailoring",
    description: "Tailored from Italian wool blend with peaked lapels and structured shoulders.",
    price: 3850000,
    compare_at_price: 4500000,
    features: ["100% Italian Wool", "Horn Buttons", "Interior Pocket", "Fully Lined"],
    materials: "90% Virgin Wool, 10% Cashmere",
    care_instructions: "Dry clean only",
    fit_type: "Tailored Fit",
    gender: "women",
    rating: 4.9,
    reviews_count: 24,
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: true,
    product_variants: [
      {
        id: "var-1",
        product_id: "prod-1",
        sku: "DBW-BLK-S",
        color_name: "Noir Black",
        color_hex: "#1A1A1A",
        size: "S",
        stock: 3,
      },
      {
        id: "var-2",
        product_id: "prod-1",
        sku: "DBW-BLK-M",
        color_name: "Noir Black",
        color_hex: "#1A1A1A",
        size: "M",
        stock: 6,
      },
    ],
  },
  {
    id: "prod-2",
    category_id: "cat-2",
    name: "Cashmere Knit Crewneck",
    slug: "cashmere-knit-crewneck",
    tagline: "Uncompromised Everyday Luxury",
    description: "Pure Mongolian cashmere knitted in a subtle 12-gauge rib for exceptional warmth and softness.",
    price: 1950000,
    compare_at_price: 2400000,
    features: ["100% Grade-A Cashmere", "Seamless Construction", "Ribbed Trims"],
    materials: "100% Mongolian Cashmere",
    care_instructions: "Hand wash cold or dry clean",
    fit_type: "Relaxed Fit",
    gender: "unisex",
    rating: 4.8,
    reviews_count: 41,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: false,
    product_variants: [
      {
        id: "var-3",
        product_id: "prod-2",
        sku: "CKC-OAT-M",
        color_name: "Oatmeal Melange",
        color_hex: "#E3DAC9",
        size: "M",
        stock: 8,
      },
    ],
  },
  {
    id: "prod-3",
    category_id: "cat-3",
    name: "Pleated Tencel Wide Trousers",
    slug: "pleated-tencel-wide-trousers",
    tagline: "Effortless Fluid Silhouette",
    description: "Relaxed wide-leg trousers crafted from sustainably sourced fluid lyocell with sharp front pleats.",
    price: 1450000,
    compare_at_price: 1800000,
    features: ["Double Front Pleats", "Deep Side Pockets", "High-Rise Cut"],
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
      {
        id: "var-4",
        product_id: "prod-3",
        sku: "PWT-SND-S",
        color_name: "Desert Sand",
        color_hex: "#C2B280",
        size: "S",
        stock: 4,
      },
    ],
  },
  {
    id: "prod-4",
    category_id: "cat-4",
    name: "Structured Minimalist Leather Tote",
    slug: "structured-minimalist-leather-tote",
    tagline: "Architectural Leather Goods",
    description: "Smooth full-grain calf leather tote bag with hand-painted edges and magnetic top closure.",
    price: 4200000,
    compare_at_price: 5000000,
    features: ["Full-Grain Calf Leather", "Suede Lining", "13-inch Laptop Sleeve"],
    materials: "100% Italian Calf Leather",
    care_instructions: "Specialist leather clean",
    fit_type: "One Size",
    gender: "unisex",
    rating: 5.0,
    reviews_count: 32,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    ],
    is_featured: true,
    is_new_release: true,
    product_variants: [
      {
        id: "var-5",
        product_id: "prod-4",
        sku: "SMLT-COG-OS",
        color_name: "Cognac Brown",
        color_hex: "#9E4717",
        size: "OS",
        stock: 2,
      },
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
  } catch (error) {
    console.warn("Koneksi Supabase belum siap atau tabel kosong, menggunakan data mock preview.", error);
    products = SAMPLE_PRODUCTS;
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="mb-10 text-center sm:text-left border-b border-[#ECE7E1] pb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C827A] mb-2 font-medium">
            New Season Arrivals
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] tracking-tight">
            Curated Collection
          </h1>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
