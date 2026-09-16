"use client";

import React, { useEffect, useRef, useState } from "react";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // milidetik, e.g. 100, 200
  direction?: "up" | "fade" | "scale" | "left" | "right";
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0,
  once = true,
}: ScrollRevealProps) {
  // Default isVisible = true agar SSR, crawling, & initial paint selalu tampak utuh
  const [isVisible, setIsVisible] = useState(true);
  const [isJsFallbackActive, setIsJsFallbackActive] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Jika browser mendukung CSS scroll-driven animations secara native, serahkan pada CSS (lebih hemat daya & GPU)
    if (
      typeof CSS !== "undefined" &&
      CSS.supports &&
      CSS.supports("(animation-timeline: view()) and (animation-range: entry)")
    ) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    // 2. Hormati user jika mengaktifkan reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // 3. Jika elemen sudah berada dalam viewport saat ini, biarkan tetap terlihat
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      return;
    }

    // 4. Jika berada di bawah viewport dan browser belum mendukung scroll-driven CSS, aktifkan IntersectionObserver fallback
    setIsVisible(false);
    setIsJsFallbackActive(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px 80px 0px", // Memicu 80px sebelum elemen mencapai batas bawah
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Pilih class native scroll-driven reveal
  const getDirectionClass = () => {
    switch (direction) {
      case "scale":
        return "reveal-scroll-scale";
      case "left":
        return "reveal-scroll-left";
      case "right":
        return "reveal-scroll-right";
      case "fade":
        return "";
      case "up":
      default:
        return "reveal-scroll-up";
    }
  };

  // Transform fallback untuk browser tanpa native scroll-driven animations
  const getFallbackTransform = () => {
    if (!isJsFallbackActive || isVisible) return "none";
    switch (direction) {
      case "scale":
        return "scale(0.96) translateY(20px)";
      case "left":
        return "translateX(-28px)";
      case "right":
        return "translateX(28px)";
      case "up":
      default:
        return "translateY(28px)";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: delay > 0 ? `${delay}ms` : undefined,
        transform: getFallbackTransform(),
        opacity: isJsFallbackActive && !isVisible ? 0 : 1,
      }}
      className={`${getDirectionClass()} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity] ${className}`}
    >
      {children}
    </div>
  );
}

