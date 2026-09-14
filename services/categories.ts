import { supabase } from "@/utils/supabase";
import type { Category } from "@/types/database";

/**
 * Mengambil semua kategori produk yang ada di database.
 * Diurutkan berdasarkan nama (A-Z) secara default.
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error.message);
      throw new Error(`Gagal mengambil kategori: ${error.message}`);
    }

    return (data as Category[]) || [];
  } catch (err) {
    console.error("Unexpected error in getAllCategories:", err);
    throw err;
  }
}

/**
 * Mengambil detail 1 kategori berdasarkan slug (contoh: "men", "outerwear", "footwear").
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching category with slug "${slug}":`, error.message);
      throw new Error(`Gagal mengambil kategori "${slug}": ${error.message}`);
    }

    return data as Category | null;
  } catch (err) {
    console.error(`Unexpected error in getCategoryBySlug("${slug}"):`, err);
    throw err;
  }
}

/**
 * Mengambil detail 1 kategori berdasarkan ID unik.
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching category with id "${id}":`, error.message);
      throw new Error(`Gagal mengambil kategori ID "${id}": ${error.message}`);
    }

    return data as Category | null;
  } catch (err) {
    console.error(`Unexpected error in getCategoryById("${id}"):`, err);
    throw err;
  }
}
