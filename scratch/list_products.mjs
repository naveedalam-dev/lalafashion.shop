import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobHBiYWRqdWlpY3NzeHNibXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTkzMTAsImV4cCI6MjA4ODQ3NTMxMH0.b39FqBOpnpY7qOrwC2EHeHpE_k0Avn4FI3sNEWWsqbc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Total Products:", data.length)
    console.table(data.map(p => ({
      id: p.id,
      name: p.name,
      status: p.stock_status,
      featured: p.is_featured,
      popular: p.is_popular,
      created: p.created_at
    })))
  }
}

checkProducts()
