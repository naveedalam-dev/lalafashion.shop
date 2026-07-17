/**
 * TikTok Pixel Events - Copy & Paste Code Snippets
 * For Lala Fashion Store (Next.js)
 * 
 * Instructions:
 * 1. Copy the relevant snippet
 * 2. Paste into your Next.js file
 * 3. Adjust paths and variable names as needed
 * 4. Test in browser console
 */

// ============================================
// 1. PAGE VIEW EVENT
// ============================================
// File: pages/_app.js or pages/_document.js
// Triggers: Every time user navigates to a new page

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Track page view on route change
    const handleRouteChange = () => {
      if (window.ttq) {
        window.ttq.track('PageView');
        console.log('📍 PageView tracked:', router.pathname);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return <Component {...pageProps} />;
}

// ============================================
// 2. VIEW CONTENT EVENT
// ============================================
// File: pages/products/[id].js or ProductDetail.js
// Triggers: When product page loads

import { useEffect } from 'react';

export default function ProductDetail({ product }) {
  useEffect(() => {
    if (window.ttq && product) {
      window.ttq.track('ViewContent', {
        content_id: product.id.toString(),
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'PKR',
        // Optional: add more details
        properties: {
          category: product.category,
          sku: product.sku,
          image_url: product.image
        }
      });
      
      console.log('👀 ViewContent tracked:', product.name);
    }
  }, [product?.id]); // Re-track if product changes

  return (
    <div>
      <h1>{product?.name}</h1>
      <p>Price: Rs {product?.price}</p>
      {/* Product details JSX */}
    </div>
  );
}

// ============================================
// 3. ADD TO CART EVENT
// ============================================
// File: components/AddToCart.js or similar
// Triggers: When user clicks "Add to Cart"

import { useState } from 'react';

export default function AddToCart({ product, onAddSuccess }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      // Add to cart logic here
      const cartItem = {
        product_id: product.id,
        quantity: quantity,
        price: product.price
      };

      // Track AddToCart event
      if (window.ttq) {
        window.ttq.track('AddToCart', {
          content_id: product.id.toString(),
          content_name: product.name,
          content_type: 'product',
          value: product.price * quantity,
          currency: 'PKR',
          quantity: quantity,
          // Optional: if you have cart contents
          contents: [
            {
              content_id: product.id.toString(),
              content_name: product.name,
              quantity: quantity,
              price: product.price
            }
          ]
        });
        
        console.log('🛒 AddToCart tracked:', product.name, 'Qty:', quantity);
      }

      // Call parent callback
      if (onAddSuccess) onAddSuccess(cartItem);

      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      <label>
        Quantity:
        <input 
          type="number" 
          min="1" 
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </label>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

// ============================================
// 4. INITIATE CHECKOUT EVENT
// ============================================
// File: pages/checkout.js
// Triggers: When user opens checkout page

import { useEffect, useState } from 'react';

export default function Checkout({ cartItems = [] }) {
  const [checkoutInitiated, setCheckoutInitiated] = useState(false);

  useEffect(() => {
    // Calculate total value
    const totalValue = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    // Track InitiateCheckout only once when page loads
    if (cartItems.length > 0 && !checkoutInitiated && window.ttq) {
      window.ttq.track('InitiateCheckout', {
        content_type: 'product',
        value: totalValue,
        currency: 'PKR',
        contents: cartItems.map(item => ({
          content_id: item.product_id.toString(),
          content_name: item.product_name,
          quantity: item.quantity,
          price: item.price
        }))
      });

      console.log('🛍️ InitiateCheckout tracked. Total:', totalValue, 'PKR');
      setCheckoutInitiated(true);
    }
  }, [cartItems, checkoutInitiated]);

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        {cartItems.map(item => (
          <div key={item.product_id}>
            <p>{item.product_name} x {item.quantity}</p>
            <p>Rs {item.price * item.quantity}</p>
          </div>
        ))}
        <h3>Total: Rs {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</h3>
      </div>
      {/* Checkout form JSX */}
    </div>
  );
}

// ============================================
// 5. PURCHASE EVENT (BROWSER-SIDE)
// ============================================
// File: pages/order-confirmation.js
// Triggers: After successful order

import { useEffect } from 'react';

export default function OrderConfirmation({ order }) {
  useEffect(() => {
    // Track Purchase event
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
        properties: {
          order_id: order.id,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone
        }
      });

      console.log('✅ Purchase tracked. Order ID:', order.id, 'Total:', order.total, 'PKR');
    }
  }, [order?.id]); // Re-track if order changes

  return (
    <div>
      <h1>Order Confirmed! 🎉</h1>
      <p>Order ID: {order?.id}</p>
      <p>Total: Rs {order?.total}</p>
      <p>Thank you for your purchase!</p>
    </div>
  );
}

// ============================================
// 6. SERVER-SIDE CONVERSION TRACKING
// ============================================
// File: lib/tiktokConversions.js
// Purpose: Send events to TikTok Conversions API

const crypto = require('crypto');

/**
 * Track conversion event via TikTok Conversions API
 * @param {string} event_type - Event name (Purchase, ViewContent, etc.)
 * @param {object} data - Event data
 * @returns {Promise} TikTok API response
 */
