"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SearchBar, Button } from "@/components";

export interface NavbarProps {
  wishlistCount?: number;
  cartCount?: number;
  className?: string;
  onSearchSubmit?: (query: string) => void;
}

const PRODUCT_CATEGORIES = [
  { name: "Semua Produk", href: "/products", badge: "31 Items" },
  { name: "T-Shirts & Polos", href: "/categories/t-shirts-polos", badge: "Popular" },
  { name: "Shirts & Flannels", href: "/categories/shirts-flannels", badge: null },
  { name: "Jackets & Outerwear", href: "/categories/jackets-outerwear", badge: "Winter" },
  { name: "Pants & Trousers", href: "/categories/pants-trousers", badge: null },
  { name: "Luxury Accessories", href: "/categories/accessories", badge: "New" },
];

/**
 * Navbar: Komponen navigasi utama brand luxury Jovique.
 * - Desain clean, glassmorphic blur, border subtle, aksen Deep Plum & Electric Blue.
 * - Terintegrasi dengan SearchBar, Wishlist (Hati), Keranjang, dan Login/Register.
 * - Responsif untuk Desktop, Tablet, dan Mobile dengan Slide-in Drawer mewah.
 * - Animasi hover smooth dan mahal (underline slide-in, soft lift, icon micro-scale).
 */
