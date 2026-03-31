const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function debugDatabase() {
  let client;
  
  try {
    console.log('🔍 Debugging MongoDB data...');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('portfolio');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections found:', collections.map(c => c.name));
    
    // Check portfolio_items collection
    const portfolioCollection = db.collection('portfolio_items');
    const portfolioCount = await portfolioCollection.countDocuments();
    console.log(`📊 portfolio_items count: ${portfolioCount}`);
    
    if (portfolioCount > 0) {
      const items = await portfolioCollection.find({}).toArray();
      console.log('📋 Portfolio items:');
      items.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item._id}, Title: ${item.title}, Created: ${item.created_at}`);
      });
    }
    
    // Check contact_messages collection
    const messagesCollection = db.collection('contact_messages');
    const messagesCount = await messagesCollection.countDocuments();
    console.log(`📊 contact_messages count: ${messagesCount}`);
    
    if (messagesCount > 0) {
      const messages = await messagesCollection.find({}).toArray();
      console.log('📧 Contact messages:');
      messages.forEach((msg, index) => {
        console.log(`  ${index + 1}. ID: ${msg._id}, Name: ${msg.name}, Email: ${msg.email}, Created: ${msg.created_at}`);
      });
    }
    
    // Test API response format
    console.log('\n🔧 Testing API response format...');
    const apiItems = await portfolioCollection.find({}).sort({ created_at: -1 }).toArray();
    console.log('API would return:', JSON.stringify(apiItems, null, 2));
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

debugDatabase();
