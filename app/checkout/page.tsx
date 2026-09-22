import React, { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Simulasi Pembayaran | Jovique Official Store",
  description:
    "Selesaikan pesanan busana eksklusif Jovique dengan simulasi pembayaran aman menggunakan E-Wallet, Virtual Account Bank, atau QRIS.",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded-lg w-56" />
            <div className="h-4 bg-slate-200 rounded-lg w-80 mb-6" />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-slate-200 rounded-3xl" />
              <div className="lg:col-span-5 h-96 bg-slate-200 rounded-3xl" />
            </div>
          </div>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
