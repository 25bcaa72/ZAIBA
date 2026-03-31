const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const { Pool } = require('pg');
const dns = require('dns').promises;

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
    throw new Error('DATABASE_URL is not set');
  }

  const parsedUrl = new URL(origUrl);
  const hostname = parsedUrl.hostname;

  for (let attempt = 1; attempt <= RETRY_MAX; attempt++) {
    try {
      console.log(`Database connect attempt ${attempt}/${RETRY_MAX} for ${hostname}`);
      const resolvedIp = await resolveHost(hostname);
      const pool = new Pool({
        host: resolvedIp,
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
      await pool.query('SELECT 1');
      console.log('✅ Database connection established');
      return pool;
    } catch (error) {
      console.error(`Database connection attempt ${attempt} failed:`, error.message);
      if (attempt < RETRY_MAX) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  throw new Error('Could not connect to NeonDB after multiple attempts');
}

let pool;
createPool()
  .then((p) => {
    pool = p;
  })
  .catch((err) => {
    console.error('Unable to initialize database pool:', err.message);
    pool = null;
  });

// Routes

// Get all portfolio items
app.get('/api/portfolio', async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const result = await pool.query('SELECT * FROM portfolio_items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    // Return sample data if database is not available
    res.json([
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform with payment integration',
        image_url: '/images/project-fallback.png',
        project_url: 'https://github.com',
        technologies: 'React, Node.js, PostgreSQL'
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'A collaborative task management application',
        image_url: 'https://via.placeholder.com/400x300',
        project_url: 'https://github.com',
        technologies: 'Vue.js, Express, MongoDB'
      }
    ]);
  }
});

// Get single portfolio item
app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM portfolio_items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio item' });
  }
});

// Create portfolio item
app.post('/api/portfolio', async (req, res) => {
  try {
    const { title, description, image_url, project_url, technologies } = req.body;
    const result = await pool.query(
      'INSERT INTO portfolio_items (title, description, image_url, project_url, technologies) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, image_url, project_url, technologies]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(500).json({ error: 'Failed to create portfolio item' });
  }
});

// Get contact messages
app.get('/api/messages', async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create contact message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error creating message:', error);
    // Return success even if database fails - for demo purposes
    res.status(201).json({
      success: true,
      message: 'Message received! (Database not yet configured - check NEONDB_SETUP.md)',
      note: 'Database connection pending - run SQL in NeonDB console'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
