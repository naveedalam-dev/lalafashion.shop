import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobHBiYWRqdWlpY3NzeHNibXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTkzMTAsImV4cCI6MjA4ODQ3NTMxMH0.b39FqBOpnpY7qOrwC2EHeHpE_k0Avn4FI3sNEWWsqbc' // ANON KEY
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg5OTMxMCwiZXhwIjoyMDg4NDc1MzEwfQ.U5BiXS9LBJHFmHqBZRra0uKDeKPQbsbc5fEi1Wi58Ag' // SERVICE ROLE KEY

const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function checkProducts() {
  console.log("--- Fetching with ANON KEY ---")
  const { data: anonProds, error: anonError } = await supabase.from('products').select('id, name, stock_status').limit(5)
  if (anonError) console.error("Anon Fetch Error:", anonError)
  else console.log("Anon Products:", anonProds)

  console.log("\n--- Fetching with SERVICE ROLE KEY ---")
  const { data: adminProds, error: adminError } = await supabaseAdmin.from('products').select('id, name, stock_status').limit(5)
  if (adminError) console.error("Admin Fetch Error:", adminError)
  else console.log("Admin Products:", adminProds)
}

checkProducts()
