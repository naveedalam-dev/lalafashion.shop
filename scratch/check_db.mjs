import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:$$Pakistanii9988@db.chlpbadjuiicssxsbmpq.supabase.co:5432/postgres";

async function checkProducts() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    console.log("\n--- Checking Products ---");
    const res = await client.query('SELECT id, name, stock_status, is_active, created_at FROM public.products ORDER BY created_at DESC LIMIT 5');
    console.table(res.rows);

    console.log("\n--- Checking RLS Policies ---");
    const rlsRes = await client.query(`
      SELECT 
          pol.polname AS policy_name,
          pol.polcmd AS command,
          pg_get_expr(pol.polqual, pol.polrelid) AS using_expression
      FROM 
          pg_policy pol
      JOIN 
          pg_class tab ON pol.polrelid = tab.oid
      JOIN 
          pg_namespace nsp ON tab.relnamespace = nsp.oid
      WHERE 
          nsp.nspname = 'public'
          AND tab.relname = 'products';
    `);
    console.table(rlsRes.rows);

    console.log("\n--- Checking RLS Enabled ---");
    const rlsEnabledRes = await client.query(`
      SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'products';
    `);
    console.table(rlsEnabledRes.rows);

  } catch (err) {
    console.error("Error connecting to database:", err);
  } finally {
    await client.end();
  }
}

checkProducts();
