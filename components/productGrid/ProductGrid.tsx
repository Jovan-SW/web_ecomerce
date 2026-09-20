"use client";

import React from "react";
import ProductCard from "../productCard/ProductCard";
import ProductCardSkeleton from "../loading/ProductCardSkeleton";
import ScrollReveal from "../common/ScrollReveal";
import type { Product, ProductWithDetails } from "@/types/database";

export { ProductCardSkeleton };

export interface ProductGridProps {
  products: (ProductWithDetails | Product)[];
  isLoading?: boolean;
  loadingCount?: number;
  emptyTitle?: string;
  emptyMessage?: string;
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void;
  className?: string;
  staggerReveal?: boolean;
}

/**
 * ProductGrid: Komponen tata letak katalog koleksi Jovique Official Store.
 * - Mobile (<768px): 2 kolom (grid-cols-2)
 * - Tablet (768px - 1023px): 3 kolom (md:grid-cols-3)
 * - Desktop (>=1024px): 5 kolom (lg:grid-cols-5)
 */
export default function ProductGrid({
  products,
  isLoading = false,
  loadingCount = 10,
  emptyTitle = "Koleksi Belum Tersedia",
  emptyMessage = "Saat ini belum ada koleksi yang ditemukan. Silakan periksa kembali nanti atau gunakan kolom pencarian.",
  onWishlistToggle,
  className = "",
  staggerReveal = false,
}: ProductGridProps) {
  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 ${className}`}
        aria-label="Memuat koleksi produk Jovique"
      >
        {Array.from({ length: loadingCount }).map((_, index) => (
          <ProductCardSkeleton key={`product-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-[#ECE7E1] bg-[#FAF9F6]">
        <div className="w-14 h-14 mb-4 flex items-center justify-center bg-[#F2EFE9] text-[#5b4257]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-[#000200] font-medium tracking-tight mb-1.5">
          {emptyTitle}
        </h3>
        <p className="text-sm text-[#5b4257] max-w-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // 3. Grid Layout: 2 Mobile, 3 Tablet, 5 Desktop
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 ${className}`}
    >
      {products.map((product, index) =>
        staggerReveal ? (
          <ScrollReveal
            key={product.id}
            delay={(index % 5) * 70}
            direction="up"
            className="h-full"
          >
            <ProductCard
              product={product}
              onWishlistToggle={onWishlistToggle}
            />
          </ScrollReveal>
        ) : (
          <ProductCard
            key={product.id}
            product={product}
            onWishlistToggle={onWishlistToggle}
          />
        )
      )}
    </div>
  );
}
