import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://chlpbadjuiicssxsbmpq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNobHBiYWRqdWlpY3NzeHNibXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTkzMTAsImV4cCI6MjA4ODQ3NTMxMH0.b39FqBOpnpY7qOrwC2EHeHpE_k0Avn4FI3sNEWWsqbc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkLogs() {
  const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10)
  if (error) {
    console.error("Error:", error)
  } else {
    console.log("Recent Activity Logs:")
    console.table(data.map(l => ({
      action: l.action,
      entity: l.entity_type,
      details: JSON.stringify(l.details),
      time: l.created_at
    })))
  }
}

checkLogs()
