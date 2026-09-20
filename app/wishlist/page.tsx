import { Metadata } from "next";
import { Suspense } from "react";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist Koleksi Saya | Jovique Official Store",
  description:
    "Lihat dan kelola koleksi busana serta aksesori Jovique favorit yang Anda simpan. Nikmati kemudahan berbelanja langsung dari toko resmi Jovique.",
};

export default function WishlistPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex items-center justify-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-sm text-[#64748B]">
            <span className="w-3 h-3 rounded-full bg-[#1474ed] animate-ping" />
            <span>Memuat Wishlist Jovique...</span>
          </div>
        </div>
      }
    >
      <WishlistClient />
    </Suspense>
  );
}
