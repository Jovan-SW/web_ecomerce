import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components";
import { WishlistProvider } from "@/context/WishlistContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jovique Official Store | Koleksi Busana & Fashion Eksklusif",
  description:
    "Official online store Jovique. Temukan koleksi pakaian dan aksesori eksklusif dengan kualitas terbaik, desain kontemporer elegan, dan kenyamanan tanpa kompromi.",
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
        <WishlistProvider>
          <Navbar cartCount={2} />
          <div className="flex-1">{children}</div>
          <Footer />
        </WishlistProvider>
      </body>
    </html>
  );
}
