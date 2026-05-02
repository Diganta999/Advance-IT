import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import User from './models/User.js';

// Fix for Windows Node.js failing to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// Seed default admin if not exists
mongoose.connection.once('open', async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@advanceit.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@advanceit.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Default Admin created: admin@advanceit.com / admin123');
    }
  } catch (err) {
    console.error('Failed to seed admin:', err);
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
