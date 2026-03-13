const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  externalOrderId: {
    type: String,
    unique: true,
    sparse: true
  },
  link: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded', 'partial'],
    default: 'pending'
  },
  start_count: Number,
  remains: Number
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
