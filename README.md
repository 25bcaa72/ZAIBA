# Portfolio Application

A full-stack portfolio website built with:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL (NeonDB)
- **Deployment**: Render

## Project Structure

```
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── .env
├── .gitignore
├── database.sql
└── render.yaml
```

## Setup Instructions

### 1. Local Development

#### Prerequisites
- Node.js (v14+)
- PostgreSQL or NeonDB account
- Git

#### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd portfolio
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your NeonDB connection string
```
DATABASE_URL=postgresql://username:password@host/database
PORT=5000
NODE_ENV=development
```

4. Set up the database
   - Create the tables using the `database.sql` file in your PostgreSQL/NeonDB client
   - Or run: `psql -U username -d database_name -f database.sql`

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### 2. Connect to NeonDB

1. Sign up at [NeonDB](https://neon.tech)
2. Create a new project and database
3. Copy the connection string from your NeonDB dashboard
4. Update the `DATABASE_URL` in your `.env` file

### 3. Deploy to Render

#### Prerequisites
- GitHub account with your repository
- Render account

#### Steps

1. Push your code to GitHub

2. Go to [Render Dashboard](https://dashboard.render.com)

3. Click "New +" and select "Web Service"

4. Connect your GitHub repository

5. Configure the following:
   - **Name**: portfolio-app
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

6. Add Environment Variables:
   - **DATABASE_URL**: Your NeonDB connection string
   - **NODE_ENV**: production
   - **PORT**: 5000

7. Click "Create Web Service"

8. Render will automatically deploy your application

## API Endpoints

### Portfolio Items
- `GET /api/portfolio` - Get all portfolio items
- `GET /api/portfolio/:id` - Get a specific portfolio item
- `POST /api/portfolio` - Create a new portfolio item

### Messages
- `GET /api/messages` - Get all contact messages
- `POST /api/messages` - Submit a contact message

### Health Check
- `GET /api/health` - Check if the server is running

## Database Schema

### portfolio_items
- `id` - Primary key
- `title` - Project title
- `description` - Project description
- `image_url` - Project image URL
- `project_url` - Link to the project
- `technologies` - Technologies used
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### contact_messages
- `id` - Primary key
- `name` - Sender's name
- `email` - Sender's email
- `message` - Message content
- `created_at` - Message timestamp

## Features

✅ Responsive design
✅ Portfolio showcase
✅ Contact form
✅ Admin API endpoints
✅ Database integration
✅ Easy deployment to Render
✅ Environment variable management

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (NeonDB)
- **Hosting**: Render
- **Version Control**: Git & GitHub

## Customization

1. **Edit Portfolio Items**: Add or modify items in the `database.sql` file
2. **Styling**: Update `public/style.css`
3. **Features**: Add new routes in `server.js`
4. **Content**: Modify `public/index.html`

## Environment Variables

```
DATABASE_URL = Your NeonDB connection string
PORT = Server port (default: 5000)
NODE_ENV = Environment (development/production)
```

## Development

To run with hot-reload:
```bash
npm run dev
```

This uses Nodemon to automatically restart the server on file changes.

## Production Build

For production deployment, ensure:
- `NODE_ENV=production`
- Proper error handling
- SSL connection to database (NeonDB provides this by default)

## Support

For issues or questions, refer to:
- [Express.js Documentation](https://expressjs.com)
- [NeonDB Documentation](https://neon.tech/docs)
- [Render Documentation](https://render.com/docs)

## License

MIT
