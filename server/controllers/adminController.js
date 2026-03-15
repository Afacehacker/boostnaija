const User = require('../models/User');
const Order = require('../models/Order');
const smmApiService = require('../services/smmApiService');

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const allOrders = await Order.find();
    const totalRevenue = allOrders.reduce((acc, curr) => acc + curr.price, 0);

    // Fetch Panel Balance from SMM.com.ng
    let panelBalance = { balance: 0, currency: 'USD' };
    try {
      panelBalance = await smmApiService.getBalance();
    } catch (apiErr) {
      console.error('Could not fetch panel balance');
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalOrders,
          revenue: totalRevenue,
          panelBalance: panelBalance.balance
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adjustUserBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Agent not found' });

    user.walletBalance += parseFloat(amount);
    await user.save();

    res.json({ success: true, message: 'Ledger adjusted', data: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete an admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Optionally delete orders or keep them as orphaned? 
    // Usually it's better to keep them for accounting but remove the link.
    // For now, let's just delete the user.
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
