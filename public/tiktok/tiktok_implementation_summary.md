# TikTok Pixel Implementation Summary
**For: Lala Fashion Store | Status: Critical Events Missing**

---

## 🚨 Current Issue

**TikTok Alert:** 5 critical funnel events are not configured
- Impact: CPA reduction potential = **5.7-7.7%** if all events implemented
- Severity: **CRITICAL**
- Affected Events: Page view, View content, Add to cart, Initiate checkout, Purchase

---

## ✅ What's Working

| Component | Status | Details |
|-----------|--------|---------|
| Base Pixel Code | ✅ Installed | ID: D99L713C77U03DOJCBLG |
| Browser Events | ⚠️ Partial | Only basic tracking, missing standard events |
| Server Events | ❌ Missing | No Conversions API setup |
| Pixel Name | ✅ Set | LALAFASHION |

---

## 🔧 What Needs to Be Done

### Phase 1: Browser-Side Events (Client-Side)
Implement 5 standard TikTok events in Next.js:

```
📍 PageView
   └─ Triggers: Every route change
   
📍 ViewContent  
   └─ Triggers: When user views product
   └─ Data: Product ID, name, price
   
📍 AddToCart
   └─ Triggers: When product added to cart
   └─ Data: Product info, quantity, price
   
📍 InitiateCheckout
   └─ Triggers: When user starts checkout
   └─ Data: Total cart value, items
   
📍 Purchase ⭐ MOST IMPORTANT
   └─ Triggers: After successful order
   └─ Data: Order ID, total, customer email
```

**Implementation Method:**
- Add tracking code to existing pages
- Use TikTok's JavaScript library (already loaded)
- Call `window.ttq.track('EventName', {...data})`

---

### Phase 2: Server-Side Conversions API (Recommended)
Why needed:
- ✅ Bypasses ad blockers
- ✅ More accurate tracking
- ✅ Better for audience building
- ✅ Complies with GDPR/privacy laws
- ✅ Works offline

**Setup Steps:**
1. Get Access Token from TikTok Business Center
2. Store in `.env.local` file
3. Create API endpoint in Next.js
4. Send events to `https://business-api.tiktok.com/open_api/v1.3/pixel/track/`

**Implementation Files Needed:**
```
lib/tiktokConversions.js          ← Conversion tracking function
pages/api/tiktok-track.js         ← Public API endpoint
pages/api/orders/confirm.js       ← Server-side purchase tracking
.env.local                         ← Environment variables
```

---

## 📋 Files to Create/Modify

### CREATE (New Files)
```
✏️ lib/tiktokConversions.js
   - Function to send events to TikTok Conversions API
   - Email hashing (SHA-256) for privacy
   - Error handling

✏️ pages/api/tiktok-track.js
   - Public endpoint to receive tracking requests
   - Accepts event_type and data
   - Calls TikTok API

✏️ pages/api/orders/confirm.js
   - Handles order confirmation events
   - Called after successful payment
   - Sends Purchase event with order details
```

### MODIFY (Existing Files)
```
📝 pages/_app.js or pages/_document.js
   + Add PageView tracking on route change

📝 pages/products/[id].js (or product detail page)
   + Add ViewContent event when product loads

📝 components/AddToCart.js (or similar)
   + Add AddToCart event when button clicked

📝 pages/checkout.js
   + Add InitiateCheckout event on page load

📝 pages/order-confirmation.js
   + Add Purchase event server-side call
```

### CREATE CONFIG
```
✏️ .env.local (NEW - IMPORTANT)
   NEXT_PUBLIC_TIKTOK_PIXEL_ID=D99L713C77U03DOJCBLG
   TIKTOK_ACCESS_TOKEN=your_token_here
   TIKTOK_CONVERSIONS_API_URL=https://business-api.tiktok.com/open_api/v1.3/pixel/track/
```

---

## 🔑 Getting Access Token

**Steps:**
1. Login to https://ads.tiktok.com/
2. Go: **Business Center → Settings → Events**
3. Click: **Conversions API**
4. Click: **Generate Access Token**
5. Copy token → Paste in `.env.local`

**⚠️ Important:** 
- Keep this token SECRET (never share publicly)
- Store only in `.env.local` (not in git)
- Regenerate if exposed

---

## 🧪 Testing Checklist

