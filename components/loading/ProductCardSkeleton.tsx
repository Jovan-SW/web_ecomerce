"use client";

import React from "react";

export interface ProductCardSkeletonProps {
  className?: string;
}

/**
 * ProductCardSkeleton: Loading skeleton ultra-modern dan presisi untuk ProductCard fashion luxury.
 * Menggunakan rasio 3:4, shimmer wave berorientasi pencahayaan premium, serta placeholder detail.
 */
export default function ProductCardSkeleton({
  className = "",
}: ProductCardSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Memuat produk"
      className={`flex flex-col bg-[#F9F7F4] border border-[#ECE7E1] rounded-none overflow-hidden select-none ${className}`}
    >
      {/* ========================================================
          IMAGE SKELETON (Rasio 3:4 Presisi dengan Luxury Shimmer)
         ======================================================== */}
      <div className="relative aspect-[3/4] w-full bg-[#EFECE6] animate-shimmer overflow-hidden">
        {/* Top Left: Floating Badge Placeholder */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <div className="h-5 w-16 bg-[#E0D9CE]/80" />
        </div>

        {/* Top Right: Wishlist Icon Button Placeholder */}
        <div className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/70 border border-[#E8E3EA]" />

        {/* Bottom Left: Fit Type Pill Placeholder */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="h-5 w-20 bg-white/75 border border-[#ECE7E1]" />
        </div>
      </div>

      {/* ========================================================
          CARD CONTENT DETAILS SKELETON
         ======================================================== */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 bg-[#F9F7F4] justify-between gap-3 animate-shimmer">
        <div>
          {/* Baris 1: Rating Stars & Stock Badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              {/* Star Icon Skeleton */}
              <div className="w-3.5 h-3.5 bg-[#DFD9CE]" />
              {/* Rating score number */}
              <div className="h-3 w-6 bg-[#DFD9CE]" />
              {/* Review count */}
              <div className="h-3 w-7 bg-[#E8E3DA]" />
            </div>
            {/* Stock indicator badge */}
            <div className="h-3 w-12 bg-[#E2DBD1]" />
          </div>

          {/* Baris 2: Nama Produk (2 Baris Shimmer) */}
          <div className="space-y-1.5 mb-2">
            <div className="h-4 w-4/5 bg-[#DDD6CA]" />
            <div className="h-4 w-3/5 bg-[#DDD6CA]" />
          </div>

          {/* Baris 3: Tagline / Subtitle */}
          <div className="h-3 w-1/2 bg-[#E8E3DA]" />
        </div>

        {/* Baris 4: Harga & Arrow Icon (Border Top) */}
        <div className="pt-2.5 border-t border-[#ECE7E1] flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            {/* Main Price */}
            <div className="h-4.5 w-24 bg-[#D3CBC0]" />
            {/* Strikethrough Discount Price */}
            <div className="h-3 w-14 bg-[#E5DFD5]" />
          </div>
          {/* Arrow Link Skeleton */}
          <div className="w-3.5 h-3.5 bg-[#DFD9CE]" />
        </div>
      </div>
    </div>
  );
}
