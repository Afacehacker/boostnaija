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
    const statusCode = err.response?.status || 400;
    const message = err.response?.data?.message || err.message;
    console.error(`❌ Paystack Handshake Failed [${statusCode}]:`, message);
    res.status(statusCode).json({ success: false, message: `Gateway Error: ${message}` });
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
// @desc    Submit Manual Payment Receipt
// @route   POST /api/payments/manual/submit
// @access  Private
exports.submitManualPayment = async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount || !receipt) {
      return res.status(400).json({ success: false, message: 'Amount and receipt are required' });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      amount: parseFloat(amount),
      type: 'deposit',
      status: 'pending',
      paymentGateway: 'manual',
      receipt: receipt // Expecting base64 or URL
    });

    res.status(201).json({ success: true, data: transaction, message: 'Payment submitted for confirmation' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update Transaction Status (Admin Only)
// @route   PUT /api/payments/manual/:id
// @access  Private/Admin
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id).populate('user');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Transaction already processed' });
    }

    if (status === 'success') {
      const user = await User.findById(transaction.user._id);
      user.walletBalance += transaction.amount;
      await user.save();
      transaction.status = 'success';
    } else if (status === 'rejected') {
      transaction.status = 'rejected';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await transaction.save();

    res.status(200).json({ 
      success: true, 
      message: status === 'success' ? 'Payment confirmed and balance added' : 'Payment rejected' 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get All Pending Manual Payments (Admin Only)
// @route   GET /api/payments/manual/pending
// @access  Private/Admin
exports.getPendingManualPayments = async (req, res) => {
  try {
    const payments = await Transaction.find({ 
      paymentGateway: 'manual', 
      status: 'pending' 
    }).populate('user', 'name email').sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
