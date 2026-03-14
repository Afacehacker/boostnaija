const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');
const smmApiService = require('../services/smmApiService');

exports.placeOrder = async (req, res) => {
  try {
    const { serviceId, link, quantity } = req.body;
    const userId = req.user.id;

    // 1. Fetch service details (serviceId is our internal externalId / mongo _id)
    const service = await Service.findOne({
      $or: [{ externalId: serviceId }, { _id: serviceId }]
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // 2. Validate quantity
    if (quantity < service.min || quantity > service.max) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be between ${service.min} and ${service.max}`,
      });
    }

    // 3. Calculate price using the stored sellingRate (already has 60% profit)
    const price = (service.sellingRate / 1000) * quantity;

    // 4. Validate user balance
    const user = await User.findById(userId);
    if (user.walletBalance < price) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // 5. Route order to the cheapest provider (stored on the service document)
    const provider = service.provider || 'smm1';
    let externalRes;
    try {
      externalRes = await smmApiService.addOrderTo(provider, {
        service: service.providerServiceId,   // use the provider's own service ID
        link,
        quantity,
      });
    } catch (apiError) {
      return res.status(502).json({
        success: false,
        message: `Provider (${provider}) API error: ${apiError.message}`,
      });
    }

    if (!externalRes || !externalRes.order) {
      return res.status(400).json({ success: false, message: 'Provider did not return an order ID' });
    }

    // 6. Deduct balance and save order
    user.walletBalance -= price;
    await user.save();

    const order = await Order.create({
      userId,
      serviceId: service.externalId,
      serviceName: service.name,
      externalOrderId: externalRes.order,
      link,
      quantity,
      price,
      status: 'pending',
      provider,                         // track which panel fulfilled it
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
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Use the provider that originally fulfilled the order
    const provider = order.provider || 'smm1';
    const statusRes = await smmApiService.getStatusFrom(provider, order.externalOrderId);

    if (statusRes && statusRes.status) {
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
