"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { ProductWithDetails, CartWithProduct } from "@/types/database";
import {
  getUserCart,
  addToCart as addToCartDb,
  updateCartItemQuantity as updateCartItemQuantityDb,
  removeFromCart as removeFromCartDb,
  clearCart as clearCartDb,
} from "@/services/cart";

interface ToastState {
  id: number;
  message: string;
  type: "success" | "info" | "error";
  actionLabel?: string;
  actionHref?: string;
}

interface CartContextType {
  cartItems: CartWithProduct[];
  cartCount: number;
  subtotal: number;
  isLoading: boolean;
  user: User | null;
  addToCart: (
    product: ProductWithDetails,
    size: string,
    color: string,
    quantity?: number
  ) => Promise<boolean>;
  updateQuantity: (cartId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (cartId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const toastCountRef = useRef(0);

  // Helper untuk menampilkan toast notification
  const showToast = useCallback(
    (
      message: string,
      type: "success" | "info" | "error" = "info",
      actionLabel?: string,
      actionHref?: string
    ) => {
      const id = ++toastCountRef.current;
      setToasts((prev) => [
        ...prev.slice(-2), // Maksimal tampil 3 toast bersamaan
        { id, message, type, actionLabel, actionHref },
      ]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  // Fungsi memuat data keranjang dari Supabase
  const loadCartData = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const items = await getUserCart(userId);
      setCartItems(items);
    } catch (err) {
      console.error("Gagal memuat keranjang dari Supabase:", err);
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
        loadCartData(currentUser.id);
      } else {
        setCartItems([]);
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
        loadCartData(currentUser.id);
      } else {
        setCartItems([]);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadCartData]);

  // Hitung total jumlah barang di keranjang
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  // Hitung subtotal harga seluruh barang
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.product?.price || 0;
      return acc + price * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  // Fungsi menambahkan barang ke keranjang
  const addToCart = useCallback(
    async (
      product: ProductWithDetails,
      size: string,
      color: string,
      quantity: number = 1
    ): Promise<boolean> => {
      // 1. Validasi Autentikasi Pengguna
      if (!user) {
        showToast(
          "Silakan masuk terlebih dahulu untuk menambahkan produk ke keranjang",
          "info",
          "Masuk Akun",
          `/auth/login?redirect=${encodeURIComponent(pathname || "/cart")}`
        );
        router.push(
          `/auth/login?redirect=${encodeURIComponent(pathname || "/cart")}`
        );
        return false;
      }

      // 2. Simpan snapshot sebelum update untuk rollback jika gagal
      const previousItems = [...cartItems];

      // 3. Optimistic Update di State Lokal
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.product_id === product.id &&
            item.size === size &&
            item.color === color
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            quantity: (existing.quantity || 1) + quantity,
            updated_at: new Date().toISOString(),
          };
          return updated;
        } else {
          const optimisticItem: CartWithProduct = {
            id: `temp-${Date.now()}`,
            user_id: user.id,
            product_id: product.id,
            size,
            color,
            quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product,
          };
          return [optimisticItem, ...prev];
        }
      });

      // Tampilkan toast berhasil
      showToast(
        `"${product.name}" (${size} • ${color}) ditambahkan ke keranjang`,
        "success",
        "Buka Keranjang",
        "/cart"
      );

      // 4. Sinkronisasi ke Database Supabase
      try {
        await addToCartDb(user.id, product.id, size, color, quantity);
        // Refresh data riil dari database di latar belakang
        const latestItems = await getUserCart(user.id);
        setCartItems(latestItems);
        return true;
      } catch (err) {
        console.error("Gagal menambahkan ke keranjang Supabase:", err);
        setCartItems(previousItems); // Rollback
        showToast("Gagal menyimpan ke keranjang. Coba lagi nanti.", "error");
        return false;
      }
    },
    [user, pathname, router, showToast, cartItems]
  );

  // Fungsi memperbarui kuantitas barang
  const updateQuantity = useCallback(
    async (cartId: string, newQuantity: number): Promise<boolean> => {
      if (!user) return false;

      const previousItems = [...cartItems];

      // Optimistic update
      if (newQuantity <= 0) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      } else {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === cartId ? { ...item, quantity: newQuantity } : item
          )
        );
      }

      try {
        await updateCartItemQuantityDb(cartId, newQuantity);
        return true;
      } catch (err) {
        console.error("Gagal mengubah kuantitas keranjang:", err);
        setCartItems(previousItems); // Rollback
        showToast("Gagal mengubah kuantitas. Coba lagi.", "error");
        return false;
      }
    },
    [user, cartItems, showToast]
  );

  // Fungsi menghapus barang dari keranjang
  const removeFromCart = useCallback(
    async (cartId: string): Promise<boolean> => {
      if (!user) return false;

      const previousItems = [...cartItems];
      const targetItem = cartItems.find((i) => i.id === cartId);

      // Optimistic remove
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));

      showToast(
        targetItem
          ? `"${targetItem.product.name}" dihapus dari keranjang`
          : "Item dihapus dari keranjang",
        "info"
      );

      try {
        await removeFromCartDb(cartId);
        return true;
      } catch (err) {
        console.error("Gagal menghapus item dari keranjang:", err);
        setCartItems(previousItems); // Rollback
        showToast("Gagal menghapus item. Coba lagi.", "error");
        return false;
      }
    },
    [user, cartItems, showToast]
  );

  // Fungsi mengosongkan keranjang
  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    const previousItems = [...cartItems];
    setCartItems([]);

    try {
      await clearCartDb(user.id);
      showToast("Keranjang belanja telah dikosongkan", "info");
      return true;
    } catch (err) {
      console.error("Gagal mengosongkan keranjang:", err);
      setCartItems(previousItems);
      showToast("Gagal mengosongkan keranjang.", "error");
      return false;
    }
  }, [user, cartItems, showToast]);

  const refreshCart = useCallback(async () => {
    if (user) {
      await loadCartData(user.id);
    }
  }, [user, loadCartData]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isLoading,
        user,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}

      {/* ========================================================
          FLOATING TOAST NOTIFICATION CONTAINER UNTUK CART
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
                <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs shrink-0 text-white font-bold">
                  ✓
                </span>
              )}
              {toast.type === "info" && (
                <span className="w-5 h-5 rounded-full bg-[#1474ed] flex items-center justify-center text-xs shrink-0 text-white font-bold">
                  🛒
                </span>
              )}
              {toast.type === "error" && (
                <span className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-xs shrink-0 text-white font-bold">
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
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
}
