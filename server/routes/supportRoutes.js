const express = require('express');
const { 
  sendMessage, 
  getMessages, 
  getAllChats, 
  getUserChat,
  replyMessage
} = require('../controllers/supportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/', protect, getMessages);

// Admin Routes
router.get('/admin/chats', protect, authorize('admin'), getAllChats);
router.get('/admin/chats/:userId', protect, authorize('admin'), getUserChat);
router.post('/reply/:userId', protect, authorize('admin'), replyMessage);

module.exports = router;
