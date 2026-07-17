import { NextRequest, NextResponse } from "next/server";
import { trackConversion, TikTokEventData } from "@/lib/tiktok/conversions";

/**
 * POST /api/tiktok-track
 * Receives browser events and forwards them to TikTok Conversions API server-side.
 * This allows deduplication: browser fires ttq.track() and also calls this endpoint
 * with the same event_id → TikTok counts it as one event.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_type, event_id, data } = body as {
      event_type: string;
      event_id?: string;
      data: TikTokEventData;
    };

    if (!event_type || !data) {
      return NextResponse.json(
        { error: "Missing event_type or data" },
        { status: 400 }
      );
    }

    // Enrich with real IP and user-agent from the request
    const enrichedData: TikTokEventData = {
      ...data,
      event_id: event_id || data.event_id, // carry dedup ID from browser
      ip_address:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown",
      user_agent: req.headers.get("user-agent") || undefined,
    };

    const result = await trackConversion(event_type, enrichedData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/tiktok-track error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
