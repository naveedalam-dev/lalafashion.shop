<p align="center">
  <img src="./public/Logo.png" alt="LALA Fashion Logo" width="180">
</p>

<h1 align="center">LALA Fashion</h1>

<p align="center">
  <strong>Modern Lifestyle Store — Pakistan</strong><br>
  Watches · Glasses · Jewellery · Electronics
</p>

<p align="center">
  <a href="https://www.lalafashion.store">Live Store</a> ·
  <a href="https://www.lalafashion.store/shop">Shop</a> ·
  <a href="https://www.instagram.com/lalafashion.shp/">Instagram</a> ·
  <a href="https://www.tiktok.com/@lalafashion.shp">TikTok</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-storefront-000000">
  <img src="https://img.shields.io/badge/Backend-Bagisto%20Headless%20Commerce-4F46E5">
  <img src="https://img.shields.io/badge/status-live-brightgreen">
  <img src="https://img.shields.io/badge/license-proprietary-lightgrey">
</p>

---

## About

LALA Fashion is Pakistan's e-commerce destination for watches, glasses, jewellery, and electronics, based in Rawalpindi. The storefront is a headless commerce build — a Next.js frontend consuming a Bagisto GraphQL backend — customized and deployed for LALA Fashion's catalog, branding, and order operations.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), server-rendered + ISR |
| Commerce backend | Bagisto Headless Commerce (GraphQL API) |
| Auth | NextAuth.js |
| Rendering strategy | Incremental Static Regeneration with revalidation, layered response caching |
| Media | Cloudflare R2 (product image delivery) |

> Built on the open-source [Bagisto Headless Commerce](https://bagisto.com/en/headless-ecommerce/) framework (MIT License). Catalog, branding, business logic, and deployment configuration are LALA Fashion's own.

## Features

- **Catalog** — Watches, Glasses, Jewellery, Electronics, with featured, new-arrival, and popular product rails
- **Cart & checkout** — guest and account checkout, live pricing with sale/discount display
- **Order tracking** — dedicated track-order flow tied to shipment/courier status
- **WhatsApp support** — direct chat widget for customer queries
- **Newsletter** — subscriber capture for collection drops and offers
- **Policy pages** — Terms, Privacy, Refund & Return, Delivery, Cancellation, Data Policy
- **Responsive design** — mobile-first, optimized for the majority-mobile Pakistani shopper base
- **SEO** — per-category and per-product meta, OpenGraph, structured URLs

## Prerequisites

- Node.js 18+ and pnpm
- A running Bagisto backend instance with the [Bagisto Headless Extension](https://github.com/bagisto/bagisto-api) installed

## Environment Variables

Create `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BAGISTO_ENDPOINT` | Bagisto backend URL |
| `NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY` | Bagisto storefront API key |
| `NEXT_PUBLIC_NEXT_AUTH_URL` | Public storefront URL (`https://www.lalafashion.store`) |
| `NEXT_PUBLIC_NEXT_AUTH_SECRET` | NextAuth secret — generate with `openssl rand -base64 32` |
| `COMPANY_NAME` | `LALA Fashion` |

**Never commit `.env.local`** — it holds credentials that control the live store.

## Getting Started

```bash
pnpm install
pnpm dev
```

Store runs at [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
pnpm build
pnpm start
```

Deployed via Vercel/Netlify with environment variables mirrored from the backend Bagisto instance.

## Business

**LALA Fashion**
House No PD 145, D1 G Floor, Main Street, Pindora, Satellite Town, Rawalpindi, Punjab, Pakistan
📞 +92 339 2255 235 · ✉️ support@lalafashion.store
[Instagram](https://www.instagram.com/lalafashion.shp/) · [TikTok](https://www.tiktok.com/@lalafashion.shp) · [X](https://x.com/lalafashion_shp) · [Threads](https://www.threads.com/@lalafashion.shp)

## License

© 2026 LALA Fashion. All rights reserved. This repository is private and proprietary to LALA Fashion. It builds on the Bagisto Headless Commerce framework, distributed under the MIT License — see [bagisto/nextjs-commerce](https://github.com/bagisto/nextjs-commerce) for the base framework's license terms.
