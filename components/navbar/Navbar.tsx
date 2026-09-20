"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar, Button } from "@/components";
import { createClient } from "@/utils/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export interface NavbarProps {
  wishlistCount?: number;
  cartCount?: number;
  className?: string;
  onSearchSubmit?: (query: string) => void;
}

// Kategori Koleksi di Jovique Official Store
const PRODUCT_CATEGORIES = [
  { name: "Semua Koleksi", href: "/products", badge: "Koleksi" },
  { name: "T-Shirts & Polos", href: "/products?category=t-shirts-polos", badge: "Populer" },
  { name: "Shirts & Flannels", href: "/products?category=shirts-flannels", badge: null },
  { name: "Jackets & Outerwear", href: "/products?category=jackets-outerwear", badge: "Trending" },
  { name: "Pants & Denim", href: "/products?category=pants-denim", badge: null },
  { name: "Footwear & Sandals", href: "/products?category=footwear-sandals", badge: "Baru" },
  { name: "Headwear & Accessories", href: "/products?category=accessories-headwear", badge: null },
];

/**
 * Navbar: Komponen navigasi utama platform Jovique Official Store.
 * - Terintegrasi dengan SearchBar busana/koleksi, Wishlist, Keranjang Belanja, dan Login/Register.
 * - Desain clean, glassmorphic blur, aksen Deep Plum & Electric Blue.
 * - Responsif untuk Desktop, Tablet, dan Mobile dengan Slide-in Drawer navigasi.
 */
