// Simple database connection test
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:FzYIcEutlCUYnzzg@db.jyhommgcwshroilavdmj.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database successfully!');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('⏰ Current database time:', result.rows[0].current_time);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('categories', 'donation_centers', 'center_categories')
      ORDER BY table_name
    `);
    
    console.log('📋 Existing tables:', tablesResult.rows.map(row => row.table_name));
    
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found. You need to run the database-setup.sql script in Supabase.');
    } else {
      // Count records
      for (const table of tablesResult.rows) {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
        console.log(`📊 ${table.table_name}: ${countResult.rows[0].count} records`);
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

testConnection();