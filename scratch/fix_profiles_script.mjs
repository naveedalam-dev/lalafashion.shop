import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
// Using the service role key to bypass RLS and fix the table
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg5OTMxMCwiZXhwIjoyMDg4NDc1MzEwfQ.U5BiXS9LBJHFmHqBZRra0uKDeKPQbsbc5fEi1Wi58Ag'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const ADMIN_UUID = '7f4b9ea2-620e-45b7-80e4-b66e1ea56579'

async function fixProfiles() {
  console.log("Checking if admin profile exists...")
  const { data: existing, error: checkError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', ADMIN_UUID)
    .single()

  if (existing) {
    console.log("Admin profile already exists:", existing)
    if (existing.role !== 'admin') {
      console.log("Updating role to admin...")
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', ADMIN_UUID)
    }
  } else {
    console.log("Inserting admin profile...")
    const { error: insertError } = await supabase.from('profiles').insert({
      id: ADMIN_UUID,
      role: 'admin',
      full_name: 'Super Admin',
      updated_at: new Date().toISOString()
    })
    
    if (insertError) {
      console.error("Insert Error:", insertError)
    } else {
      console.log("Admin profile inserted successfully.")
    }
  }
}

fixProfiles()
