const express = require('express');
const { getAdminStats, getAllUsers, adjustUserBalance } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/balance', adjustUserBalance);

module.exports = router;
