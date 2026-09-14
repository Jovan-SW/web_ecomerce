import { Button, SearchBar } from "@/components";

export default async function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-10 sm:py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* ========================================================
            SECTION SEARCHBAR (Premium, Elegant, White BG, Black Logo)
           ======================================================== */}
        <section className="bg-white p-6 sm:p-8 border border-[#ECE7E1] shadow-xs">
          <div className="mb-5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C827A] font-semibold">
              Katalog & Tren Busana
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-[#08080A] tracking-tight mt-0.5">
              Temukan Produk & Merk Pilihan
            </h2>
            <p className="text-xs text-[#5b4257] mt-1">
              Cari ribuan busana, potongan oversized, pakaian rajut vintage, atau merk favorit Anda.
            </p>
          </div>

          <SearchBar
            size="lg"
            placeholder="Cari produk, tren gaya terkini, atau merk busana..."
            trendingKeywords={[
              "Heavyweight Boxy Tee",
              "Vintage Washed",
              "Textured Knit Polo",
              "Oversized Fit",
              "Linen Camp Collar",
            ]}
          />
        </section>

        {/* Header Showcase */}
        <header className="border-b border-[#ECE7E1] pb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8C827A] font-semibold mb-1.5">
            Modern Fashion UI System
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#08080A] tracking-tight">
            High-Contrast Neon Button Component
          </h1>
          <p className="text-sm text-[#5b4257] mt-2">
            Arahkan kursor (hover) pada tombol di bawah untuk melihat kilau neon cyan & purple, micro-lift, dan reflective sheen.
          </p>
        </header>

        {/* Grid Showcase Tombol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. PRIMARY */}
          <div className="bg-white p-6 border border-[#ECE7E1] shadow-sm flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#08080A]">
                  1. Primary (Aksi Utama / CTA)
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-black text-cyan-400 font-mono tracking-widest uppercase">
                  Neon Glow
                </span>
              </div>
              <p className="text-xs text-[#5b4257]">
                Latar hitam pekat, aksen laser neon di bawah, reflective light sweep, dan neon aura saat di-hover.
              </p>
            </div>
            <div className="space-y-3">
              <Button variant="primary" size="lg" fullWidth>
                Tambah ke Keranjang
              </Button>
              <Button variant="primary" size="md">
                Checkout Sekarang →
              </Button>
            </div>
          </div>

          {/* 2. SECONDARY / OUTLINE */}
          <div className="bg-white p-6 border border-[#ECE7E1] shadow-sm flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#08080A]">
                  2. Secondary / Outline
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-800 font-mono tracking-widest uppercase">
                  Electric Rim
                </span>
              </div>
              <p className="text-xs text-[#5b4257]">
                Kontras tajam putih-hitam, bertransformasi ke dark sleek dengan border neon cyan menyala saat di-hover.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="md">
                Lihat Detail
              </Button>
              <Button variant="outline" size="sm">
                Pilih Ukuran
              </Button>
            </div>
          </div>

          {/* 3. GHOST */}
          <div className="bg-white p-6 border border-[#ECE7E1] shadow-sm flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#08080A]">
                  3. Ghost (Bersih Tanpa Garis)
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-50 text-cyan-700 font-mono tracking-widest uppercase">
                  Holographic
                </span>
              </div>
              <p className="text-xs text-[#5b4257]">
                Tanpa latar dan tanpa border saat diam. Hover memunculkan holographic neon tint dan micro-scale.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" aria-label="Tutup">
                <span className="text-base font-bold">✕</span>
              </Button>
              <Button variant="ghost" size="sm">
                Lanjut Belanja →
              </Button>
              <Button variant="ghost" size="sm">
                Voucher Saya
              </Button>
            </div>
          </div>

          {/* 4. DESTRUCTIVE */}
          <div className="bg-white p-6 border border-[#ECE7E1] shadow-sm flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
                  4. Destructive (Aksi Bahaya / Hapus)
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-600 font-mono tracking-widest uppercase">
                  Crimson Laser
                </span>
              </div>
              <p className="text-xs text-[#5b4257]">
                Latar merah lembut kontras tinggi, meledak dengan laser crimson neon glow saat di-hover.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="destructive" size="md">
                Kosongkan Keranjang
              </Button>
              <Button variant="destructive" size="sm">
                Hapus Item
              </Button>
            </div>
          </div>
        </div>

        {/* 5. LOADING STATE SECTION */}
        <div className="bg-white p-6 border border-[#ECE7E1] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#08080A]">
              5. Status Loading Terintegrasi
            </span>
            <p className="text-xs text-[#5b4257] mt-1">
              Dilengkapi animasi micro-spinner neon dan proteksi anti double-click saat request berlangsung.
            </p>
          </div>
          <Button variant="primary" size="md" isLoading>
            Memproses Pembayaran...
          </Button>
        </div>
      </div>
    </main>
  );
}
