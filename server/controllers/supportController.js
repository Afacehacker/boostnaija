const SupportMessage = require('../models/SupportMessage');
const User = require('../models/User');

// @desc    Send a support message
// @route   POST /api/support
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const supportMessage = await SupportMessage.create({
      user: req.user.id,
      sender: req.user.role === 'admin' ? 'admin' : 'user',
      message
    });
    res.status(201).json({ success: true, data: supportMessage });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Reply to a support message (Admin)
// @route   POST /api/support/reply/:userId
// @access  Private/Admin
exports.replyMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { userId } = req.params;

    const supportMessage = await SupportMessage.create({
      user: userId,
      sender: 'admin',
      message
    });

    res.status(201).json({ success: true, data: supportMessage });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all messages for a user
// @route   GET /api/support
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all users who have sent messages (Admin)
// @route   GET /api/support/admin/chats
// @access  Private/Admin
exports.getAllChats = async (req, res) => {
  try {
    const chats = await SupportMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$user',
          lastMessage: { $first: '$message' },
          lastMessageDate: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$sender', 'user'] }, { $eq: ['$isRead', false] }] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: { 'user.password': 0 } },
      { $sort: { lastMessageDate: -1 } }
    ]);

    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get chat history for a specific user (Admin)
// @route   GET /api/support/admin/chats/:userId
// @access  Private/Admin
exports.getUserChat = async (req, res) => {
  try {
    const messages = await SupportMessage.find({ user: req.params.userId }).sort({ createdAt: 1 });
    
    // Mark as read
    await SupportMessage.updateMany(
      { user: req.params.userId, sender: 'user' },
      { isRead: true }
    );

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
