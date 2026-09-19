import { Metadata } from "next";
import { Suspense } from "react";
import { ProfileClient } from "@/components";

export const metadata: Metadata = {
  title: "Profil Akun Saya | Jovique Official Store",
  description:
    "Kelola data akun, lihat keranjang belanja, wishlist produk impian, dan riwayat produk yang sudah dibeli di Jovique.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#F8FAFC]">
      <Suspense
        fallback={
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-[#64748B]">
              <span className="w-3 h-3 rounded-full bg-[#1474ED] animate-ping" />
              <span>Memuat data profil akun...</span>
            </div>
          </div>
        }
      >
        <ProfileClient />
      </Suspense>
    </main>
  );
}
