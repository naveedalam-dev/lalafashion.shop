import crypto from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TikTokEventData {
  value?: number;
  currency?: string;
  email?: string;
  phone?: string;
  ip_address?: string;
  user_agent?: string;
  event_id?: string; // pass from browser for deduplication
  contents?: Array<{
    content_id: string;
    content_name?: string;
    quantity?: number;
    price?: number;
  }>;
  order_id?: string;
  [key: string]: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

function hashEmail(email?: string): string | undefined {
  if (!email) return undefined;
  return sha256(email);
}

function hashPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  return sha256(digits);
}

function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// ─── Core Tracking Function ───────────────────────────────────────────────────

/**
 * Send an event to TikTok Conversions API v1.3 (server-side).
 *
 * CORRECT FLAT PAYLOAD FORMAT (verified against live API):
 * {
 *   pixel_code, event (string), event_id, timestamp (string),
 *   user: { em, ph, ip, user_agent },
 *   properties: { value, currency, contents, order_id }
 * }
 */
export async function trackConversion(
  event_name: string,
  data: TikTokEventData
): Promise<{ success: boolean; code?: number; message?: string }> {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const apiUrl = process.env.TIKTOK_CONVERSIONS_API_URL;

  if (!pixelId || !accessToken || !apiUrl) {
    console.error(
      "❌ TikTok: Missing env vars — NEXT_PUBLIC_TIKTOK_PIXEL_ID, TIKTOK_ACCESS_TOKEN, or TIKTOK_CONVERSIONS_API_URL"
    );
    return { success: false, message: "Missing TikTok configuration" };
  }

  const eventId = data.event_id || generateEventId();
  // timestamp must be a STRING (TikTok API requirement)
  const timestamp = String(Math.floor(Date.now() / 1000));

  // Build user object — only include non-empty fields
  const user: Record<string, string> = {};
  const hashedEmail = hashEmail(data.email);
  const hashedPhone = hashPhone(data.phone);
  if (hashedEmail) user.em = hashedEmail;
  if (hashedPhone) user.ph = hashedPhone;
  if (data.ip_address) user.ip = data.ip_address;
  if (data.user_agent) user.user_agent = data.user_agent;

  // Build properties
  const properties: Record<string, unknown> = {
    currency: data.currency || "PKR",
  };
  if (data.value !== undefined) properties.value = data.value;
  if (data.contents && data.contents.length > 0) {
    properties.contents = data.contents.map((c) => ({
      content_id: c.content_id,
      ...(c.content_name ? { content_name: c.content_name } : {}),
      ...(c.quantity !== undefined ? { quantity: c.quantity } : {}),
      ...(c.price !== undefined ? { price: c.price } : {}),
    }));
  }
  if (data.order_id) properties.order_id = data.order_id;

  // Flat payload — verified format that TikTok v1.3 API accepts
  const payload = {
    pixel_code: pixelId,
    event: event_name,   // top-level string field
    event_id: eventId,
    timestamp,           // must be a string
    user,
    properties,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.code === 0) {
      console.log(`✅ TikTok [${event_name}] tracked server-side. event_id=${eventId}`);
      return { success: true, code: result.code, message: result.message };
    } else {
      console.error(`❌ TikTok API error [${event_name}]: code=${result.code}`, result.message);
      return { success: false, code: result.code, message: result.message };
    }
  } catch (error) {
    console.error(`❌ TikTok Conversions API fetch error [${event_name}]:`, error);
    return { success: false, message: String(error) };
  }
}
