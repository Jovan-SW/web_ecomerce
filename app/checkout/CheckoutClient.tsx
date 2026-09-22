"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components";
import { getProductById } from "@/services/products";
import { createOrder, type CreateOrderItemInput } from "@/services/orders";
import type { ProductWithDetails, OrderWithItems } from "@/types/database";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Data Pilihan Metode Pembayaran
interface PaymentMethodOption {
  id: string;
  category: "ewallet" | "va" | "qris";
  name: string;
  providerName: string;
  shortDesc: string;
  badge?: string;
  colorHex: string;
  accountPrefix?: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  // Virtual Account
  {
    id: "va_bca",
    category: "va",
    name: "BCA Virtual Account",
    providerName: "Bank Central Asia",
    shortDesc: "Bayar instan melalui BCA Mobile, KlikBCA, atau ATM BCA",
    badge: "Paling Populer",
    colorHex: "#005CAB",
    accountPrefix: "80777",
  },
  {
    id: "va_mandiri",
    category: "va",
    name: "Mandiri Virtual Account",
    providerName: "Bank Mandiri",
    shortDesc: "Bayar via Livin by Mandiri atau ATM Mandiri",
    colorHex: "#003876",
    accountPrefix: "88708",
  },
  {
    id: "va_bni",
    category: "va",
    name: "BNI Virtual Account",
    providerName: "Bank Negara Indonesia",
    shortDesc: "Bayar via BNI Mobile Banking atau ATM BNI",
    colorHex: "#F15A24",
    accountPrefix: "988",
  },
  {
    id: "va_bri",
    category: "va",
    name: "BRI Virtual Account (BRIVA)",
    providerName: "Bank Rakyat Indonesia",
    shortDesc: "Bayar via aplikasi BRImo atau ATM BRI",
    colorHex: "#00529C",
    accountPrefix: "12800",
  },
  {
    id: "va_permata",
    category: "va",
    name: "Permata Virtual Account",
    providerName: "PermataBank",
    shortDesc: "Bayar via PermataMobile X atau ATM Permata",
    colorHex: "#008850",
    accountPrefix: "8528",
  },
  // E-Wallet
  {
    id: "ewallet_gopay",
    category: "ewallet",
    name: "GoPay",
    providerName: "Gojek Ecosystem",
    shortDesc: "Konfirmasi instan di aplikasi Gojek / GoPay",
    badge: "Praktis",
    colorHex: "#00AA13",
  },
  {
    id: "ewallet_ovo",
    category: "ewallet",
    name: "OVO",
    providerName: "OVO Payment",
    shortDesc: "Push notification pembayaran ke aplikasi OVO",
    colorHex: "#4C2A86",
  },
  {
    id: "ewallet_dana",
    category: "ewallet",
    name: "DANA",
    providerName: "DANA Indonesia",
    shortDesc: "Verifikasi saldo dompet digital akun DANA",
    badge: "Favorit",
    colorHex: "#118EEA",
  },
  {
    id: "ewallet_shopeepay",
    category: "ewallet",
    name: "ShopeePay",
    providerName: "Sea Limited",
    shortDesc: "Bayar mudah dengan verifikasi aplikasi Shopee",
    colorHex: "#EE4D2D",
  },
  {
    id: "ewallet_linkaja",
    category: "ewallet",
    name: "LinkAja",
    providerName: "Telkomsel / Finarya",
    shortDesc: "Bayar via aplikasi LinkAja",
    colorHex: "#ED1C24",
  },
  // QRIS
  {
    id: "qris",
    category: "qris",
    name: "QRIS Nasional",
    providerName: "Semua Aplikasi Pembayaran",
    shortDesc: "Pindai kode QR dari BCA, GoPay, OVO, DANA, dll.",
    badge: "Scan QR",
    colorHex: "#E11931",
  },
];

