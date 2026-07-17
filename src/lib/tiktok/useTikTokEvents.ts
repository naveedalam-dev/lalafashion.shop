"use client";

/**
 * useTikTokEvents — Browser-side TikTok Pixel event helpers.
 * All functions guard against window.ttq being undefined (SSR safe).
 */

// ─── TypeScript declarations ────────────────────────────────────────────────────
declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: Record<string, unknown>) => void;
      page: () => void;
      identify: (data: Record<string, unknown>) => void;
    };
  }
}

// ─── Shared event_id util (for browser+server deduplication) ─────────────────
export function generateBrowserEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Identify (Email + Phone) ────────────────────────────────────────────────────
/**
 * Call this whenever you know the customer's phone or email.
 * TikTok pixel automatically hashes PII client-side.
 * Fixes "Email & Phone Missing" diagnostic in TikTok Events Manager.
 */
export function trackIdentify(phone?: string, email?: string): void {
  if (typeof window === "undefined" || !window.ttq) return;
  const identifyData: Record<string, string> = {};
  if (phone) identifyData.phone_number = phone;
  if (email) identifyData.email = email;
  if (Object.keys(identifyData).length === 0) return;
  window.ttq.identify(identifyData);
  console.log("🪪 TikTok Identify:", Object.keys(identifyData).join(", "));
}

// ─── PageView ─────────────────────────────────────────────────────────────────
export function trackPageView(): void {
  if (typeof window === "undefined" || !window.ttq) return;
  window.ttq.track("PageView");
  console.log("📍 TikTok PageView tracked");
}

// ─── ViewContent (Product Page) ───────────────────────────────────────────────
interface ViewContentParams {
  content_id: string;
  content_name: string;
  value: number;
  currency?: string;
}

export function trackViewContent(params: ViewContentParams): void {
  if (typeof window === "undefined" || !window.ttq) return;
  window.ttq.track("ViewContent", {
    content_id: params.content_id,
    content_name: params.content_name,
    content_type: "product",
    value: params.value,
    currency: params.currency || "PKR",
    contents: [
      {
        content_id: params.content_id,
        content_name: params.content_name,
        price: params.value,
        quantity: 1,
      },
    ],
  });
  console.log(`👀 TikTok ViewContent: ${params.content_name}`);
}

// ─── AddToCart ────────────────────────────────────────────────────────────────
interface AddToCartParams {
  content_id: string;
  content_name: string;
  value: number;
  quantity: number;
  currency?: string;
}

export function trackAddToCart(params: AddToCartParams): void {
  if (typeof window === "undefined" || !window.ttq) return;
  window.ttq.track("AddToCart", {
    content_id: params.content_id,
    content_name: params.content_name,
    content_type: "product",
    value: params.value,
    currency: params.currency || "PKR",
    quantity: params.quantity,
    contents: [
      {
        content_id: params.content_id,
        content_name: params.content_name,
        quantity: params.quantity,
        price: params.value / params.quantity,
      },
    ],
  });
  console.log(`🛒 TikTok AddToCart: ${params.content_name} x${params.quantity}`);
}

// ─── InitiateCheckout ─────────────────────────────────────────────────────────
interface CartContentItem {
  product_id?: string;
  productId?: string;
  name?: string;
  quantity: number;
  price: number;
}

export function trackInitiateCheckout(items: CartContentItem[], total: number): void {
  if (typeof window === "undefined" || !window.ttq) return;

  // Filter out items without a valid content_id
  const contents = items
    .map((item) => ({
      content_id: String(item.product_id || item.productId || "").split("/").pop() || "",
      content_name: item.name || "Product",
      quantity: item.quantity,
      price: item.price,
    }))
    .filter((c) => c.content_id !== "");

  window.ttq.track("InitiateCheckout", {
    content_type: "product",
    value: total,
    currency: "PKR",
    contents,
  });
  console.log(`🛍️ TikTok InitiateCheckout: Rs. ${total}`);
}

// ─── Purchase (Browser Side) ──────────────────────────────────────────────────
interface PurchaseItem {
  product_id?: string;
  productId?: string;
  name?: string;
  quantity: number;
  unit_price?: number;
  price?: number;
  product?: { name?: string } | null;
}

interface PurchaseParams {
  order_id: string;
  total: number;
  items: PurchaseItem[];
  event_id?: string; // use same event_id as server-side for deduplication
  currency?: string;
  email?: string;
  phone?: string;
}

export function trackPurchaseBrowser(params: PurchaseParams): void {
  if (typeof window === "undefined" || !window.ttq) return;

  // Filter out items without a valid content_id
  const contents = (params.items || [])
    .map((item) => ({
      content_id: String(item.product_id || item.productId || "").split("/").pop() || "",
      content_name: item.product?.name || item.name || "Product",
      quantity: item.quantity,
      price: item.unit_price || item.price || 0,
    }))
    .filter((c) => c.content_id !== "");

  window.ttq.track("Purchase", {
    content_type: "product",
    value: params.total,
    currency: params.currency || "PKR",
    order_id: params.order_id,
    email: params.email,
    phone: params.phone,
    contents,
  });
  console.log(`✅ TikTok Purchase (browser): Order ${params.order_id}, Rs. ${params.total}`);
}

// ─── Server-side Purchase (via Next.js API Route) ────────────────────────────
interface ServerPurchaseParams {
  order_id: string;
  total: number;
  items: PurchaseItem[];
  event_id: string; // MUST match browser event_id for deduplication
  email?: string;
  phone?: string;
}

export async function trackPurchaseServer(params: ServerPurchaseParams): Promise<void> {
  try {
    await fetch("/api/tiktok-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "Purchase",
        event_id: params.event_id, // deduplication key
        data: {
          value: params.total,
          currency: "PKR",
          order_id: params.order_id,
          email: params.email,
          phone: params.phone,
          contents: (params.items || []).map((item) => ({
            content_id: String(item.product_id || item.productId || "unknown").split("/").pop() || "unknown",
            content_name: item.product?.name || item.name || "Product",
            quantity: item.quantity,
            price: item.unit_price || item.price || 0,
          })),
        },
      }),
    });
    console.log(`✅ TikTok Purchase (server): Order ${params.order_id}`);
  } catch (err) {
    console.error("❌ TikTok server Purchase failed:", err);
  }
}
