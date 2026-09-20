"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { ProductWithDetails, WishlistWithProduct } from "@/types/database";
import {
  getUserWishlist,
  getUserWishlistIds,
  addToWishlist,
  removeFromWishlist as removeWishlistFromDb,
} from "@/services/wishlist";

interface ToastState {
  id: number;
  message: string;
  type: "success" | "info" | "error";
  actionLabel?: string;
  actionHref?: string;
}

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: WishlistWithProduct[];
  wishlistCount: number;
  isLoading: boolean;
  user: User | null;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (
    productId: string,
    product?: ProductWithDetails
  ) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const toastCountRef = useRef(0);

  // Helper untuk menampilkan toast notification
  const showToast = useCallback(
    (
      message: string,
      type: "success" | "info" | "error" = "success",
      actionLabel?: string,
      actionHref?: string
    ) => {
      const id = ++toastCountRef.current;
      setToasts((prev) => [...prev, { id, message, type, actionLabel, actionHref }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  // Muat data wishlist dari Supabase
  const loadWishlistData = useCallback(async (currentUserId: string) => {
    setIsLoading(true);
    try {
      const [ids, items] = await Promise.all([
        getUserWishlistIds(currentUserId),
        getUserWishlist(currentUserId),
      ]);
      setWishlistIds(ids);
      setWishlistItems(items);
    } catch (err) {
      console.error("Gagal memuat wishlist dari Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Monitor status autentikasi Supabase
  useEffect(() => {
    const supabase = createClient();

    // 1. Cek sesi saat inisialisasi
    supabase.auth.getUser().then(({ data }) => {
      const currentUser = data?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadWishlistData(currentUser.id);
      } else {
        setWishlistIds([]);
        setWishlistItems([]);
        setIsLoading(false);
      }
    });

    // 2. Pasang listener event auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadWishlistData(currentUser.id);
      } else {
        setWishlistIds([]);
        setWishlistItems([]);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadWishlistData]);

  // Fungsi cek apakah suatu produk sudah di-wishlist
  const isWishlisted = useCallback(
    (productId: string): boolean => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  // Toggle wishlist (tambah atau hapus) dengan verifikasi login
  const toggleWishlist = useCallback(
    async (
      productId: string,
      product?: ProductWithDetails
    ): Promise<boolean> => {
      // 1. Validasi Autentikasi Pengguna
      if (!user) {
        showToast(
          "Silakan masuk ke akun Anda untuk menyimpan koleksi ke wishlist",
          "info",
          "Masuk Sekarang",
          `/auth/login?redirect=${encodeURIComponent(pathname || "/products")}`
        );

        // Arahkan ke halaman login
        setTimeout(() => {
          router.push(
            `/auth/login?redirect=${encodeURIComponent(pathname || "/products")}`
          );
        }, 800);

        return false;
      }

      const alreadyWishlisted = wishlistIds.includes(productId);

      if (alreadyWishlisted) {
        // OPTIMISTIC UPDATE: Hapus seketika dari state lokal
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        setWishlistItems((prev) =>
          prev.filter((item) => item.product_id !== productId)
        );
        showToast("Dihapus dari Wishlist", "info");

        try {
          await removeWishlistFromDb(user.id, productId);
          return false;
        } catch (err) {
          // Revert jika gagal di server
          console.error("Gagal menghapus wishlist di Supabase:", err);
          setWishlistIds((prev) => [...prev, productId]);
          showToast("Gagal memperbarui wishlist. Silakan coba lagi.", "error");
          return true;
        }
      } else {
        // OPTIMISTIC UPDATE: Tambahkan seketika ke state lokal
        setWishlistIds((prev) => [...prev, productId]);
        if (product) {
          const optimisticWishlistItem: WishlistWithProduct = {
            id: `temp-${Date.now()}`,
            user_id: user.id,
            product_id: productId,
            created_at: new Date().toISOString(),
            product,
          };
          setWishlistItems((prev) => [optimisticWishlistItem, ...prev]);
        }
        showToast(
          "Koleksi berhasil disimpan ke Wishlist",
          "success",
          "Lihat Wishlist",
          "/wishlist"
        );

        try {
          const inserted = await addToWishlist(user.id, productId);
          if (inserted) {
            // Update ID asli dari Supabase jika ada
            setWishlistItems((prev) =>
              prev.map((item) =>
                item.product_id === productId ? { ...item, id: inserted.id } : item
              )
            );
          }
          return true;
        } catch (err) {
          // Revert jika gagal di server
          console.error("Gagal menambahkan wishlist di Supabase:", err);
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          setWishlistItems((prev) =>
            prev.filter((item) => item.product_id !== productId)
          );
          showToast("Gagal menyimpan ke wishlist. Silakan coba lagi.", "error");
          return false;
        }
      }
    },
    [user, wishlistIds, pathname, router, showToast]
  );

  // Hapus produk dari wishlist
  const removeFromWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!user) return false;

      // Optimistic delete
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
      showToast("Produk dihapus dari wishlist", "info");

      try {
        await removeWishlistFromDb(user.id, productId);
        return true;
      } catch (err) {
        console.error("Gagal menghapus wishlist:", err);
        showToast("Gagal menghapus produk. Silakan coba lagi.", "error");
        if (user) loadWishlistData(user.id);
        return false;
      }
    },
    [user, showToast, loadWishlistData]
  );

  const refreshWishlist = useCallback(async () => {
    if (user) {
      await loadWishlistData(user.id);
    }
  }, [user, loadWishlistData]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        wishlistCount: wishlistIds.length,
        isLoading,
        user,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}

      {/* ========================================================
          FLOATING TOAST NOTIFICATION CONTAINER
         ======================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3
              ${
                toast.type === "success"
                  ? "bg-[#0F172A]/95 text-white border-white/10"
                  : toast.type === "error"
                  ? "bg-red-950/95 text-white border-red-800/40"
                  : "bg-[#1E293B]/95 text-white border-slate-700/40"
              }
            `}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === "success" && (
                <span className="w-5 h-5 rounded-full bg-[#1474ed] flex items-center justify-center text-xs shrink-0">
                  ♥
                </span>
              )}
              {toast.type === "info" && (
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0 text-slate-300">
                  ℹ
                </span>
              )}
              {toast.type === "error" && (
                <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-xs shrink-0">
                  ✕
                </span>
              )}
              <span className="text-xs sm:text-sm font-medium leading-tight">
                {toast.message}
              </span>
            </div>

            {toast.actionLabel && toast.actionHref && (
              <Link
                href={toast.actionHref}
                className="shrink-0 text-xs font-semibold text-[#60A5FA] hover:text-white underline underline-offset-2 ml-2 transition-colors cursor-pointer"
              >
                {toast.actionLabel}
              </Link>
            )}
          </div>
        ))}
      </div>
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist harus digunakan di dalam WishlistProvider");
  }
  return context;
}
