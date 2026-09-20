import { createClient } from "@/utils/supabase/client";
import type { Wishlist, WishlistWithProduct } from "@/types/database";

const getClient = () => createClient();

/**
 * Mengambil seluruh item wishlist pengguna lengkap dengan data produk, kategori, dan varian.
 */
export async function getUserWishlist(userId: string): Promise<WishlistWithProduct[]> {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("wishlists")
      .select("*, product:products(*, category:categories(*), product_variants(*))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user wishlist:", error.message);
      throw new Error(`Gagal mengambil wishlist: ${error.message}`);
    }

    return (data as unknown as WishlistWithProduct[]) || [];
  } catch (err) {
    console.error("Unexpected error in getUserWishlist:", err);
    throw err;
  }
}

/**
 * Mengambil hanya array ID produk yang telah di-wishlist oleh pengguna.
 * Sangat cepat dan ringan untuk sinkronisasi ikon hati di seluruh halaman.
 */
export async function getUserWishlistIds(userId: string): Promise<string[]> {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching wishlist IDs:", error.message);
      return [];
    }

    return data ? data.map((item) => item.product_id) : [];
  } catch (err) {
    console.error("Unexpected error in getUserWishlistIds:", err);
    return [];
  }
}

/**
 * Menambahkan produk ke wishlist pengguna di database Supabase.
 */
export async function addToWishlist(
  userId: string,
  productId: string
): Promise<Wishlist | null> {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("wishlists")
      .insert({
        user_id: userId,
        product_id: productId,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error adding to wishlist:", error.message);
      throw new Error(`Gagal menambahkan ke wishlist: ${error.message}`);
    }

    return data as Wishlist | null;
  } catch (err) {
    console.error("Unexpected error in addToWishlist:", err);
    throw err;
  }
}

/**
 * Menghapus produk dari wishlist pengguna di database Supabase.
 */
export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<boolean> {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      console.error("Error removing from wishlist:", error.message);
      throw new Error(`Gagal menghapus dari wishlist: ${error.message}`);
    }

    return true;
  } catch (err) {
    console.error("Unexpected error in removeFromWishlist:", err);
    throw err;
  }
}

/**
 * Memeriksa apakah suatu produk ada di wishlist pengguna.
 */
export async function checkIsWishlisted(
  userId: string,
  productId: string
): Promise<boolean> {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    if (error) {
      return false;
    }

    return Boolean(data?.id);
  } catch {
    return false;
  }
}
