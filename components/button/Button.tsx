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

    // 2. Variant Styles dengan Perpaduan Neon Glow & High-Contrast
    const variantStyles: Record<ButtonVariant, string> = {
      // Primary: Hitam pekat kontras tinggi -> Hover: Neon Cyan/Violet aura, micro-lift, border glow
      primary:
        "bg-[#08080A] text-white border border-[#222226] shadow-sm hover:border-[#00F5FF]/80 hover:bg-gradient-to-r hover:from-[#08080A] hover:via-[#161226] hover:to-[#08080A] hover:shadow-[0_0_24px_-2px_rgba(0,245,255,0.45),0_0_14px_-2px_rgba(157,0,255,0.35)] hover:-translate-y-0.5 focus-visible:ring-[#00F5FF]",

      // Secondary / Outline: Kontras putih tajam -> Hover: Dark sleek dengan neon cyan border & glow
      secondary:
        "bg-white text-[#08080A] border-2 border-[#141416] shadow-xs hover:border-[#00F5FF] hover:text-[#00F5FF] hover:bg-[#08080A] hover:shadow-[0_0_22px_-2px_rgba(0,245,255,0.4)] hover:-translate-y-0.5 focus-visible:ring-[#00F5FF]",

      outline:
        "bg-white text-[#08080A] border-2 border-[#141416] shadow-xs hover:border-[#00F5FF] hover:text-[#00F5FF] hover:bg-[#08080A] hover:shadow-[0_0_22px_-2px_rgba(0,245,255,0.4)] hover:-translate-y-0.5 focus-visible:ring-[#00F5FF]",

      // Ghost: Transparan bersih -> Hover: Holographic neon tint, border neon halus, micro-scale
      ghost:
        "bg-transparent text-[#08080A] border border-transparent hover:bg-gradient-to-r hover:from-cyan-500/10 hover:via-purple-500/10 hover:to-blue-500/10 hover:text-cyan-600 hover:border-cyan-400/30 hover:shadow-[0_0_16px_rgba(0,245,255,0.25)] hover:scale-105 active:scale-95 focus-visible:ring-cyan-400",

      // Destructive: Merah kontras -> Hover: Crimson laser neon glow, solid red fill
      destructive:
        "bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] shadow-xs hover:bg-[#FF0055] hover:text-white hover:border-[#FF0055] hover:shadow-[0_0_25px_rgba(255,0,85,0.55)] hover:-translate-y-0.5 focus-visible:ring-[#FF0055]",
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
