"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, ProductGrid, ScrollReveal } from "@/components";
import type { ProductWithDetails } from "@/types/database";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

/* ============================================================
   HELPERS
   ============================================================ */

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

/* ============================================================
   PROPS
   ============================================================ */

interface ProductDetailClientProps {
  product: ProductWithDetails;
  relatedProducts: ProductWithDetails[];
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { isWishlisted: checkIsWishlisted, toggleWishlist } = useWishlist();
  const { addToCart, user } = useCart();
  const isWishlisted = checkIsWishlisted(product.id);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // ── Photo Gallery State ──
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // ── Variant Selection State ──
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // ── UI State ──
  const [activeTab, setActiveTab] = useState<"deskripsi" | "material" | "fitur">("deskripsi");

  // ── Derived data from database ──
  const variants = useMemo(
    () => product.product_variants || [],
    [product.product_variants]
  );
  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"];

  // Unique colors from database variants
  const uniqueColors = useMemo(() => {
    const colorMap = new Map<string, { color_name: string; color_hex: string }>();
    variants.forEach((v) => {
      if (v.color_hex && v.color_name) {
        const key = v.color_hex.toLowerCase();
        if (!colorMap.has(key)) {
          colorMap.set(key, { color_name: v.color_name, color_hex: v.color_hex });
        }
      }
    });
    return Array.from(colorMap.values());
  }, [variants]);

  // Initial color: pick first available color from database (no useEffect needed)
  const [selectedColor, setSelectedColor] = useState<string | null>(() => {
    const pvs = product.product_variants || [];
    const first = pvs.find((v) => v.color_hex && v.color_name);
    return first ? first.color_hex.toLowerCase() : null;
  });

  // Available sizes based on selected color (filter from database)
  const availableSizes = useMemo(() => {
    if (!selectedColor) return [];
    const sizes = variants
      .filter((v) => v.color_hex?.toLowerCase() === selectedColor)
      .map((v) => ({
        size: v.size,
        stock: v.stock,
        sku: v.sku,
        id: v.id,
      }));
    // Deduplicate and sort
    const sizeMap = new Map<string, typeof sizes[0]>();
    sizes.forEach((s) => {
      if (!sizeMap.has(s.size)) sizeMap.set(s.size, s);
    });
    return Array.from(sizeMap.values());
  }, [variants, selectedColor]);

