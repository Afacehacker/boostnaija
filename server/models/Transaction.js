const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'order', 'refund'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'rejected'],
    default: 'pending'
  },
  paymentGateway: {
    type: String,
    enum: ['paystack', 'flutterwave', 'system', 'manual'],
    default: 'system'
  },
  reference: {
    type: String,
    unique: true,
    sparse: true
  },
  receipt: {
    type: String // URL to uploaded image
  },
  metadata: {
    type: Object
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
