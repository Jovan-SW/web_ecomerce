"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface FooterProps {
  className?: string;
  brandName?: string;
  tagline?: string;
}

interface NavSection {
  title: string;
  links: { label: string; href: string; badge?: string; isExternal?: boolean }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Kategori Populer",
    links: [
      { label: "Semua Koleksi", href: "/products", badge: "Koleksi" },
      { label: "Pakaian Pria & Wanita", href: "/categories/t-shirts-polos", badge: "Hot" },
      { label: "Kemeja & Kasual", href: "/categories/shirts-flannels" },
      { label: "Jaket & Outerwear", href: "/categories/jackets-outerwear" },
      { label: "Celana & Trousers", href: "/categories/pants-trousers" },
      { label: "Sepatu & Aksesoris", href: "/categories/accessories", badge: "Baru" },
      { label: "Promo & Rilis Spesial", href: "/products", badge: "Diskon" },
      { label: "Koleksi Terbaru", href: "/products" },
    ],
  },
  {
    title: "Layanan Pelanggan",
    links: [
      { label: "Pusat Bantuan (FAQ)", href: "/faq" },
      { label: "Lacak Status Pesanan", href: "/track-order" },
      { label: "Cara Berbelanja Online", href: "/how-to-buy" },
      { label: "Kebijakan Retur & Garansi", href: "/returns" },
      { label: "Syarat Bebas Ongkir", href: "/free-shipping" },
      { label: "Panduan Pembayaran & Pengiriman", href: "/payment-guide" },
      { label: "Hubungi Customer Care 24/7", href: "/contact" },
    ],
  },
  {
    title: "Tentang Jovique",
    links: [
      { label: "Tentang Jovique", href: "/about" },
      { label: "Cerita Brand & Filosofi", href: "/about" },
      { label: "Lookbook & Kampanye", href: "/lookbook" },
      { label: "Keberlanjutan & Etika", href: "/sustainability" },
      { label: "Panduan Ukuran & Gaya", href: "/size-guide" },
      { label: "Karier di Jovique", href: "/careers", badge: "Hiring" },
    ],
  },
  {
    title: "Keamanan & Kebijakan",
    links: [
      { label: "Syarat & Ketentuan Pengguna", href: "/terms" },
      { label: "Kebijakan Privasi Data", href: "/privacy" },
      { label: "Garansi Orisinalitas & Retur", href: "/authenticity" },
      { label: "Hak Kekayaan Intelektual", href: "/authenticity" },
      { label: "Pengaturan Cookie", href: "/cookies" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    handle: "@jovique.official",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    handle: "@jovique.id",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    handle: "Jovique Official",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer({
  className = "",
  brandName = "JOVIQUE",
  tagline = "Official Online Store & Signature Fashion",
}: FooterProps) {
  // State for interactive Newsletter
  const [email, setEmail] = useState("");
  const [subscriptionState, setSubscriptionState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // State for Mobile Accordion
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setErrorMessage("Silakan masukkan alamat email yang valid.");
      setSubscriptionState("error");
      return;
    }

    setSubscriptionState("loading");
    setErrorMessage("");

    // Simulate luxury API subscription
    setTimeout(() => {
      setSubscriptionState("success");
    }, 850);
  };

  return (
    <footer
      className={`relative w-full bg-[#071324] text-[#E2E8F0] border-t border-[#1E293B] overflow-hidden ${className}`}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Navigasi Footer {brandName}
      </h2>

      {/* Ambient Blue Glow in Background */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-[#1474ed]/20 via-[#0B2545]/25 to-transparent blur-3xl opacity-60"
        aria-hidden="true"
      />

      {/* =========================================================================
          TIER 1: NEWSLETTER (High Conversion & Clean Luxury)
          ========================================================================= */}
      <div className="relative border-b border-[#1E293B] py-12 lg:py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative rounded-2xl border border-[#1E3A8A]/50 bg-gradient-to-br from-[#0B2545] via-[#0A192F] to-[#071324] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
            {/* Subtle decorative grid lines */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#1474ed]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#1D4ED8]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading & Value */}
              <div className="lg:col-span-6 space-y-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Dapatkan Informasi Koleksi Baru & Privilese Eksklusif
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl leading-relaxed">
                  Daftarkan email Anda untuk mendapatkan akses awal ke koleksi rilis terbatas, undangan acara privat Jovique,
                  dan penawaran sambutan istimewa setiap musim.
                </p>
              </div>

              {/* Right Column: Interactive Subscription Form */}
              <div className="lg:col-span-6">
                {subscriptionState === "success" ? (
                  <div className="p-6 rounded-xl bg-[#071324] border border-[#1474ed]/50 text-left space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1474ed]/20 text-[#1474ed] flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Selamat Datang di Jovique Official!</h4>
                        <p className="text-xs text-[#94A3B8]">Kode voucher sambutan telah dikirim ke {email}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-[#0B2545] border border-[#1E3A8A] rounded-lg flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] block">Voucher Selamat Datang (10% Off):</span>
                        <span className="font-mono text-xs font-bold text-[#60A5FA] tracking-wider">JOVIQUEWELCOME10</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("JOVIQUEWELCOME10");
                          alert("Kode voucher disalin!");
                        }}
                        className="text-[11px] font-medium px-3 py-1.5 bg-[#1474ed] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Salin Kode
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Masukkan alamat email Anda..."
                          required
                          className="w-full h-12 px-4 bg-[#071324] border border-[#1E3A8A] focus:border-[#1474ed] focus:ring-2 focus:ring-[#1474ed]/20 text-white placeholder-[#64748B] text-xs transition-all outline-none rounded-xl"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={subscriptionState === "loading"}
                        className="h-12 px-6 bg-white hover:bg-[#EFF6FF] text-[#0B2545] hover:text-[#1474ed] text-xs uppercase tracking-[0.16em] font-bold transition-all duration-300 flex items-center justify-center gap-2 shrink-0 group shadow-md hover:shadow-[0_0_20px_rgba(20,116,237,0.3)] disabled:opacity-50 rounded-xl cursor-pointer"
                      >
                        {subscriptionState === "loading" ? (
                          <span className="inline-block w-4 h-4 border-2 border-[#0B2545] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Daftar Sekarang</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </>
                        )}
                      </button>
                    </div>

                    {errorMessage && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errorMessage}
                      </p>
                    )}

                    <p className="text-[10px] text-[#64748B] leading-relaxed">
                      Dengan berlangganan, Anda menyetujui Kebijakan Privasi Jovique. Anda dapat berhenti berlangganan kapan pun tanpa biaya.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: MAIN NAVIGATION DIRECTORY & JOVIQUE IDENTITY
          ========================================================================= */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Identity & Social Channels (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block group focus:outline-none">
              <span className="font-bold text-3xl tracking-[0.24em] uppercase text-white group-hover:text-[#93C5FD] transition-colors">
                {brandName}
              </span>
              <span className="block text-[9px] uppercase tracking-[0.42em] text-[#60A5FA] -mt-0.5 font-bold">
                {tagline}
              </span>
            </Link>

            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              Rumah mode kontemporer Jovique menghadirkan koleksi busana dan aksesori eksklusif dengan presisi craftsmanship tinggi, desain modern berkarakter, dan pengalaman belanja personal langsung dari toko resmi Jovique.
            </p>

            {/* Social Channels */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] block font-semibold">
                Ikuti Kanal Resmi Jovique
              </span>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Kunjungi ${soc.name} Jovique Official`}
                    className="w-9 h-9 rounded-lg bg-[#0B2545] border border-[#1E3A8A] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#1474ed] hover:border-[#1474ed] transition-all duration-300 group shadow-xs"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">
                      {soc.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Directory Link Columns (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {NAV_SECTIONS.map((section, sIndex) => (
              <div key={section.title} className="border-b lg:border-b-0 border-[#1E293B] pb-4 lg:pb-0">
                {/* Mobile Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(sIndex)}
                  className="w-full lg:cursor-default flex items-center justify-between text-left py-2 lg:py-0 focus:outline-none"
                  aria-expanded={expandedSection === sIndex}
                >
                  <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                    {section.title}
                  </h4>
                  <span className="lg:hidden text-sm text-[#64748B]">
                    {expandedSection === sIndex ? "−" : "+"}
                  </span>
                </button>

                {/* Link List */}
                <ul
                  className={`mt-3 lg:mt-4 space-y-2.5 transition-all duration-300 ${
                    expandedSection === sIndex ? "block" : "hidden lg:block"
                  }`}
                >
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-xs text-[#94A3B8] hover:text-white transition-colors duration-200 py-0.5"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.label}
                        </span>
                        {link.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0B2545] text-[#60A5FA] border border-[#1E3A8A] uppercase font-semibold">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 3: BOTTOM COPYRIGHT (Jovan Sebastian William)
          ========================================================================= */}
      <div className="relative border-t border-[#1E293B] bg-[#040B14] py-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Copyright & Maison Credits */}
          <div className="space-y-1">
            <p className="text-[11px] text-[#94A3B8]">
              © 2026 <strong className="text-white font-medium">Jovan Sebastian William</strong>. Seluruh hak cipta dilindungi undang-undang.
            </p>
            <p className="text-[10px] text-[#64748B]">
              Situs ini dilindungi enkripsi SSL 256-bit dan mematuhi standar perlindungan data pribadi konsumen.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
