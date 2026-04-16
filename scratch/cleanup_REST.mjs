import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobHBiYWRqdWlpY3NzeHNibXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTkzMTAsImV4cCI6MjA4ODQ3NTMxMH0.b39FqBOpnpY7qOrwC2EHeHpE_k0Avn4FI3sNEWWsqbc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runCleanup() {
  console.log("Cleaning up products...")
  const { data, error } = await supabase
    .from('products')
    .delete()
    .ilike('name', 'Success Test Product%')
    .select()

  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Deleted items:", data?.length || 0)
    data?.forEach(p => console.log(`Deleted: ${p.name}`))
  }
}

runCleanup()
