## Portfolio Application Setup Instructions

This is a full-stack portfolio application with Node.js backend, HTML/CSS/JavaScript frontend, PostgreSQL database (NeonDB), and deployment on Render.

### Project Overview
- **Frontend**: Located in `public/` folder with HTML, CSS, and JavaScript
- **Backend**: Express.js server in `server.js`
- **Database**: PostgreSQL with NeonDB
- **Deployment**: Ready for Render deployment

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Database**
   - Sign up at [NeonDB](https://neon.tech)
   - Create a database and copy the connection string
   - Update `.env` file with `DATABASE_URL`

3. **Run Database Setup**
   - Execute `database.sql` in your NeonDB console to create tables

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Deploy to Render**
   - Push code to GitHub
   - Connect GitHub repository to Render
   - Add environment variables in Render dashboard
   - Deploy automatically

### Key Files
- `server.js` - Express backend server
- `public/index.html` - Main page
- `public/style.css` - Styling
- `public/script.js` - Frontend JavaScript
- `database.sql` - Database schema
- `.env` - Environment configuration
- `render.yaml` - Render deployment configuration

### API Endpoints
- `GET /api/portfolio` - Fetch all portfolio items
- `POST /api/portfolio` - Create portfolio item
- `POST /api/messages` - Submit contact form

See README.md for detailed documentation.
