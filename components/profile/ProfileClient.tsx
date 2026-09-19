"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getProducts } from "@/services/products";
import { Button } from "@/components";
import type { User } from "@supabase/supabase-js";
import type { ProductWithDetails } from "@/types/database";

type ProfileTab = "overview" | "cart" | "wishlist" | "orders";

export default function ProfileClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ProfileTab | null;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    tabParam && ["overview", "cart", "wishlist", "orders"].includes(tabParam)
      ? tabParam
      : "overview"
  );

  // Data produk dari Supabase untuk mengisi Keranjang, Wishlist, dan Produk yang Dibeli
  const [products, setProducts] = useState<ProductWithDetails[]>([]);

  // State kuantitas item di keranjang
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (tabParam && ["overview", "cart", "wishlist", "orders"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const supabase = createClient();

    // 1. Ambil sesi user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });

    // 2. Ambil produk dari Supabase untuk ditampilkan di tab
    getProducts({ limit: 8 })
      .then((res) => {
        if (res?.data) {
          setProducts(res.data);
          // Inisialisasi kuantitas default untuk produk keranjang
          const initialQty: Record<string, number> = {};
          res.data.slice(0, 3).forEach((p, idx) => {
            initialQty[p.id] = idx === 0 ? 2 : 1;
          });
          setCartQuantities(initialQty);
        }
      })
      .catch(() => {
        // Fallback jika fetch error
      });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const removeFromCart = (productId: string) => {
    setCartQuantities((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  // Format Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format Tanggal
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Baru Bergabung";
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center mb-4">
          <span className="w-4 h-4 rounded-full bg-[#1474ED] animate-ping" />
        </div>
        <p className="text-sm font-medium text-[#64748B]">Memuat profil akun kamu...</p>
      </div>
    );
  }

  // Jika user belum login
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#1474ED] flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">Akses Dibatasi</h1>
            <p className="text-sm text-[#64748B] mt-2">
              Kamu harus masuk terlebih dahulu untuk melihat informasi akun, keranjang, wishlist, dan riwayat belanja.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/auth/login?next=/profile">
              <Button variant="primary" size="md" fullWidth>
                Masuk ke Akun
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Member Jovique";
  const userInitial = fullName ? fullName[0].toUpperCase() : "U";

  // Data Item untuk Keranjang, Wishlist, dan Orders
  const cartProducts = products.slice(0, 3).filter((p) => cartQuantities[p.id] !== undefined);
  const wishlistProducts = products.slice(2, 6);
  const orderProducts = products.slice(0, 4);

  // Hitung subtotal keranjang
  const cartSubtotal = cartProducts.reduce((acc, p) => {
    const qty = cartQuantities[p.id] || 1;
    return acc + p.price * qty;
  }, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ========================================================
          1. TOP PROFILE HERO CARD (Identitas Akun & Foto Profil)
         ======================================================== */}
      <div className="relative rounded-3xl bg-white border border-[#E2E8F0] shadow-sm p-6 sm:p-8 overflow-hidden mb-8">
        {/* Background Ambient Glow */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#1474ED]/15 via-[#00F5FF]/10 to-transparent blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Identitas */}
          <div className="flex items-center gap-5">
            {/* Foto Profil Pengguna */}
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-[#1474ED]/20 shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#1474ED] to-[#00F5FF] text-white flex items-center justify-center font-extrabold text-3xl sm:text-4xl uppercase shadow-md ring-4 ring-[#1474ED]/20">
                  {userInitial}
                </div>
              )}
              {/* Online / Active Badge */}
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs"
                title="Akun Aktif"
              >
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Nama & Data User */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#1474ED] border border-[#BFDBFE]">
                  ★ Gold Member
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#64748B] flex items-center gap-2">
                <span>{user.email}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px]">Bergabung {formatDate(user.created_at)}</span>
              </p>

              {/* Supabase User ID (Unik) */}
              <div className="pt-1 flex items-center gap-2 text-[11px] text-[#94A3B8]">
                <span>ID Akun:</span>
                <code className="px-2 py-0.5 rounded-md bg-[#F1F5F9] font-mono text-[#475569] text-[10px]">
                  {user.id.slice(0, 18)}...
                </code>
                <button
                  type="button"
                  onClick={copyUserId}
                  className="hover:text-[#1474ED] transition-colors cursor-pointer"
                  title="Salin ID Lengkap"
                >
                  {copiedId ? "✓ Tersalin" : "Salin"}
                </button>
              </div>
            </div>
          </div>

          {/* Action Button: Logout */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#F1F5F9]">
          <div
            onClick={() => setActiveTab("cart")}
            className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1474ED] transition-colors cursor-pointer group"
          >
            <p className="text-[11px] text-[#64748B] font-medium">Keranjang Belanja</p>
            <p className="text-lg font-bold text-[#0F172A] group-hover:text-[#1474ED] transition-colors mt-0.5">
              {cartProducts.length} Produk
            </p>
          </div>

          <div
            onClick={() => setActiveTab("wishlist")}
            className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1474ED] transition-colors cursor-pointer group"
          >
            <p className="text-[11px] text-[#64748B] font-medium">Wishlist Saya</p>
            <p className="text-lg font-bold text-[#0F172A] group-hover:text-[#1474ED] transition-colors mt-0.5">
              {wishlistProducts.length} Disimpan
            </p>
          </div>

          <div
            onClick={() => setActiveTab("orders")}
            className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1474ED] transition-colors cursor-pointer group"
          >
            <p className="text-[11px] text-[#64748B] font-medium">Produk Dibeli</p>
            <p className="text-lg font-bold text-[#0F172A] group-hover:text-[#1474ED] transition-colors mt-0.5">
              {orderProducts.length} Transaksi
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <p className="text-[11px] text-[#64748B] font-medium">Voucher Aktif</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">2 Siap Pakai</p>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. TAB NAVIGATION (Ringkasan, Keranjang, Wishlist, Orders)
         ======================================================== */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] mb-8 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === "overview"
              ? "border-[#1474ED] text-[#1474ED]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          Ringkasan Profil
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cart")}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "cart"
              ? "border-[#1474ED] text-[#1474ED]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <span>Keranjang Belanja</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === "cart"
                ? "bg-[#1474ED] text-white"
                : "bg-[#E2E8F0] text-[#475569]"
            }`}
          >
            {cartProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("wishlist")}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "wishlist"
              ? "border-[#1474ED] text-[#1474ED]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <span>Wishlist</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === "wishlist"
                ? "bg-[#1474ED] text-white"
                : "bg-[#E2E8F0] text-[#475569]"
            }`}
          >
            {wishlistProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "orders"
              ? "border-[#1474ED] text-[#1474ED]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <span>Produk yang Sudah Dibeli</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === "orders"
                ? "bg-[#1474ED] text-white"
                : "bg-[#E2E8F0] text-[#475569]"
            }`}
          >
            {orderProducts.length}
          </span>
        </button>
      </div>

      {/* ========================================================
          3. TAB CONTENT
         ======================================================== */}

      {/* TAB 1: RINGKASAN PROFIL */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Kolom Kiri: Detail Akun */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-4">
                Informasi Akun Pengguna
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] text-[#64748B] font-medium">Nama Lengkap</p>
                  <p className="font-semibold text-[#0F172A] mt-1">{fullName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] text-[#64748B] font-medium">Alamat Email</p>
                  <p className="font-semibold text-[#0F172A] mt-1">{user.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] text-[#64748B] font-medium">Status Verifikasi</p>
                  <p className="font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                    <span>✓</span> Terverifikasi Supabase Auth
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-[11px] text-[#64748B] font-medium">ID Pengguna (UUID)</p>
                  <p className="font-semibold text-[#0F172A] font-mono text-xs mt-1 truncate" title={user.id}>
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Keamanan & Bantuan */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Keamanan Akun</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC]">
                  <div>
                    <p className="font-semibold text-[#0F172A]">Kata Sandi</p>
                    <p className="text-[#64748B] text-[11px]">Terakhir diperbarui hari ini</p>
                  </div>
                  <span className="text-[#1474ED] font-semibold">Aman</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC]">
                  <div>
                    <p className="font-semibold text-[#0F172A]">Google Auth</p>
                    <p className="text-[#64748B] text-[11px]">
                      {avatarUrl ? "Terhubung" : "Dukungan Aktif"}
                    </p>
                  </div>
                  <span className="text-emerald-600 font-semibold">Aktif</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-[#0B2545] to-[#1474ED] p-6 text-white space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold tracking-wider">
                Bantuan 24/7
              </span>
              <h3 className="text-base font-bold">Punya Kendala Belanja?</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Tim Support Jovique siap membantu status pesanan, pembayaran, hingga retur barang dengan respon cepat.
              </p>
              <Link href="/products" className="inline-block pt-2">
                <Button variant="secondary" size="sm">
                  Mulai Belanja Lagi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KERANJANG BELANJA */}
      {activeTab === "cart" && (
        <div className="animate-fade-in space-y-6">
          {cartProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFF6FF] text-[#1474ED] flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Keranjang Belanja Masih Kosong</h3>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto">
                Yuk jelajahi ribuan produk fashion & lifestyle menarik dan tambahkan ke keranjangmu!
              </p>
              <Link href="/products">
                <Button variant="primary" size="md">
                  Jelajahi Produk Sekarang
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Daftar Produk di Keranjang */}
              <div className="lg:col-span-8 space-y-4">
                {cartProducts.map((product) => {
                  const qty = cartQuantities[product.id] || 1;
                  const itemTotal = product.price * qty;
                  return (
                    <div
                      key={product.id}
                      className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:shadow-sm"
                    >
                      {/* Thumbnail Produk */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0]"
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            No Image
                          </div>
                        )}
                      </Link>

                      {/* Detail Produk */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1474ED]">
                          {product.category?.name || "Koleksi Resmi"}
                        </span>
                        <Link
                          href={`/products/${product.slug}`}
                          className="block text-sm sm:text-base font-bold text-[#0F172A] hover:text-[#1474ED] transition-colors truncate"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-[#64748B]">
                          Harga Satuan: {formatRupiah(product.price)}
                        </p>
                        <p className="text-sm font-extrabold text-[#0F172A] pt-1">
                          Total: {formatRupiah(itemTotal)}
                        </p>
                      </div>

                      {/* Counter & Tombol Hapus */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#CBD5E1] rounded-xl overflow-hidden bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-[#475569] hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-[#0F172A]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#475569] hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Hapus Item */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ringkasan Belanja & Checkout */}
              <div className="lg:col-span-4 rounded-3xl bg-white border border-[#E2E8F0] p-6 shadow-sm space-y-5 sticky top-24">
                <h3 className="text-base font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3">
                  Ringkasan Pesanan
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm text-[#475569]">
                  <div className="flex justify-between">
                    <span>Total Harga ({cartProducts.length} barang)</span>
                    <span className="font-semibold text-[#0F172A]">{formatRupiah(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span className="text-emerald-600 font-semibold">GRATIS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diskon Member</span>
                    <span className="text-[#1474ED] font-semibold">- Rp 20.000</span>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex justify-between text-base font-bold text-[#0F172A]">
                    <span>Total Pembayaran</span>
                    <span className="text-[#1474ED]">
                      {formatRupiah(Math.max(0, cartSubtotal - 20000))}
                    </span>
                  </div>
                </div>

                <Button variant="primary" size="md" fullWidth>
                  Lanjut ke Pembayaran
                </Button>

                <p className="text-[11px] text-center text-[#94A3B8]">
                  🔒 Transaksi Aman & Terverifikasi dengan Garansi Jovique
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WISHLIST PRODUK */}
      {activeTab === "wishlist" && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Produk Favorit Tersimpan ({wishlistProducts.length})
            </h2>
            <Link href="/products" className="text-xs font-semibold text-[#1474ED] hover:underline">
              Cari Produk Lain →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-3xl bg-white border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Foto Produk */}
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        No Image
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#1474ED] shadow-xs">
                      ★ {product.rating || 4.9}
                    </span>
                  </div>

                  {/* Info Produk */}
                  <div className="p-4 space-y-1">
                    <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">
                      {product.category?.name || "Official Brand"}
                    </p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold text-sm text-[#0F172A] hover:text-[#1474ED] transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm font-extrabold text-[#0F172A] pt-1">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="p-4 pt-0">
                  <Link href={`/products/${product.slug}`} className="block w-full">
                    <Button variant="secondary" size="sm" fullWidth>
                      Lihat Produk
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRODUK YANG SUDAH DIBELI (RIWAYAT PESANAN) */}
      {activeTab === "orders" && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Riwayat Pembelian Produk ({orderProducts.length} Transaksi)
            </h2>
            <span className="text-xs text-[#64748B]">Semua transaksi terverifikasi resmi</span>
          </div>

          <div className="space-y-4">
            {orderProducts.map((product, idx) => {
              const orderId = `INV/JVQ/2026/09${100 + idx}`;
              const orderDate = `1${idx + 2} September 2026`;
              const isCompleted = idx !== 0;

              return (
                <div
                  key={product.id}
                  className="rounded-3xl bg-white border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-4 hover:border-[#1474ED]/40 transition-colors"
                >
                  {/* Header Order */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#0F172A]">{orderId}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[#64748B]">{orderDate}</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isCompleted ? "✓ Selesai" : "⏳ Sedang Dikirim"}
                    </span>
                  </div>

                  {/* Body Order: Detail Produk yang Dibeli */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0]">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-bold text-sm sm:text-base text-[#0F172A] hover:text-[#1474ED] transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-[#64748B]">
                          1 Barang x {formatRupiah(product.price)}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-medium">
                          Bebas Ongkir Reguler (JNE Express)
                        </p>
                      </div>
                    </div>

                    {/* Total Pembayaran & Tombol Beli Lagi */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                      <div className="sm:text-right">
                        <p className="text-[10px] text-[#64748B] uppercase tracking-wider">
                          Total Belanja
                        </p>
                        <p className="text-base font-extrabold text-[#1474ED]">
                          {formatRupiah(product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/products/${product.slug}`}>
                          <Button variant="primary" size="sm">
                            Beli Lagi
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
