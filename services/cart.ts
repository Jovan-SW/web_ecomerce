import { createClient } from "@/utils/supabase/client";
import type { Cart, CartWithProduct } from "@/types/database";

const getClient = () => createClient();

/**
 * Mengambil semua item keranjang pengguna beserta relasi data produk, kategori, dan variannya.
 */
export async function getUserCart(userId: string): Promise<CartWithProduct[]> {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("carts")
      .select("*, product:products(*, category:categories(*), product_variants(*))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user cart:", error.message);
      throw new Error(`Gagal mengambil keranjang: ${error.message}`);
    }

    return (data as unknown as CartWithProduct[]) || [];
  } catch (err) {
    console.error("Unexpected error in getUserCart:", err);
    throw err;
  }
}

/**
 * Menambahkan item ke keranjang belanja pengguna.
 * Jika item dengan kombinasi (user_id, product_id, size, color) sudah ada, kuantitas akan diakumulasikan.
 */
export async function addToCart(
  userId: string,
  productId: string,
  size: string,
  color: string,
  quantity: number = 1
): Promise<Cart | null> {
  try {
    const supabase = getClient();

    // 1. Cek apakah item dengan produk, ukuran, dan warna yang sama sudah ada di keranjang
    const { data: existingItem, error: checkError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .eq("size", size)
      .eq("color", color)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing cart item:", checkError.message);
    }

    if (existingItem) {
      // 2a. Update kuantitas akumulasi
      const newQuantity = (existingItem.quantity || 1) + quantity;
      const { data, error: updateError } = await supabase
        .from("carts")
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating cart quantity:", updateError.message);
        throw new Error(`Gagal memperbarui kuantitas: ${updateError.message}`);
      }

      return data as Cart;
    } else {
      // 2b. Tambahkan baris baru
      const { data, error: insertError } = await supabase
        .from("carts")
        .insert({
          user_id: userId,
          product_id: productId,
          size,
          color,
          quantity,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error adding to cart:", insertError.message);
        throw new Error(`Gagal menambahkan ke keranjang: ${insertError.message}`);
      }

      return data as Cart;
    }
  } catch (err) {
    console.error("Unexpected error in addToCart:", err);
    throw err;
  }
}

/**
 * Memperbarui kuantitas suatu item di keranjang belanja.
 * Jika kuantitas <= 0, item akan otomatis dihapus.
 */
export async function updateCartItemQuantity(
  cartId: string,
  quantity: number
): Promise<boolean> {
  try {
    const supabase = getClient();

    if (quantity <= 0) {
      return await removeFromCart(cartId);
    }

    const { error } = await supabase
      .from("carts")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartId);

    if (error) {
      console.error("Error updating cart item quantity:", error.message);
      throw new Error(`Gagal memperbarui kuantitas: ${error.message}`);
    }

    return true;
  } catch (err) {
    console.error("Unexpected error in updateCartItemQuantity:", err);
    throw err;
  }
}

/**
 * Menghapus satu item dari keranjang belanja berdasarkan ID keranjang.
 */
export async function removeFromCart(cartId: string): Promise<boolean> {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("id", cartId);

    if (error) {
      console.error("Error removing item from cart:", error.message);
      throw new Error(`Gagal menghapus item dari keranjang: ${error.message}`);
    }

    return true;
  } catch (err) {
    console.error("Unexpected error in removeFromCart:", err);
    throw err;
  }
}

/**
 * Mengosongkan seluruh isi keranjang belanja pengguna (misalnya setelah checkout).
 */
export async function clearCart(userId: string): Promise<boolean> {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error clearing user cart:", error.message);
      throw new Error(`Gagal mengosongkan keranjang: ${error.message}`);
    }

    return true;
  } catch (err) {
    console.error("Unexpected error in clearCart:", err);
    throw err;
  }
}
