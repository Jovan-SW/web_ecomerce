import { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components";

export const metadata: Metadata = {
  title: "Masuk ke Akun | Jovique Official Store",
  description:
    "Masuk ke akun Jovique Anda untuk melanjutkan belanja, melacak pesanan, dan menikmati diskon eksklusif.",
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <Suspense
        fallback={
          <div className="w-full max-w-5xl h-[640px] rounded-3xl bg-white border border-[#E2E8F0] flex items-center justify-center animate-pulse">
            <div className="flex items-center gap-3 text-sm text-[#64748B]">
              <span className="w-3 h-3 rounded-full bg-[#1474ED] animate-ping" />
              <span>Memuat halaman autentikasi...</span>
            </div>
          </div>
        }
      >
        <AuthCard initialMode="login" />
      </Suspense>
    </main>
  );
}
