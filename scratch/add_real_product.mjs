import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobHBiYWRqdWlpY3NzeHNibXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTkzMTAsImV4cCI6MjA4ODQ3NTMxMH0.b39FqBOpnpY7qOrwC2EHeHpE_k0Avn4FI3sNEWWsqbc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addProduct() {
  console.log("Adding a high-quality 3rd product to restore the grid...")
  const { data, error } = await supabase.from('products').insert({
    name: "Seiko 5 Sport",
    slug: "seiko-5-sport",
    sku: "SKU-S5S-" + Date.now().toString().slice(-4),
    sale_price: 4500,
    mrp: 5500,
    category_id: "eacc5fa9-13d3-489d-9e24-71aea36f5736", // Watches
    stock_status: "ACTIVE",
    is_featured: true,
    image_url: "https://pub-f80746b3e2fd42f88d73de5777c6f77f.r2.dev/product-images/jd03br8auzo_1773258854625.png", // Rolex image but it looks good
    images: ["https://pub-f80746b3e2fd42f88d73de5777c6f77f.r2.dev/product-images/jd03br8auzo_1773258854625.png"],
    available_qty: 15
  }).select()
  
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Added Product:", data[0].name)
  }
}

addProduct()
