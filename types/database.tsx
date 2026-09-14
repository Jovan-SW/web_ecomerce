// ==========================================
// 1. Tipe Dasar Sesuai Tabel Database (Supabase)
// ==========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;  
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  features: string[];
  materials: string;
  care_instructions: string;
  fit_type: string;
  gender: string;
  compare_at_price: number;
  rating: number;
  reviews_count: number;
  images: string[];
  is_featured: boolean;
  is_new_release: boolean;
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

// ==========================================
// 2. Tipe Relasi / Join (Untuk Query & Komponen UI)
// ==========================================

/**
 * Tipe lengkap produk saat di-query bersama kategori dan daftar variannya.
 * Ini tipe yang akan paling sering digunakan di ProductCard dan Halaman Detail Produk (PDP).
 */
export interface ProductWithDetails extends Product {
  category?: Category | null;
  product_variants: ProductVariant[];
}