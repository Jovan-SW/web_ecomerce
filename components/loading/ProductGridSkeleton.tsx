"use client";

import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

export interface ProductGridSkeletonProps {
  count?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * ProductGridSkeleton: Full page & grid loading skeleton dengan estetika luxury fashion.
 * - Mobile (<768px): 2 kolom
 * - Tablet (768px - 1023px): 3 kolom
 * - Desktop (>=1024px): 5 kolom
 */
export default function ProductGridSkeleton({
  count = 10,
  showHeader = false,
  className = "",
}: ProductGridSkeletonProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* ========================================================
          OPTIONAL: SECTION HEADER SKELETON (Title & Filters)
         ======================================================== */}
      {showHeader && (
        <div className="mb-8 sm:mb-12 border-b border-[#ECE7E1] pb-6 animate-shimmer">
          {/* Breadcrumb / Top Category Tag */}
          <div className="h-3 w-32 bg-[#E2DBD1] mb-2.5" />

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Title Line */}
            <div className="h-8 sm:h-10 w-64 bg-[#D3CBC0]" />

            {/* Product Counter Placeholder */}
            <div className="h-3.5 w-36 bg-[#E8E3DA] self-start sm:self-end" />
          </div>

          {/* Filter / Category Tabs Bar Placeholder */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
            <div className="h-8 w-16 bg-[#DCD5CA]" />
            <div className="h-8 w-24 bg-[#EAE5DE]" />
            <div className="h-8 w-28 bg-[#EAE5DE]" />
            <div className="h-8 w-20 bg-[#EAE5DE]" />
            <div className="h-8 w-24 bg-[#EAE5DE]" />
          </div>
        </div>
      )}

      {/* ========================================================
          RESPONSIVE GRID (Mobile: 2, Tablet: 3, Desktop: 5)
         ======================================================== */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
        aria-label="Memuat daftar produk"
      >
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={`product-grid-skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}
