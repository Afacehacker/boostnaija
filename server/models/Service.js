const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  // Provider's own service ID (e.g. "123") — used to place orders
  externalId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  // Raw provider rate per 1000 units (cost price)
  rate: {
    type: Number,
    required: true
  },
  // What we charge the customer: rate * PROFIT_MARGIN (e.g. ×1.60 = 60% profit)
  sellingRate: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
