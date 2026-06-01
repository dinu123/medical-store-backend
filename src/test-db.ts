import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testMongoDB = async () => {
  try {
    console.log('\n🔍 Testing MongoDB Connection...\n');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-store';
    
    console.log('Connection String: ' + mongoUri.replace(/:[^:]*@/, ':****@'));
    console.log('Connecting...\n');
    
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('\n📊 Connection Details:');
    console.log('   Host:', connection.connection.host);
    console.log('   Port:', connection.connection.port);
    console.log('   Database:', connection.connection.name);
    console.log('   State:', connection.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // List databases
    const admin = connection.connection.getClient().db().admin();
    const databases = await admin.listDatabases();
    
    console.log('\n📚 Available Databases:');
    databases.databases.forEach((db: any) => {
      console.log('   • ' + db.name + ' (' + (db.sizeOnDisk / 1024 / 1024).toFixed(2) + ' MB)');
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Connection Test Successful!\n');
    process.exit(0);
    
  } catch (error: any) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('\n📋 Error Details:');
    console.error('   Type:', error.name);
    console.error('   Message:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Hint: Check username and password in connection string');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Hint: Check cluster name in connection string');
    } else if (error.message.includes('connect ECONNREFUSED')) {
      console.error('\n💡 Hint: MongoDB is not running. Use MongoDB Atlas or start local MongoDB');
    }
    
    console.error('\n📖 Setup Instructions:');
    console.error('   1. Follow MONGODB_SETUP.md guide');
    console.error('   2. Update .env with connection string');
    console.error('   3. Run: npm run test-db\n');
    
    process.exit(1);
  }
};

testMongoDB();
