require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('Starting Server...');

// Route imports
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Override DNS to use Google's public DNS — fixes ECONNREFUSED on Atlas SRV lookups
// caused by local ISP/corporate DNS blocking mongodb SRV records
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Database connection
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    console.log(`🔄 Connecting to MongoDB...`);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4  // Force IPv4
    });
    console.log('✅ Connected to MongoDB Atlas');
    return;
  } catch (err) {
    console.error(`❌ MongoDB Atlas connection error:`, err.message);
    console.log('⚠️ Falling back to Local Memory Database (mongodb-memory-server)...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ Connected to Fallback In-Memory MongoDB. The app is fully functional!');

      // Seed the in-memory database if it's empty
      const Post = require('./models/Post');
      const count = await Post.countDocuments();
      if (count === 0) {
        const seed = require('./seed');
        await seed();
      }
    } catch (fallbackErr) {
       console.error('❌ Failed to start In-Memory Database:', fallbackErr.message);
       console.log('⚠️  Running in disconnected mode. Database features will be unavailable.');
    }
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
