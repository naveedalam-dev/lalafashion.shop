import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:$$Pakistanii9988@db.chlpbadjuiicssxsbmpq.supabase.co:5432/postgres';

async function runFix() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log("Connected to database.");

        const query = `
            INSERT INTO profiles (id, role, full_name, updated_at)
            VALUES ('7f4b9ea2-620e-45b7-80e4-b66e1ea56579', 'admin', 'Super Admin', NOW())
            ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = NOW();
        `;

        const res = await client.query(query);
        console.log("SQL executed successfully. Result:", res.rowCount);

    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

runFix();
