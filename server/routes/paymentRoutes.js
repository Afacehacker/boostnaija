const express = require('express');
const { 
  initializePaystack, 
  paystackWebhook,
  submitManualPayment,
  updateTransactionStatus,
  getPendingManualPayments 
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/paystack/initialize', protect, initializePaystack);
router.post('/paystack/webhook', paystackWebhook);

router.post('/manual/submit', protect, submitManualPayment);
router.get('/manual/pending', protect, authorize('admin'), getPendingManualPayments);
router.put('/manual/:id', protect, authorize('admin'), updateTransactionStatus);

module.exports = router;
