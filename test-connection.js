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
    // fallback to external resolver
    const resolver = new dns.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);
    const addresses = await resolver.resolve4(hostname);
    return addresses[0];
  }
}

async function connectDatabase() {
  const origUrl = process.env.DATABASE_URL;
  if (!origUrl) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const url = new URL(origUrl);
  const hostname = url.hostname;

  for (let attempt = 1; attempt <= RETRY_MAX; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${RETRY_MAX}: resolving ${hostname}`);
      const ip = await resolveHost(hostname);
      const connectionString = origUrl.replace(hostname, ip);

      const parsedUrl = new URL(connectionString);
      const pool = new Pool({
        host: parsedUrl.hostname,
        port: parsedUrl.port || 5432,
        database: parsedUrl.pathname.replace('/', ''),
        user: parsedUrl.username,
        password: parsedUrl.password,
        ssl: {
          rejectUnauthorized: false,
          servername: hostname,
          checkServerIdentity: () => undefined
        },
        connectionTimeoutMillis: 10000,
        query_timeout: 10000
      });

      const result = await pool.query('SELECT NOW()');
      console.log('✅ Successfully connected to NeonDB!');
      console.log('Current time from database:', result.rows[0]);
      await pool.end();
      return true;
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error.message || error);
      if (attempt < RETRY_MAX) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  console.error('❌ Unable to connect to NeonDB after several attempts.');
  return false;
}

(async () => {
  const success = await connectDatabase();
  process.exit(success ? 0 : 1);
})();
