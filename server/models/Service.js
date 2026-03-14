const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  externalId: {
    type: String,
    required: true,
    unique: true              // normalised name used as the stable key
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  // Cheapest raw rate across providers (per 1000 units)
  rate: {
    type: Number,
    required: true
  },
  // What we charge the customer (rate * profitMargin)
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
  },
  // ── Multi-provider fields ──────────────────────────────────
  /** Which provider currently offers the cheapest rate: 'smm1' | 'smm2' */
  provider: {
    type: String,
    enum: ['smm1', 'smm2'],
    default: 'smm1'
  },
  /** The external service ID on the chosen provider's panel */
  providerServiceId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
