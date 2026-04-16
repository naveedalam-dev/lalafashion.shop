import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobHBiYWRqdWlpY3NzeHNibXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTkzMTAsImV4cCI6MjA4ODQ3NTMxMH0.b39FqBOpnpY7qOrwC2EHeHpE_k0Avn4FI3sNEWWsqbc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  // We can't query information_schema via anon key usually.
  // But we can check one product's full data.
  const { data, error } = await supabase.from('products').select('*').limit(1)
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Product Schema Example:", Object.keys(data[0]))
    console.log("Full Data:", data[0])
  }
}

checkSchema()
