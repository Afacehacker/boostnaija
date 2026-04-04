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
const support = require('./routes/supportRoutes');
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
app.use('/api/support', support);

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

// Auto-sync services from provider on every startup
const autoSyncServices = async () => {
  try {
    const Service = require('./models/Service');
    const smmApiService = require('./services/smmApiService');
    const profitMargin = parseFloat(process.env.PROFIT_MARGIN) || 1.60;

    console.log('[Auto-Sync] Fetching services from provider...');
    const externalServices = await smmApiService.getServices();

    if (!Array.isArray(externalServices) || externalServices.length === 0) {
      console.warn('[Auto-Sync] No services returned from provider — skipping sync.');
      return;
    }

    console.log(`[Auto-Sync] Received ${externalServices.length} services. Clearing old DB records...`);

    // ⚠️ Delete ALL old services first so stale IDs from previous providers don't linger
    await Service.deleteMany({});
    console.log('[Auto-Sync] Old services cleared.');

    // Insert fresh services with profit margin applied
    const docs = [];
    for (const s of externalServices) {
      if (!s.service || !s.name) continue;
      const costRate    = parseFloat(s.rate) || 0;
      const sellingRate = parseFloat((costRate * profitMargin).toFixed(4));
      docs.push({
        externalId:  s.service.toString(),
        name:        s.name,
        category:    s.category || 'General',
        rate:        costRate,
        sellingRate: sellingRate,
        min:         parseInt(s.min)  || 0,
        max:         parseInt(s.max)  || 0,
        active:      true,
      });
    }

    await Service.insertMany(docs, { ordered: false });
    console.log(`[Auto-Sync] ✅ ${docs.length} services synced from ReallySimpleSocial (${((profitMargin - 1) * 100).toFixed(0)}% profit applied).`);
  } catch (err) {
    console.error('[Auto-Sync] ⚠️ Service sync failed (server still running):', err.message);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
  // Sync services in the background after server is up
  autoSyncServices();
};

startServer();

