"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tiktok/useTikTokEvents";

/**
 * TikTokPageViewTracker
 * Fires TikTok PageView on every route change.
 * Must be rendered inside <Suspense> because useSearchParams() requires it.
 */
export function TikTokPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Small delay to ensure ttq is fully initialised after route change
    const timer = setTimeout(() => {
      trackPageView();
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Initial load — ttq.page() is already called by the base pixel in layout.tsx
  // but we still track on soft navigations via the useEffect above.

  return null;
}
