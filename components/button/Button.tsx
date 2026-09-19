"use client";

import React, { forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Micro Spinner bergaya neon cyber-luxury
 */
function ButtonSpinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Button: Komponen tombol modern luxury e-commerce dengan sentuhan neon glow & micro-animations.
 *
 * 1. primary: Latar hitam pekat, aura neon cyan-purple, micro-lift, dan garis laser neon aktif saat hover.
 * 2. secondary / outline: Kontras tinggi, saat hover bertransformasi ke dark sleek dengan neon cyan rim.
 * 3. ghost: Clean tanpa batas, hover holographic neon wash dengan micro-scale.
 * 4. destructive: Latar merah kontras dengan laser crimson neon glow.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    // 1. Base Styles (Presisi Modern Luxury Fashion, Smooth Micro-Interactions)
    const baseStyles =
      "group relative inline-flex items-center justify-center font-medium tracking-wide uppercase overflow-hidden select-none cursor-pointer transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]";

    // 2. Variant Styles dengan Perpaduan Blue & White Modern E-Commerce
    const variantStyles: Record<ButtonVariant, string> = {
      // Primary: Biru Elektrik -> Hover: Deep Royal Blue, micro-lift, blue glow
      primary:
        "bg-[#1474ed] text-white border border-[#1474ed] shadow-sm hover:bg-[#1d4ed8] hover:border-[#1d4ed8] hover:shadow-[0_6px_24px_-2px_rgba(20,116,237,0.4)] hover:-translate-y-0.5 focus-visible:ring-[#1474ed]",

      // Secondary: Putih bersih dengan aksen biru -> Hover: Soft blue fill & deep blue border
      secondary:
        "bg-white text-[#1474ed] border-2 border-[#1474ed] shadow-xs hover:bg-[#eff6ff] hover:text-[#1d4ed8] hover:border-[#1d4ed8] hover:shadow-[0_4px_18px_-2px_rgba(20,116,237,0.25)] hover:-translate-y-0.5 focus-visible:ring-[#1474ed]",

      // Outline: Putih dengan border slate halus -> Hover: Blue border & text
      outline:
        "bg-white text-[#0f172a] border border-[#e2e8f0] shadow-xs hover:border-[#1474ed] hover:text-[#1474ed] hover:bg-[#eff6ff] hover:-translate-y-0.5 focus-visible:ring-[#1474ed]",

      // Ghost: Transparan bersih -> Hover: Soft blue wash
      ghost:
        "bg-transparent text-[#0f172a] border border-transparent hover:bg-[#eff6ff] hover:text-[#1474ed] hover:scale-105 active:scale-95 focus-visible:ring-[#1474ed]",

      // Destructive: Merah kontras -> Hover: Crimson solid fill
      destructive:
        "bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] shadow-xs hover:bg-[#e11d48] hover:text-white hover:border-[#e11d48] hover:shadow-[0_4px_16px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 focus-visible:ring-[#e11d48]",
    };

    // 3. Size Styles
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-[11px] gap-1.5",
      md: "h-11 px-5 text-xs gap-2",
      lg: "h-13 px-7 text-[13px] gap-2.5",
      icon: "h-10 w-10 p-0 text-sm",
    };

    const isButtonDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isButtonDisabled}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {/* ========================================================
            MICRO-ANIMATION: REFLECTIVE LIGHT SHEEN SWEEP ON HOVER
           ======================================================== */}
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* ========================================================
            NEON ACCENT LINE (Garis laser neon di sisi bawah)
           ======================================================== */}
        {variant === "primary" && (
          <span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00F5FF] via-[#9D00FF] to-[#1474ed] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            aria-hidden="true"
          />
        )}
        {variant === "destructive" && (
          <span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF0055] via-amber-400 to-[#FF0055] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* ========================================================
            BUTTON CONTENT & ICONS
           ======================================================== */}
        {/* Loading Spinner */}
        {isLoading && (
          <ButtonSpinner
            className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"}
          />
        )}

        {/* Left Icon (jika tidak sedang loading) */}
        {!isLoading && leftIcon && (
          <span className="relative z-10 inline-flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
            {leftIcon}
          </span>
        )}

        {/* Button Text */}
        {children && (
          <span className="relative z-10 transition-colors duration-200">
            {children}
          </span>
        )}

        {/* Right Icon */}
        {!isLoading && rightIcon && (
          <span className="relative z-10 inline-flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
