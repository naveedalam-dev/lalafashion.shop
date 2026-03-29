import type { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

const BASE = 'https://www.lalafashion.store';

// ─── STATIC PAGES ─────────────────────────────────────────────────────────────
const STATIC_ROUTES: {
  url: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}[] = [
  { url: '/',                priority: 1.0, changeFrequency: 'daily'   },
  { url: '/shop',            priority: 0.9, changeFrequency: 'daily'   },
  { url: '/about',           priority: 0.6, changeFrequency: 'monthly' },
  { url: '/contact',         priority: 0.6, changeFrequency: 'monthly' },
  { url: '/faqs',            priority: 0.5, changeFrequency: 'monthly' },
  { url: '/track-order',     priority: 0.5, changeFrequency: 'monthly' },
  { url: '/privacy-policy',  priority: 0.3, changeFrequency: 'yearly'  },
  { url: '/data-policy',     priority: 0.3, changeFrequency: 'yearly'  },
  { url: '/return-policy',   priority: 0.4, changeFrequency: 'monthly' },
  { url: '/shipment-policy', priority: 0.4, changeFrequency: 'monthly' },
  { url: '/terms',           priority: 0.3, changeFrequency: 'yearly'  },
  { url: '/disclaimer',      priority: 0.2, changeFrequency: 'yearly'  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const supabase = await createClient();

  // ── Static routes ────────────────────────────────────────────────────────────
  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // ── Product pages ─────────────────────────────────────────────────────────────
  // Only ACTIVE products with valid slugs
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('stock_status', 'ACTIVE')
    .not('slug', 'is', null)
    .order('updated_at', { ascending: false });

  const productUrls: MetadataRoute.Sitemap = (products || [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE}/product/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // ── Category pages ────────────────────────────────────────────────────────────
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .not('slug', 'is', null);

  const categoryUrls: MetadataRoute.Sitemap = (categories || [])
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${BASE}/category/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
