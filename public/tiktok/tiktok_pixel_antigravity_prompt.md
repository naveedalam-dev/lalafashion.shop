# TikTok Pixel Events Setup - Google Antigravity Implementation Guide

## Project Overview
Implement complete TikTok Pixel tracking for **Lala Fashion Store** (Next.js e-commerce):
- **Pixel ID:** D99L713C77U03DOJCBLG
- **Pixel Name:** LALAFASHION
- **Platform:** Next.js/Custom
- **Goal:** Setup 5 critical missing events + server-side Conversions API

---

## Phase 1: Browser-Side Events (Already Partially Done)

### Current Status
✅ Basic pixel code installed
✅ Browser events receiving (some)
❌ Missing: Page view, View content, Add to cart, Initiate checkout, Purchase

### Required Implementation

#### 1. **Enhanced Basic Pixel Code** (with event tracking)
```javascript
// pages/_app.js or _document.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Initialize TikTok Pixel
    if (window.ttq) {
      // Track page views
      window.ttq.track('PageView');
    }
  }, [router.pathname]); // Triggers on route change

  return <Component {...pageProps} />;
}
```

#### 2. **View Content Event** (Product Page)
```javascript
// components/ProductDetail.js
import { useEffect } from 'react';

export default function ProductDetail({ product }) {
  useEffect(() => {
    if (window.ttq && product) {
      window.ttq.track('ViewContent', {
        content_id: product.id.toString(),
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'PKR'
      });
    }
  }, [product.id]);

  return (
    // Product detail JSX
  );
}
```

#### 3. **Add to Cart Event**
```javascript
// components/AddToCart.js
const handleAddToCart = (product, quantity) => {
  if (window.ttq) {
    window.ttq.track('AddToCart', {
      content_id: product.id.toString(),
      content_name: product.name,
      content_type: 'product',
      value: product.price * quantity,
      currency: 'PKR',
      quantity: quantity
    });
  }
  // Add to cart logic...
};
```

#### 4. **Initiate Checkout Event**
```javascript
// pages/checkout.js
import { useEffect } from 'react';

export default function Checkout({ cartItems }) {
  useEffect(() => {
    const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (window.ttq && cartItems.length > 0) {
      window.ttq.track('InitiateCheckout', {
        content_type: 'product',
        value: totalValue,
        currency: 'PKR',
        contents: cartItems.map(item => ({
          content_id: item.id.toString(),
          content_name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      });
    }
  }, [cartItems]);

  return (
    // Checkout form JSX
  );
}
```

#### 5. **Purchase Event** (Order Confirmation)
```javascript
// pages/order-confirmation.js
import { useEffect } from 'react';

export default function OrderConfirmation({ order }) {
  useEffect(() => {
    if (window.ttq && order) {
      window.ttq.track('Purchase', {
        content_type: 'product',
        value: order.total,
        currency: 'PKR',
        contents: order.items.map(item => ({
          content_id: item.product_id.toString(),
          content_name: item.product_name,
          quantity: item.quantity,
          price: item.price
        })),
        order_id: order.id.toString()
      });
    }
  }, [order]);

  return (
    // Confirmation message JSX
  );
}
```

---

## Phase 2: Server-Side Conversions API (Critical for Accuracy)

### Setup Environment Variables
```env
# .env.local
NEXT_PUBLIC_TIKTOK_PIXEL_ID=D99L713C77U03DOJCBLG
TIKTOK_ACCESS_TOKEN=your_access_token_here
TIKTOK_CONVERSIONS_API_URL=https://business-api.tiktok.com/open_api/v1.3/pixel/track/
```

**How to get Access Token:**
1. Go to https://ads.tiktok.com/
2. Business Center → Settings → Events → Conversions API
3. Generate access token → Copy to `.env.local`

### Conversions API Helper Function
```javascript
// lib/tiktokConversions.js
export async function trackConversion(event_type, data) {
  try {
    const payload = {
      pixel_code: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
      event: {
        event_name: event_type,
        event_id: `${Date.now()}_${Math.random()}`, // Unique ID for deduplication
        timestamp: Math.floor(Date.now() / 1000),
        user: {
          ph: data.email ? hashEmail(data.email) : undefined, // Hash customer email
          client_ip_address: data.ip_address,
          user_agent: data.user_agent
        },
        content: {
          value: data.value,
          currency: data.currency || 'PKR'
        },
        properties: data.properties
      }
    };

    const response = await fetch(process.env.TIKTOK_CONVERSIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': process.env.TIKTOK_ACCESS_TOKEN
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  } catch (error) {
    console.error('TikTok Conversions API error:', error);
  }
}

// Helper: SHA-256 hash for email (privacy-safe)
function hashEmail(email) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}
```

