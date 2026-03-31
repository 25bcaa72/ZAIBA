const { Pool } = require('pg');
const dns = require('dns');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Extract hostname from connection string
const url = new URL(process.env.DATABASE_URL);
const hostname = url.hostname;

console.log('Resolving hostname:', hostname);

// Manually resolve DNS
dns.lookup(hostname, { family: 4 }, (err, address, family) => {
  if (err) {
    console.error('DNS lookup failed:', err.message);
    return;
  }

  console.log('Resolved IP:', address);

  // Create connection string with IP
  const ipConnectionString = process.env.DATABASE_URL.replace(hostname, address);

  console.log('Attempting connection with IP:', ipConnectionString);

  const pool = new Pool({
    connectionString: ipConnectionString,
    ssl: {
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined
    },
    connectionTimeoutMillis: 10000,
    query_timeout: 10000
  });

  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('❌ Connection Error:', err.message);
      console.error('Error Code:', err.code);
    } else {
      console.log('✅ Successfully connected to NeonDB!');
      console.log('Current time from database:', result.rows[0]);
    }
    pool.end();
    process.exit(err ? 1 : 0);
  });
});