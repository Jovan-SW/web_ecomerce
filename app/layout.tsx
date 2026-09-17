import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jovique | Situs Jual Beli Online Terlengkap, Aman & Terpercaya",
  description:
    "Platform e-commerce & marketplace jual beli online terlengkap. Temukan ribuan brand resmi, jutaan produk pilihan, diskon menarik, bebas ongkir, dan jaminan pembayaran aman.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#000200]">
        <Navbar wishlistCount={3} cartCount={2} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