### API Route for Server-Side Tracking
```javascript
// pages/api/tiktok-track.js
import { trackConversion } from '@/lib/tiktokConversions';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { event_type, data } = req.body;

  const result = await trackConversion(event_type, {
    ...data,
    ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    user_agent: req.headers['user-agent']
  });

  res.status(200).json(result);
}
```

### Order Confirmation (Server-Side - Most Accurate)
```javascript
// pages/api/orders/confirm.js
import { trackConversion } from '@/lib/tiktokConversions';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { order } = req.body;

  // Server-side tracking (most accurate)
  await trackConversion('Purchase', {
    value: order.total,
    currency: 'PKR',
    email: order.customer_email,
    properties: {
      order_id: order.id,
      items: order.items
    }
  });

  // Also send browser event (for real-time tracking in dashboard)
  // This happens client-side on order confirmation page

  res.status(200).json({ success: true });
}
```

---

## Phase 3: Testing & Validation

### Test Events in TikTok Event Manager
1. Go to **https://ads.tiktok.com/**
2. **Ads Manager → Assets → Events → Test Events**
3. Use browser console:
```javascript
// Test PageView
window.ttq.track('PageView');

// Test ViewContent
window.ttq.track('ViewContent', {
  content_id: 'test-123',
  content_name: 'Test Product',
  value: 5000,
  currency: 'PKR'
});

// Check in browser console
console.log(window.ttq); // Should show ttq object
```

### Server-Side Testing
```bash
# Test Conversions API endpoint
curl -X POST http://localhost:3000/api/tiktok-track \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "Purchase",
    "data": {
      "value": 5000,
      "currency": "PKR",
      "email": "customer@example.com"
    }
  }'
```

---

## Implementation Checklist

### Browser-Side Events
- [ ] Page view event on route change
- [ ] View content event on product page
- [ ] Add to cart event with product details
- [ ] Initiate checkout event on checkout page
- [ ] Purchase event on order confirmation

### Server-Side (Conversions API)
- [ ] Environment variables configured
- [ ] Access token generated & stored
- [ ] Conversion helper function created
- [ ] API route created for tracking
- [ ] Order confirmation calls server-side event
- [ ] Email hashing implemented

### Testing
- [ ] Browser events showing in TikTok dashboard
- [ ] Server events showing in TikTok dashboard
- [ ] Deduplication working (same event from both sides counted as one)
- [ ] Real orders tracking properly
- [ ] Email matching for audience building

### Monitoring
- [ ] Check TikTok Event Manager daily for first week
- [ ] Monitor Conversions API for errors
- [ ] Verify event counts match actual conversions
- [ ] Enable "Test Events" in TikTok dashboard

---

## Important Notes

### Data Privacy
- ✅ Always hash emails before sending to TikTok
- ✅ Don't send sensitive data (passwords, SSN)
- ✅ Use HTTPS only

### Event Deduplication
- Browser-side + Server-side events can be deduplicated using `event_id`
- TikTok automatically deduplicates if same event_id received within 48 hours

### Documentation Links
- Event Parameters: https://ads.tiktok.com/help/article/standard-events-parameters
- Conversions API: https://ads.tiktok.com/help/article/tiktok-conversions-api
- Event Manager: https://ads.tiktok.com/help/article/tiktok-events-manager

---

## Files to Create/Modify

1. **lib/tiktokConversions.js** - Conversion tracking helper
2. **pages/api/tiktok-track.js** - Public API route
3. **pages/api/orders/confirm.js** - Order confirmation tracking
4. **pages/_app.js** - Add page view tracking
5. **components/ProductDetail.js** - Add view content event
6. **components/AddToCart.js** - Add to cart event
7. **.env.local** - Environment variables (create new file)

---

## Questions for Implementation?

Agar implementation ke doran koi issue aaye:
1. Console mein error message check karo
2. TikTok Event Manager dashboard mein test events dekhao
3. Ensure CORS allowed for conversions API domain
4. Check access token expiry date

**Ready to implement!** 🚀