interface CheckoutItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, user, isLoading: isCartLoading } = useCart();

  // State mode pembelian: dari keranjang atau 'Beli Langsung'
  const isBuyNow = searchParams.get("buyNow") === "true";
  const buyNowProductId = searchParams.get("productId");
  const buyNowSize = searchParams.get("size") || "M";
  const buyNowColor = searchParams.get("color") || "Default";
  const buyNowQty = parseInt(searchParams.get("qty") || "1", 10);

  // State data produk Buy Now
  const [buyNowProduct, setBuyNowProduct] = useState<ProductWithDetails | null>(null);
  const [isLoadingBuyNow, setIsLoadingBuyNow] = useState<boolean>(Boolean(isBuyNow && buyNowProductId));

  // Pilihan metode pembayaran yang aktif
  const [selectedCategory, setSelectedCategory] = useState<"va" | "ewallet" | "qris">("va");
  const [selectedMethodId, setSelectedMethodId] = useState<string>("va_bca");
  const [eWalletPhone, setEWalletPhone] = useState<string>("081234567890");

  const [isCopiedVa, setIsCopiedVa] = useState<boolean>(false);
  const [isCopiedTotal, setIsCopiedTotal] = useState<boolean>(false);

  // State hitung mundur QRIS (15 menit)
  const [countdownSeconds, setCountdownSeconds] = useState<number>(15 * 60);

  // State proses checkout & sukses
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderWithItems | null>(null);

  // 1. Validasi Autentikasi Pengguna
  useEffect(() => {
    if (!isCartLoading && !user) {
      const redirectUrl = isBuyNow
        ? `/checkout?${searchParams.toString()}`
        : "/checkout";
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [user, isCartLoading, router, isBuyNow, searchParams]);

  // 2. Fetch data produk jika mode Buy Now
  useEffect(() => {
    if (isBuyNow && buyNowProductId) {
      let isMounted = true;
      getProductById(buyNowProductId)
        .then((product) => {
          if (isMounted) {
            setBuyNowProduct(product);
          }
        })
        .catch((err) => {
          console.error("Gagal memuat produk Buy Now:", err);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingBuyNow(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isBuyNow, buyNowProductId]);

  // 3. Nomor Virtual Account dihitung secara deterministik / memo
  const simulatedVaNumber = useMemo(() => {
    const method = PAYMENT_METHODS.find((m) => m.id === selectedMethodId);
    if (method && method.category === "va") {
      const prefix = method.accountPrefix || "80000";
      return `${prefix}08123984572`;
    }
    return "";
  }, [selectedMethodId]);

  // 4. Hitung mundur timer QRIS
  useEffect(() => {
    if (selectedCategory !== "qris") return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(countdownSeconds / 60);
    const secs = countdownSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [countdownSeconds]);

  // 5. Susun daftar barang yang akan dicheckout
  const checkoutItems: CheckoutItem[] = useMemo(() => {
    if (isBuyNow) {
      if (!buyNowProduct) return [];
      return [
        {
          id: `buynow-${buyNowProduct.id}`,
          productId: buyNowProduct.id,
          name: buyNowProduct.name,
          image: buyNowProduct.images?.[0] || "",
          price: buyNowProduct.price,
          quantity: buyNowQty,
          size: buyNowSize,
          color: buyNowColor,
        },
      ];
    }

    return cartItems
      .filter((item) => item.product)
      .map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.product.name,
        image: item.product.images?.[0] || "",
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));
  }, [isBuyNow, buyNowProduct, buyNowQty, buyNowSize, buyNowColor, cartItems]);

  // Hitung total harga transaksi
  const totalAmount = useMemo(() => {
    return checkoutItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [checkoutItems]);

  const selectedMethod = useMemo(() => {
    return PAYMENT_METHODS.find((m) => m.id === selectedMethodId) || PAYMENT_METHODS[0];
  }, [selectedMethodId]);

  // Handler Salin Nomor VA
  const handleCopyVa = () => {
    if (simulatedVaNumber) {
      navigator.clipboard.writeText(simulatedVaNumber);
      setIsCopiedVa(true);
      setTimeout(() => setIsCopiedVa(false), 2500);
    }
  };

  // Handler Salin Total
  const handleCopyTotal = () => {
    navigator.clipboard.writeText(totalAmount.toString());
    setIsCopiedTotal(true);
    setTimeout(() => setIsCopiedTotal(false), 2500);
  };

  // 6. EKSEKUSI PEMBAYARAN SIMULASI
  const handleProcessPayment = async () => {
    if (!user || checkoutItems.length === 0 || isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      // Panggil endpoint Xendit Sandbox di background untuk membuat invoice resmi
      let xenditId: string | null = null;
      let xenditUrl: string | null = null;

      try {
        const xenditRes = await fetch("/api/xendit/create-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            description: `Pembelian Simulasi Jovique - ${selectedMethod.name}`,
            payerEmail: user.email,
            customerName: user.user_metadata?.full_name || "Pelanggan Jovique",
            items: checkoutItems.map((it) => ({
              name: `${it.name} (${it.size}, ${it.color})`,
              quantity: it.quantity,
              price: it.price,
            })),
          }),
        });

        const xenditJson = await xenditRes.json();
        if (xenditJson.success && xenditJson.invoice) {
          xenditId = xenditJson.invoice.id;
          xenditUrl = xenditJson.invoice.invoice_url;
        }
      } catch (err) {
        console.warn("Gagal menghubungi Xendit Sandbox API (lanjut simulasi lokal):", err);
      }

      // Berikan sedikit jeda realistis seperti sedang verifikasi payment gateway
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simpan transaksi ke tabel database Supabase 'orders' & 'order_items'
      const orderItemsInput: CreateOrderItemInput[] = checkoutItems.map((it) => ({
        productId: it.productId,
        productName: `${it.name} - ${it.size} / ${it.color}`,
        productImage: it.image,
        price: it.price,
        quantity: it.quantity,
        size: it.size,
        color: it.color,
      }));

      const newOrder = await createOrder({
        userId: user.id,
        totalAmount,
        paymentMethod: `${selectedMethod.name} (Simulasi)`,
        status: "PAID",
        xenditInvoiceId: xenditId || `INV-SIM-${Date.now()}`,
        xenditInvoiceUrl: xenditUrl || null,
        items: orderItemsInput,
        fromCart: !isBuyNow,
      });

      setCompletedOrder(newOrder);
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
      alert("Terjadi kendala saat memproses pesanan. Silakan coba kembali.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Loading State
  if (isCartLoading || isLoadingBuyNow) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-56 mb-4" />
        <div className="h-4 bg-slate-200 rounded-lg w-96 mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-slate-200 rounded-3xl" />
          <div className="lg:col-span-4 h-96 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Not Logged In State
  if (!user) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-20 text-center">
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1474ED] mx-auto flex items-center justify-center font-bold text-xl">
            🔒
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">Wajib Masuk Akun</h2>
          <p className="text-sm text-[#64748B]">
            Anda harus masuk ke akun terlebih dahulu untuk melanjutkan simulasi transaksi pembelian koleksi Jovique.
          </p>
          <Link href="/auth/login?redirect=/checkout">
            <Button variant="primary" size="md" fullWidth>
              Masuk ke Akun Sekarang
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Empty Items State
  if (checkoutItems.length === 0 && !completedOrder) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm p-10 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center font-bold text-xl">
            🛍️
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">Tidak Ada Barang untuk Dicheckout</h2>
          <p className="text-sm text-[#64748B]">
            Keranjang belanja Anda masih kosong atau tidak ada produk yang dipilih. Temukan busana favorit Anda sekarang!
          </p>
          <Link href="/products">
            <Button variant="primary" size="md">
              Eksplor Koleksi Jovique
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 7. LAYAR SUKSES PEMBAYARAN (CELEBRATORY RECEIPT MODAL / FULL VIEW)
  // ============================================================================
  if (completedOrder) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fade-in">
        {/* Card Struk Sukses */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Header Banner Hijau Sukses */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div
              className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative z-10 space-y-3">
              {/* Animated Checkmark Badge */}
              <div className="w-16 h-16 rounded-full bg-white text-emerald-600 mx-auto flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Pembayaran Berhasil Dikonfirmasi!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
                Terima kasih telah berbelanja di Jovique Official Store. Pesanan simulasi Anda telah tersimpan secara resmi.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* ALERT NOTIFIKASI SIMULASI TANPA UANG ASLI */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-200/80 text-amber-900 flex items-start gap-3.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-200/60 text-amber-800 flex items-center justify-center shrink-0 font-bold text-lg">
                ⚠️
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <h2 className="font-extrabold text-amber-950 flex items-center gap-2">
                  <span>Pemberitahuan Transaksi Simulasi (Sandbox)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900 uppercase">
                    Non-Real Money
                  </span>
                </h2>
                <p className="leading-relaxed text-amber-900/90">
                  Pembayaran ini adalah <strong>SIMULASI (Demo / Sandbox)</strong> dan <strong>TIDAK MENGGUNAKAN UANG ASLI</strong>. Saldo e-wallet maupun rekening bank Anda sama sekali tidak terpotong. Transaksi ini telah tercatat ke dalam sistem database untuk keperluan demonstrasi e-commerce.
                </p>
              </div>
            </div>

            {/* Rincian Transaksi */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">ID Pesanan (Invoice)</span>
                <span className="font-mono font-bold text-[#0F172A]">
                  {completedOrder.id}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Metode Pembayaran</span>
                <span className="font-semibold text-[#0F172A]">
                  {completedOrder.payment_method}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Status Transaksi</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LUNAS (SIMULASI)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Waktu Pembayaran</span>
                <span className="text-[#0F172A] font-medium">
                  {new Date(completedOrder.paid_at || "2026-09-22T00:00:00.000Z").toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            {/* Rincian Barang yang Telah Dibeli */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Barang yang Telah Anda Beli ({completedOrder.order_items.length} Item)
              </h2>
              <div className="divide-y divide-[#F1F5F9] rounded-2xl border border-[#E2E8F0] p-4 bg-white space-y-3">
                {completedOrder.order_items.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center gap-4 pt-3 first:pt-0">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0]">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                          Jovique
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0F172A] truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {item.quantity} x {formatRupiah(item.price)}
                      </p>
                    </div>
                    <div className="text-right font-extrabold text-sm text-[#0F172A]">
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Pembayaran */}
            <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex justify-between items-center">
              <span className="text-sm font-bold text-[#1E3A8A]">Total Pembayaran Selesai</span>
              <span className="text-xl font-extrabold text-[#1474ED]">
                {formatRupiah(completedOrder.total_amount)}
              </span>
            </div>

            {/* Tautan Opsional Xendit Sandbox Invoice */}
            {completedOrder.xendit_invoice_url && (
              <div className="text-center pt-2">
                <a
                  href={completedOrder.xendit_invoice_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1474ED] hover:underline font-semibold inline-flex items-center gap-1.5"
                >
                  <span>Lihat Tampilan Invoice Xendit Sandbox Resmi</span>
                  <span>↗</span>
                </a>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link href="/profile?tab=orders" className="flex-1">
                <Button variant="primary" size="lg" fullWidth className="font-bold rounded-2xl shadow-md">
                  Lihat Riwayat Pesanan di Profil →
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button variant="secondary" size="lg" fullWidth className="font-semibold rounded-2xl">
                  Belanja Koleksi Lain
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 8. TAMPILAN CHECKOUT & SIMULASI PEMBAYARAN UTAMA
  // ============================================================================
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#64748B] mb-6">
        <Link href="/" className="hover:text-[#0F172A] transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#0F172A] transition-colors">
          Keranjang
        </Link>
        <span>/</span>
        <span className="text-[#0F172A] font-semibold">Simulasi Pembayaran</span>
      </nav>

      {/* Header Halaman dengan Badge Simulasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E2E8F0]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Simulasi Pembayaran
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Mode Sandbox (Tanpa Uang Asli)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
            Pilih metode pembayaran favorit Anda. Anda dapat menyelesaikan transaksi simulasi tanpa memotong saldo asli.
          </p>
        </div>

        <Link
          href={isBuyNow ? "/products" : "/cart"}
          className="text-xs font-semibold text-[#1474ED] hover:underline"
        >
          ← Kembali ke {isBuyNow ? "Katalog" : "Keranjang"}
        </Link>
      </div>

      {/* Layout 2 Kolom: Pilihan Pembayaran & Rincian Pesanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI: PILIHAN METODE PEMBAYARAN & INSTRUKSI REALISTIS (8 Kolom) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB KATEGORI: VIRTUAL ACCOUNT | E-WALLET | QRIS */}
          <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                Pilih Metode Pembayaran
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Simulasi transaksi tersedia untuk Bank Virtual Account, E-Wallet, dan QRIS Nasional.
              </p>
            </div>

            {/* Selector Kategori Tab */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("va");
                  setSelectedMethodId("va_bca");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedCategory === "va"
                    ? "bg-white text-[#1474ED] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span>🏦</span>
                <span>Transfer Bank / VA</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("ewallet");
                  setSelectedMethodId("ewallet_gopay");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedCategory === "ewallet"
                    ? "bg-white text-[#1474ED] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span>📱</span>
                <span>E-Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("qris");
                  setSelectedMethodId("qris");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedCategory === "qris"
                    ? "bg-white text-[#1474ED] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span>📷</span>
                <span>QRIS</span>
              </button>
            </div>

            {/* DAFTAR PILIHAN METODE BERDASARKAN KATEGORI */}
            <div className="space-y-3 pt-2">
              {PAYMENT_METHODS.filter((m) => m.category === selectedCategory).map((method) => {
                const isSelected = selectedMethodId === method.id;

                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? "border-[#1474ED] bg-blue-50/50 shadow-xs ring-1 ring-[#1474ED]"
                        : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Radio Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "border-[#1474ED] bg-[#1474ED]"
                            : "border-[#CBD5E1] bg-white"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      {/* Icon / Brand Pill */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs shrink-0"
                        style={{ backgroundColor: method.colorHex }}
                      >
                        {method.category === "qris" ? "QRIS" : method.name.slice(0, 3).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#0F172A]">{method.name}</p>
                          {method.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#1474ED]/10 text-[#1474ED] border border-[#1474ED]/20">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5">{method.shortDesc}</p>
                      </div>
                    </div>

                    <span className="text-xs text-[#94A3B8] font-mono hidden sm:inline-block">
                      Simulasi
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAIL INSTRUKSI PEMBAYARAN REALISTIS (DYNAMIC BERDASARKAN METODE) */}
          <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-7 shadow-xs space-y-5">
            {/* JIKA MEMILIH VIRTUAL ACCOUNT */}
            {selectedCategory === "va" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Nomor Akun Virtual
                    </span>
                    <h3 className="text-base font-extrabold text-[#0F172A]">
                      {selectedMethod.name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1474ED]">
                    Verifikasi Otomatis
                  </span>
                </div>

                {/* Box Nomor VA Realistis dengan Tombol Salin */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <span className="text-xs text-[#64748B] block">Nomor Virtual Account Simulasi:</span>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-wider text-[#0F172A]">
                      {simulatedVaNumber || "8077708123456789"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyVa}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-[#CBD5E1] text-[#1474ED] hover:bg-blue-50 transition-colors cursor-pointer shadow-2xs shrink-0"
                    >
                      {isCopiedVa ? "✓ Tersalin" : "Salin Nomor"}
                    </button>
                  </div>
                </div>

                {/* Panduan Pembayaran */}
                <div className="space-y-2.5 text-xs text-[#475569]">
                  <p className="font-bold text-[#0F172A]">Panduan Pembayaran Virtual Account:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed text-[#64748B]">
                    <li>Buka aplikasi Mobile Banking atau ATM bank pilihan Anda.</li>
                    <li>Pilih menu <strong>Transfer</strong> &gt; <strong>Virtual Account</strong>.</li>
                    <li>Masukkan nomor Virtual Account di atas dan pastikan nama penerima tertera <strong>JOVIQUE OFFICIAL</strong>.</li>
                    <li>Masukkan nominal tepat <strong>{formatRupiah(totalAmount)}</strong>.</li>
                    <li>Konfirmasi pembayaran atau tekan tombol <strong>Bayar Sekarang (Simulasi)</strong> di bawah.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* JIKA MEMILIH E-WALLET */}
            {selectedCategory === "ewallet" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      Simulasi Pembayaran E-Wallet
                    </span>
                    <h3 className="text-base font-extrabold text-[#0F172A]">
                      {selectedMethod.name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    Instan
                  </span>
                </div>

                {/* Input Nomor HP Akun E-Wallet */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0F172A] block">
                    Nomor Handphone Terdaftar di {selectedMethod.name} (Simulasi):
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={eWalletPhone}
                      onChange={(e) => setEWalletPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-sm font-mono font-semibold text-[#0F172A] focus:outline-none focus:border-[#1474ED] focus:bg-white"
                    />
                    <span className="absolute right-3 top-3 text-xs text-emerald-600 font-bold">
                      ✓ Terhubung
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Dalam mode simulasi ini, Anda tidak perlu membuka aplikasi ponsel Anda. Cukup klik tombol pembayaran.
                  </p>
                </div>
              </div>
            )}

            {/* JIKA MEMILIH QRIS */}
            {selectedCategory === "qris" && (
              <div className="space-y-5 text-center">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4 text-left">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                      QR Code Indonesian Standard
                    </span>
                    <h3 className="text-base font-extrabold text-[#0F172A]">
                      QRIS Nasional (NMID: ID1020039485721)
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    Sisa Waktu: {formattedTimer}
                  </span>
                </div>

                {/* Mockup QR Code Dinamis */}
                <div className="inline-block p-6 rounded-3xl bg-white border-2 border-dashed border-[#CBD5E1] shadow-xs">
                  <div className="w-52 h-52 mx-auto bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-between relative shadow-inner">
                    {/* Header QRIS Logo Strip */}
                    <div className="w-full bg-white rounded-md py-1 px-2 flex justify-between items-center text-[9px] font-extrabold text-rose-700">
                      <span>QRIS</span>
                      <span className="text-[8px] text-slate-500 font-mono">GPN / ASPI</span>
                    </div>

                    {/* Styled Dynamic QR Matrix Representation */}
                    <div className="w-36 h-36 bg-white rounded-lg p-2 grid grid-cols-6 gap-1 my-auto">
                      {Array.from({ length: 36 }).map((_, i) => {
                        const isCorner =
                          i === 0 || i === 5 || i === 30 || i === 35 ||
                          i === 1 || i === 6 || i === 29 || i === 34;
                        return (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              isCorner || (i * 7) % 3 === 0
                                ? "bg-slate-900"
                                : "bg-slate-200/60"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="text-[9px] font-mono text-white/80">
                      JOVIQUE LUXURY STORE
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
                  Pindai QR di atas menggunakan aplikasi mobile banking (BCA, Mandiri, BRI, BNI) atau e-wallet (GoPay, OVO, DANA, ShopeePay, LinkAja).
                </p>
              </div>
            )}
          </div>

          {/* CATATAN SIMULASI TEGASKAN TANPA UANG ASLI */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-amber-900 block">
                Simulasi Pembayaran Bebas Risiko
              </span>
              <p className="text-amber-800/90 leading-relaxed">
                Anda tidak perlu mengeluarkan uang asli. Begitu Anda menekan tombol <strong>&quot;Bayar Sekarang (Simulasi)&quot;</strong>, sistem akan merekam pesanan Anda ke database dan mengonfirmasi bahwa produk telah berhasil Anda beli.
              </p>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: RINGKASAN PESANAN & TOMBOL BAYAR (4 Kolom Sticky) */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
          <div className="border-b border-[#F1F5F9] pb-4">
            <h2 className="text-lg font-bold text-[#0F172A]">Ringkasan Belanja</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {checkoutItems.length} produk siap dibeli
            </p>
          </div>

          {/* Mini List Barang yang Dibeli */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                      Jovique
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0F172A] truncate">{item.name}</p>
                  <p className="text-[#64748B]">
                    {item.size} • {item.color} • {item.quantity} pcs
                  </p>
                </div>
                <span className="font-extrabold text-[#0F172A] shrink-0">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Kalkulasi Biaya */}
          <div className="space-y-2.5 text-xs text-[#475569] pt-2 border-t border-[#F1F5F9]">
            <div className="flex justify-between items-center">
              <span>Total Harga Produk</span>
              <span className="font-semibold text-[#0F172A]">{formatRupiah(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Ongkos Kirim</span>
              <span className="text-emerald-600 font-bold">GRATIS</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Biaya Penanganan Gateway</span>
              <span className="text-emerald-600 font-bold">Rp0</span>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">Total Pembayaran</span>
                <span className="text-[10px] text-[#94A3B8]">Metode: {selectedMethod.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#1474ED] block">
                  {formatRupiah(totalAmount)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTotal}
                  className="text-[10px] text-[#1474ED] hover:underline cursor-pointer"
                >
                  {isCopiedTotal ? "✓ Nominal Tersalin" : "Salin Nominal"}
                </button>
              </div>
            </div>
          </div>

          {/* Tombol Eksekusi Bayar Sekarang */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isProcessingPayment}
              onClick={handleProcessPayment}
              className="rounded-2xl font-bold tracking-wide shadow-md py-4 text-sm"
            >
              {isProcessingPayment ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Memverifikasi Pembayaran...
                </span>
              ) : (
                `Bayar Sekarang (${selectedMethod.name}) →`
              )}
            </Button>

            <p className="text-[11px] text-center text-[#94A3B8] leading-relaxed">
              🔒 Transaksi aman, terverifikasi, dan menggunakan simulasi sandbox tanpa biaya asli.
            </p>
          </div>

          {/* Jaminan Layanan Jovique */}
          <div className="pt-4 border-t border-[#F1F5F9] space-y-2 text-xs text-[#475569]">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Koleksi 100% Asli Jovique Luxury</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">✓</span>
              <span>Tersimpan di Riwayat Pesanan Profil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