export default function Navbar({
  wishlistCount = 3,
  cartCount = 2,
  className = "",
  onSearchSubmit,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
          1. TOP ANNOUNCEMENT BAR (Banner Info Mewah)
         ======================================================== */}
      <div className="bg-[#000200] text-white text-[11px] font-medium tracking-[0.2em] uppercase py-2 px-4 text-center border-b border-white/10 flex items-center justify-center gap-3 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1474ed] animate-pulse" />
        <span>Gratis Ongkir ke Seluruh Indonesia • Garansi 100% Produk Asli</span>
        <span className="hidden sm:inline text-white/40">|</span>
        <span className="hidden sm:inline text-white/70">Koleksi Baru Tersedia</span>
      </div>

      {/* ========================================================
          2. MAIN STICKY NAVBAR CONTAINER (Glassmorphic Luxury)
         ======================================================== */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(0,2,0,0.06)] border-b border-[#ECE7E1]"
            : "bg-white/90 backdrop-blur-sm border-b border-[#ECE7E1]"
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
              className="lg:hidden w-10 h-10 -ml-1.5 flex items-center justify-center text-[#000200] hover:text-[#311744] hover:bg-[#F2EFE9] transition-colors duration-200 focus:outline-none"
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

            {/* BRAND LOGO: JOVIQUE */}
            <Link
              href="/"
              className="group flex flex-col items-start select-none focus:outline-none"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.22em] uppercase text-[#000200] group-hover:text-[#311744] transition-colors duration-300">
                JOVIQUE
              </span>
              <span className="text-[8px] uppercase tracking-[0.38em] text-[#8C827A] -mt-0.5 group-hover:text-[#1474ed] transition-colors duration-300 font-medium">
                Atelier
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-widest uppercase font-medium text-[#000200]">
              {/* Menu Dropdown: PRODUK */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setProductDropdownOpen(true)}
                onMouseLeave={() => setProductDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                  className="group relative flex items-center gap-1.5 py-2 text-[#000200] hover:text-[#311744] transition-colors duration-200 focus:outline-none"
                >
                  <span>Produk</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      productDropdownOpen ? "rotate-180 text-[#311744]" : "text-[#8C827A]"
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {/* Subtle Underline Hover Animation */}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#311744] group-hover:w-full transition-all duration-300 ease-out" />
                </button>

                {/* Dropdown Menu Produk (Kategori) */}
                <div
                  className={`absolute top-full left-0 w-64 pt-2 transition-all duration-300 ease-out ${
                    productDropdownOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto visible"
                      : "opacity-0 -translate-y-2 pointer-events-none invisible"
                  }`}
                >
                  <div className="bg-white border border-[#ECE7E1] shadow-[0_12px_32px_-6px_rgba(0,2,0,0.12)] p-2.5 space-y-1">
                    {PRODUCT_CATEGORIES.map((cat, idx) => (
                      <Link
                        key={`cat-nav-${idx}`}
                        href={cat.href}
                        onClick={() => setProductDropdownOpen(false)}
                        className="group/item flex items-center justify-between px-3 py-2.5 text-xs text-[#000200] hover:bg-[#F9F7F4] hover:text-[#311744] transition-all duration-200"
                      >
                        <span className="font-medium tracking-wide">
                          {cat.name}
                        </span>
                        {cat.badge && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#F2EFE9] text-[#5b4257] group-hover/item:bg-[#311744] group-hover/item:text-white transition-colors duration-200 font-semibold">
                            {cat.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Menu: KOLEKSI BARU */}
              <Link
                href="/new-arrivals"
                className="group relative py-2 text-[#000200] hover:text-[#311744] transition-colors duration-200"
              >
                <span>Koleksi Baru</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#311744] group-hover:w-full transition-all duration-300 ease-out" />
              </Link>

              {/* Menu: TREN */}
              <Link
                href="/trends"
                className="group relative py-2 text-[#000200] hover:text-[#311744] transition-colors duration-200"
              >
                <span>Tren</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#311744] group-hover:w-full transition-all duration-300 ease-out" />
              </Link>

              {/* Menu: MERK / ATELIER */}
              <Link
                href="/brands"
                className="group relative py-2 text-[#000200] hover:text-[#311744] transition-colors duration-200"
              >
                <span>Merk</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#311744] group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            </nav>
          </div>

          {/* ========================================================
              CENTER: INTEGRATED SEARCHBAR (Desktop Only)
             ======================================================== */}
          <div className="hidden lg:block flex-1 max-w-md xl:max-w-lg mx-4">
            <SearchBar
              size="sm"
              showTrending={false}
              placeholder="Cari busana, tren, merk..."
              onSearch={onSearchSubmit}
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

            {/* Login / Register Button (Desktop) */}
            <div className="hidden sm:flex items-center">
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
            </div>

            {/* WISHLIST BUTTON (Gambar Hati) */}
            <Link
              href="/wishlist"
              aria-label={`Lihat wishlist (${wishlistCount} produk)`}
              className="group relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#000200] hover:text-[#311744] hover:bg-[#F9F7F4] border border-transparent hover:border-[#ECE7E1] transition-all duration-300 focus:outline-none"
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
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#311744] text-white text-[10px] font-bold flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART BUTTON (Icon Keranjang Belanja) */}
            <Link
              href="/cart"
              aria-label={`Buka keranjang belanja (${cartCount} produk)`}
              className="group relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-[#000200] hover:text-[#1474ed] hover:bg-[#F9F7F4] border border-transparent hover:border-[#ECE7E1] transition-all duration-300 focus:outline-none"
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
          <div className="lg:hidden border-t border-[#ECE7E1] bg-white p-4 animate-in slide-in-from-top duration-300 shadow-sm">
            <SearchBar
              size="md"
              placeholder="Cari busana, tren, merk..."
              onSearch={(q) => {
                setMobileSearchOpen(false);
                if (onSearchSubmit) onSearchSubmit(q);
              }}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Slide-out Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white border-r border-[#ECE7E1] shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#ECE7E1]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl font-bold tracking-[0.2em] uppercase text-[#000200]"
                >
                  JOVIQUE
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Tutup menu"
                  className="w-9 h-9 flex items-center justify-center text-[#000200] hover:bg-[#F2EFE9] transition-colors duration-150"
                >
                  ✕
                </button>
              </div>

              {/* Mobile SearchBar */}
              <div>
                <SearchBar
                  size="sm"
                  showTrending={false}
                  placeholder="Cari produk..."
                  onSearch={(q) => {
                    setMobileMenuOpen(false);
                    if (onSearchSubmit) onSearchSubmit(q);
                  }}
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-4 pt-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C827A] font-semibold">
                  Navigasi Katalog
                </p>

                {/* Submenu Kategori Produk */}
                <div className="space-y-1 pl-1">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#000200] mb-2">
                    Kategori Pilihan:
                  </span>
                  {PRODUCT_CATEGORIES.map((cat, i) => (
                    <Link
                      key={`mob-cat-${i}`}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 text-sm text-[#5b4257] hover:text-[#000200] transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#F2EFE9] text-[#000200] font-semibold">
                          {cat.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-[#ECE7E1] pt-4 space-y-3">
                  <Link
                    href="/new-arrivals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold tracking-wide uppercase text-[#000200] hover:text-[#311744]"
                  >
                    Koleksi Baru
                  </Link>
                  <Link
                    href="/trends"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold tracking-wide uppercase text-[#000200] hover:text-[#311744]"
                  >
                    Tren Musim Ini
                  </Link>
                  <Link
                    href="/brands"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold tracking-wide uppercase text-[#000200] hover:text-[#311744]"
                  >
                    Atelier & Merk
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Bottom (Auth & Info) */}
            <div className="p-6 bg-[#FAF9F6] border-t border-[#ECE7E1] space-y-3">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button variant="primary" size="md" fullWidth>
                  Masuk / Daftar Akun
                </Button>
              </Link>

              <div className="flex items-center justify-between pt-2 text-[11px] text-[#8C827A]">
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
