import { supabase } from "@/utils/supabase";
import type { ProductWithDetails } from "@/types/database";
import { getSearchSqlTerms } from "@/utils/search";

export type ProductSortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "name-asc";

export interface GetProductsParams {
  categorySlug?: string;
  categoryId?: string;
  gender?: string;
  isFeatured?: boolean;
  isNewRelease?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortOption;
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponse {
  data: ProductWithDetails[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Mengambil daftar produk lengkap dengan join kategori dan varian (warna, ukuran, stok).
 * Mendukung filter lengkap, pencarian, pengurutan, serta pagination.
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<PaginatedProductsResponse> {
  try {
    const {
      categorySlug,
      categoryId,
      gender,
      isFeatured,
      isNewRelease,
      search,
      minPrice,
      maxPrice,
      sortBy = "newest",
      page = 1,
      limit = 12,
    } = params;

    // Jika filter categorySlug digunakan, dapatkan category_id terlebih dahulu
    let resolvedCategoryId = categoryId;
    if (categorySlug && !resolvedCategoryId) {
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (catError) {
        console.error(`Error resolving category slug "${categorySlug}":`, catError.message);
      }

      if (catData?.id) {
        resolvedCategoryId = catData.id;
      } else {
        // Kategori tidak ditemukan, kembalikan data kosong
        return {
          data: [],
          totalCount: 0,
          page,
          limit,
          totalPages: 0,
          hasMore: false,
        };
      }
    }

    // Bangun query Supabase
    let query = supabase
      .from("products")
      .select("*, category:categories(*), product_variants(*)", {
        count: "exact",
      });

    // 1. Filter Kategori
    if (resolvedCategoryId) {
      query = query.eq("category_id", resolvedCategoryId);
    }

    // 2. Filter Gender (men, women, unisex)
    if (gender) {
      query = query.eq("gender", gender);
    }

    // 3. Filter Status Unggulan / Rilis Baru
    if (typeof isFeatured === "boolean") {
      query = query.eq("is_featured", isFeatured);
    }
    if (typeof isNewRelease === "boolean") {
      query = query.eq("is_new_release", isNewRelease);
    }

    // 4. Filter Range Harga
    if (typeof minPrice === "number" && !isNaN(minPrice)) {
      query = query.gte("price", minPrice);
    }
    if (typeof maxPrice === "number" && !isNaN(maxPrice)) {
      query = query.lte("price", maxPrice);
    }

    // 5. Pencarian Teks (Search) dengan ekspansi istilah & sinonim
    if (search && search.trim() !== "") {
      const searchTerms = getSearchSqlTerms(search);
      const orClauses = searchTerms.flatMap((term) => [
        `name.ilike.%${term}%`,
        `tagline.ilike.%${term}%`,
        `description.ilike.%${term}%`,
      ]);
      if (orClauses.length > 0) {
        query = query.or(orClauses.join(","));
      }
    }

    // 6. Sorting
    switch (sortBy) {
      case "price-asc":
        query = query.order("price", { ascending: true });
        break;
      case "price-desc":
        query = query.order("price", { ascending: false });
        break;
      case "rating":
        query = query.order("rating", { ascending: false });
        break;
      case "name-asc":
        query = query.order("name", { ascending: true });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // 7. Pagination (Range-based pada Supabase)
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("Error fetching products:", error.message);
      throw new Error(`Gagal mengambil data produk: ${error.message}`);
    }

    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / safeLimit);
    const hasMore = safePage < totalPages;

    return {
      data: (data as ProductWithDetails[]) || [],
      totalCount,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasMore,
    };
  } catch (err) {
    console.error("Unexpected error in getProducts:", err);
    throw err;
  }
}

/**
 * Mengambil detail 1 produk lengkap (kategori + varian) berdasarkan slug.
 * Digunakan untuk Halaman Detail Produk (PDP / Product Detail Page).
 */
export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), product_variants(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching product with slug "${slug}":`, error.message);
      throw new Error(`Gagal mengambil produk "${slug}": ${error.message}`);
    }

    return data as ProductWithDetails | null;
  } catch (err) {
    console.error(`Unexpected error in getProductBySlug("${slug}"):`, err);
    throw err;
  }
}

/**
 * Mengambil detail 1 produk lengkap berdasarkan ID unik.
 */
export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), product_variants(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching product with id "${id}":`, error.message);
      throw new Error(`Gagal mengambil produk ID "${id}": ${error.message}`);
    }

    return data as ProductWithDetails | null;
  } catch (err) {
    console.error(`Unexpected error in getProductById("${id}"):`, err);
    throw err;
  }
}

/**
 * Helper khusus untuk mengambil produk unggulan (Featured Products).
 * Cocok untuk section Highlight / Featured di Homepage.
 */
export async function getFeaturedProducts(limit: number = 8): Promise<ProductWithDetails[]> {
  try {
    const response = await getProducts({
      isFeatured: true,
      limit,
      sortBy: "newest",
    });
    return response.data;
  } catch (err) {
    console.error("Error in getFeaturedProducts:", err);
    throw err;
  }
}

/**
 * Helper khusus untuk mengambil koleksi produk rilisan terbaru (New Arrivals).
 */
export async function getNewReleaseProducts(limit: number = 8): Promise<ProductWithDetails[]> {
  try {
    const response = await getProducts({
      isNewRelease: true,
      limit,
      sortBy: "newest",
    });
    return response.data;
  } catch (err) {
    console.error("Error in getNewReleaseProducts:", err);
    throw err;
  }
}

/**
 * Mengambil rekomendasi produk terkait (misal: produk lain dalam kategori yang sama).
 * Mengabaikan produk yang sedang dilihat (`currentProductId`).
 */
export async function getRelatedProducts(
  currentProductId: string,
  categoryId: string,
  limit: number = 4
): Promise<ProductWithDetails[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), product_variants(*)")
      .eq("category_id", categoryId)
      .neq("id", currentProductId)
      .limit(limit);

    if (error) {
      console.error("Error fetching related products:", error.message);
      throw new Error(`Gagal mengambil produk terkait: ${error.message}`);
    }

    return (data as ProductWithDetails[]) || [];
  } catch (err) {
    console.error("Unexpected error in getRelatedProducts:", err);
    throw err;
  }
}

/**
 * Pencarian cepat produk (untuk Search Bar / Modal Auto-complete).
 */
export async function searchProducts(
  queryText: string,
  limit: number = 10
): Promise<ProductWithDetails[]> {
  if (!queryText || queryText.trim() === "") {
    return [];
  }

  try {
    const response = await getProducts({
      search: queryText,
      limit,
    });
    return response.data;
  } catch (err) {
    console.error(`Error searching products with query "${queryText}":`, err);
    throw err;
  }
}
