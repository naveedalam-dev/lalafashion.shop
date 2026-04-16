import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobHBiYWRqdWlpY3NzeHNibXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTkzMTAsImV4cCI6MjA4ODQ3NTMxMH0.b39FqBOpnpY7qOrwC2EHeHpE_k0Avn4FI3sNEWWsqbc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPolicies() {
  console.log("Attempting to insert product with ANON key into 'Watches'...")
  const { data, error } = await supabase.from('products').insert({
    name: "Success Test Product " + Date.now(),
    slug: "success-test-product-" + Date.now(),
    sale_price: 1500,
    category_id: "eacc5fa9-13d3-489d-9e24-71aea36f5736", // Watches
    stock_status: "ACTIVE",
    sku: "TEST-" + Math.floor(Math.random() * 1000)
  }).select()
  
  if (error) {
    console.log("Insert Error:", error)
  } else {
    console.log("Insert Success! New ID:", data[0].id)
  }
}

checkPolicies()
