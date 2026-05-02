const Setting = require('../models/Setting');

// Get settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, telegramLink } = req.body;
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({});
    }

    if (bankName) settings.bankName = bankName;
    if (accountNumber) settings.accountNumber = accountNumber;
    if (accountName) settings.accountName = accountName;
    if (telegramLink) settings.telegramLink = telegramLink;

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
