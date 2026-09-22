import { createClient } from "@/utils/supabase/client";
import type { Order, OrderItem, OrderWithItems } from "@/types/database";
import { clearCart } from "./cart";

const getClient = () => createClient();

export interface CreateOrderItemInput {
  productId?: string | null;
  productName: string;
  productImage?: string | null;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CreateOrderInput {
  userId: string;
  totalAmount: number;
  paymentMethod: string;
  xenditInvoiceId?: string | null;
  xenditInvoiceUrl?: string | null;
  status?: string;
  items: CreateOrderItemInput[];
  fromCart?: boolean;
}

const LOCAL_STORAGE_KEY_PREFIX = "jovique_sim_orders_";

function getLocalOrders(userId: string): OrderWithItems[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrder(userId: string, order: OrderWithItems) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalOrders(userId);
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY_PREFIX}${userId}`,
      JSON.stringify(updated)
    );
  } catch (e) {
    console.error("Gagal menyimpan pesanan ke localStorage:", e);
  }
}

/**
 * Membuat pesanan baru dan menyimpan detail item ke tabel orders & order_items di Supabase.
 * Mengembalikan objek pesanan lengkap beserta itemnya.
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<OrderWithItems> {
  const {
    userId,
    totalAmount,
    paymentMethod,
    xenditInvoiceId,
    xenditInvoiceUrl,
    status = "PAID",
    items,
    fromCart = false,
  } = input;

  const nowIso = new Date().toISOString();
  const orderId =
    xenditInvoiceId && !xenditInvoiceId.startsWith("INV-SIM")
      ? `JVQ-${xenditInvoiceId.slice(-8).toUpperCase()}`
      : `JVQ-${Date.now().toString().slice(-8)}`;

  // Objek pesanan untuk fallback / state lokal
  const fallbackOrder: OrderWithItems = {
    id: orderId,
    user_id: userId,
    total_amount: totalAmount,
    status: status,
    payment_method: paymentMethod,
    paid_at: nowIso,
    created_at: nowIso,
    updated_at: nowIso,
    xendit_invoice_id: xenditInvoiceId || orderId,
    xendit_invoice_url: xenditInvoiceUrl || null,
    order_items: items.map((it, idx) => ({
      id: `item-${orderId}-${idx + 1}`,
      order_id: orderId,
      product_id: it.productId || null,
      product_name: it.productName,
      product_image: it.productImage || null,
      price: it.price,
      quantity: it.quantity,
    })),
  };

  try {
    const supabase = getClient();

    // 1. Masukkan ke tabel orders
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        user_id: userId,
        total_amount: totalAmount,
        status: status,
        payment_method: paymentMethod,
        paid_at: nowIso,
        xendit_invoice_id: xenditInvoiceId || orderId,
        xendit_invoice_url: xenditInvoiceUrl || null,
      })
      .select()
      .single();

    if (orderError) {
      console.warn(
        "Penyimpanan tabel 'orders' Supabase belum diizinkan atau gagal (periksa supabase/setup_orders.sql):",
        orderError.message
      );
      // Simpan ke local storage agar transaksi pengguna tetap tersimpan
      saveLocalOrder(userId, fallbackOrder);

      // Kosongkan keranjang jika checkout dari keranjang
      if (fromCart) {
        try {
          await clearCart(userId);
        } catch {}
      }

      return fallbackOrder;
    }

    const createdOrderId = orderData.id;

    // 2. Masukkan item ke tabel order_items
    const orderItemsToInsert = items.map((it) => ({
      order_id: createdOrderId,
      product_id: it.productId || null,
      product_name: it.productName,
      product_image: it.productImage || null,
      price: it.price,
      quantity: it.quantity,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert)
      .select();

    if (itemsError) {
      console.warn(
        "Penyimpanan tabel 'order_items' Supabase gagal:",
        itemsError.message
      );
    }

    // 3. Kosongkan keranjang belanja jika transaksi berasal dari keranjang
    if (fromCart) {
      try {
        await clearCart(userId);
      } catch (err) {
        console.warn("Gagal mengosongkan keranjang belanja:", err);
      }
    }

    const finalOrder: OrderWithItems = {
      ...(orderData as Order),
      order_items: (itemsData as OrderItem[]) || fallbackOrder.order_items,
    };

    saveLocalOrder(userId, finalOrder);
    return finalOrder;
  } catch (err) {
    console.error("Unexpected error in createOrder:", err);
    saveLocalOrder(userId, fallbackOrder);

    if (fromCart) {
      try {
        await clearCart(userId);
      } catch {}
    }

    return fallbackOrder;
  }
}

/**
 * Mengambil daftar seluruh riwayat pesanan milik pengguna beserta item produk yang telah dibeli.
 */
export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  const localOrders = getLocalOrders(userId);

  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Error getUserOrders dari Supabase:", error.message);
      return localOrders;
    }

    const dbOrders = (data as unknown as OrderWithItems[]) || [];

    // Gabungkan database orders dengan local orders tanpa duplikasi id
    const dbOrderIds = new Set(dbOrders.map((o) => o.id));
    const merged = [
      ...dbOrders,
      ...localOrders.filter((o) => !dbOrderIds.has(o.id)),
    ];

    merged.sort((a, b) => {
      const timeA = new Date(a.created_at || a.paid_at || 0).getTime();
      const timeB = new Date(b.created_at || b.paid_at || 0).getTime();
      return timeB - timeA;
    });

    return merged;
  } catch (err) {
    console.warn("Fallback to local orders:", err);
    return localOrders;
  }
}

/**
 * Mengambil satu pesanan spesifik berdasarkan ID
 */
export async function getOrderById(
  orderId: string,
  userId: string
): Promise<OrderWithItems | null> {
  const localOrders = getLocalOrders(userId);
  const foundLocal = localOrders.find((o) => o.id === orderId);

  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return foundLocal || null;
    }

    return data as unknown as OrderWithItems;
  } catch {
    return foundLocal || null;
  }
}
