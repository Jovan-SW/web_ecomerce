"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductWithDetails } from "@/types/database";

export interface ProductCardProps {
  product: ProductWithDetails | Product;
  isWishlisted?: boolean;
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void;
  className?: string;
}

/**
 * Helper format rupiah
 */
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ProductCard({
  product,
  isWishlisted: initialWishlisted = false,
  onWishlistToggle,
  className = "",
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isHovered, setIsHovered] = useState(false);

  // Ambil varian jika tersedia di relasi
  const variants =
    "product_variants" in product && Array.isArray(product.product_variants)
      ? product.product_variants
      : [];

  // Ambil daftar varian warna unik dari database
  const uniqueColors = Array.from(
    new Map(
      variants
        .filter((v) => v.color_hex && v.color_name)
        .map((v) => [v.color_hex.toLowerCase(), v])
    ).values()
  );

  // Ambil daftar ukuran unik dari database
  const availableSizes = Array.from(
    new Set(variants.filter((v) => v.size && (v.stock ?? 0) > 0).map((v) => v.size))
  );

  // Hitung total stok asli dari seluruh varian produk di database
  const totalStock =
    variants.length > 0
      ? variants.reduce((acc, curr) => acc + (curr.stock || 0), 0)
      : null;

  const isSoldOut = totalStock !== null && totalStock === 0;
  const isLowStock = totalStock !== null && totalStock > 0 && totalStock <= 5;

  // Foto produk utama dan foto kedua langsung dari array database images
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";

  const secondaryImage =
    product.images && product.images.length > 1 ? product.images[1] : null;

  // Hitung persentase diskon jika compare_at_price tersedia di database
  const hasDiscount =
    Boolean(product.compare_at_price) &&
    Number(product.compare_at_price) > Number(product.price);
  const discountPercentage = hasDiscount && product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) *
          100
      )
    : 0;

  // Kategori asli produk dari database
  const categoryName =
    "category" in product && product.category?.name
      ? product.category.name
      : null;

  // Deskripsi / Tagline asli
  const subtitle = product.tagline || product.description;

  // Handler klik tombol wishlist (Love)
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !wishlisted;
    setWishlisted(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(product.id, nextState);
    }
  };

  return (
    <div
      className={`group relative flex flex-col bg-[#F9F7F4] border border-[#ECE7E1] rounded-none overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-fashion-md hover:border-[#DCD5CB] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ========================================================
          IMAGE CONTAINER (Sharp Frame, Aspect 3:4 Luxury Fashion)
         ======================================================== */}
      <div className="relative aspect-[3/4] w-full bg-[#F2EFE9] overflow-hidden">
        {/* Link Wrapper untuk Gambar */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block w-full h-full"
        >
          {/* Foto Utama */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover object-center transition-transform duration-700 ease-out ${
              secondaryImage ? "" : "group-hover:scale-105"
            } ${secondaryImage && isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
          />

          {/* Foto Kedua (Otomatis cross-fade saat di-hover jika tersedia) */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover object-center transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-[#000200]/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-[#000200] text-white text-[11px] font-medium tracking-widest uppercase px-3.5 py-1.5 border border-white/20">
                Habis Terjual
              </span>
            </div>
          )}
        </Link>

        {/* ================= BADGES TOP LEFT ================= */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.is_new_release && (
            <span className="bg-[#311744] text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 shadow-sm">
              New Arrival
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#1474ed] text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 shadow-sm">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* ================= WISHLIST / LOVE BUTTON TOP RIGHT ================= */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={
            wishlisted ? "Hapus dari wishlist" : "Tambahkan ke wishlist"
          }
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-none flex items-center justify-center transition-all duration-300 shadow-sm ${
            wishlisted
              ? "bg-[#311744] text-white border border-[#311744]"
              : "bg-white/90 text-[#000200] border border-[#E8E3EA] hover:bg-white hover:text-[#311744] hover:border-[#311744]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 transition-transform duration-200 ${
              wishlisted ? "scale-110" : "group-hover/btn:scale-110"
            }`}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* ================= FIT TYPE FLOATING PILL ================= */}
        {product.fit_type && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="bg-white/90 backdrop-blur-xs text-[#5b4257] text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 border border-[#ECE7E1]">
              {product.fit_type}
            </span>
          </div>
        )}
      </div>

      {/* ========================================================
          CARD CONTENT & DETAILS (Text, Price, Rating, Stock)
         ======================================================== */}
      <div className="flex flex-col flex-1 p-4 bg-[#F9F7F4] justify-between">
        <div>
          {/* Row Atas: Rating & Stock Indicator */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-[#1474ed]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#000200]">
                {product.rating ? Number(product.rating).toFixed(1) : "5.0"}
              </span>
              {product.reviews_count > 0 && (
                <span className="text-[11px] text-[#5b4257]">
                  ({product.reviews_count})
                </span>
              )}
            </div>

            {/* Status Stok */}
            <div>
              {isSoldOut ? (
                <span className="text-[11px] font-medium text-red-600 uppercase tracking-wider">
                  Habis
                </span>
              ) : isLowStock ? (
                <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">
                  Sisa {totalStock} pcs
                </span>
              ) : totalStock !== null ? (
                <span className="text-[11px] text-[#5b4257] font-medium tracking-wide">
                  Stok: {totalStock}
                </span>
              ) : (
                <span className="text-[11px] text-emerald-700 font-medium tracking-wide">
                  Tersedia
                </span>
              )}
            </div>
          </div>

          {/* Kategori Asli dari Database */}
          {categoryName && (
            <p className="text-[10px] uppercase tracking-widest text-[#8C827A] font-semibold mb-0.5">
              {categoryName}
            </p>
          )}

          {/* Nama Produk Asli dari Database */}
          <h3 className="font-medium text-[15px] leading-snug text-[#000200] group-hover:text-[#311744] transition-colors duration-200 line-clamp-1 mb-1">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Tagline / Deskripsi Singkat Asli dari Database */}
          {subtitle && (
            <p className="text-xs text-[#5b4257] line-clamp-1 mb-1.5 font-normal" title={subtitle}>
              {subtitle}
            </p>
          )}

          {/* Varian Warna & Ukuran Asli dari Database */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <div className="flex items-center -space-x-1">
                {uniqueColors.slice(0, 5).map((col) => (
                  <span
                    key={col.id}
                    title={`${col.color_name} (Stok: ${col.stock})`}
                    className="inline-block w-3.5 h-3.5 rounded-full border border-white shadow-2xs transition-transform hover:scale-125"
                    style={{ backgroundColor: col.color_hex }}
                  />
                ))}
              </div>
              {availableSizes.length > 0 && (
                <span className="text-[10px] text-[#8C827A] font-medium tracking-tight">
                  {availableSizes.slice(0, 4).join(" · ")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Harga & Tombol Aksi Cepat */}
        <div className="pt-2 border-t border-[#ECE7E1] mt-2 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-bold text-[#000200] tracking-tight">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#5b4257] line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Subtle Accent Arrow Icon */}
          <Link
            href={`/products/${product.slug}`}
            aria-label={`Lihat detail ${product.name}`}
            className="text-[#5b4257] group-hover:text-[#1474ed] transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-200"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
