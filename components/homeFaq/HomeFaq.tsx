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
    question: "Apakah koleksi Jovique ramah di kantong?",
    answer:
      "Sangat bersahabat! Jovique menerapkan model direct-to-consumer langsung dari workshop produksi tanpa markup perantara dan tanpa biaya sewa butik mall yang mahal. Koleksi esensial harian kami dibanderol mulai dari Rp 100rb-an, memberikan perpaduan terbaik antara harga terjangkau dan kualitas bahan yang solid.",
    category: "tentang",
  },
  {
    id: "faq-2",
    question: "Kenapa Jovique dibuat dan apa tujuannya?",
    answer:
      "Jovique didirikan untuk menghadirkan alternatif pakaian berkualitas tanpa harga yang selangit. Kami jenuh melihat pakaian murah yang cepat melar, tipis menerawang, dan cepat rusak setelah beberapa kali cuci. Di Jovique, kami ingin semua orang bisa tampil percaya diri dengan pakaian awet bertahun-tahun dengan harga yang masuk akal bagi semua kalangan.",
    category: "tentang",
  },
  {
    id: "faq-3",
    question: "Pilihan produk apa saja yang tersedia di Jovique?",
    answer: (
      <div className="space-y-2">
        <p>Jovique menyediakan busana esensial harian yang mudah dipadupadankan (mix & match):</p>
        <ul className="list-disc pl-5 space-y-1 text-[#5b4257]">
          <li><strong>Heavyweight Tees:</strong> Kaos katun 280 GSM berpotongan boxy yang jatuh rapi dan kerah rib tebal anti-melar.</li>
          <li><strong>Flannels & Shirts:</strong> Kemeja kasual flanel lembut dan overshirt kerja harian yang fleksibel.</li>
          <li><strong>Jackets & Outerwear:</strong> Chore jacket kanvas tebal dan trucker denim santai untuk gaya harian.</li>
          <li><strong>Trousers & Chinos:</strong> Celana relaxed pleated dan denim berpotongan nyaman untuk kerja maupun nongkrong.</li>
          <li><strong>Daily Essentials:</strong> Aksesoris fungsional seperti tote bag kanvas tebal dan topi beanie lembut.</li>
        </ul>
      </div>
    ),
    category: "produk",
  },
  {
    id: "faq-4",
    question: "Apakah bahan katun tebal 280+ GSM gerah di iklim tropis?",
    answer:
      "Sama sekali tidak. Kami memilih rajutan 100% combed cotton serat panjang berkualitas tinggi. Karakter kainnya tebal sehingga jatuhnya rapi (drape bagus) dan tidak menerawang, namun memiliki sirkulasi udara (breathability) prima yang adem dan menyerap keringat seharian.",
    category: "produk",
  },
  {
    id: "faq-5",
    question: "Bagaimana jika baju yang saya beli kebesaran atau kekecilan?",
    answer:
      "Tenang dan belanja tanpa was-was! Jovique menyediakan Garansi Tukar Ukuran 7 Hari setelah paket sampai di tangan Anda. Jika ukuran kurang pas di badan, tim kami akan membantu proses tukar ukuran dengan cepat dan ramah.",
    category: "layanan",
  },
  {
    id: "faq-6",
    question: "Apakah tersedia Gratis Ongkir dan berapa lama pengirimannya?",
    answer:
      "Ya! Kami menyediakan subsidi Gratis Ongkir ke seluruh wilayah Indonesia. Pesanan yang terkonfirmasi sebelum jam 15.00 WIB langsung dikirim hari itu juga, dengan estimasi 1–3 hari kerja untuk Pulau Jawa dan 2–5 hari kerja untuk luar pulau.",
    category: "layanan",
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
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#311744]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1474ed]/4 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ========================================================
            1. BRAND STORY / PENJELASAN TENTANG JOVIQUE (3 PILAR RAMAH)
           ======================================================== */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#311744]/5 border border-[#311744]/12 text-[11px] font-mono tracking-wider text-[#311744] font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#1474ed]" />
              Tentang Jovique & Komitmen Kami
            </span>
            <h2
              id="home-about-faq-title"
              className="text-3xl sm:text-4xl lg:text-[42px] font-serif text-[#000200] tracking-tight leading-tight"
            >
              Fashion Keren, Nyaman & Ramah di Kantong
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-[#5b4257] font-normal leading-relaxed">
              Jovique hadir untuk Anda yang ingin tampil rapi, bergaya, dan berkarakter tanpa perlu membayar mahal. Pilihan tepat untuk gaya harian yang awet bertahun-tahun.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Kartu Penjelasan Utama (Tampilan Bersahabat, Rounded Warm Surfaces) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-24">
          {/* Card 1: Keren Gak Harus Mahal */}
          <ScrollReveal direction="up" delay={0} className="h-full">
            <div className="h-full bg-white/90 backdrop-blur-xs p-7 sm:p-8 rounded-2xl border border-[#e8e3ea] shadow-sm hover:shadow-md hover:border-[#311744]/30 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f5eff8] text-[#311744] flex items-center justify-center font-serif text-lg font-bold mb-5 border border-[#311744]/10 group-hover:bg-[#311744] group-hover:text-white transition-colors duration-300">
                  01
                </div>
                <span className="text-[11px] uppercase tracking-wider font-mono text-[#1474ed] font-semibold block mb-1">
                  Harga Jujur Produsen
                </span>
                <h3 className="text-xl font-serif text-[#000200] tracking-tight mb-2.5">
                  Keren Gak Harus Mahal
                </h3>
                <p className="text-sm text-[#5b4257] leading-relaxed font-normal">
                  Kami memangkas jalur perantara dan biaya sewa mall yang tinggi. Anda mendapatkan pakaian berkualitas tinggi mulai Rp 100rb-an langsung dengan harga yang adil dan transparan.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#f1edf2] flex items-center justify-between text-xs font-semibold text-[#311744]">
                <span>Mulai Rp 100rb-an</span>
                <span className="text-[#1474ed] font-normal">✓ Tanpa Markup Butik</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Bahan Awet & Nyaman Harian */}
          <ScrollReveal direction="up" delay={120} className="h-full">
            <div className="h-full bg-white/90 backdrop-blur-xs p-7 sm:p-8 rounded-2xl border border-[#e8e3ea] shadow-sm hover:shadow-md hover:border-[#311744]/30 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f5eff8] text-[#311744] flex items-center justify-center font-serif text-lg font-bold mb-5 border border-[#311744]/10 group-hover:bg-[#311744] group-hover:text-white transition-colors duration-300">
                  02
                </div>
                <span className="text-[11px] uppercase tracking-wider font-mono text-[#1474ed] font-semibold block mb-1">
                  Kualitas Tahan Lama
                </span>
                <h3 className="text-xl font-serif text-[#000200] tracking-tight mb-2.5">
                  Bahan Nyaman & Awet
                </h3>
                <p className="text-sm text-[#5b4257] leading-relaxed font-normal">
                  Menggunakan katun combed 280–330 GSM yang tebal dan jatuh rapi di badan. Tidak tipis menerawang, tetap sejuk di iklim tropis, dan tidak mudah melar dicuci berkali-kali.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#f1edf2] flex items-center justify-between text-xs font-semibold text-[#311744]">
                <span>Katun 280+ GSM</span>
                <span className="text-[#1474ed] font-normal">✓ Anti-Fast Fashion</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Belanja Tenang & Garansi Ukuran */}
          <ScrollReveal direction="up" delay={240} className="h-full">
            <div className="h-full bg-white/90 backdrop-blur-xs p-7 sm:p-8 rounded-2xl border border-[#e8e3ea] shadow-sm hover:shadow-md hover:border-[#311744]/30 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f5eff8] text-[#311744] flex items-center justify-center font-serif text-lg font-bold mb-5 border border-[#311744]/10 group-hover:bg-[#311744] group-hover:text-white transition-colors duration-300">
                  03
                </div>
                <span className="text-[11px] uppercase tracking-wider font-mono text-[#1474ed] font-semibold block mb-1">
                  Layanan Terpercaya
                </span>
                <h3 className="text-xl font-serif text-[#000200] tracking-tight mb-2.5">
                  Belanja Nyaman & Tenang
                </h3>
                <p className="text-sm text-[#5b4257] leading-relaxed font-normal">
                  Dari subsidi gratis ongkir ke seluruh Indonesia hingga garansi penukaran ukuran 7 hari jika baju yang sampai kurang pas di badan. Belanja online jadi bebas rasa cemas.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-[#f1edf2] flex items-center justify-between text-xs font-semibold text-[#311744]">
                <span>Tukar Ukuran 7 Hari</span>
                <span className="text-[#1474ed] font-normal">✓ Gratis Ongkir</span>
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
                  <span className="text-[11px] uppercase tracking-wider font-mono text-[#1474ed] font-semibold">
                    Pertanyaan Yang Sering Diajukan
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#000200] tracking-tight leading-tight mt-1.5">
                    Punya Pertanyaan Sebelum Berbelanja?
                  </h3>
                  <p className="text-sm text-[#5b4257] leading-relaxed mt-2.5 font-normal">
                    Berikut rangkuman jawaban seputar standar bahan, panduan ukuran, dan kemudahan berbelanja di Jovique.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-[#e8e3ea] shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#000200]">
                      Tim Bantuan Jovique Siaga
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#5b4257] leading-relaxed">
                    Bingung menentukan ukuran yang tepat untuk badan Anda? Tim ramah kami siap membantu merekomendasikan size terbaik agar langsung pas saat dipakai.
                  </p>
                  <Link href="/contact" className="block pt-1">
                    <Button variant="outline" size="sm" fullWidth className="rounded-xl font-medium text-xs">
                      Tanya Bantuan Ukuran →
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
                        ? "border-[#311744] shadow-sm"
                        : "border-[#e8e3ea] hover:border-[#311744]/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer select-none"
                    >
                      <span className="font-serif text-base sm:text-lg font-medium text-[#000200] tracking-tight flex items-start sm:items-center">
                        <span className="font-mono text-xs text-[#1474ed] mr-3 font-semibold shrink-0 mt-0.5 sm:mt-0">
                          {String(index + 1).padStart(2, "0")}.
                        </span>
                        <span>{item.question}</span>
                      </span>
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          isOpen
                            ? "bg-[#311744] text-white rotate-45 border-[#311744]"
                            : "bg-[#f5eff8] text-[#311744] border-[#e8e3ea] hover:bg-[#311744] hover:text-white"
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
                      <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 text-sm text-[#5b4257] leading-relaxed border-t border-[#f1edf2] font-normal">
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

