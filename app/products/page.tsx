import React, { Suspense } from "react";
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getProducts, getAllCategories } from "@/services";
import type { ProductSortOption } from "@/services";

export const revalidate = 60; // ISR revalidate setiap 60 detik

export const metadata: Metadata = {
  title: "Koleksi Busana & Produk | Jovique Official Store",
  description:
    "Jelajahi seluruh koleksi busana dan aksesori eksklusif dari Jovique. Dibuat dengan material premium, desain modern yang elegan, dan jaminan keaslian 100% dari Jovique.",
};

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage(props: PageProps) {
  const searchParams = (await props.searchParams) || {};
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const category =
    typeof searchParams.category === "string" ? searchParams.category : "all";
  const sort =
    typeof searchParams.sort === "string"
      ? (searchParams.sort as ProductSortOption)
      : "newest";

  // Ambil seluruh produk (limit 100 untuk menjangkau seluruh 31+ koleksi) & seluruh kategori
  const [productsResponse, categories] = await Promise.all([
    getProducts({ limit: 100 }).catch(() => ({
      data: [],
      totalCount: 0,
      page: 1,
      limit: 100,
      totalPages: 0,
      hasMore: false,
    })),
    getAllCategories().catch(() => []),
  ]);

  const initialProducts = productsResponse?.data || [];

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-warm-canvas flex items-center justify-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-[#e8e3ea] shadow-xs text-sm text-[#5b4257]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1474ed] animate-ping" />
            <span>Memuat koleksi Jovique...</span>
          </div>
        </div>
      }
    >
      <ProductsClient
        initialProducts={initialProducts}
        categories={categories}
        initialQuery={query}
        initialCategory={category}
        initialSort={sort}
      />
    </Suspense>
  );
}
