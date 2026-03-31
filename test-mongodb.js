const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

async function testConnection() {
  let client;
  
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    
    const db = client.db('portfolio');
    
    // Test ping
    await db.admin().ping();
    console.log('✅ Ping successful');
    
    // Test collections
    const portfolioCount = await db.collection('portfolio_items').countDocuments();
    const messagesCount = await db.collection('contact_messages').countDocuments();
    
    console.log(`📊 Portfolio items: ${portfolioCount}`);
    console.log(`📊 Contact messages: ${messagesCount}`);
    
    // Test insert
    const testItem = {
      title: 'Test Item',
      description: 'This is a test item to verify MongoDB is working',
      image_url: 'https://example.com/test.jpg',
      project_url: 'https://github.com/test',
      technologies: 'Test, MongoDB',
      created_at: new Date()
    };
    
    const result = await db.collection('portfolio_items').insertOne(testItem);
    console.log(`✅ Inserted test item with ID: ${result.insertedId}`);
    
    // Clean up test item
    await db.collection('portfolio_items').deleteOne({ _id: result.insertedId });
    console.log('🧹 Cleaned up test item');
    
    console.log('🎉 All tests passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    console.error('🔧 Troubleshooting tips:');
    console.error('   - Check your MONGODB_URI in .env file');
    console.error('   - Ensure MongoDB Atlas cluster is running');
    console.error('   - Verify IP access is configured (0.0.0.0/0 for cloud deployment)');
    console.error('   - Check username and password are correct');
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed');
    }
  }
}

testConnection();
