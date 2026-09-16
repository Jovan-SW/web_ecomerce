import { supabase } from "@/utils/supabase";
import type { Banner } from "@/types/database";

/**
 * Mengambil semua banner promosi / hero banner yang berstatus aktif (is_active = true).
 * Diurutkan berdasarkan urutan tampilan (sort_order) secara ascending (1, 2, 3...).
 *
 * @returns {Promise<Banner[]>} Daftar banner aktif
 */
export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching active banners:", error.message);
      throw new Error(`Gagal mengambil banner aktif: ${error.message}`);
    }

    return (data as Banner[]) || [];
  } catch (err) {
    console.error("Unexpected error in getActiveBanners:", err);
    throw err;
  }
}

/**
 * Mengambil semua data banner tanpa filter status aktif (berguna untuk panel admin / dashboard).
 * Diurutkan berdasarkan sort_order secara ascending.
 *
 * @returns {Promise<Banner[]>} Seluruh daftar banner
 */
export async function getAllBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching all banners:", error.message);
      throw new Error(`Gagal mengambil semua data banner: ${error.message}`);
    }

    return (data as Banner[]) || [];
  } catch (err) {
    console.error("Unexpected error in getAllBanners:", err);
    throw err;
  }
}

/**
 * Mengambil detail 1 banner berdasarkan ID unik.
 *
 * @param {string} id - ID unik banner
 * @returns {Promise<Banner | null>} Data banner atau null bila tidak ditemukan
 */
export async function getBannerById(id: string): Promise<Banner | null> {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching banner with id "${id}":`, error.message);
      throw new Error(`Gagal mengambil data banner ID "${id}": ${error.message}`);
    }

    return data as Banner | null;
  } catch (err) {
    console.error(`Unexpected error in getBannerById("${id}"):`, err);
    throw err;
  }
}
