import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobHBiYWRqdWlpY3NzeHNibXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTkzMTAsImV4cCI6MjA4ODQ3NTMxMH0.b39FqBOpnpY7qOrwC2EHeHpE_k0Avn4FI3sNEWWsqbc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPolicies() {
  // We can try to query policy info if the user allowed it, 
  // but usually system tables are restricted.
  // Instead, let's just try to INSERT and see the error.
  
  console.log("Attempting to insert product with ANON key...")
  const { data, error } = await supabase.from('products').insert({
    name: "Test Product " + Date.now(),
    slug: "test-product-" + Date.now(),
    sale_price: 100,
    category_id: "71320f71-0675-4d00-ac94-b26a6406f57f", // Assuming this exists or using a random UUID
    stock_status: "ACTIVE"
  }).select()
  
  if (error) {
    console.log("Insert Error:", error)
  } else {
    console.log("Insert Success:", data)
  }
}

checkPolicies()
