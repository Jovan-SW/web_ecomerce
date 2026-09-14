"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  showTrending?: boolean;
  trendingKeywords?: string[];
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  autoFocus?: boolean;
}

const DEFAULT_TRENDING = [
  "Heavyweight Boxy Tee",
  "Vintage Washed",
  "Textured Knit Polo",
  "Oversized Fit",
  "Linen Shirt",
];

/**
 * SearchBar: Komponen pencarian produk, tren busana, dan merk berestetika luxury fashion.
 * - Background putih bersih (bg-white)
 * - Logo search hitam pekat kontras tinggi
 * - Shortcut keyboard ⌘K / Ctrl+K
 * - Tombol clear cepat (✕)
 * - Dukungan trending search pills & micro-animations
 */
const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onChange,
      onSearch,
      onClear,
      placeholder = "Cari produk, tren gaya, atau merk busana...",
      showTrending = true,
      trendingKeywords = DEFAULT_TRENDING,
      isLoading = false,
      size = "md",
      className = "",
      autoFocus = false,
    },
    forwardedRef
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const isControlled = controlledValue !== undefined;
    const query = isControlled ? controlledValue : internalValue;

    // Sinkronisasi ref lokal dan forwardRef
    const setRefs = (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    };

    // Shortcut keyboard global: Tekan ⌘K (Mac) atau Ctrl+K (Windows) untuk langsung fokus ke SearchBar
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          inputRef.current?.focus();
        }
        if (e.key === "Escape" && isFocused) {
          inputRef.current?.blur();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFocused]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      if (!isControlled) {
        setInternalValue(newVal);
      }
      if (onChange) {
        onChange(newVal);
      }
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      if (onChange) {
        onChange("");
      }
      if (onClear) {
        onClear();
      }
      inputRef.current?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(query.trim());
      }
    };

    const handleTrendingClick = (keyword: string) => {
      if (!isControlled) {
        setInternalValue(keyword);
      }
      if (onChange) {
        onChange(keyword);
      }
      if (onSearch) {
        onSearch(keyword);
      }
      inputRef.current?.focus();
    };

    // Sizing Styles
    const sizeStyles = {
      sm: {
        container: "h-10 px-3.5",
        input: "text-xs",
        icon: "w-4 h-4",
      },
      md: {
        container: "h-12 px-4 sm:px-5",
        input: "text-sm",
        icon: "w-4.5 h-4.5",
      },
      lg: {
        container: "h-14 px-5 sm:px-6",
        input: "text-base",
        icon: "w-5 h-5",
      },
    };

    const currentSize = sizeStyles[size];

    return (
      <div className={`w-full flex flex-col gap-2.5 ${className}`}>
        {/* Form Box Input Utama */}
        <form
          onSubmit={handleSubmit}
          className={`
            group relative flex items-center bg-white border transition-all duration-300 ease-out
            ${currentSize.container}
            ${
              isFocused
                ? "border-[#000200] shadow-[0_4px_24px_-4px_rgba(0,2,0,0.12)] -translate-y-0.5"
                : "border-[#ECE7E1] hover:border-[#000200]/60 hover:shadow-xs"
            }
          `}
        >
          {/* ========================================================
              LOGO SEARCH HITAM PEKAT (High-Contrast Black Logo)
             ======================================================== */}
          <button
            type="submit"
            aria-label="Lakukan pencarian"
            className="shrink-0 text-[#000200] hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={currentSize.icon}
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* ========================================================
              TEXT INPUT
             ======================================================== */}
          <input
            ref={setRefs}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck="false"
            className={`
              w-full bg-transparent text-[#000200] placeholder-[#8C827A] font-normal tracking-wide
              focus:outline-none
              ${currentSize.input}
            `}
          />

          {/* ========================================================
              AKSI KANAN: LOADING SPINNER / CLEAR BUTTON / HOTKEY BADGE
             ======================================================== */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {/* Loading Spinner */}
            {isLoading && (
              <svg
                className="animate-spin w-4 h-4 text-[#000200]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
            )}

            {/* Clear Button (✕) saat ada teks */}
            {!isLoading && query && query.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Hapus kata kunci pencarian"
                className="w-5 h-5 flex items-center justify-center text-[#8C827A] hover:text-[#000200] hover:bg-[#F2EFE9] transition-all duration-150 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            )}

            {/* Shortcut Keyboard Badge (⌘K / Ctrl+K) */}
            {(!query || query.length === 0) && (
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-[#ECE7E1] bg-[#F9F7F4] text-[10px] font-mono text-[#8C827A] tracking-wider select-none">
                ⌘K
              </span>
            )}
          </div>
        </form>

        {/* ========================================================
            TRENDING SEARCH PILLS (Tren, Produk & Merk Terpopuler)
           ======================================================== */}
        {showTrending && trendingKeywords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5 px-0.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C827A] shrink-0 mr-1 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3 text-[#000200]"
              >
                <path
                  fillRule="evenodd"
                  d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.2-.026.4-.045.606-.057a6.002 6.002 0 0 0 9.07 7.025 5.502 5.502 0 0 0-1.07-8.705Zm-4.992 5.06a3.5 3.5 0 0 1 4.985 4.985 4.5 4.5 0 0 1-4.985-4.985Z"
                  clipRule="evenodd"
                />
              </svg>
              Tren:
            </span>
            {trendingKeywords.map((keyword, index) => (
              <button
                key={`trending-${index}`}
                type="button"
                onClick={() => handleTrendingClick(keyword)}
                className="text-[11px] text-[#5b4257] bg-white border border-[#ECE7E1] px-2.5 py-1 hover:border-[#000200] hover:text-[#000200] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 tracking-normal"
              >
                {keyword}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