### Browser Events Testing
```javascript
// Open browser console on your website
// Test each event:

window.ttq.track('PageView');

window.ttq.track('ViewContent', {
  content_id: 'product-123',
  content_name: 'Laptop',
  value: 50000,
  currency: 'PKR'
});

window.ttq.track('AddToCart', {
  content_id: 'product-123',
  value: 50000,
  currency: 'PKR',
  quantity: 1
});
```

### Server-Side Testing
```bash
# Test API endpoint
curl -X POST http://localhost:3000/api/tiktok-track \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "Purchase",
    "data": {
      "value": 5000,
      "currency": "PKR",
      "email": "test@example.com"
    }
  }'

# Expected response: 
# {"code":0,"message":"success"} or similar
```

### Dashboard Verification
1. Go to **TikTok Ads Manager**
2. **Assets → Events → View Events**
3. Should see:
   - ✅ Page views increasing
   - ✅ View content events
   - ✅ Add to cart events
   - ✅ Purchase events

---

## ⚡ Implementation Priority

### HIGH (Do First)
1. ✅ Purchase event (most valuable)
2. ✅ ViewContent event (conversion signal)
3. ✅ Server-side Conversions API (accuracy)

### MEDIUM (Do Next)
4. ✅ AddToCart event (funnel insight)
5. ✅ InitiateCheckout event (abandonment tracking)

### LOW (But Recommended)
6. ✅ PageView event (general analytics)

---

## 💡 Pro Tips

### Email Hashing
```javascript
// Always hash customer email before sending to TikTok
// This protects privacy while allowing audience matching

const crypto = require('crypto');
function hashEmail(email) {
  return crypto.createHash('sha256')
    .update(email.toLowerCase())
    .digest('hex');
}

// Use it:
// hashEmail('customer@example.com') 
// → 'a1b2c3d4e5f6...'
```

### Event Deduplication
- If same event sent from browser AND server, TikTok counts it once
- Use unique `event_id` to prevent duplicates
- Event ID format: `${Date.now()}_${Math.random()}`

### Currency
- All events: **PKR** (Pakistani Rupee)
- Example value: `5000` = 5000 PKR

### Testing Without Real Orders
1. Use TikTok "Test Events" feature
2. Send test events from browser console
3. Check "Test Events" dashboard within 1 minute

---

## 📚 Documentation Links

| Resource | URL |
|----------|-----|
| TikTok Pixel Guide | https://ads.tiktok.com/help/article/tiktok-pixel |
| Standard Events | https://ads.tiktok.com/help/article/standard-events-parameters |
| Conversions API | https://ads.tiktok.com/help/article/tiktok-conversions-api |
| Event Manager | https://ads.tiktok.com/help/article/tiktok-events-manager |

---

## ❓ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Events not showing in dashboard | Wait 5-15 minutes, check browser console for errors |
| CORS error on server-side | Ensure access token is correct and endpoint URL exact |
| Email not matching in audiences | Must hash email with SHA-256 before sending |
| Duplicate events counted | Use unique event_id for deduplication |
| Access token not working | Regenerate token in TikTok Business Center |

---

## 🚀 Timeline

**Week 1:** Browser events (PageView, ViewContent, AddToCart)
**Week 2:** Checkout events (InitiateCheckout)  
**Week 3:** Server-side Conversions API setup
**Week 4:** Testing & optimization

---

## 📞 Support Information

**For TikTok Help:**
- Email: eventsmanager-noreply@ads.tiktok.com
- Dashboard: https://ads.tiktok.com/
- Help Center: https://ads.tiktok.com/help/

**For Implementation Help:**
- Provide full error messages from console
- Share .env.local configuration (minus token)
- Share implementation code samples
- Describe which event is failing

---

## ✨ Expected Results

After full implementation:

**Month 1:**
- ✅ All 5 events showing in TikTok dashboard
- ✅ Event tracking accuracy >90%
- ✅ Conversion funnel visible

**Month 2-3:**
- ✅ CPA reduction: 5-7% (conservatively)
- ✅ Better audience targeting (pixel data)
- ✅ Improved ROAS on campaigns

**Ongoing:**
- ✅ Real-time conversion tracking
- ✅ Retargeting audiences built from pixel data
- ✅ Continuous optimization opportunity

---

**Status:** Ready for Google Antigravity Implementation
**Last Updated:** July 17, 2026
**Next Step:** Share these files with Google Antigravity for development
