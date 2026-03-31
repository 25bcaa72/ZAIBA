const { Pool } = require('pg');
const dns = require('dns').promises;
require('dotenv').config();

const RETRY_MAX = 10;
const RETRY_DELAY_MS = 5000;

async function resolveHost(hostname) {
  try {
    const addresses = await dns.resolve4(hostname);
    return addresses[0];
  } catch (err) {
    const resolver = new dns.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);
    const addresses = await resolver.resolve4(hostname);
    return addresses[0];
  }
}

async function createPool() {
  const origUrl = process.env.DATABASE_URL;
  if (!origUrl) {
    throw new Error('DATABASE_URL is not set in .env');
  }

  const url = new URL(origUrl);
  const hostname = url.hostname;

  for (let attempt = 1; attempt <= RETRY_MAX; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${RETRY_MAX}: resolving ${hostname}`);
      const ip = await resolveHost(hostname);
      const connectionString = origUrl.replace(hostname, ip);

      return new Pool({
        host: ip,
        port: url.port || 5432,
        database: url.pathname.replace('/', ''),
        user: url.username,
        password: url.password,
        ssl: {
          rejectUnauthorized: false,
          servername: hostname,
          checkServerIdentity: () => undefined
        },
        connectionTimeoutMillis: 10000,
        query_timeout: 10000
      });
    } catch (error) {
      console.warn(`Pool setup attempt ${attempt} failed:`, error.message);
      if (attempt < RETRY_MAX) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  throw new Error('Unable to resolve NeonDB hostname after multiple attempts');
}

const fs = require('fs');
const sql = fs.readFileSync('./database.sql', 'utf8');

async function initializeDatabase() {
  try {
    console.log('Connecting to NeonDB...');
    const pool = await createPool();
    const client = await pool.connect();
    
    console.log('Creating tables...');
    // Split SQL by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      await client.query(statement);
    }
    
    console.log('✅ Database tables created successfully!');
    console.log('Portfolio items were inserted as sample data.');
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
