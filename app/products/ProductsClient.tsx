"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar, ProductGrid, Button, ScrollReveal } from "@/components";
import type { ProductWithDetails, Category } from "@/types/database";
import type { ProductSortOption } from "@/services";
import { searchProducts, DEFAULT_TRENDING_KEYWORDS } from "@/utils/search";

export interface ProductsClientProps {
  initialProducts: ProductWithDetails[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: ProductSortOption;
}

const TRENDING_KEYWORDS = DEFAULT_TRENDING_KEYWORDS;

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "newest", label: "Paling Baru Ditambahkan" },
  { value: "price-asc", label: "Harga: Termurah" },
  { value: "price-desc", label: "Harga: Tertinggi" },
  { value: "rating", label: "Rating & Ulasan Tertinggi" },
  { value: "name-asc", label: "Nama Produk (A–Z)" },
];

export default function ProductsClient({
  initialProducts,
  categories,
  initialQuery = "",
  initialCategory = "all",
  initialSort = "newest",
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // State pencarian, kategori aktif, dan sorting
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState<ProductSortOption>(initialSort);

  // Sinkronisasi kategori dan pencarian saat URL berubah (misal navigasi dari Navbar)
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setSelectedCategory((prev) => (prev !== cat ? cat : prev));
    const q = searchParams.get("q") || "";
    setSearchQuery((prev) => (prev !== q ? q : prev));
  }, [searchParams]);

  // Helper untuk sinkronisasi query string ke URL tanpa page reload
  const updateUrlParams = (newQuery: string, newCat: string, newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newQuery.trim()) {
      params.set("q", newQuery.trim());
    } else {
      params.delete("q");
    }

    if (newCat && newCat !== "all") {
      params.set("category", newCat);
    } else {
      params.delete("category");
    }

    if (newSort && newSort !== "newest") {
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }

    const queryString = params.toString();
    const newPath = queryString ? `/products?${queryString}` : "/products";

    startTransition(() => {
      router.replace(newPath, { scroll: false });
    });
  };

  // Handler perubahan search bar
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(val, selectedCategory, selectedSort);
  };

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    // Saat user submit pencarian baru atau klik keyword tren, reset kategori ke "all"
    // agar pencarian menyisir seluruh katalog Jovique tanpa terkunci di kategori lama
    setSelectedCategory("all");
    updateUrlParams(val, "all", selectedSort);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    updateUrlParams("", selectedCategory, selectedSort);
  };

  // Handler pemilihan kategori
  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    updateUrlParams(searchQuery, slug, selectedSort);
  };

  // Handler pengurutan
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortVal = e.target.value as ProductSortOption;
    setSelectedSort(sortVal);
    updateUrlParams(searchQuery, selectedCategory, sortVal);
  };

  // Reset semua filter & pencarian
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSort("newest");
    router.replace("/products", { scroll: false });
  };

  // Hitung jumlah produk per kategori untuk badge pill
  const categoryCounts = useMemo(() => {
    // Jika ada pencarian aktif, hitung jumlah item per kategori dari hasil pencarian agar sinkron
    const baseList =
      searchQuery.trim() !== ""
        ? searchProducts(initialProducts, searchQuery)
        : initialProducts;

    const counts: Record<string, number> = { all: baseList.length };
    baseList.forEach((prod) => {
      const slug = prod.category?.slug;
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      }
    });
    return counts;
  }, [initialProducts, searchQuery]);

  // Filter & Urutkan Produk secara Responsif di Client
  const filteredProducts = useMemo(() => {
    // 1. Pencarian Cerdas dengan Kamus Sinonim & Skor Relevansi Multi-Tier
    let result =
      searchQuery.trim() !== ""
        ? searchProducts(initialProducts, searchQuery)
        : [...initialProducts];

    // 2. Filter Kategori (jika dipilih spesifik selain "all")
    if (selectedCategory !== "all") {
      result = result.filter(
        (prod) => prod.category?.slug === selectedCategory
      );
    }

    // 3. Sorting Produk (jika bukan default relevansi saat pencarian teks aktif)
    if (selectedSort !== "newest" || !searchQuery.trim()) {
      switch (selectedSort) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name, "id"));
          break;
        case "newest":
        default:
          result.sort((a, b) => {
            if (!a.created_at || !b.created_at) return 0;
            return (
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
          });
          break;
      }
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, selectedSort]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "all";

  return (
    <div className="min-h-screen bg-warm-canvas ambient-glow-mesh pb-24">
      {/* =========================================================================
          1. HEADER KATALOG & BREADCRUMB
          ========================================================================= */}
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 border-b border-[#e8e3ea]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-xs font-mono text-[#5b4257]">
            <li>
              <Link
                href="/"
                className="hover:text-[#311744] hover:underline transition-colors"
              >
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#311744] font-semibold" aria-current="page">
              Koleksi Jovique
            </li>
          </ol>
        </nav>

        {/* Section Title */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#000200] tracking-tight leading-tight">
            Koleksi Eksklusif Jovique
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-[#5b4257] font-normal leading-relaxed">
            Temukan rangkaian busana dan aksesori berkualitas dari Jovique. Didesain dengan presisi dan bahan pilihan untuk menghadirkan kenyamanan dan keanggunan sejati.
          </p>
        </div>
      </section>

      {/* =========================================================================
          2. INTEGRATED SEARCHBAR & TRENDING KEYWORDS
          ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <ScrollReveal direction="up">
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-[#e8e3ea] shadow-xs">
            <SearchBar
              size="md"
              value={searchQuery}
              onChange={handleSearchChange}
              onSearch={handleSearchSubmit}
              onClear={handleClearSearch}
              placeholder="Cari busana, gaun, kemeja, atau aksesori Jovique..."
              showTrending={true}
              trendingKeywords={TRENDING_KEYWORDS}
              className="w-full"
            />
          </div>
        </ScrollReveal>

        {/* =========================================================================
            3. MOBILE FILTER: DI BAGIAN ATAS (lg:hidden)
            ========================================================================= */}
        <div className="lg:hidden mt-6 space-y-3 pb-3 border-b border-[#e8e3ea]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#311744]">
              Kategori Koleksi
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-mono text-[#1474ed] hover:underline cursor-pointer font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleCategorySelect("all")}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#311744] text-white shadow-xs font-semibold"
                  : "bg-white/90 border border-[#e8e3ea] text-[#5b4257] hover:border-[#311744]/40"
              }`}
            >
              Semua ({categoryCounts.all || 0})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const count = categoryCounts[cat.slug] || 0;
              return (
                <button
                  key={`mob-cat-${cat.id}`}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#311744] text-white shadow-xs font-semibold"
                      : "bg-white/90 border border-[#e8e3ea] text-[#5b4257] hover:border-[#311744]/40"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            4. TWO-COLUMN LAYOUT: DESKTOP LEFT SIDEBAR + PRODUCT GRID
            ========================================================================= */}
        <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row items-start gap-8">
          {/* ================= DESKTOP LEFT SIDEBAR ================= */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-24 space-y-6">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#e8e3ea] p-5 shadow-xs space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#ece7e1]">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-[#311744]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-serif text-base font-bold text-[#000200] tracking-wide">
                    Filter Koleksi
                  </h3>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] font-mono uppercase tracking-wider text-[#1474ed] hover:underline cursor-pointer font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Kategori Navigation List */}
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider font-mono text-[#8c827a] font-semibold mb-2">
                  Kategori Koleksi
                </p>

                {/* All Collections Option */}
                <button
                  type="button"
                  onClick={() => handleCategorySelect("all")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left ${
                    selectedCategory === "all"
                      ? "bg-[#311744] text-white font-semibold shadow-xs"
                      : "text-[#5b4257] hover:bg-[#f9f7f4] hover:text-[#000200]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedCategory === "all" ? "bg-[#1474ed]" : "bg-transparent"
                      }`}
                    />
                    Semua Koleksi
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                      selectedCategory === "all"
                        ? "bg-white/20 text-white"
                        : "bg-[#f2efe9] text-[#5b4257]"
                    }`}
                  >
                    {categoryCounts.all || 0}
                  </span>
                </button>

                {/* Individual Categories from DB */}
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  const count = categoryCounts[cat.slug] || 0;

                  return (
                    <button
                      key={`side-cat-${cat.id}`}
                      type="button"
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                          ? "bg-[#311744] text-white font-semibold shadow-xs"
                          : "text-[#5b4257] hover:bg-[#f9f7f4] hover:text-[#000200]"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate pr-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSelected ? "bg-[#1474ed]" : "bg-transparent"
                          }`}
                        />
                        <span className="truncate">{cat.name}</span>
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-mono shrink-0 ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#f2efe9] text-[#5b4257]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Urutan Cepat (Sort Options in Sidebar) */}
              <div className="pt-4 border-t border-[#ece7e1] space-y-2">
                <p className="text-[11px] uppercase tracking-wider font-mono text-[#8c827a] font-semibold">
                  Urutan Produk
                </p>
                <div className="space-y-1">
                  {SORT_OPTIONS.map((opt) => {
                    const isSortActive = selectedSort === opt.value;
                    return (
                      <button
                        key={`side-sort-${opt.value}`}
                        type="button"
                        onClick={() => {
                          setSelectedSort(opt.value);
                          updateUrlParams(searchQuery, selectedCategory, opt.value);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                          isSortActive
                            ? "text-[#311744] font-semibold bg-[#311744]/5"
                            : "text-[#5b4257] hover:bg-[#f9f7f4] hover:text-[#000200]"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSortActive
                              ? "border-[#311744] bg-[#311744]"
                              : "border-[#8c827a]/50 bg-white"
                          }`}
                        >
                          {isSortActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span className="text-[11px] truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Filter Aktif Info */}
              {hasActiveFilters && (
                <div className="pt-3 border-t border-[#ece7e1] text-xs text-[#5b4257]">
                  <p className="text-[11px] font-mono text-[#8c827a] mb-2 uppercase tracking-wider">
                    Filter Diterapkan
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {searchQuery.trim() && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1474ed]/10 text-[#1474ed] text-[10px] font-medium">
                        Q: {searchQuery.trim()}
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {selectedCategory !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#311744]/10 text-[#311744] text-[10px] font-medium">
                        {categories.find((c) => c.slug === selectedCategory)?.name}
                        <button
                          type="button"
                          onClick={() => handleCategorySelect("all")}
                          className="hover:text-red-600 font-bold ml-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ================= RIGHT MAIN PRODUCT CONTENT ================= */}
          <main className="flex-1 min-w-0 w-full">
            {/* Top Bar for Results & Sorting */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e8e3ea]">
              {/* Product Count & Active Filter Tags */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-[#5b4257]">
                <span>
                  Menampilkan{" "}
                  <strong className="text-[#000200] font-semibold">
                    {filteredProducts.length}
                  </strong>{" "}
                  dari {initialProducts.length} produk
                </span>

                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1474ed]/10 text-[#1474ed] font-medium text-[11px]">
                    Kata Kunci: &ldquo;{searchQuery.trim()}&rdquo;
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      aria-label="Hapus kata kunci"
                      className="hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#311744]/10 text-[#311744] font-medium text-[11px]">
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                    <button
                      type="button"
                      onClick={() => handleCategorySelect("all")}
                      aria-label="Hapus filter kategori"
                      className="hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>

              {/* Sort Selector Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <label
                  htmlFor="product-sort-select"
                  className="text-xs text-[#5b4257] font-medium shrink-0"
                >
                  Urutan:
                </label>
                <div className="relative">
                  <select
                    id="product-sort-select"
                    value={selectedSort}
                    onChange={handleSortChange}
                    className="appearance-none bg-white border border-[#e8e3ea] rounded-xl px-3 py-1.5 pr-7 text-xs font-medium text-[#000200] hover:border-[#311744]/40 focus:outline-none focus:border-[#311744] cursor-pointer shadow-2xs transition-colors"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5b4257]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid / Empty State */}
            <div className="mt-6">
              {filteredProducts.length > 0 ? (
                <ProductGrid
                  products={filteredProducts}
                  staggerReveal={true}
                  className="!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-3 xl:!grid-cols-4 gap-4 sm:gap-5"
                />
              ) : (
                <div className="py-20 px-4 text-center bg-white/80 rounded-2xl border border-[#e8e3ea] max-w-xl mx-auto shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-[#f5eff8] text-[#311744] flex items-center justify-center mx-auto mb-4 border border-[#311744]/10 text-2xl">
                    🔍
                  </div>
                  <h3 className="text-xl font-serif text-[#000200] tracking-tight mb-2">
                    Tidak Ada Koleksi yang Cocok
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5b4257] leading-relaxed mb-6 font-normal">
                    {searchQuery.trim() ? (
                      <>
                        Maaf, kami tidak menemukan koleksi Jovique yang cocok dengan kata kunci &ldquo;
                        <strong className="text-[#000200] font-semibold">
                          {searchQuery}
                        </strong>
                        &rdquo;. Coba rekomendasi kata kunci populer berikut atau tampilkan seluruh koleksi.
                      </>
                    ) : (
                      "Belum ada item untuk kategori ini. Silakan jelajahi pilihan koleksi Jovique lainnya."
                    )}
                  </p>

                  {/* Rekomendasi Kata Kunci Tren */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    {DEFAULT_TRENDING_KEYWORDS.slice(0, 5).map((kw, i) => (
                      <button
                        key={`empty-sugg-${i}`}
                        type="button"
                        onClick={() => handleSearchSubmit(kw)}
                        className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:border-[#1474ed] hover:text-[#1474ed] hover:bg-[#EFF6FF] transition-all duration-150 cursor-pointer"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleResetFilters}
                      className="rounded-xl px-6"
                    >
                      Tampilkan Semua Koleksi ({initialProducts.length})
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