export default function Navbar({
  wishlistCount = 3,
  cartCount = 2,
  className = "",
  onSearchSubmit,
}: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Supabase User Auth State
  const [user, setUser] = useState<User | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  // Monitor Supabase Auth State
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const handleSearchSubmit = (query: string) => {
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else if (query && query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}&category=all`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // Efek transisi border & shadow saat di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProductDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Kunci scroll body saat mobile drawer terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ========================================================
          1. TOP ANNOUNCEMENT BAR (Jovique Brand Info)
         ======================================================== */}
      <div className="bg-[#0B2545] text-white text-[11px] font-medium tracking-[0.16em] uppercase py-2 px-4 text-center border-b border-white/10 flex items-center justify-center gap-3 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1474ed] animate-pulse" />
        <span>✓ Bebas Ongkir Seluruh Indonesia • 100% Orisinal Jovique • Transaksi Aman</span>
        <span className="hidden sm:inline text-white/40">|</span>
        <span className="hidden sm:inline text-white/80">Official Online Store</span>
      </div>

      {/* ========================================================
          2. MAIN STICKY NAVBAR CONTAINER (Glassmorphic Clean Blue-White)
         ======================================================== */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(20,116,237,0.08)] border-b border-[#E2E8F0]"
            : "bg-white/90 backdrop-blur-sm border-b border-[#E2E8F0]"
        } ${className}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-18 sm:h-20 flex items-center justify-between gap-4 sm:gap-6">
          {/* ========================================================
              LEFT: MOBILE HAMBURGER & LOGO & NAV LINKS
             ======================================================== */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka navigasi menu"
              className="lg:hidden w-10 h-10 -ml-1.5 flex items-center justify-center text-[#0F172A] hover:text-[#1474ed] hover:bg-[#EFF6FF] transition-colors duration-200 focus:outline-none rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* BRAND LOGO: JOVIQUE OFFICIAL */}
            <Link
              href="/"
              className="group flex flex-col items-start select-none focus:outline-none"
            >
              <span className="font-bold text-2xl sm:text-3xl tracking-[0.22em] uppercase text-[#0B2545] group-hover:text-[#1474ed] transition-colors duration-300">
                JOVIQUE
              </span>
              <span className="text-[8px] uppercase tracking-[0.34em] text-[#1474ed] -mt-0.5 font-bold">
                Official Store
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-widest uppercase font-medium text-[#0F172A]">
              {/* Menu Dropdown: KOLEKSI PRODUK */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setProductDropdownOpen(true)}
                onMouseLeave={() => setProductDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setProductDropdownOpen((prev) => !prev)}
                  className="group relative flex items-center gap-2 py-2 text-[#0F172A] hover:text-[#1474ed] transition-colors duration-200 focus:outline-none cursor-pointer"
                  aria-expanded={productDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="font-semibold tracking-wider">Koleksi Produk</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      productDropdownOpen ? "rotate-180 text-[#1474ed]" : "text-[#64748B] group-hover:text-[#1474ed]"
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {/* Subtle Underline Hover Animation */}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1474ed] group-hover:w-full transition-all duration-300 ease-out" />
                </button>

                {/* Dropdown Menu Kategori Produk */}
                <div
                  className={`absolute top-full left-0 w-64 pt-2 transition-all duration-200 ease-out z-50 ${
                    productDropdownOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto visible"
                      : "opacity-0 -translate-y-2 pointer-events-none invisible"
                  }`}
                >
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_16px_36px_-8px_rgba(20,116,237,0.14)] p-2 space-y-0.5">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#64748B] border-b border-[#F1F5F9] mb-1 flex items-center justify-between">
                      <span>Kategori Koleksi</span>
                      <span className="text-[9px] text-[#1474ed] font-medium lowercase">Lengkap</span>
                    </div>
                    {PRODUCT_CATEGORIES.map((cat, idx) => (
                      <Link
                        key={`cat-nav-${idx}`}
                        href={cat.href}
                        onClick={() => setProductDropdownOpen(false)}
                        className="group/item flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#1474ed] transition-all duration-150"
                      >
                        <span className="font-medium tracking-wide">
                          {cat.name}
                        </span>
                        {cat.badge && (
                          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] group-hover/item:bg-[#1474ed] group-hover/item:text-white transition-colors duration-150 font-semibold">
                            {cat.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* ========================================================
              CENTER: INTEGRATED SEARCHBAR (Desktop Only)
             ======================================================== */}
          <div className="hidden lg:block flex-1 max-w-md xl:max-w-lg mx-4">
            <SearchBar
              size="sm"
              showTrending={false}
              placeholder="Cari kaos, kemeja, celana, sepatu, atau koleksi Jovique..."
              onSearch={handleSearchSubmit}
              className="w-full"
            />
          </div>

          {/* ========================================================
              RIGHT: MOBILE SEARCH BUTTON, AUTH, WISHLIST & CART
             ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile/Tablet Search Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Buka pencarian"
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#000200] hover:bg-[#F2EFE9] transition-colors duration-200 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Login / Register / User Profile (Desktop) */}
            <div className="hidden sm:flex items-center">
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <div className="flex items-center rounded-xl border border-[#E2E8F0] hover:border-[#1474ED] bg-white hover:bg-[#F8FAFC] transition-all p-1 shadow-2xs group">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 pl-1 pr-2 py-0.5"
                      title="Buka Halaman Profil"
                    >
                      {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                        <img
                          src={user.user_metadata.avatar_url || user.user_metadata.picture}
                          alt="Foto Profil"
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#1474ED]/30 group-hover:ring-[#1474ED]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1474ED] to-[#00F5FF] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {user.user_metadata?.full_name
                            ? user.user_metadata.full_name[0]
                            : user.email
                            ? user.email[0]
                            : "U"}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#0F172A] group-hover:text-[#1474ED] transition-colors max-w-[110px] truncate">
                          {user.user_metadata?.full_name?.split(" ")[0] ||
                            user.email?.split("@")[0] ||
                            "Profil Saya"}
                        </span>
                        <span className="text-[10px] text-[#64748B]">Lihat Profil</span>
                      </div>
                    </Link>

                    {/* Quick Dropdown Trigger Chevron */}
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      aria-label="Menu akun"
                      className="p-1.5 text-[#64748B] hover:text-[#1474ED] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          userDropdownOpen ? "rotate-180 text-[#1474ED]" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Dropdown Menu Pengguna */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl p-2 z-50 animate-fade-in">
                      <div className="px-3 py-2 border-b border-[#F1F5F9]">
                        <p className="text-xs font-bold text-[#0F172A] truncate">
                          {user.user_metadata?.full_name || "Member Jovique"}
                        </p>
                        <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#0F172A] hover:text-[#1474ED] hover:bg-[#F8FAFC] rounded-xl transition-colors font-medium"
                        >
                          <svg
                            className="w-4 h-4 text-[#1474ED]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span>Halaman Profil</span>
                        </Link>
                        <Link
                          href="/profile?tab=cart"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#0F172A] hover:text-[#1474ED] hover:bg-[#F8FAFC] rounded-xl transition-colors"
                        >
                          <svg
                            className="w-4 h-4 text-[#64748B]"
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
                          <span>Keranjang Belanja</span>
                        </Link>
                        <Link
                          href="/profile?tab=wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#0F172A] hover:text-[#1474ED] hover:bg-[#F8FAFC] rounded-xl transition-colors"
                        >
                          <svg
                            className="w-4 h-4 text-[#64748B]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>Wishlist Saya</span>
                        </Link>
                        <Link
                          href="/profile?tab=orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#0F172A] hover:text-[#1474ED] hover:bg-[#F8FAFC] rounded-xl transition-colors"
                        >
                          <svg
                            className="w-4 h-4 text-[#64748B]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <span>Produk yang Dibeli</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-[#F1F5F9]">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <svg
                            className="w-4 h-4 text-rose-600"
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
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.75"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    }
                    className="font-normal uppercase tracking-wider text-[11px]"
                  >
                    Masuk / Daftar
                  </Button>
                </Link>
              )}
            </div>

            {/* WISHLIST BUTTON (Gambar Hati) */}
            <Link
              href="/wishlist"
              aria-label={`Lihat wishlist (${wishlistCount} produk)`}
              className="group relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#0F172A] hover:text-[#1474ed] hover:bg-[#EFF6FF] border border-transparent hover:border-[#BFDBFE] rounded-lg transition-all duration-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:scale-115"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>

              {/* Badge Jumlah Wishlist */}
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#1474ed] text-white text-[10px] font-bold flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART BUTTON (Icon Keranjang Belanja) */}
            <Link
              href="/cart"
              aria-label={`Buka keranjang belanja (${cartCount} produk)`}
              className="group relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#0F172A] hover:text-[#1474ed] hover:bg-[#EFF6FF] border border-transparent hover:border-[#BFDBFE] rounded-lg transition-all duration-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:scale-115"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>

              {/* Badge Jumlah Cart */}
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#1474ed] text-white text-[10px] font-bold flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ========================================================
            DROPDOWN SEARCHBAR UNTUK TABLET & MOBILE
           ======================================================== */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-t border-[#E2E8F0] bg-white p-4 animate-in slide-in-from-top duration-300 shadow-sm">
            <SearchBar
              size="md"
              placeholder="Cari koleksi busana & aksesori Jovique..."
              onSearch={handleSearchSubmit}
              autoFocus
            />
          </div>
        )}
      </header>

      {/* ========================================================
          3. RESPONSIVE MOBILE & TABLET SLIDE-IN DRAWER
         ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#0B2545]/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Slide-out Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white border-r border-[#E2E8F0] shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col select-none focus:outline-none"
                >
                  <span className="font-bold text-2xl tracking-[0.2em] uppercase text-[#0B2545]">
                    JOVIQUE
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[#1474ed] -mt-0.5 font-bold">
                    Official Store
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Tutup menu"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#1474ed] transition-colors duration-150"
                >
                  ✕
                </button>
              </div>

              {/* Mobile SearchBar */}
              <div>
                <SearchBar
                  size="sm"
                  showTrending={false}
                  placeholder="Cari koleksi busana Jovique..."
                  onSearch={handleSearchSubmit}
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0B2545] font-bold">
                    Koleksi Jovique
                  </p>
                  <span className="text-[10px] text-[#1474ed] font-medium">Kategori Koleksi</span>
                </div>

                {/* Submenu Kategori Produk */}
                <div className="space-y-1">
                  {PRODUCT_CATEGORIES.map((cat, i) => (
                    <Link
                      key={`mob-cat-${i}`}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1474ed] transition-colors"
                    >
                      <span className="font-medium">{cat.name}</span>
                      {cat.badge && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] font-semibold">
                          {cat.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Bottom (Auth & Info) */}
            <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] space-y-3">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1474ED] transition-all group shadow-2xs"
                  >
                    {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                      <img
                        src={user.user_metadata.avatar_url || user.user_metadata.picture}
                        alt="Foto Profil"
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#1474ED]/30 group-hover:ring-[#1474ED]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#1474ED] text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs">
                        {user.user_metadata?.full_name
                          ? user.user_metadata.full_name[0]
                          : user.email
                          ? user.email[0]
                          : "U"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] group-hover:text-[#1474ED] transition-colors truncate">
                        {user.user_metadata?.full_name || "Member Jovique"}
                      </p>
                      <p className="text-[11px] text-[#1474ED] font-medium flex items-center gap-1 mt-0.5">
                        <span>Buka Halaman Profil</span>
                        <span>→</span>
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors cursor-pointer"
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
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" size="md" fullWidth>
                    Masuk / Daftar Akun
                  </Button>
                </Link>
              )}

              <div className="flex items-center justify-between pt-2 text-[11px] text-[#64748B]">
                <span>Bantuan & Layanan</span>
                <span>IDR (Rp)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
