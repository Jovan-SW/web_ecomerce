import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { getProductBySlug, getRelatedProducts } from "@/services";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate dynamic SEO metadata berdasarkan data produk dari Supabase.
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | Jovique Marketplace",
      description: "Maaf, produk yang Anda cari tidak tersedia.",
    };
  }

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : 0;

  const priceFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(product.price);

  return {
    title: `${product.name} | Jovique Marketplace`,
    description:
      product.tagline ||
      `${product.name} — ${priceFormatted}${discount ? ` (Diskon ${discount}%)` : ""}. ${product.description?.slice(0, 120)}`,
    openGraph: {
      title: product.name,
      description: product.tagline || product.description?.slice(0, 160),
      images:
        product.images && product.images.length > 0
          ? [{ url: product.images[0], width: 800, height: 1067 }]
          : undefined,
    },
  };
}

export default async function ProductDetailPage(props: PageProps) {
  const { slug } = await props.params;

  // Fetch produk dari Supabase berdasarkan slug
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    notFound();
  }

  // Fetch produk terkait dari kategori yang sama (4 produk)
  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.id, product.category_id, 4).catch(
        () => []
      )
    : [];

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-warm-canvas flex items-center justify-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-[#e8e3ea] shadow-xs text-sm text-[#5b4257]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1474ed] animate-ping" />
            <span>Memuat detail produk...</span>
          </div>
        </div>
      }
    >
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </Suspense>
  );
}
