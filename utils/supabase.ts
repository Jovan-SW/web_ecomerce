import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi untuk mencegah runtime error jika env belum terpasang
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// Inisialisasi Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==============================================================================
// DEFINISI TIPE DATA (TYPESCRIPT INTERFACES)
// ==============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  color_name: string;
  color_hex: string;
  size: string;
  stock: number;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  features: string[];
  materials: string;
  care_instructions: string | null;
  fit_type: string;
  gender: "men" | "women" | "unisex";
  price: number;
  compare_at_price: number | null;
  is_featured: boolean;
  is_new_release: boolean;
  rating: number;
  reviews_count: number;
  images: string[];
  created_at?: string;
  // Relasi opsional saat melakukan query join
  categories?: Category | null;
  product_variants?: ProductVariant[];
}