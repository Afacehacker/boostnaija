const express = require('express');
const { getServices, syncServices, updateService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getServices);
router.post('/sync', protect, authorize('admin'), syncServices);
router.put('/:id', protect, authorize('admin'), updateService);

module.exports = router;
