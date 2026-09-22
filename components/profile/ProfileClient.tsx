"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getProducts } from "@/services/products";
import { getUserOrders } from "@/services/orders";
import { Button } from "@/components";
import type { User } from "@supabase/supabase-js";
import type { ProductWithDetails, OrderWithItems } from "@/types/database";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

type ProfileTab = "overview" | "cart" | "wishlist" | "orders";

export default function ProfileClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ProfileTab | null;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<ProfileTab>(
    tabParam && ["overview", "cart", "wishlist", "orders"].includes(tabParam)
      ? tabParam
      : "overview"
  );
  const activeTab =
    tabParam && ["overview", "cart", "wishlist", "orders"].includes(tabParam)
      ? tabParam
      : selectedTab;

  const setActiveTab = (tab: ProfileTab) => {
    setSelectedTab(tab);
    router.replace(`/profile?tab=${tab}`, { scroll: false });
  };

  const { wishlistItems, removeFromWishlist } = useWishlist();
  const {
    cartItems,
    cartCount,
    subtotal: cartSubtotal,
    updateQuantity: updateCartQuantity,
    removeFromCart: removeCartItem,
  } = useCart();

  // Data produk dari Supabase untuk mengisi Keranjang, Wishlist, dan Produk yang Dibeli
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [userOrders, setUserOrders] = useState<OrderWithItems[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // State kuantitas item di keranjang
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // 1. Ambil sesi user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);

      if (data?.user) {
        getUserOrders(data.user.id)
          .then((orders) => setUserOrders(orders))
          .catch((err) => console.error("Gagal memuat pesanan user:", err))
          .finally(() => setLoadingOrders(false));
      } else {
        setLoadingOrders(false);
      }
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

  // Data Item untuk Orders & Wishlist
  const wishlistProducts = wishlistItems.map((item) => item.product).filter(Boolean);

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
              {cartCount} Item
            </p>
          </div>

          <div
            onClick={() => setActiveTab("wishlist")}
            className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1474ED] transition-colors cursor-pointer group"
          >
            <p className="text-[11px] text-[#64748B] font-medium">Wishlist Saya</p>
            <p className="text-lg font-bold text-[#0F172A] group-hover:text-[#1474ED] transition-colors mt-0.5">
              {wishlistProducts.length} Koleksi
            </p>
          </div>

          <div
            onClick={() => setActiveTab("orders")}
            className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1474ED] transition-colors cursor-pointer group"
          >
            <p className="text-[11px] text-[#64748B] font-medium">Pesanan Selesai</p>
            <p className="text-lg font-bold text-[#0F172A] group-hover:text-[#1474ED] transition-colors mt-0.5">
              {userOrders.length} Pesanan
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
            {cartCount}
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
          <span>Riwayat Pesanan</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === "orders"
                ? "bg-[#1474ED] text-white"
                : "bg-[#E2E8F0] text-[#475569]"
            }`}
          >
            {userOrders.length}
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
              <h3 className="text-base font-bold">Butuh Bantuan Pesanan?</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Tim Jovique siap membantu informasi pesanan, pengiriman, hingga panduan perawatan produk Anda.
              </p>
              <Link href="/products" className="inline-block pt-2">
                <Button variant="secondary" size="sm">
                  Eksplorasi Koleksi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KERANJANG BELANJA */}
      {activeTab === "cart" && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Keranjang Belanja ({cartCount} Barang)
            </h2>
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="text-xs font-semibold text-[#1474ED] hover:underline"
              >
                Halaman Keranjang Lengkap →
              </Link>
              <Link
                href="/products"
                className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:underline"
              >
                Lanjut Belanja →
              </Link>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1474ED] mx-auto flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">
                Keranjang Belanja Anda Kosong
              </h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">
                Belum ada produk busana Jovique yang ditambahkan ke keranjang belanja Anda.
              </p>
              <Link href="/products">
                <Button variant="primary" size="md">
                  Eksplor Koleksi Jovique
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Daftar Produk di Keranjang */}
              <div className="lg:col-span-8 space-y-4">
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  const itemTotal = product.price * item.quantity;
                  return (
                    <div
                      key={item.id}
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
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1474ED]">
                          {product.category?.name || "Koleksi Jovique"}
                        </span>
                        <Link
                          href={`/products/${product.slug}`}
                          className="block text-sm sm:text-base font-bold text-[#0F172A] hover:text-[#1474ED] transition-colors truncate"
                        >
                          {product.name}
                        </Link>

                        {/* Size & Color Badges */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            Ukuran: {item.size}
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            Warna: {item.color}
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B]">
                          Harga Satuan: {formatRupiah(product.price)}
                        </p>
                        <p className="text-sm font-extrabold text-[#0F172A]">
                          Total: {formatRupiah(itemTotal)}
                        </p>
                      </div>

                      {/* Counter & Tombol Hapus */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#CBD5E1] rounded-xl overflow-hidden bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#475569] hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-[#0F172A]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#475569] hover:bg-slate-100 transition-colors font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Hapus Item */}
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.id)}
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
                    <span>Total Harga ({cartCount} barang)</span>
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

                <Link href="/cart" className="block w-full">
                  <Button variant="primary" size="md" fullWidth>
                    Buka Halaman Checkout
                  </Button>
                </Link>

                <p className="text-[11px] text-center text-[#94A3B8]">
                  🔒 Transaksi Aman & Terenkripsi Langsung oleh Jovique
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
              Koleksi Favorit Tersimpan ({wishlistProducts.length})
            </h2>
            <div className="flex items-center gap-3">
              <Link href="/wishlist" className="text-xs font-semibold text-[#1474ED] hover:underline">
                Halaman Wishlist Lengkap →
              </Link>
              <Link href="/products" className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:underline">
                Eksplor Koleksi →
              </Link>
            </div>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Belum Ada Koleksi di Wishlist</h3>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">
                Simpan item pakaian dan aksesoris Jovique yang Anda sukai dengan menekan ikon hati pada produk.
              </p>
              <Link href="/products">
                <Button variant="primary" size="md">
                  Eksplor Koleksi Jovique
                </Button>
              </Link>
            </div>
          ) : (
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
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        title="Hapus dari Wishlist"
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-rose-500 hover:bg-rose-50 transition-colors shadow-xs"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>

                    {/* Info Produk */}
                    <div className="p-4 space-y-1">
                      <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">
                        {product.category?.name || "Jovique Official"}
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
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRODUK YANG SUDAH DIBELI (RIWAYAT PESANAN) */}
      {activeTab === "orders" && (
        <div className="animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Riwayat Pesanan ({userOrders.length} Pesanan)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                  Mode Simulasi Sandbox
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Semua pesanan yang Anda beli disimpan secara resmi di database orders &amp; order_items.
              </p>
            </div>
            <Link href="/products" className="text-xs font-semibold text-[#1474ED] hover:underline">
              + Belanja Produk Lain
            </Link>
          </div>

          {/* Loading Skeleton */}
          {loadingOrders && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State jika belum ada pesanan */}
          {!loadingOrders && userOrders.length === 0 && (
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 mx-auto flex items-center justify-center font-bold text-2xl mb-4 border border-[#E2E8F0]">
                📦
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1">
                Belum Ada Riwayat Pesanan
              </h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
                Anda belum melakukan transaksi pembelian koleksi busana Jovique. Beli produk langsung atau checkout dari keranjang dengan simulasi pembayaran instan tanpa uang asli.
              </p>
              <Link href="/products">
                <Button variant="primary" size="md">
                  Mulai Belanja Sekarang
                </Button>
              </Link>
            </div>
          )}

          {/* List Pesanan Riil */}
          {!loadingOrders && userOrders.length > 0 && (
            <div className="space-y-5">
              {userOrders.map((order) => {
                const orderDate = new Date(
                  order.paid_at || order.created_at || "2026-09-22T00:00:00.000Z"
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const items = order.order_items || [];

                return (
                  <div
                    key={order.id}
                    className="rounded-3xl bg-white border border-[#E2E8F0] shadow-xs p-5 sm:p-6 space-y-5 hover:border-[#1474ED]/40 transition-colors"
                  >
                    {/* Header Order */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-extrabold text-[#0F172A] bg-slate-100 px-2.5 py-1 rounded-lg">
                          {order.id}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[#64748B]">{orderDate}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-medium text-[#475569]">
                          {order.payment_method || "Simulasi"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ✓ Lunas (Simulasi)
                        </span>
                      </div>
                    </div>

                    {/* Body Order: Daftar Seluruh Item yang Dibeli */}
                    <div className="divide-y divide-[#F1F5F9]">
                      {items.map((item, itmIdx) => (
                        <div
                          key={item.id || itmIdx}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0]">
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                                  Jovique
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <p className="font-bold text-sm text-[#0F172A]">
                                {item.product_name}
                              </p>
                              <p className="text-xs text-[#64748B]">
                                {item.quantity} Barang x {formatRupiah(item.price)}
                              </p>
                              <p className="text-[11px] text-emerald-600 font-medium">
                                Bebas Ongkir (Pengiriman Khusus Jovique)
                              </p>
                            </div>
                          </div>

                          <div className="text-right sm:text-right w-full sm:w-auto">
                            <p className="text-xs text-[#94A3B8]">Subtotal</p>
                            <p className="text-sm font-extrabold text-[#0F172A]">
                              {formatRupiah(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Order: Total Pembayaran & Aksi */}
                    <div className="pt-3 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#64748B]">Total Pembayaran:</span>
                        <span className="text-base font-extrabold text-[#1474ED]">
                          {formatRupiah(order.total_amount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {order.xendit_invoice_url && (
                          <a
                            href={order.xendit_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#1474ED] hover:underline font-semibold"
                          >
                            Invoice Xendit Sandbox ↗
                          </a>
                        )}
                        <Link href="/products">
                          <Button variant="secondary" size="sm">
                            Beli Lagi
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
