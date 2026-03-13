const cron = require('node-cron');
const Order = require('../models/Order');
const smmApiService = require('../services/smmApiService');

// Runs every 2 minutes
const orderStatusChecker = cron.schedule('*/2 * * * *', async () => {
  console.log('--- CRON: Checking Pending Missions ---');
  
  try {
    const pendingOrders = await Order.find({ 
      status: { $in: ['pending', 'processing'] } 
    }).limit(50); // Process 50 at a time to avoid API rate limits

    if (pendingOrders.length === 0) return;

    const externalIds = pendingOrders.map(o => o.externalOrderId);
    const statuses = await smmApiService.getMultiStatus(externalIds);

    for (const order of pendingOrders) {
      const statusData = statuses[order.externalOrderId];
      
      if (statusData && statusData.status) {
        order.status = statusData.status.toLowerCase();
        order.start_count = statusData.start_count;
        order.remains = statusData.remains;
        await order.save();
        console.log(`Updated Order ${order.externalOrderId} to ${order.status}`);
      }
    }
  } catch (error) {
    console.error('CRON ERROR:', error.message);
  }
});

module.exports = orderStatusChecker;
