import React from "react";
import Link from "next/link";
import { HeroSlider, ProductGrid, HomeFaq, Button, ScrollReveal } from "@/components";
import { getActiveBanners, getProducts } from "@/services";

export const revalidate = 60; // Revalidate data setiap 60 detik (ISR)

export default async function Home() {
  // Ambil data banner aktif & 10 produk terbaik (berdasarkan rating tertinggi)
  const [banners, productsResponse] = await Promise.all([
    getActiveBanners().catch(() => []),
    getProducts({ limit: 10, sortBy: "rating" }).catch(() => ({
      data: [],
      totalCount: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasMore: false,
    })),
  ]);

  const topProducts = productsResponse?.data || [];

  return (
    <main className="min-h-screen bg-warm-canvas ambient-glow-mesh relative selection:bg-[#311744] selection:text-white">
      {/* =========================================================================
          1. HERO SLIDER UTAMA (Auto-play, Full Landscape)
          ========================================================================= */}
      <HeroSlider initialBanners={banners} />

      {/* =========================================================================
          2. SECTION: PRODUK TERPOPULER & REKOMENDASI (ProductCard & ProductGrid)
          ========================================================================= */}
      <section
        className="py-16 sm:py-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10"
        aria-labelledby="featured-products-heading"
      >
        {/* Section Header dengan Smooth Scroll Reveal */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 pb-6 border-b border-[#e8e3ea]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#311744]/5 border border-[#311744]/12 text-[11px] font-mono tracking-wider text-[#311744] font-semibold mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#1474ed]" />
                Signature Collection • Pilihan Terbaik Hari Ini
              </div>
              <h2
                id="featured-products-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#000200] tracking-tight leading-tight"
              >
                Koleksi Paling Diminati & Terpopuler
              </h2>
              <p className="text-xs sm:text-sm text-[#5b4257] mt-2 font-normal max-w-xl leading-relaxed">
                Koleksi busana dan aksesori terfavorit yang dirancang secara eksklusif oleh Jovique. Dibuat dengan material premium untuk menyempurnakan gaya harian Anda.
              </p>
            </div>

            <Link href="/products" className="shrink-0 self-start md:self-end">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl font-medium text-xs tracking-normal border-[#e8e3ea] hover:border-[#311744] hover:bg-[#f5eff8]"
              >
                Lihat Semua Koleksi Jovique →
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Grid 10 Produk Terbaik dengan Stagger Reveal Animasi Lembut */}
        <ProductGrid
          products={topProducts}
          staggerReveal={true}
          loadingCount={10}
          emptyTitle="Koleksi Rekomendasi Sedang Dipersiapkan"
          emptyMessage="Daftar koleksi terpopuler sedang diperbarui. Silakan jelajahi katalog lengkap Jovique."
        />

        {/* Footer CTA Section Produk dengan Smooth Scroll Reveal */}
        <ScrollReveal direction="up" delay={150}>
          <div className="mt-12 sm:mt-16 text-center pt-8 border-t border-[#e8e3ea]">
            <p className="text-xs text-[#5b4257] uppercase tracking-wider font-mono font-medium mb-4">
              Jelajahi Seluruh Koleksi Eksklusif & Busana Elegan di Jovique Official
            </p>
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                className="px-8 rounded-xl shadow-sm hover:shadow-[0_0_24px_rgba(49,23,68,0.25)]"
              >
                Jelajahi Seluruh Koleksi Jovique →
              </Button>
            </Link>
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#5b4257] flex-wrap">
              <span>✓ Bebas Ongkir Seluruh Indonesia</span>
              <span>•</span>
              <span>✓ 100% Orisinal Jovique</span>
              <span>•</span>
              <span>✓ Transaksi Aman & Terenkripsi</span>
              <span>•</span>
              <span>✓ Jaminan Retur 7 Hari</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          3. SECTION: KEUNGGULAN JOVIQUE & FAQ
          ========================================================================= */}
      <HomeFaq />
    </main>
  );
}

