const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/authRoutes');
const services = require('./routes/serviceRoutes');
const orders = require('./routes/orderRoutes');
const payments = require('./routes/paymentRoutes');
const admin = require('./routes/adminRoutes');
const notifications = require('./routes/notificationRoutes');
const orderStatusChecker = require('./jobs/orderStatusChecker');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200 
});
app.use('/api/', limiter);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/services', services);
app.use('/api/orders', orders);
app.use('/api/payments', payments);
app.use('/api/admin', admin);
app.use('/api/notifications', notifications);

// Basic route
app.get('/', (req, res) => {
  res.send('BoostNaija API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

startServer();
