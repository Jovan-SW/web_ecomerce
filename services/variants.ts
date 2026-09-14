import { supabase } from "@/utils/supabase";
import type { ProductVariant } from "@/types/database";

/**
 * Mengambil semua varian (warna, ukuran, stok, SKU) dari suatu produk.
 */
export async function getProductVariants(productId: string): Promise<ProductVariant[]> {
  try {
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("size", { ascending: true });

    if (error) {
      console.error(`Error fetching variants for product "${productId}":`, error.message);
      throw new Error(`Gagal mengambil varian produk: ${error.message}`);
    }

    return (data as ProductVariant[]) || [];
  } catch (err) {
    console.error(`Unexpected error in getProductVariants("${productId}"):`, err);
    throw err;
  }
}

/**
 * Mengambil detail 1 varian produk berdasarkan variant ID.
 * Sangat berguna untuk validasi keranjang belanja (cart) atau checkout.
 */
export async function getVariantById(variantId: string): Promise<ProductVariant | null> {
  try {
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("id", variantId)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching variant "${variantId}":`, error.message);
      throw new Error(`Gagal mengambil varian: ${error.message}`);
    }

    return data as ProductVariant | null;
  } catch (err) {
    console.error(`Unexpected error in getVariantById("${variantId}"):`, err);
    throw err;
  }
}

/**
 * Memeriksa ketersediaan stok varian produk.
 * Mengembalikan true jika stok mencukupi quantity yang diminta.
 */
export async function checkVariantStock(
  variantId: string,
  requestedQuantity: number = 1
): Promise<{ available: boolean; currentStock: number }> {
  try {
    const variant = await getVariantById(variantId);
    if (!variant) {
      return { available: false, currentStock: 0 };
    }

    const available = variant.stock >= requestedQuantity;
    return { available, currentStock: variant.stock };
  } catch (err) {
    console.error(`Error checking stock for variant "${variantId}":`, err);
    throw err;
  }
}
