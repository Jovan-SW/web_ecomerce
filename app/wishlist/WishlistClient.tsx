"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard, Button, ProductCardSkeleton } from "@/components";

export default function WishlistClient() {
  const { wishlistItems, wishlistCount, isLoading, user } = useWishlist();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] pb-24">
      {/* =========================================================================
          1. HEADER & BREADCRUMB
          ========================================================================= */}
      <section className="bg-white border-b border-[#E2E8F0] pt-8 pb-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#1474ed] transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>/</li>
              <li className="text-[#0F172A] font-medium" aria-current="page">
                Wishlist
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#1474ed] text-xs font-bold uppercase tracking-wider mb-2">
                <span>♥</span>
                <span>Koleksi Disimpan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0F172A] tracking-tight font-normal">
                Wishlist Koleksi Saya
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl font-normal">
                Koleksi busana dan aksesori eksklusif Jovique yang Anda simpan.
                Dapatkan akses cepat untuk meninjau dan menyelesaikan pesanan
                kapan saja.
              </p>
            </div>

            {user && (
              <div className="shrink-0">
                <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] text-xs sm:text-sm font-semibold text-[#0F172A]">
                  Total: {wishlistCount} Koleksi
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MAIN CONTENT AREA
          ========================================================================= */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10">
        {/* CASE 1: LOADING SKELETON */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={`wishlist-skel-${i}`} />
            ))}
          </div>
        )}

        {/* CASE 2: USER BELUM LOGIN (GUEST STATE) */}
        {!isLoading && !user && (
          <div className="py-16 sm:py-24 px-6 text-center bg-white rounded-3xl border border-[#E2E8F0] max-w-xl mx-auto shadow-xs space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#EFF6FF] text-[#1474ed] flex items-center justify-center mx-auto border border-[#BFDBFE] text-3xl">
              ♥
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif text-[#0F172A] tracking-tight">
                Masuk untuk Mengakses Wishlist Anda
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md mx-auto">
                Simpan koleksi busana favorit Anda, pantau ketersediaan ukuran
                eksklusif, dan sinkronkan daftar impian Anda di semua perangkat
                dengan akun Jovique.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/auth/login?redirect=/wishlist" className="w-full sm:w-auto">
                <Button variant="primary" size="md" fullWidth className="rounded-xl px-8">
                  Masuk ke Akun
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button variant="secondary" size="md" fullWidth className="rounded-xl px-6">
                  Daftar Member Baru
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* CASE 3: USER LOGIN TETAPI WISHLIST KOSONG (EMPTY STATE) */}
        {!isLoading && user && wishlistItems.length === 0 && (
          <div className="py-16 sm:py-24 px-6 text-center bg-white rounded-3xl border border-[#E2E8F0] max-w-xl mx-auto shadow-xs space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center mx-auto border border-[#E2E8F0] text-3xl">
              ♡
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif text-[#0F172A] tracking-tight">
                Wishlist Anda Masih Kosong
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md mx-auto">
                Belum ada koleksi yang Anda simpan. Klik ikon hati pada foto
                produk di katalog atau halaman detail untuk menambahkannya ke
                daftar ini.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/products">
                <Button variant="primary" size="md" className="rounded-xl px-8">
                  Jelajahi Koleksi Jovique
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* CASE 4: WISHLIST BERISI PRODUK (GRID LIST) */}
        {!isLoading && user && wishlistItems.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <span className="text-xs sm:text-sm font-medium text-[#64748B]">
                Menampilkan {wishlistItems.length} produk tersimpan
              </span>
              <Link
                href="/products"
                className="text-xs font-semibold text-[#1474ed] hover:underline"
              >
                + Tambah Koleksi Lain
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {wishlistItems.map((item) => {
                if (!item.product) return null;
                return (
                  <ProductCard
                    key={item.id}
                    product={item.product}
                    isWishlisted={true}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