export async function trackConversion(event_type, data) {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const apiUrl = process.env.TIKTOK_CONVERSIONS_API_URL;

  if (!accessToken) {
    console.error('❌ TIKTOK_ACCESS_TOKEN not configured in .env.local');
    return null;
  }

  try {
    // Create unique event ID for deduplication
    const eventId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare payload
    const payload = {
      pixel_code: pixelId,
      event: {
        event_name: event_type,
        event_id: eventId,
        timestamp: Math.floor(Date.now() / 1000),
        user: {
          ph: data.email ? hashEmail(data.email) : null,
          client_ip_address: data.ip_address,
          user_agent: data.user_agent
        },
        content: {
          value: data.value,
          currency: data.currency || 'PKR'
        },
        properties: data.properties || {}
      }
    };

    // Send to TikTok
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.code === 0) {
      console.log(`✅ TikTok ${event_type} tracked successfully`);
    } else {
      console.error(`❌ TikTok API error: ${result.message}`);
    }

    return result;
  } catch (error) {
    console.error('❌ TikTok Conversions API error:', error);
    return null;
  }
}

/**
 * Hash email for privacy (SHA-256)
 * @param {string} email - Customer email
 * @returns {string} Hashed email
 */
function hashEmail(email) {
  if (!email) return null;
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
}

// ============================================
// 7. API ROUTE FOR TRACKING
// ============================================
// File: pages/api/tiktok-track.js
// Purpose: Endpoint to send tracking events from frontend

import { trackConversion } from '@/lib/tiktokConversions';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event_type, data } = req.body;

    // Validate input
    if (!event_type || !data) {
      return res.status(400).json({ error: 'Missing event_type or data' });
    }

    // Add request metadata to data
    const enrichedData = {
      ...data,
      ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      user_agent: req.headers['user-agent']
    };

    // Send to TikTok
    const result = await trackConversion(event_type, enrichedData);

    return res.status(200).json({
      success: result?.code === 0,
      message: result?.message || 'Event tracked'
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ============================================
// 8. ORDER CONFIRMATION ENDPOINT
// ============================================
// File: pages/api/orders/confirm.js
// Purpose: Track purchase after payment

import { trackConversion } from '@/lib/tiktokConversions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order } = req.body;

    if (!order) {
      return res.status(400).json({ error: 'Missing order data' });
    }

    // Server-side tracking (most accurate)
    await trackConversion('Purchase', {
      value: order.total,
      currency: 'PKR',
      email: order.customer_email,
      ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      user_agent: req.headers['user-agent'],
      properties: {
        order_id: order.id,
        items_count: order.items.length,
        payment_method: order.payment_method
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Order confirmed and tracked'
    });
  } catch (error) {
    console.error('Order confirmation error:', error);
    return res.status(500).json({ error: 'Failed to confirm order' });
  }
}

// ============================================
// 9. TESTING IN BROWSER CONSOLE
// ============================================
// Copy-paste these commands in browser developer tools (F12)

// Test PageView
window.ttq.track('PageView');
console.log('✅ PageView test sent');

// Test ViewContent
window.ttq.track('ViewContent', {
  content_id: 'test-123',
  content_name: 'Test Product',
  value: 5000,
  currency: 'PKR'
});
console.log('✅ ViewContent test sent');

// Test AddToCart
window.ttq.track('AddToCart', {
  content_id: 'test-123',
  value: 5000,
  currency: 'PKR',
  quantity: 1
});
console.log('✅ AddToCart test sent');

// Test Purchase
window.ttq.track('Purchase', {
  content_id: 'test-123',
  value: 5000,
  currency: 'PKR'
});
console.log('✅ Purchase test sent');

// Check if TikTok pixel is loaded
console.log('TikTok Pixel Status:', window.ttq ? '✅ Loaded' : '❌ Not loaded');

// ============================================
// 10. SERVER-SIDE TESTING (CURL)
// ============================================
// Run these in terminal to test API endpoints

// Test basic tracking endpoint:
// curl -X POST http://localhost:3000/api/tiktok-track \
//   -H "Content-Type: application/json" \
//   -d '{
//     "event_type": "Purchase",
//     "data": {
//       "value": 5000,
//       "currency": "PKR",
//       "email": "test@example.com"
//     }
//   }'

// Test order confirmation endpoint:
// curl -X POST http://localhost:3000/api/orders/confirm \
//   -H "Content-Type: application/json" \
//   -d '{
//     "order": {
//       "id": "order-123",
//       "total": 5000,
//       "customer_email": "customer@example.com",
//       "items": [{"product_id": "123", "quantity": 1}]
//     }
//   }'

// ============================================
// 11. DEBUGGING HELPER
// ============================================
// File: lib/debugTikTok.js
// Use this to debug TikTok pixel issues

export function debugTikTokPixel() {
  console.group('🔍 TikTok Pixel Debug Info');
  
  console.log('Pixel loaded:', !!window.ttq);
  console.log('Pixel ID:', process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);
  console.log('Environment:', process.env.NODE_ENV);
  
  if (window.ttq) {
    console.log('TTQ methods:', window.ttq.methods);
    console.log('TTQ instances:', window.ttq._i);
  }
  
  // Check if tracking scripts loaded
  const scripts = Array.from(document.scripts);
  const tiktokScript = scripts.find(s => s.src.includes('tiktok'));
  console.log('TikTok script loaded:', !!tiktokScript);
  
  console.groupEnd();
}

// Call in useEffect or on page load:
// debugTikTokPixel();

// ============================================
// END OF SNIPPETS
// ============================================
// 
// Usage Guide:
// 1. Copy relevant snippets above
// 2. Paste into your Next.js files
// 3. Adjust imports and variable names
// 4. Test in browser console
// 5. Monitor TikTok dashboard
// 6. Celebrate when events appear! 🎉
