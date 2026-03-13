const axios = require('axios');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');

// @desc    Initialize Paystack Payment
// @route   POST /api/payments/paystack/initialize
// @access  Private
exports.initializePaystack = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);

    const params = {
      email: user.email,
      amount: amount * 100, // Paystack expects kobo
      callback_url: `${process.env.FRONTEND_URL}/dashboard/wallet`,
      metadata: {
        userId: user._id,
        type: 'deposit'
      }
    };

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      params,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ success: true, data: response.data.data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Paystack Webhook
// @route   POST /api/payments/paystack/webhook
// @access  Public
exports.paystackWebhook = async (req, res) => {
  try {
    const whitelistedRaw = process.env.PAYSTACK_WHITELISTED_IPS || '';
    const paystackIPs = whitelistedRaw.split(',').map(ip => ip.trim());
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // IP Verification (Uncomment for production security)
    // if (paystackIPs.length > 0 && !paystackIPs.some(ip => clientIP.includes(ip))) {
    //   console.warn(`Blocked Webhook attempt from unauthorized IP: ${clientIP}`);
    //   return res.status(403).send('Unauthorized IP');
    // }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { amount, metadata, reference } = event.data;
      const userId = metadata.userId;

      const user = await User.findById(userId);
      if (user) {
        // Check if transaction already processed
        const existingTx = await Transaction.findOne({ reference });
        if (!existingTx) {
          user.walletBalance += (amount / 100);
          await user.save();

          await Transaction.create({
            user: userId,
            amount: amount / 100,
            type: 'deposit',
            status: 'success',
            paymentGateway: 'paystack',
            reference: reference
          });
        }
      }
    }

    res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('Paystack Webhook Error:', err);
    res.status(500).send('Internal Server Error');
  }
};
