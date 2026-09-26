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
      "Belanja langsung di Jovique 100% aman dan terenkripsi. Kami bekerja sama dengan payment gateway berstandar enkripsi tinggi untuk melindungi setiap transaksi Anda. Pesanan Anda diproses langsung dari warehouse resmi Jovique dengan jaminan kepuasan belanja.",
    category: "layanan",
  },
  {
    id: "faq-2",
    question: "Apakah semua produk yang tersedia di Jovique terjamin original?",
    answer:
      "Pasti! Seluruh busana dan aksesori yang Anda temukan di website ini adalah produk original 100% yang dirancang dan diproduksi eksklusif oleh Jovique. Setiap jahitan, material, dan detail melalui quality control ketat sebelum dikirimkan ke tangan Anda.",
    category: "produk",
  },
  {
    id: "faq-3",
    question: "Metode pembayaran apa saja yang didukung di Jovique?",
    answer:
      "Jovique menyediakan pilihan pembayaran lengkap dan fleksibel untuk kenyamanan Anda: Transfer Bank / Virtual Account (BCA, Mandiri, BRI, BNI, Permata), E-Wallet (GoPay, OVO, ShopeePay, DANA), Kartu Kredit/Debit Visa/Mastercard, serta berbagai pilihan pembayaran digital resmi lainnya.",
    category: "layanan",
  },
  {
    id: "faq-4",
    question: "Apakah tersedia layanan Bebas Ongkir?",
    answer:
      "Ya! Anda bisa menikmati promo Bebas Ongkir untuk setiap pembelian koleksi Jovique dalam simulasi belanja di website ini.",
    category: "layanan",
  },
  {
    id: "faq-5",
    question: "Bagaimana jika produk yang saya terima salah ukuran atau ingin ditukar?",
    answer:
      "Kepuasan Anda adalah prioritas kami! Setiap pembelian di Jovique dilindungi Garansi Penukaran Ukuran & Pengembalian 7 Hari. Anda cukup menghubungi tim layanan pelanggan kami, dan tim Jovique akan memfasilitasi proses penukaran produk atau pengembalian dengan mudah.",
    category: "produk",
  },
  {
    id: "faq-6",
    question: "Apakah Jovique merilis koleksi eksklusif atau edisi terbatas (limited edition)?",
    answer:
      "Ya! Jovique secara berkala merilis koleksi kapsul (capsule collection) dan edisi terbatas dengan desain eksklusif yang hanya diproduksi dalam kuantitas tertentu. Pastikan Anda memiliki akun Jovique agar tidak ketinggalan peluncuran koleksi terbaru.",
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
            1. JOVIQUE VALUE PROPOSITION (3 PILAR KEUNGGULAN)
           ======================================================== */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] tracking-wider text-[#1D4ED8] font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1474ed]" />
              Kenapa Memilih Jovique?
            </span>
            <h2
              id="home-about-faq-title"
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight"
            >
              Dedikasi Kami untuk Keanggunan & Kualitas Terbaik
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-[#475569] font-normal leading-relaxed">
              Jovique menghadirkan koleksi busana eksklusif dengan sentuhan material premium dan jahitan presisi, menjamin tampilan memukau di setiap momen istimewa Anda.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Kartu Keunggulan Jovique */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-24">
          {/* Card 1: Desain Orisinal & Material Premium */}
          <ScrollReveal direction="up" delay={0} className="h-full">
            <div className="h-full bg-white p-7 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#1474ed]/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold text-lg mb-5 border border-[#BFDBFE] group-hover:bg-[#1474ed] group-hover:text-white transition-colors duration-300">
                  01
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#1474ed] font-semibold block mb-1">
                  Koleksi Eksklusif
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2.5">
                  Desain Orisinal & Material Premium
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-normal">
                  Setiap busana Jovique dirancang khusus dengan material berkualitas tinggi, memadukan kenyamanan sepanjang hari dengan estetika kontemporer yang elegan.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                <span>Atelier Resmi Jovique</span>
                <span className="text-[#1474ed] font-normal">✓ 100% Orisinal Jovique</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Craftsmanship & Transaksi Aman */}
          <ScrollReveal direction="up" delay={120} className="h-full">
            <div className="h-full bg-white p-7 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#1474ed]/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold text-lg mb-5 border border-[#BFDBFE] group-hover:bg-[#1474ed] group-hover:text-white transition-colors duration-300">
                  02
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#1474ed] font-semibold block mb-1">
                  Standar Kualitas
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2.5">
                  Craftsmanship & Transaksi Aman
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-normal">
                  Setiap jahitan melalui kendali mutu (quality control) teliti. Sistem pembayaran kami terenkripsi penuh menjamin kenyamanan belanja Anda dari awal hingga akhir.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                <span>Jaminan Kepuasan</span>
                <span className="text-[#1474ed] font-normal">✓ Garansi Retur 7 Hari</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Bebas Ongkir & Pengemasan Eksklusif */}
          <ScrollReveal direction="up" delay={240} className="h-full">
            <div className="h-full bg-white p-7 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#1474ed]/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold text-lg mb-5 border border-[#BFDBFE] group-hover:bg-[#1474ed] group-hover:text-white transition-colors duration-300">
                  03
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#1474ed] font-semibold block mb-1">
                  Pengemasan Mewah
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2.5">
                  Bebas Ongkir & Pengemasan Eksklusif
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed font-normal">
                  Pesanan dikemas secara mewah dan aman untuk menjaga keutuhan produk, didukung layanan pengiriman cepat dan subsidi bebas ongkir ke seluruh nusantara.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0B2545]">
                <span>Pengiriman Seluruh Nusantara</span>
                <span className="text-[#1474ed] font-normal">✓ Packaging Eksklusif</span>
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
                    Layanan Pelanggan & Bantuan
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight leading-tight mt-1.5">
                    Punya Pertanyaan Seputar Koleksi Jovique?
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed mt-2.5 font-normal">
                    Berikut informasi penting mengenai pemesanan, panduan ukuran, jaminan orisinalitas, dan layanan purna jual Jovique.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                      Layanan Konsultasi & CS Jovique
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                    Butuh panduan memilih ukuran, rekomendasi gaya busana, atau informasi pengiriman? Tim Jovique siap membantu Anda dengan ramah.
                  </p>
                  <Link href="/products" className="block pt-1">
                    <Button variant="outline" size="sm" fullWidth className="rounded-xl font-medium text-xs">
                      Hubungi Layanan Pelanggan →
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

