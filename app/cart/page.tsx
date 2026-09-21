import React, { Suspense } from "react";
import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Keranjang Belanja | Jovique Official Store",
  description:
    "Periksa dan kelola item pilihan busana eksklusif Anda di keranjang belanja resmi Jovique sebelum melanjutkan ke proses pembayaran.",
};

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded-lg w-48" />
            <div className="h-64 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      }
    >
      <CartClient />
    </Suspense>
  );
}
