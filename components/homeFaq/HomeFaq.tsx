"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components";
import ScrollReveal from "../common/ScrollReveal";

interface FaqItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  category: "tentang" | "produk" | "layanan";
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Bagaimana sistem keamanan transaksi dan pembayaran di Jovique?",
    answer:
      "Belanja di Jovique 100% aman dengan sistem Rekening Bersama (Escrow Jovique Proteksi). Dana pembayaran Anda disimpan aman oleh platform dan baru akan dicairkan ke pihak penjual setelah pesanan sampai di tangan Anda dalam kondisi baik dan sesuai ekspektasi.",
    category: "layanan",
  },
  {
    id: "faq-2",
    question: "Apakah semua produk yang dijual di Jovique terjamin original?",
    answer:
      "Pasti! Seluruh produk berlabel Official Store dan merchant terverifikasi dijamin 100% original langsung dari brand pemegang lisensi resmi. Jika produk yang Anda terima terbukti palsu atau tidak asli, Jovique menyediakan jaminan 100% garansi uang kembali.",
    category: "produk",
  },
  {
    id: "faq-3",
    question: "Metode pembayaran apa saja yang didukung di platform Jovique?",
    answer:
      "Jovique menyediakan pilihan pembayaran lengkap dan fleksibel untuk kenyamanan Anda: Transfer Bank / Virtual Account (BCA, Mandiri, BRI, BNI, Permata), E-Wallet (GoPay, OVO, ShopeePay, DANA), Kartu Kredit/Debit Visa/Mastercard, PayLater, serta fitur COD (Bayar di Tempat).",
    category: "layanan",
  },
  {
    id: "faq-4",
    question: "Apakah tersedia program Bebas Ongkir dan berapa estimasi pengirimannya?",
    answer:
      "Ya! Anda bisa menikmati subsidi Bebas Ongkir ke seluruh wilayah Indonesia dengan memilih produk bertanda promo. Estimasi pengiriman bervariasi mulai dari beberapa jam untuk kurir Instant & Same Day, hingga 1–3 hari kerja untuk pengiriman Reguler antar-kota.",
    category: "layanan",
  },
  {
    id: "faq-5",
    question: "Bagaimana jika barang yang saya terima rusak, salah ukuran, atau tidak sesuai?",
    answer:
      "Tenang dan bebas khawatir! Setiap transaksi dilindungi Garansi Perlindungan Pembeli 7 Hari. Anda cukup mengajukan komplain atau permohonan retur melalui halaman pesanan, dan tim kami bersama penjual akan memfasilitasi penukaran barang atau pengembalian dana (refund) secara cepat.",
    category: "produk",
  },
  {
    id: "faq-6",
    question: "Bagaimana cara mendaftar dan mulai berjualan sebagai seller di Jovique?",
    answer:
      "Membuka toko di Jovique sangat mudah, cepat, dan tanpa biaya pendaftaran! Cukup buat akun, lengkapi data profil toko, unggah produk Anda, dan Anda siap menjangkau jutaan calon pembeli di seluruh Indonesia dengan dukungan logistik terintegrasi.",
    category: "tentang",
  },
];

