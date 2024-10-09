import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import productRoutes from './routes/product.route.js';
import InventoryRoutes from './routes/inventory.route.js';
import { v2 as cloudinary } from 'cloudinary';
import Inventory from './models/invetory.model.js';


dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

// // Configure CORS
// const corsOptions = {
//   origin: ['http://localhost:3000', 'http://your-other-allowed-origin.com'], // Add allowed origins here
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// };

// app.use(cors(corsOptions));
app.use(cors()) ;
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Define routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', InventoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
