import fetch from 'node-fetch'

const token = 'sbp_e08362706a1eac3e74709c1dedc0198769dd8a4a'
const projectRef = 'chlpbadjuiicssxsbmpq'

async function checkProject() {
  console.log("Checking project with Management API...")
  
  // Get project info
  const projectRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!projectRes.ok) {
    console.error("Project lookup failed:", await projectRes.text())
    return
  }
  
  const project = await projectRes.json()
  console.log("Project Name:", project.name)
  console.log("Status:", project.status)

  // We can't easily get policies via Management API without many calls, 
  // but we can try to use the SQL endpoint IF we can get the service role key working 
  // or use the 'pg' proxy.
}

checkProject()
