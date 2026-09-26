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
      title: "Koleksi Tidak Ditemukan | Jovique Official Store",
      description: "Maaf, koleksi yang Anda cari tidak tersedia.",
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jovique.com";

  return {
    title: `${product.name} | Jovique Official Store`,
    description:
      product.tagline ||
      `${product.name} — ${priceFormatted}${discount ? ` (Diskon ${discount}%)` : ""}. Dapatkan koleksi busana eksklusif Jovique dengan material premium dan garansi orisinalitas 100%.`,
    keywords: [
      product.name,
      `beli ${product.name}`,
      product.category?.name || "fashion",
      "Jovique Official",
      "busana premium",
      "pakaian branded original",
    ],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Jovique Official Store`,
      description:
        product.tagline || product.description?.slice(0, 160) || product.name,
      url: `${siteUrl}/products/${product.slug}`,
      siteName: "Jovique Official Store",
      locale: "id_ID",
      type: "website",
      images:
        product.images && product.images.length > 0
          ? [{ url: product.images[0], width: 800, height: 1067, alt: product.name }]
          : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Jovique Official Store`,
      description: product.tagline || product.description?.slice(0, 140) || product.name,
      images: product.images && product.images.length > 0 ? [product.images[0]] : undefined,
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jovique.com";

  // Google Schema.org Product Rich Snippet
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [],
    description: product.description,
    sku: product.product_variants?.[0]?.sku || product.slug,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: "Jovique Official",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "IDR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 5.0,
      reviewCount: product.reviews_count || 10,
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen bg-warm-canvas flex items-center justify-center py-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-[#e8e3ea] shadow-xs text-sm text-[#5b4257]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1474ed] animate-ping" />
              <span>Memuat detail koleksi...</span>
            </div>
          </div>
        }
      >
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </Suspense>
    </>
  );
}
