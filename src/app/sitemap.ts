import type { MetadataRoute } from 'next';

const BASE = 'https://www.lalafashion.store';

// ─── STATIC PAGES ─────────────────────────────────────────────────────────────
// Only public, indexable pages. Admin / API / auth / checkout excluded.
const STATIC_ROUTES: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { url: '/',                priority: 1.0,  changeFrequency: 'daily'   },
  { url: '/about',           priority: 0.6,  changeFrequency: 'monthly' },
  { url: '/contact',         priority: 0.6,  changeFrequency: 'monthly' },
  { url: '/faqs',            priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/track-order',     priority: 0.5,  changeFrequency: 'monthly' },
  { url: '/privacy-policy',  priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/data-policy',     priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/return-policy',   priority: 0.4,  changeFrequency: 'monthly' },
  { url: '/shipment-policy', priority: 0.4,  changeFrequency: 'monthly' },
  { url: '/terms',           priority: 0.3,  changeFrequency: 'yearly'  },
  { url: '/disclaimer',      priority: 0.2,  changeFrequency: 'yearly'  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_ROUTES.map(({ url, priority, changeFrequency }) => ({
    url:              `${BASE}${url}`,
    lastModified:     now,
    changeFrequency,
    priority,
  }));
}
