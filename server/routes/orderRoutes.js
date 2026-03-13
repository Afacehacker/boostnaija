const express = require('express');
const { placeOrder, getUserOrders, syncOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/', getUserOrders);
router.put('/:id/sync', syncOrderStatus);

module.exports = router;
