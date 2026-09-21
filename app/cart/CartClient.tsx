"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartClient() {
  const {
    cartItems,
    cartCount,
    subtotal,
    isLoading,
    user,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // ── 1. LOADING SKELETON ──
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-56 mb-3" />
        <div className="h-4 bg-slate-200 rounded-lg w-80 mb-8" />
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-3xl" />
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="h-72 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── 2. GUEST STATE (Belum Login) ──
  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="relative rounded-3xl bg-white border border-[#E2E8F0] shadow-sm p-8 sm:p-14 overflow-hidden">
          {/* Ambient Glow */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#1474ED]/15 via-[#00F5FF]/10 to-transparent blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-md mx-auto space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 text-[#1474ED] mx-auto flex items-center justify-center shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Masuk untuk Melihat Keranjang
              </h1>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Untuk menyimpan pilihan produk busana Jovique, mengelola kuantitas, dan melanjutkan ke proses pembayaran aman, silakan masuk ke akun Anda.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/login?redirect=/cart" className="w-full sm:w-auto">
                <Button variant="primary" size="md" fullWidth>
                  Masuk ke Akun
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button variant="secondary" size="md" fullWidth>
                  Daftar Akun Baru
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <Link
                href="/products"
                className="text-xs font-semibold text-[#1474ED] hover:underline"
              >
                ← Jelajahi Koleksi Jovique
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 3. EMPTY STATE (Keranjang Kosong) ──
  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="relative rounded-3xl bg-white border border-[#E2E8F0] shadow-sm p-8 sm:p-14 overflow-hidden">
          <div className="relative z-10 max-w-md mx-auto space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 text-[#64748B] mx-auto flex items-center justify-center border border-[#E2E8F0]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Keranjang Belanja Masih Kosong
              </h1>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Anda belum menambahkan item busana pilihan ke dalam keranjang. Temukan rancangan eksklusif Jovique yang sesuai dengan karakter Anda sekarang.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="primary" size="md">
                  Eksplor Koleksi Jovique
                </Button>
              </Link>
              <Link href="/wishlist" className="w-full sm:w-auto">
                <Button variant="secondary" size="md">
                  Lihat Wishlist Saya
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 4. ACTIVE CART STATE ──
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#64748B] mb-6">
        <Link href="/" className="hover:text-[#0F172A] transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-[#0F172A] font-semibold">Keranjang Belanja</span>
      </nav>

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Keranjang Belanja
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#1474ED]/10 text-[#1474ED] border border-[#1474ED]/20">
              {cartCount} Barang
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
            Periksa kembali ukuran, warna, dan kuantitas busana Jovique sebelum menyelesaikan pesanan.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-xs font-semibold text-[#1474ED] hover:underline"
          >
            ← Lanjut Belanja
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
          >
            Kosongkan Keranjang
          </button>
        </div>
      </div>

      {/* Layout 2 Kolom: Item List (Kiri) & Ringkasan Pesanan (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI: DAFTAR ITEM KERANJANG */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;
            const itemTotal = product.price * item.quantity;
            const imageUrl = product.images?.[0] || null;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white border border-[#E2E8F0] p-4 sm:p-6 shadow-xs hover:border-[#1474ED]/30 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
              >
                {/* Thumbnail Gambar Produk */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0 group"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      No Image
                    </div>
                  )}
                </Link>

                {/* Info Produk, Ukuran, dan Warna */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#64748B]">
                      {product.category?.name || "Koleksi Jovique"}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="block text-sm sm:text-base font-bold text-[#0F172A] hover:text-[#1474ED] transition-colors truncate"
                    >
                      {product.name}
                    </Link>
                  </div>

                  {/* Badges Pilihan Ukuran & Warna */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                      <span className="text-[#94A3B8] font-normal">Ukuran:</span> {item.size}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                      <span className="text-[#94A3B8] font-normal">Warna:</span> {item.color}
                    </span>
                  </div>

                  {/* Harga Satuan */}
                  <p className="text-xs text-[#64748B] pt-0.5">
                    Harga Satuan:{" "}
                    <span className="font-semibold text-[#0F172A]">
                      {formatRupiah(product.price)}
                    </span>
                  </p>
                </div>

                {/* Kontrol Kuantitas, Subtotal, & Tombol Hapus */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                  {/* Stepper Jumlah */}
                  <div className="flex items-center border border-[#CBD5E1] rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      title="Kurangi jumlah"
                      aria-label="Kurangi kuantitas"
                      className="w-8 h-8 flex items-center justify-center text-[#475569] hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-[#0F172A]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      title="Tambah jumlah"
                      aria-label="Tambah kuantitas"
                      className="w-8 h-8 flex items-center justify-center text-[#475569] hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal Item */}
                  <div className="text-right">
                    <p className="text-xs text-[#94A3B8]">Subtotal</p>
                    <p className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                      {formatRupiah(itemTotal)}
                    </p>
                  </div>

                  {/* Tombol Hapus */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 1 .75.748l.25 7a.75.75 0 1 1-1.498.054l-.25-7a.75.75 0 0 1 .748-.802Zm3.588.748a.75.75 0 1 0-1.498-.054l-.25 7a.75.75 0 1 0 1.498.054l.25-7Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* KOLOM KANAN: RINGKASAN PESANAN (STICKY CARD) */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
          <div className="border-b border-[#F1F5F9] pb-4">
            <h2 className="text-lg font-bold text-[#0F172A]">Ringkasan Pesanan</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Dihitung berdasarkan {cartCount} produk dalam keranjang
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#475569]">
            <div className="flex justify-between items-center">
              <span>Total Harga Produk</span>
              <span className="font-semibold text-[#0F172A]">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Ongkos Kirim</span>
              <span className="text-emerald-600 font-bold">GRATIS</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Asuransi Pengiriman</span>
              <span className="text-emerald-600 font-bold">Ditanggung Jovique</span>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">Total Pembayaran</span>
                <span className="text-[11px] text-[#94A3B8]">Sudah termasuk PPN 11%</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-[#1474ED]">
                {formatRupiah(subtotal)}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="rounded-2xl font-bold tracking-wide shadow-md"
              onClick={() => {
                alert("Terima kasih! Fitur checkout pesanan Jovique akan segera tersedia.");
              }}
            >
              Lanjut ke Pembayaran →
            </Button>
            <p className="text-[11px] text-center text-[#94A3B8] leading-relaxed">
              🔒 Transaksi 100% Aman, Terenkripsi, dan Dijamin Langsung oleh Jovique Official Store.
            </p>
          </div>

          {/* Jaminan & Layanan Eksklusif */}
          <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-[#475569]">
              <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-[10px]">
                ✓
              </span>
              <span>Garansi 100% Original Jovique Luxury Brand</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#475569]">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#1474ED] flex items-center justify-center shrink-0 font-bold text-[10px]">
                📦
              </span>
              <span>Kemasan Eksklusif Jovique Luxury Box</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#475569]">
              <span className="w-5 h-5 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 font-bold text-[10px]">
                ↺
              </span>
              <span>Garansi Tukar Ukuran 7 Hari Bebas Repot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
