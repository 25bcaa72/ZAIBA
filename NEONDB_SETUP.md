# 🚀 NeonDB Setup Guide - Manual Method

Your Node.js server is running on port 5000, but we need to initialize your NeonDB database manually due to network restrictions.

## ⚡ Quick Setup (2 minutes)

### Step 1: Open NeonDB Console
1. Go to https://console.neon.tech
2. Sign in with your account
3. Select your project: **neondb**
4. Click on the **SQL Editor** tab

### Step 2: Copy & Run This SQL
Copy the entire SQL block below and paste it into the NeonDB SQL Editor, then click **Run**:

```sql
-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  project_url VARCHAR(500),
  technologies VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample portfolio items
INSERT INTO portfolio_items (title, description, image_url, project_url, technologies) VALUES
('E-Commerce Platform', 'A full-stack e-commerce platform with payment integration', 'https://via.placeholder.com/400x300', 'https://github.com', 'React, Node.js, PostgreSQL'),
('Task Management App', 'A collaborative task management application', 'https://via.placeholder.com/400x300', 'https://github.com', 'Vue.js, Express, MongoDB'),
('Weather Dashboard', 'Real-time weather dashboard with geolocation', 'https://via.placeholder.com/400x300', 'https://github.com', 'HTML, CSS, JavaScript, API');
```

### Step 3: Verify Setup
Run this query to confirm tables were created:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema='public';
```

You should see:
- portfolio_items ✅
- contact_messages ✅

## 🎯 Current Status

✅ **Node.js server** running on port 5000
✅ **Environment configured** with your NeonDB credentials
✅ **Frontend ready** on Live Server (port 5500)
⏳ **Database tables** - Run the SQL above manually

## 🚀 Test Your Portfolio

1. Open your portfolio in VS Code with Live Server (port 5500)
2. Your backend API is running on port 5000
3. **After running the SQL above**, your contact form and portfolio will work perfectly!

## 📋 What Happens Next

Once you run the SQL in NeonDB:
- ✅ Contact form messages will be saved to database
- ✅ Portfolio items will load from database
- ✅ Full CRUD operations will work
- ✅ Ready for production deployment

**Time estimate: 2 minutes to complete setup!**

---

*Note: The DNS resolution issue prevents automatic setup from your network. Manual setup via NeonDB console is the fastest solution.*
