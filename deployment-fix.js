// This script helps identify deployment issues
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkDeploymentIssues() {
  console.log('🔍 Checking for deployment issues...');
  
  // Check 1: Environment variables
  console.log('\n📋 Environment Variables:');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
  console.log('NODE_ENV:', process.env.NODE_ENV || '❌ Not set');
  console.log('PORT:', process.env.PORT || '❌ Not set');
  
  if (!process.env.MONGODB_URI) {
    console.log('\n❌ SOLUTION: Add MONGODB_URI to Render environment variables');
    console.log('Format: mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority');
    return;
  }
  
  // Check 2: Database connection
  console.log('\n🔌 Testing database connection...');
  let client;
  
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('portfolio');
    const count = await db.collection('portfolio_items').countDocuments();
    
    console.log(`✅ Database connected! Found ${count} portfolio items`);
    
    if (count === 0) {
      console.log('\n⚠️  ISSUE: Database exists but has no data');
      console.log('SOLUTION: Add some test data or check if data was saved to correct database');
    }
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\n🔧 POSSIBLE SOLUTIONS:');
    console.log('1. Check MONGODB_URI format');
    console.log('2. Verify MongoDB Atlas cluster is running');
    console.log('3. Ensure IP access is set to 0.0.0.0/0');
    console.log('4. Check username/password are correct');
  } finally {
    if (client) await client.close();
  }
  
  // Check 3: Common deployment issues
  console.log('\n🚀 Common Deployment Issues:');
  console.log('1. ❌ Using fallback data instead of real data');
  console.log('   → Check server logs for "Database not connected" messages');
  console.log('2. ❌ Frontend caching old responses');
  console.log('   → Clear browser cache or use incognito mode');
  console.log('3. ❌ Wrong database name');
  console.log('   → Ensure database name is "portfolio" in MONGODB_URI');
  console.log('4. ❌ Collection names mismatch');
  console.log('   → Should be "portfolio_items" and "contact_messages"');
  
  console.log('\n📝 NEXT STEPS:');
  console.log('1. Deploy latest changes: git push origin main');
  console.log('2. Check Render logs for connection errors');
  console.log('3. Test: https://your-app.onrender.com/api/db-status');
  console.log('4. Test: https://your-app.onrender.com/api/portfolio');
}

checkDeploymentIssues();
