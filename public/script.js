// API base URL - FINAL FIX: Use local backend for dev/live-server, relative for production
let API_URL = '';

if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '5500' ||
  window.location.port === '3000'
) {
  API_URL = 'http://localhost:5000';
  const warning = document.createElement('div');
  warning.style = 'background:#ffeb3b;color:#000;padding:10px;margin:10px;border:2px solid #f57c00;font-weight:bold';
  warning.textContent = '⚠️ Running on Live Server (5500/3000). API will be proxied to localhost:5000 automatically.';
  document.body.prepend(warning);
}

console.log('API_URL set to:', API_URL); // Debug: should be http://localhost:5000 for local dev, empty for deploy

const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#555" font-size="24">No Image</text></svg>`;
const fallbackImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg)}`;

function safeImageUrl(url) {
  if (!url || url.trim() === '') {
    return fallbackImage;
  }
  try {
    const parsed = new URL(url, window.location.origin);
    const denied = ['via.placeholder.com', 'placehold.co', 'dummyimage.com'];
    if (denied.some(domain => parsed.host.includes(domain))) {
      return fallbackImage;
    }
    return url;
  } catch (err) {
    return fallbackImage;
  }
}

// Load portfolio items
async function loadPortfolioItems() {
  const fetchUrl = `${API_URL}/api/portfolio`;
  console.log('Fetching portfolio from:', fetchUrl); // Debug: should be /api/portfolio

  try {
    const response = await fetch(fetchUrl);
    console.log('Fetch response status:', response.status); // Debug: should be 200

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const portfolioItems = await response.json();
    console.log('Portfolio items received:', portfolioItems.length); // Debug: should be >0
    
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = '';

    portfolioItems.forEach(item => {
      const portfolioItemDiv = document.createElement('div');
      portfolioItemDiv.className = 'portfolio-item';
      const imageSrc = safeImageUrl(item.image_url);
      portfolioItemDiv.innerHTML = `
        <img src="${imageSrc}" alt="${item.title}" onerror="this.src='${fallbackImage}'">
        <div class="portfolio-item-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <p class="technologies"><strong>Tech:</strong> ${item.technologies}</p>
          <a href="${item.project_url}" target="_blank" class="btn btn-primary" style="display: inline-block;">View Project</a>
        </div>
      `;
      portfolioGrid.appendChild(portfolioItemDiv);
    });
  } catch (error) {
    console.error('Error loading portfolio items:', error);
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (portfolioGrid) {
      portfolioGrid.innerHTML = `<div class="error-message">Unable to load portfolio items. ${error.message}</div>`;
    }
  }
}

// Handle contact form submission
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  try {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();
    const formMessage = document.getElementById('formMessage');

    if (response.ok) {
      formMessage.textContent = 'Message sent successfully!';
      formMessage.className = 'form-message success';
      document.getElementById('contactForm').reset();
    } else {
      formMessage.textContent = data.error || 'Failed to send message';
      formMessage.className = 'form-message error';
    }

    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  } catch (error) {
    console.error('Error sending message:', error);
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = 'An error occurred. Please try again.';
    formMessage.className = 'form-message error';
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Load portfolio items on page load
document.addEventListener('DOMContentLoaded', loadPortfolioItems);
