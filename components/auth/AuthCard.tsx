"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components";

export interface AuthCardProps {
  initialMode?: "login" | "register";
}

export default function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const urlError = searchParams.get("error");

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show / Hide Password state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

  // Tangani error dari redirect OAuth callback jika ada
  useEffect(() => {
    if (urlError === "oauth_failed") {
      setErrorMessage("Gagal masuk dengan Google. Silakan coba lagi.");
    }
  }, [urlError]);

  // Reset form status saat berpindah mode
  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // 1. Fitur Login/Register dengan Google OAuth
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const redirectUri = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        nextUrl
      )}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghubungkan ke akun Google.";
      setErrorMessage(msg);
      setIsGoogleLoading(false);
    }
  };

  // 2. Submit Form Email & Password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validasi Dasar
    if (!email || !password) {
      setErrorMessage("Silakan isi semua field yang diperlukan.");
      return;
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        setErrorMessage("Silakan masukkan nama lengkap kamu.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Kata sandi minimal harus 6 karakter.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi kata sandi tidak cocok.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        // Alur Login: hanya user yang sudah register yang bisa login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // Menampilkan pesan yang jelas jika user belum terdaftar atau salah password
          if (
            error.message.toLowerCase().includes("invalid login credentials") ||
            error.message.toLowerCase().includes("invalid credentials")
          ) {
            setErrorMessage(
              "Email atau kata sandi tidak cocok. Pastikan kamu sudah mendaftar terlebih dahulu."
            );
          } else if (error.message.toLowerCase().includes("email not confirmed")) {
            setErrorMessage(
              "Email kamu belum dikonfirmasi. Silakan periksa kotak masuk email untuk memverifikasi akun."
            );
          } else {
            setErrorMessage(error.message || "Gagal masuk ke akun.");
          }
          setIsLoading(false);
          return;
        }

        if (data?.session) {
          setSuccessMessage("Berhasil masuk! Mengalihkan ke halaman...");
          setTimeout(() => {
            router.push(nextUrl);
            router.refresh();
          }, 800);
        }
      } else {
        // Alur Register: membuat user baru di Supabase dengan id unik
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes("already registered")) {
            setErrorMessage(
              "Email ini sudah terdaftar. Silakan beralih ke tab 'Masuk' untuk login."
            );
          } else {
            setErrorMessage(error.message || "Pendaftaran gagal. Coba lagi.");
          }
          setIsLoading(false);
          return;
        }

        // Jika Supabase mengembalikan session (email confirmations disabled)
        if (data?.session) {
          setSuccessMessage(
            "Pendaftaran akun berhasil! Kamu langsung masuk, mengalihkan..."
          );
          setTimeout(() => {
            router.push(nextUrl);
            router.refresh();
          }, 1000);
        } else {
          // Jika Supabase membutuhkan konfirmasi email
          setSuccessMessage(
            "Pendaftaran berhasil! Tautan verifikasi telah dikirim ke email kamu. Silakan periksa kotak masuk/spam."
          );
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan pada sistem. Silakan coba lagi.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] border border-[#E2E8F0] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* ========================================================
            KOLOM KIRI (DESKTOP): BRAND EXPERIENCE & TRUST SHOWCASE
           ======================================================== */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#0B2545] via-[#0F172A] to-[#1474ED] text-white p-10 flex-col justify-between overflow-hidden">
          {/* Ambient Glow Circles */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#1474ED]/30 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#00F5FF]/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  J
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wider text-white">
                  JOVIQUE
                </span>
                <span className="text-[10px] tracking-widest text-[#93C5FD] uppercase">
                  Official Store
                </span>
              </div>
            </Link>

            <div className="mt-12 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1474ED]/20 text-[#60A5FA] border border-[#1474ED]/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
                {mode === "login" ? "Selamat Datang Kembali" : "Pendaftaran Member Eksklusif"}
              </span>
              <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
                {mode === "login"
                  ? "Akses Koleksi Busana & Privilese Eksklusif Jovique."
                  : "Bergabung dengan Jovique Circle & Nikmati Keistimewaan Eksklusif."}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {mode === "login"
                  ? "Masuk untuk melihat pesanan Anda, menyimpan wishlist favorit, dan menikmati layanan personal Jovique."
                  : "Daftar sekarang untuk mendapatkan voucher selamat datang, akses peluncuran koleksi perdana, dan bebas ongkir ke seluruh Indonesia."}
              </p>
            </div>
          </div>

          {/* Middle: Key Guarantees */}
          <div className="relative z-10 my-8 space-y-3.5">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-[#1474ED]/30 text-[#93C5FD] flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">100% Produk Original</p>
                <p className="text-slate-300 text-[11px]">
                  Koleksi autentik langsung dari rumah mode Jovique.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-[#1474ED]/30 text-[#93C5FD] flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Privasi & Transaksi Aman</p>
                <p className="text-slate-300 text-[11px]">
                  Terenkripsi end-to-end dengan Supabase Security.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Social Proof */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Dipercaya 50.000+ Pelanggan Setia</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <span>★ 4.9</span>
              <span className="text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            KOLOM KANAN: AUTH FORM (MASUK / DAFTAR)
           ======================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          {/* Mobile Logo Brand */}
          <div className="lg:hidden flex items-center justify-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1474ED] text-white flex items-center justify-center font-bold text-lg">
                J
              </div>
              <span className="font-bold text-xl tracking-wider text-[#0F172A]">
                JOVIQUE
              </span>
            </Link>
          </div>

          {/* Segmented Tab Switcher (Masuk / Daftar) */}
          <div className="w-full bg-[#F1F5F9] p-1.5 rounded-2xl flex items-center mb-8 border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#1474ED] shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Masuk ke Akun
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                mode === "register"
                  ? "bg-white text-[#1474ED] shadow-sm"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              {mode === "login" ? "Masuk ke Akun Kamu" : "Buat Akun Member Baru"}
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              {mode === "login"
                ? "Masukkan email dan kata sandi yang sudah terdaftar."
                : "Lengkapi formulir di bawah ini untuk memulai pengalaman bersama Jovique."}
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
              <svg
                className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">Berhasil!</p>
                <p className="mt-0.5 text-emerald-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
              <svg
                className="w-5 h-5 text-rose-600 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold">Perhatian</p>
                <p className="mt-0.5 text-rose-700">{errorMessage}</p>
                {mode === "login" &&
                  errorMessage.includes("belum terdaftar") && (
                    <button
                      type="button"
                      onClick={() => switchMode("register")}
                      className="mt-2 text-xs font-bold text-[#1474ED] underline hover:text-[#1D4ED8] cursor-pointer"
                    >
                      Daftar Akun Baru Sekarang →
                    </button>
                  )}
              </div>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field Nama Lengkap (Hanya saat Register) */}
            {mode === "register" && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Jovan Pratama"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1474ED] focus:ring-2 focus:ring-[#1474ED]/15 transition-all bg-white"
                  />
                </div>
              </div>
            )}

            {/* Field Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1474ED] focus:ring-2 focus:ring-[#1474ED]/15 transition-all bg-white"
                />
              </div>
            </div>

            {/* Field Kata Sandi (Dengan Tombol Show / Hide) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#0F172A]"
                >
                  Kata Sandi
                </label>
                {mode === "login" && (
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#1474ED] hover:text-[#1D4ED8] hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1474ED] focus:ring-2 focus:ring-[#1474ED]/15 transition-all bg-white"
                />
                {/* Tombol Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    // Eye Off SVG Icon
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    // Eye Open SVG Icon
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Field Konfirmasi Kata Sandi (Hanya saat Register) */}
            {mode === "register" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                >
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1474ED] focus:ring-2 focus:ring-[#1474ED]/15 transition-all bg-white"
                  />
                  {/* Tombol Show / Hide Confirm Password */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi kata sandi"
                        : "Tampilkan konfirmasi kata sandi"
                    }
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {password && confirmPassword && (
                  <p
                    className={`mt-1.5 text-[11px] font-medium flex items-center gap-1 ${
                      password === confirmPassword
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {password === confirmPassword ? (
                      <>
                        <span>✓</span> Kata sandi cocok
                      </>
                    ) : (
                      <>
                        <span>✕</span> Kata sandi belum sama
                      </>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Checkbox Ingat Saya (Saat Login) */}
            {mode === "login" && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="rememberMe"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#1474ED] focus:ring-[#1474ED]/30 cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-xs text-[#64748B] select-none cursor-pointer"
                >
                  Ingat sesi saya di perangkat ini
                </label>
              </div>
            )}

            {/* Tombol Aksi Utama */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
              >
                {mode === "login" ? "Masuk ke Akun" : "Daftar Sekarang"}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-[#E2E8F0] w-full" />
            <span className="bg-white px-4 text-xs uppercase tracking-wider text-[#94A3B8] absolute">
              atau lanjutkan dengan
            </span>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-12 px-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGoogleLoading ? (
              <svg
                className="animate-spin w-5 h-5 text-[#1474ED]"
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
            ) : (
              // Google Official Multi-color SVG Logo
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {isGoogleLoading
                ? "Menghubungkan ke Google..."
                : mode === "login"
                ? "Masuk dengan Akun Google"
                : "Daftar dengan Akun Google"}
            </span>
          </button>

          {/* Footer Switcher & Kebijakan */}
          <div className="mt-6 text-center text-xs text-[#64748B] space-y-3">
            <p>
              {mode === "login" ? (
                <>
                  Belum memiliki akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="font-semibold text-[#1474ED] hover:text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Daftar Akun Baru
                  </button>
                </>
              ) : (
                <>
                  Sudah memiliki akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-[#1474ED] hover:text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Masuk ke Akun
                  </button>
                </>
              )}
            </p>

            <p className="text-[11px] text-[#94A3B8] leading-relaxed pt-2">
              Dengan melanjutkan, kamu menyetujui{" "}
              <Link href="/terms" className="underline hover:text-[#64748B]">
                Syarat & Ketentuan
              </Link>{" "}
              serta{" "}
              <Link href="/privacy" className="underline hover:text-[#64748B]">
                Kebijakan Privasi
              </Link>{" "}
              Jovique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
