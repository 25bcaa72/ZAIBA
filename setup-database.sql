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
