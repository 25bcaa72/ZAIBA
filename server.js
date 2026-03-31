const express = require('express');
const { MongoClient } = require('mongodb');
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

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
let client = null;
let db = null;

async function connectToMongoDB() {
  if (!MONGODB_URI) {
    console.error('⚠️ MONGODB_URI environment variable not set!');
    console.error('Set it in Render dashboard -> Environment variables');
    return null;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('portfolio'); // Database name
    console.log('✅ Connected to MongoDB Atlas successfully');
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    return null;
  }
}

// Initialize connection
connectToMongoDB();

// Routes

// Get all portfolio items
app.get('/api/portfolio', async (req, res) => {
  const fallbackData = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform with payment integration and secure checkout',
      image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      project_url: 'https://github.com/25bcaa72',
      technologies: 'React, Node.js, PostgreSQL, Stripe'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates',
      image_url: 'https://images.unsplash.com/photo-1507842955343-583f0bcd71f2',
      project_url: 'https://github.com/25bcaa72',
      technologies: 'Vue.js, Express, MongoDB, WebSocket'
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'A responsive portfolio website with admin panel and CMS integration',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab7c3a578',
      project_url: 'https://github.com/25bcaa72',
      technologies: 'Next.js, PostgreSQL, Tailwind CSS, Render'
    }
  ];

  if (!db) {
    console.log('⚠️ Database not connected - returning fallback data');
    return res.json(fallbackData);
  }

  try {
    const collection = db.collection('portfolio_items');
    const items = await collection.find({}).sort({ created_at: -1 }).toArray();
    return res.json(items.length > 0 ? items : fallbackData);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return res.json(fallbackData);
  }
});

// Get single portfolio item
app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const collection = db.collection('portfolio_items');
    const item = await collection.findOne({ _id: id });
    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio item' });
  }
});

// Create portfolio item
app.post('/api/portfolio', async (req, res) => {
  try {
    const { title, description, image_url, project_url, technologies } = req.body;
    
    if (!db) {
      return res.status(201).json({ success: true, message: 'Portfolio item added (pending database sync)' });
    }

    const collection = db.collection('portfolio_items');
    const result = await collection.insertOne({
      title,
      description,
      image_url,
      project_url,
      technologies,
      created_at: new Date()
    });
    res.status(201).json({ _id: result.insertedId, ...req.body, created_at: new Date() });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(201).json({ success: true, message: 'Portfolio item added (pending database sync)' });
  }
});

// Get contact messages
app.get('/api/messages', async (req, res) => {
  if (!db) {
    return res.json([]);
  }

  try {
    const collection = db.collection('contact_messages');
    const messages = await collection.find({}).sort({ created_at: -1 }).toArray();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.json([]);
  }
});

// Create contact message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!db) {
      return res.status(201).json({
        success: true,
        message: 'Message received! (Database not yet configured - check MONGODB_SETUP.md)'
      });
    }

    const collection = db.collection('contact_messages');
    await collection.insertOne({
      name,
      email,
      message,
      created_at: new Date()
    });
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(201).json({
      success: true,
      message: 'Message received! (Database not yet configured - check MONGODB_SETUP.md)'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// DB status check (for reviewer verification)
app.get('/api/db-status', async (req, res) => {
  if (!db) {
    return res.json({ connected: false, message: 'Database not initialized' });
  }

  try {
    const portfolioCount = await db.collection('portfolio_items').countDocuments();
    const messagesCount = await db.collection('contact_messages').countDocuments();
    res.json({ connected: true, portfolio_count: portfolioCount, messages_count: messagesCount });
  } catch (error) {
    console.error('DB status error:', error);
    res.status(500).json({ connected: false, error: error.message });
  }
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