export default function HomeFaq({ className = "" }: { className?: string }) {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className={`py-16 sm:py-24 border-t border-[#e8e3ea] relative overflow-hidden ${className}`}
      aria-labelledby="home-about-faq-title"
    >
      {/* Subtle Background Glow Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1474ed]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1D4ED8]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ========================================================
            1. MARKETPLACE VALUE PROPOSITION (3 PILAR KEUNGGULAN)
           ======================================================== */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] tracking-wider text-[#1D4ED8] font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1474ed]" />
              Kenapa Belanja di Jovique?
            </span>
            <h2
              id="home-about-faq-title"
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight"
            >
              Belanja Online Lengkap, Aman, dan Tepercaya
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
              Jovique menghubungkan Anda dengan ribuan toko pilihan dan official brand di seluruh nusantara dengan jaminan belanja aman, harga bersaing, dan bebas cemas.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Kartu Keunggulan Marketplace */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-24">
          {/* Card 1: Jutaan Produk & Brand Resmi */}
          <ScrollReveal direction="up" delay={0} className="h-full">
            <div className="h-full bg-white p-7 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#1474ed]/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold text-lg mb-5 border border-[#BFDBFE] group-hover:bg-[#1474ed] group-hover:text-white transition-colors duration-300">
                  01
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#1474ed] font-semibold block mb-1">
                  Pilihan Terlengkap
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2.5">
                  Jutaan Produk & Brand Resmi
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-normal">
                  Temukan beragam kebutuhan harian mulai dari fashion, sepatu, aksesoris, hingga produk gaya hidup dari brand official dan seller terpercaya seluruh Indonesia.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                <span>Ribuan Toko Pilihan</span>
                <span className="text-[#1474ed] font-normal">✓ 100% Produk Asli</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Transaksi Aman & Terlindungi */}
          <ScrollReveal direction="up" delay={120} className="h-full">
            <div className="h-full bg-white p-7 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#1474ed]/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold text-lg mb-5 border border-[#BFDBFE] group-hover:bg-[#1474ed] group-hover:text-white transition-colors duration-300">
                  02
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#1474ed] font-semibold block mb-1">
                  Perlindungan Konsumen
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2.5">
                  Transaksi Aman & Terlindungi
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-normal">
                  Dilindungi sistem rekening bersama (Escrow). Pembayaran Anda baru diteruskan ke penjual setelah barang diterima dengan aman dan sesuai pesanan Anda.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                <span>Garansi Uang Kembali</span>
                <span className="text-[#1474ed] font-normal">✓ Rekber & COD</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Bebas Ongkir & Pengiriman Cepat */}
          <ScrollReveal direction="up" delay={240} className="h-full">
            <div className="h-full bg-white p-7 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#1474ed]/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold text-lg mb-5 border border-[#BFDBFE] group-hover:bg-[#1474ed] group-hover:text-white transition-colors duration-300">
                  03
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#1474ed] font-semibold block mb-1">
                  Logistik Terintegrasi
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2.5">
                  Bebas Ongkir & Pengiriman Cepat
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-normal">
                  Dukungan kurir pengiriman lengkap mulai dari Instant, Same Day, Reguler, hingga Kargo dengan subsidi bebas ongkir ke seluruh pelosok tanah air.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                <span>Seluruh Indonesia</span>
                <span className="text-[#1474ed] font-normal">✓ Bebas Ongkir</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ========================================================
            2. INTERACTIVE FAQ ACCORDION SECTION
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Sisi Kiri: Judul FAQ & Customer Care Box */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <ScrollReveal direction="left">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#1474ed] font-semibold">
                    Pusat Bantuan & Layanan Pembeli
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight leading-tight mt-1.5">
                    Punya Pertanyaan Seputar Belanja di Jovique?
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed mt-2.5 font-normal">
                    Berikut rangkuman jawaban seputar keamanan transaksi, metode pembayaran, garansi retur, dan kemudahan belanja di Jovique.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                      Customer Care 24/7 Siaga
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                    Butuh bantuan terkait status pesanan, verifikasi pembayaran, atau kendala transaksi lainnya? Tim ramah kami siap membantu Anda kapan pun.
                  </p>
                  <Link href="/products" className="block pt-1">
                    <Button variant="outline" size="sm" fullWidth className="rounded-xl font-medium text-xs">
                      Pusat Bantuan & Layanan →
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sisi Kanan: Daftar Accordion FAQ */}
          <div className="lg:col-span-8 space-y-3.5">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openId === item.id;

              return (
                <ScrollReveal
                  key={item.id}
                  direction="up"
                  delay={index * 60}
                >
                  <div
                    className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-[#1474ed] shadow-sm ring-1 ring-[#1474ed]/10"
                        : "border-[#E2E8F0] hover:border-[#1474ed]/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer select-none"
                    >
                      <span className="text-base sm:text-lg font-semibold text-[#0F172A] tracking-tight flex items-start sm:items-center">
                        <span className="text-xs text-[#1474ed] mr-3 font-semibold shrink-0 mt-0.5 sm:mt-0">
                          {String(index + 1).padStart(2, "0")}.
                        </span>
                        <span>{item.question}</span>
                      </span>
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          isOpen
                            ? "bg-[#1474ed] text-white rotate-45 border-[#1474ed]"
                            : "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] hover:bg-[#1474ed] hover:text-white"
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>

                    {/* Isi Jawaban Accordion */}
                    <div
                      id={`faq-answer-${item.id}`}
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9] font-normal">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

