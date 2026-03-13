const express = require('express');
const { 
  initializePaystack, 
  paystackWebhook 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/paystack/initialize', protect, initializePaystack);
router.post('/paystack/webhook', paystackWebhook);

module.exports = router;
