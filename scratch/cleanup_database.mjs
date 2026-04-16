import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:$$Pakistanii9988@db.chlpbadjuiicssxsbmpq.supabase.co:5432/postgres';

async function runCleanup() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log("Connected to database.");

        // Delete the broken test product
        const deleteQuery = `DELETE FROM products WHERE name LIKE 'Success Test Product%';`;
        const deleteRes = await client.query(deleteQuery);
        console.log("Deleted broken test products. Count:", deleteRes.rowCount);

    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await client.end();
    }
}

runCleanup();