  // Currently selected variant from database
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return variants.find(
      (v) =>
        v.color_hex?.toLowerCase() === selectedColor &&
        v.size === selectedSize
    ) || null;
  }, [variants, selectedColor, selectedSize]);

  // Total stock for the entire product
  const totalStock = useMemo(() => {
    return variants.reduce((acc, v) => acc + (v.stock || 0), 0);
  }, [variants]);

  // Discount calculation from database fields
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  // Stock status helpers
  const currentStock = selectedVariant?.stock ?? null;
  const isOutOfStock = currentStock !== null && currentStock === 0;
  const isLowStock = currentStock !== null && currentStock > 0 && currentStock <= 5;
  const canAddToCart = selectedColor && selectedSize && !isOutOfStock && quantity > 0;

  // ── Handlers ──
  const handleColorSelect = useCallback((hex: string) => {
    setSelectedColor(hex.toLowerCase());
    setSelectedSize(null);
    setQuantity(1);
  }, []);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  }, []);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (currentStock !== null && next > currentStock) return currentStock;
      return next;
    });
  }, [currentStock]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  // Selected color name for display
  const selectedColorName = useMemo(() => {
    if (!selectedColor) return null;
    return uniqueColors.find((c) => c.color_hex.toLowerCase() === selectedColor)?.color_name || null;
  }, [selectedColor, uniqueColors]);

  // Handler Tambah ke Keranjang
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) return;
    try {
      setIsAddingToCart(true);
      await addToCart(
        product,
        selectedSize,
        selectedColorName || selectedColor,
        quantity
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handler Beli Langsung (langsung menuju simulasi pembayaran di /checkout)
  const handleBuyNow = async () => {
    if (!selectedSize || !selectedColor) return;
    const checkoutUrl = `/checkout?buyNow=true&productId=${product.id}&size=${encodeURIComponent(
      selectedSize
    )}&color=${encodeURIComponent(selectedColorName || selectedColor)}&qty=${quantity}`;

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }

    try {
      setIsBuyingNow(true);
      router.push(checkoutUrl);
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-canvas ambient-glow-mesh pb-20">
      {/* ================================================================
          1. BREADCRUMB
          ================================================================ */}
      <section className="pt-6 sm:pt-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs font-mono text-[#5b4257] flex-wrap">
            <li>
              <Link href="/" className="hover:text-[#311744] hover:underline transition-colors">
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-[#311744] hover:underline transition-colors">
                Koleksi Produk
              </Link>
            </li>
            {product.category && (
              <>
                <li>/</li>
                <li>
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="hover:text-[#311744] hover:underline transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-[#311744] font-semibold truncate max-w-[200px]" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
      </section>

      {/* ================================================================
          2. MAIN PRODUCT LAYOUT (Gallery Left + Info Right)
          ================================================================ */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-6 sm:mt-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          {/* ════════════════ LEFT: PHOTO GALLERY ════════════════ */}
          <div className="w-full lg:w-[55%] xl:w-[58%]">
            <ScrollReveal direction="left">
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                {/* Thumbnail Strip */}
                <div className="flex sm:flex-col gap-2 sm:gap-3 sm:w-20 overflow-x-auto sm:overflow-y-auto sm:max-h-[640px] scrollbar-none pb-1 sm:pb-0">
                  {images.map((img, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`shrink-0 w-16 h-20 sm:w-full sm:h-24 relative rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-[#311744] shadow-md"
                          : "border-transparent hover:border-[#e8e3ea] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} foto ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div
                  className="flex-1 relative aspect-[3/4] bg-[#F2EFE9] rounded-xl overflow-hidden cursor-crosshair"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <Image
                    src={images[activeImageIndex]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                    className={`object-cover object-center transition-transform duration-500 ease-out ${
                      isZoomed ? "scale-150" : "scale-100"
                    }`}
                    style={
                      isZoomed
                        ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                        : undefined
                    }
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.is_new_release && (
                      <span className="px-3 py-1 bg-[#311744] text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                        New Arrival
                      </span>
                    )}
                    {hasDiscount && discountPercentage > 0 && (
                      <span className="px-3 py-1 bg-[#1474ed] text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Floating Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id, product)}
                    aria-label={
                      isWishlisted ? "Hapus dari wishlist" : "Simpan ke wishlist"
                    }
                    className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                      isWishlisted
                        ? "bg-[#e11d48] text-white border border-[#e11d48] shadow-[0_4px_16px_rgba(225,29,72,0.4)] scale-105"
                        : "bg-white/95 backdrop-blur-md text-[#0F172A] border border-[#E2E8F0] hover:bg-white hover:text-[#e11d48] hover:border-[#e11d48]/50 hover:scale-105"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isWishlisted ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isWishlisted ? "scale-110 text-white" : ""
                      }`}
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-mono">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ════════════════ RIGHT: PRODUCT INFORMATION ════════════════ */}
          <div className="w-full lg:w-[45%] xl:w-[42%] lg:sticky lg:top-24 lg:self-start">
            <ScrollReveal direction="right">
              <div className="space-y-6">
                {/* Category & Fit Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  {product.category && (
                    <Link
                      href={`/products?category=${product.category.slug}`}
                      className="text-[11px] uppercase tracking-widest font-mono text-[#5b4257] hover:text-[#311744] transition-colors font-semibold"
                    >
                      {product.category.name}
                    </Link>
                  )}
                  {product.category && product.fit_type && (
                    <span className="text-[#e8e3ea]">•</span>
                  )}
                  {product.fit_type && (
                    <span className="text-[11px] uppercase tracking-widest font-mono text-[#1474ed] font-semibold">
                      {product.fit_type}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#000200] tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Tagline */}
                {product.tagline && (
                  <p className="text-sm text-[#5b4257] leading-relaxed -mt-2">
                    {product.tagline}
                  </p>
                )}

                {/* Rating & Reviews */}
                {(product.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={`star-${i}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill={i < Math.round(product.rating ?? 0) ? "#311744" : "#e8e3ea"}
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#000200]">
                      {(product.rating ?? 0).toFixed(1)}
                    </span>
                    <span className="text-xs text-[#5b4257]">
                      ({product.reviews_count} ulasan)
                    </span>
                  </div>
                )}

                {/* Price Block */}
                <div className="flex items-end gap-3 pt-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#000200] tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-[#8c827a] line-through font-normal">
                        {formatPrice(product.compare_at_price!)}
                      </span>
                      <span className="text-xs font-bold text-white bg-[#1474ed] px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Hemat {formatPrice(product.compare_at_price! - product.price)}
                      </span>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-[#e8e3ea]" />

                {/* ── Color Selector ── */}
                {uniqueColors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#000200]">
                        Warna
                      </span>
                      {selectedColorName && (
                        <span className="text-xs text-[#5b4257] capitalize">
                          {selectedColorName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {uniqueColors.map((color) => {
                        const isActive = selectedColor === color.color_hex.toLowerCase();
                        return (
                          <button
                            key={color.color_hex}
                            type="button"
                            onClick={() => handleColorSelect(color.color_hex)}
                            title={color.color_name}
                            className={`w-9 h-9 rounded-full border-2 transition-all duration-200 cursor-pointer flex items-center justify-center ${
                              isActive
                                ? "border-[#311744] scale-110 shadow-md"
                                : "border-[#e8e3ea] hover:border-[#5b4257] hover:scale-105"
                            }`}
                          >
                            <span
                              className="w-6 h-6 rounded-full border border-black/10"
                              style={{ backgroundColor: color.color_hex }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Size Selector ── */}
                {availableSizes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#000200]">
                        Ukuran
                      </span>
                      {selectedSize && selectedVariant && (
                        <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                          selectedVariant.stock === 0
                            ? "bg-red-50 text-red-600"
                            : selectedVariant.stock <= 5
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}>
                          Stok: {selectedVariant.stock}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((sizeItem) => {
                        const isActive = selectedSize === sizeItem.size;
                        const outOfStock = sizeItem.stock === 0;
                        return (
                          <button
                            key={sizeItem.id}
                            type="button"
                            onClick={() => !outOfStock && handleSizeSelect(sizeItem.size)}
                            disabled={outOfStock}
                            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                              outOfStock
                                ? "border-[#e8e3ea] text-[#ccc] bg-[#faf9f7] cursor-not-allowed line-through"
                                : isActive
                                  ? "border-[#311744] bg-[#311744] text-white shadow-sm cursor-pointer"
                                  : "border-[#e8e3ea] text-[#000200] bg-white hover:border-[#311744] cursor-pointer"
                            }`}
                          >
                            {sizeItem.size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── SKU display ── */}
                {selectedVariant && (
                  <p className="text-[11px] font-mono text-[#8c827a]">
                    SKU: {selectedVariant.sku}
                  </p>
                )}

                {/* ── Quantity Selector ── */}
                {selectedVariant && !isOutOfStock && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#000200]">
                      Jumlah
                    </span>
                    <div className="flex items-center gap-0.5 bg-white border border-[#e8e3ea] rounded-lg w-fit overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-[#5b4257] hover:bg-[#f9f7f4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer text-lg"
                      >
                        −
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center text-sm font-bold text-[#000200] font-mono border-x border-[#e8e3ea]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={currentStock !== null && quantity >= currentStock}
                        className="w-10 h-10 flex items-center justify-center text-[#5b4257] hover:bg-[#f9f7f4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Stock Warning ── */}
                {isOutOfStock && selectedSize && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    Maaf, ukuran {selectedSize} untuk warna {selectedColorName} sedang habis.
                  </div>
                )}
                {isLowStock && selectedSize && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    Sisa {currentStock} unit — segera checkout sebelum kehabisan!
                  </div>
                )}

                {/* ── Action Buttons ── */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!canAddToCart || isAddingToCart}
                    onClick={handleAddToCart}
                    leftIcon={
                      isAddingToCart ? (
                        <span className="inline-block animate-spin mr-1">↻</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3h13.07a.75.75 0 0 1 .733.917l-1.72 8.031a1.75 1.75 0 0 1-1.712 1.385H6.563a1.75 1.75 0 0 1-1.714-1.404l-1.91-10.236A.25.25 0 0 0 2.693 1.5H1.75A.75.75 0 0 1 1 .75ZM6 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                        </svg>
                      )
                    }
                    className="rounded-xl"
                  >
                    {isAddingToCart ? "Menambahkan..." : "Tambah ke Keranjang"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    disabled={!canAddToCart || isBuyingNow}
                    onClick={handleBuyNow}
                    className="rounded-xl"
                  >
                    {isBuyingNow ? "Memproses..." : "Beli Langsung"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id, product)}
                    aria-label={
                      isWishlisted ? "Hapus dari wishlist" : "Simpan ke wishlist"
                    }
                    className={`h-12 sm:h-13 px-5 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shrink-0 ${
                      isWishlisted
                        ? "bg-[#e11d48] text-white border-[#e11d48] shadow-[0_4px_16px_rgba(225,29,72,0.35)]"
                        : "bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#e11d48]/50 hover:text-[#e11d48] hover:bg-[#fff1f2]"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isWishlisted ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {isWishlisted ? "Tersimpan" : "Wishlist"}
                    </span>
                  </button>
                </div>

                {/* Guidance if no selection */}
                {(!selectedColor || !selectedSize) && (
                  <p className="text-[11px] text-center text-[#8c827a] font-mono">
                    {!selectedColor ? "Pilih varian warna terlebih dahulu" : "Pilih ukuran untuk melanjutkan pembelian"}
                  </p>
                )}

                {/* ── Jovique Brand Trust & Assurance Badges ── */}
                <div className="p-4 bg-white/80 rounded-xl border border-[#e8e3ea] space-y-2.5 text-xs text-[#5b4257]">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-[#000200]">Jaminan 100% Produk Asli & Eksklusif Langsung dari Jovique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1474ed] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75l-4.5 4.5m4.5-4.5h4.5" />
                    </svg>
                    <span>Bebas Ongkir & Pengiriman Aman ke Seluruh Indonesia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#311744] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>Garansi 7 Hari Penukaran & Pengembalian Mudah</span>
                  </div>
                </div>

                {/* ── Total Stock Overview ── */}
                <div className="flex items-center gap-4 text-xs text-[#5b4257] pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${totalStock > 10 ? "bg-emerald-500" : totalStock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
                    Total stok: <strong className="text-[#000200]">{totalStock}</strong> unit
                  </span>
                  <span>•</span>
                  <span>{product.gender === "unisex" ? "Unisex" : product.gender === "men" ? "Pria" : "Wanita"}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. DETAIL TABS — Deskripsi, Material & Perawatan, Fitur
          ================================================================ */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 sm:mt-16">
        <ScrollReveal direction="up">
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#e8e3ea] shadow-xs overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-[#e8e3ea] overflow-x-auto scrollbar-none">
              {([
                { key: "deskripsi" as const, label: "Deskripsi Produk" },
                { key: "material" as const, label: "Spesifikasi & Bahan" },
                { key: "fitur" as const, label: "Fitur & Keunggulan" },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 ${
                    activeTab === tab.key
                      ? "border-[#311744] text-[#311744] bg-[#f5eff8]/50"
                      : "border-transparent text-[#5b4257] hover:text-[#000200] hover:bg-[#f9f7f4]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Tab: Deskripsi */}
              {activeTab === "deskripsi" && (
                <div className="max-w-3xl space-y-4">
                  <p className="text-sm sm:text-base text-[#000200] leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Tab: Material & Perawatan */}
              {activeTab === "material" && (
                <div className="max-w-3xl space-y-6">
                  {product.materials && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#311744]">
                        Material & Bahan
                      </h3>
                      <p className="text-sm text-[#000200] leading-relaxed">
                        {product.materials}
                      </p>
                    </div>
                  )}
                  {product.care_instructions && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#311744]">
                        Instruksi Perawatan
                      </h3>
                      <p className="text-sm text-[#000200] leading-relaxed whitespace-pre-line">
                        {product.care_instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Fitur Unggulan */}
              {activeTab === "fitur" && (
                <div className="max-w-3xl">
                  {product.features && product.features.length > 0 ? (
                    <ul className="space-y-3">
                      {product.features.map((feature, idx) => (
                        <li key={`feat-${idx}`} className="flex items-start gap-3 text-sm text-[#000200]">
                          <span className="w-5 h-5 shrink-0 rounded-full bg-[#311744] flex items-center justify-center mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#5b4257]">
                      Informasi fitur belum tersedia untuk produk ini.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ================================================================
          4. RELATED PRODUCTS
          ================================================================ */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-20">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-mono text-[#5b4257] font-semibold mb-1">
                  Rekomendasi Jovique
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#000200] tracking-tight">
                  Pilihan Serupa dari Jovique
                </h2>
              </div>
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-xs font-semibold text-[#1474ed] hover:underline transition-colors uppercase tracking-wider"
                >
                  Lihat Semua →
                </Link>
              )}
            </div>
            <ProductGrid
              products={relatedProducts}
              staggerReveal={true}
              className="!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-4 sm:gap-5"
            />
          </ScrollReveal>
        </section>
      )}
    </div>
  );
}
