const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');
const smmApiService = require('../services/smmApiService');

exports.placeOrder = async (req, res) => {
  try {
    const { serviceId, link, quantity } = req.body;
    const userId = req.user.id;

    // 1. Fetch service details
    const service = await Service.findOne({ externalId: serviceId });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Strategic service not found' });
    }

    // 2. Validate quantity
    if (quantity < service.min || quantity > service.max) {
      return res.status(400).json({ 
        success: false, 
        message: `Quantity outside mission parameters (${service.min} - ${service.max})` 
      });
    }

    // 3. Calculate price
    const price = (service.sellingRate / 1000) * quantity;

    // 4. Validate user balance
    const user = await User.findById(userId);
    if (user.walletBalance < price) {
      return res.status(400).json({ success: false, message: 'Insufficient liquidity for mission' });
    }

    // 5. Send order to Provider API
    let externalRes;
    try {
      externalRes = await smmApiService.addOrder({
        service: serviceId,
        link,
        quantity
      });
    } catch (apiError) {
      return res.status(502).json({ 
        success: false, 
        message: 'Provider API Handshake Failed: ' + apiError.message 
      });
    }

    if (!externalRes || !externalRes.order) {
      return res.status(400).json({ success: false, message: 'Mission failed by provider queue' });
    }

    // 6. Deduct balance and Save Order
    user.walletBalance -= price;
    await user.save();

    const order = await Order.create({
      userId,
      serviceId,
      serviceName: service.name,
      externalOrderId: externalRes.order,
      link,
      quantity,
      price,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: order });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.syncOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order || !order.externalOrderId) {
      return res.status(404).json({ success: false, message: 'Mission log not found' });
    }

    const statusRes = await smmApiService.getStatus(order.externalOrderId);
    
    if (statusRes.status) {
      order.status = statusRes.status.toLowerCase();
      order.start_count = statusRes.start_count;
      order.remains = statusRes.remains;
      await order.save();
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
