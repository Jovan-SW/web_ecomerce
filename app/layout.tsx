import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jovique.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jovique Official Store | Toko Busana & Fashion Pria Wanita Premium",
    template: "%s | Jovique Official",
  },
  description:
    "Toko resmi Jovique Official Store. Belanja online koleksi busana pria & wanita, kemeja kasual, jaket outerwear, celana formal, dan pakaian premium 100% original dengan garansi retur & bebas ongkir se-Indonesia.",
  applicationName: "Jovique",
  authors: [
    { name: "Jovan Sebastian William", url: siteUrl },
    { name: "Jovique" },
  ],
  generator: "Next.js",
  keywords: [
    "Jovique",
    "Jovique",
    "Jovique Store",
    "Jovan Sebastian William",
    "toko busana online",
    "baju pria elegan",
    "baju wanita modern",
    "fashion pria wanita premium",
    "kemeja pria kasual",
    "jaket outerwear pria wanita",
    "celana formal kasual",
    "kaos katun premium",
    "brand fashion lokal original",
    "baju branded indonesia",
    "beli pakaian online",
    "fashion kontemporer",
    "gratis ongkir belanja baju",
  ],
  creator: "Jovan Sebastian William",
  publisher: "Jovique",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jovique Official Store | Koleksi Busana & Fashion Pria Wanita Premium",
    description:
      "Temukan busana kontemporer berkualitas tinggi dengan desain elegan dan material premium langsung dari toko resmi Jovique. Garansi 100% original & bebas ongkir.",
    url: siteUrl,
    siteName: "Jovique Official Store",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Jovique Official Store — Koleksi Busana & Fashion Eksklusif",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jovique Official Store | Koleksi Busana Eksklusif",
    description:
      "Official online store Jovique. Busana pria & wanita berkelas, material premium, dan kenyamanan sempurna.",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    ],
    creator: "@jovique.official",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "ecommerce",
};

// Schema.org Structured Data (JSON-LD) untuk Google Search Knowledge Panel & Sitelinks
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Jovique Official",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop",
      },
      sameAs: [
        "https://instagram.com/jovique.official",
        "https://tiktok.com/@jovique.id",
        "https://youtube.com",
      ],
      founder: {
        "@type": "Person",
        name: "Jovan Sebastian William",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Jovique Official Store",
      description:
        "Official online store Jovique. Koleksi busana dan fashion eksklusif pria dan wanita.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans">
        <WishlistProvider>
          <CartProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
