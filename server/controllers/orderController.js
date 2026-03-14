const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');
const smmApiService = require('../services/smmApiService');

// ── Place a new order ─────────────────────────────────────────────────────────
exports.placeOrder = async (req, res) => {
  try {
    const { serviceId, link, quantity } = req.body;
    const userId = req.user.id;

    // 1. Look up service — serviceId from frontend = service.externalId
    const service = await Service.findOne({ externalId: serviceId });
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

    // 3. Calculate price using sellingRate (already includes 60% profit margin)
    const price = parseFloat(((service.sellingRate / 1000) * quantity).toFixed(2));

    // 4. Check wallet balance
    const user = await User.findById(userId);
    if (user.walletBalance < price) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // 5. Send order to provider — externalId IS the provider's service ID
    const orderPayload = {
      service:  service.externalId,   // provider's own service ID
      link,
      quantity: String(quantity),     // ensure string for URLSearchParams
    };
    console.log('[Order] Sending to provider:', JSON.stringify(orderPayload));

    let externalRes;
    try {
      externalRes = await smmApiService.addOrder(orderPayload);
      console.log('[Order] Provider response:', JSON.stringify(externalRes));
    } catch (apiError) {
      console.error('[Order] Provider error:', apiError.message);
      return res.status(502).json({
        success: false,
        message: 'Provider API error: ' + apiError.message,
      });
    }

    if (!externalRes || !externalRes.order) {
      return res.status(400).json({ success: false, message: 'Provider did not return an order ID' });
    }

    // 6. Deduct wallet and create order record
    user.walletBalance -= price;
    await user.save();

    const order = await Order.create({
      userId,
      serviceId:      service.externalId,
      serviceName:    service.name,
      externalOrderId: externalRes.order,
      link,
      quantity,
      price,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: order });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get all orders for the logged-in user ────────────────────────────────────
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Sync a single order's status from the provider ───────────────────────────
exports.syncOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order || !order.externalOrderId) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const statusRes = await smmApiService.getStatus(order.externalOrderId);

    if (statusRes && statusRes.status) {
      order.status      = statusRes.status.toLowerCase();
      order.start_count = statusRes.start_count;
      order.remains     = statusRes.remains;
      await order.save();
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
