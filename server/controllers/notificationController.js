const Notification = require('../models/Notification');

// @desc    Get all notifications (for dashboard)
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create a notification (Admin only)
// @route   POST /api/notifications
// @access  Admin
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a notification (Admin only)
// @route   DELETE /api/notifications/:id
// @access  Admin
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Notification removed' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
