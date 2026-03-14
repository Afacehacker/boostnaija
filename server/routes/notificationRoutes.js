const express = require('express');
const { 
    getNotifications, 
    createNotification, 
    deleteNotification 
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getNotifications)
    .post(protect, authorize('admin'), createNotification);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteNotification);

module.exports = router;
