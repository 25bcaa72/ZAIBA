# MongoDB Atlas Setup Instructions

This portfolio application now uses MongoDB Atlas cloud database instead of NeonDB.

## 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is fine)

## 2. Get Connection String

1. In Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. It will look like: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority`

## 3. Update Environment Variables

### For Local Development (.env file):
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### For Render Deployment:
1. Go to Render dashboard → Your app → Environment
2. Add environment variable:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority`

## 4. Database Collections

The app will automatically create two collections:
- `portfolio_items` - Stores portfolio projects
- `contact_messages` - Stores contact form submissions

## 5. Test Connection

Run the app locally:
```bash
npm install
npm start
```

Check endpoints:
- `http://localhost:5000/api/health` → `{"status":"OK"}`
- `http://localhost:5000/api/db-status` → Shows connection status and counts
- `http://localhost:5000/api/portfolio` → Returns portfolio items

## 6. View Data in Atlas

1. Go to Atlas dashboard
2. Click "Collections" in your cluster
3. View `portfolio` database → `portfolio_items` and `contact_messages` collections

## Security Notes

- Never commit your actual MongoDB URI to Git
- Use environment variables for sensitive data
- Atlas free tier has 512MB storage limit
- Consider upgrading for production use