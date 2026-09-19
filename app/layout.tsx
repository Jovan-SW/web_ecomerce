import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
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
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans">
        <Navbar wishlistCount={3} cartCount={2} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
