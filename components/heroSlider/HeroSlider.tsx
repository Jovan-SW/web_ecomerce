"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components";
import { getActiveBanners } from "@/services";
import type { Banner } from "@/types/database";

export interface HeroSliderProps {
  initialBanners?: Banner[];
  autoPlayInterval?: number; // default 5500 ms
  className?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

// Fallback high-editorial fashion banners jika database Supabase belum terisi data banner
const FALLBACK_BANNERS: Banner[] = [
  {
    id: "fallback-1",
    title: "The Autumn / Winter Atelier Collection",
    subtitle: "Siluet kontemporer dengan potongan presisi, kain wol premium, dan pakaian rajut vintage pilihan.",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fallback-2",
    title: "Heavyweight Boxy & Minimalist Silhouettes",
    subtitle: "Didesain untuk ketahanan gaya lintas era. Eksplorasi koleksi katun 280 GSM dengan fit oversized otentik.",
    image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "fallback-3",
    title: "Bespoke Outerwear & Tailored Trousers",
    subtitle: "Kemewahan subtle yang menyatu dalam detail jahitan tangan dan tekstur kain drape yang berkarakter.",
    image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
    sort_order: 3,
    is_active: true,
  },
];

export default function HeroSlider({
  initialBanners,
  autoPlayInterval = 5500,
  className = "",
  ctaText = "Jelajahi Koleksi",
  ctaHref = "/products",
  secondaryCtaText = "Lihat Lookbook",
  secondaryCtaHref = "/categories/jackets-outerwear",
}: HeroSliderProps) {
  const [fetchedBanners, setFetchedBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Gunakan data props jika ada, atau data Supabase yang di-fetch, atau fallback
  const banners =
    initialBanners && initialBanners.length > 0
      ? initialBanners
      : fetchedBanners.length > 0
      ? fetchedBanners
      : FALLBACK_BANNERS;

  // Touch gesture state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Ambil data banner dari Supabase hanya bila belum di-inject via props
  useEffect(() => {
    if (initialBanners && initialBanners.length > 0) return;

    let isMounted = true;
    async function fetchBanners() {
      try {
        const data = await getActiveBanners();
        if (isMounted && data && data.length > 0) {
          setFetchedBanners(data);
        }
      } catch (err) {
        console.warn("Gagal memuat banner dari Supabase:", err);
      }
    }

    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, [initialBanners]);

  // Handler pergantian slide
  const handleNext = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Timer Auto Play Otomatis
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, banners.length, autoPlayInterval, handleNext]);

  // Touch Swipe Support (Mobile friendly)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Geser ke kiri -> Next slide
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Geser ke kanan -> Prev slide
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const activeBanner = banners[currentIndex] || FALLBACK_BANNERS[0];

  return (
    <section
      className={`relative w-full h-[540px] sm:h-[640px] lg:h-[740px] bg-[#07050A] text-white overflow-hidden select-none focus:outline-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Hero Banner Slider Jovique Atelier"
    >
      {/* =========================================================================
          SLIDE IMAGES & SMOOTH TRANSITION OVERLAYS
          ========================================================================= */}
      {banners.map((banner, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={banner.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Image: Full Landscape dengan zoom out halus agar seluruh gambar tampil lebih utuh */}
            <div className="absolute -inset-3 sm:-inset-6 overflow-hidden">
              <div
                className={`relative w-full h-full transform transition-transform duration-[6000ms] ease-out ${
                  isActive ? "scale-95" : "scale-100"
                }`}
              >
                <Image
                  src={banner.image_url}
                  alt={banner.title || `Hero banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-[center_25%] transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              </div>
            </div>

            {/* Gradient Overlay Mewah: Dark Vignette & High Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060408] via-[#060408]/40 to-black/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060408]/80 via-[#060408]/30 to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* =========================================================================
          HERO TEXT & CALL TO ACTION (ANIMATED SMOOTH REVEAL)
          ========================================================================= */}
      <div className="relative z-20 h-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.15] drop-shadow-md">
            {activeBanner.title || "Kemewahan Gaya Kontemporer"}
          </h1>

          {/* Subtitle */}
          {activeBanner.subtitle && (
            <p className="text-xs sm:text-base text-[#D4CDD8] max-w-xl leading-relaxed drop-shadow-sm font-light">
              {activeBanner.subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href={ctaHref}>
              <Button variant="primary" size="lg" className="shadow-lg hover:shadow-[0_0_25px_rgba(20,116,237,0.35)]">
                {ctaText} →
              </Button>
            </Link>

            {secondaryCtaText && (
              <Link href={secondaryCtaHref}>
                <Button
                  variant="outline"
                  size="lg"
                  className="!bg-white !text-[#08080A] border-2 border-white hover:!bg-[#08080A] hover:!text-white hover:border-[#08080A] transition-all duration-300 shadow-md font-semibold tracking-wide"
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTROLS: PREV & NEXT NAVIGATION ARROWS
          ========================================================================= */}
      {banners.length > 1 && (
        <>
          {/* Tombol Prev */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Slide sebelumnya"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/30 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/50 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 focus:outline-none"
          >
            <svg className="w-5 h-5 -translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Tombol Next */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Slide berikutnya"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/30 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/50 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 focus:outline-none"
          >
            <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* =========================================================================
          PAGINATION: LUXURY PROGRESS INDICATORS & BAR
          ========================================================================= */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 lg:right-16 z-30 flex items-center gap-2">
          {banners.map((_, dotIndex) => {
            const isCurrent = dotIndex === currentIndex;
            return (
              <button
                key={dotIndex}
                type="button"
                onClick={() => goToSlide(dotIndex)}
                aria-label={`Buka slide ${dotIndex + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 focus:outline-none ${
                  isCurrent
                    ? "w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
