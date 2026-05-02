const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  bankName: { type: String, default: 'Rubies micro finance bank' },
  accountNumber: { type: String, default: '8025329616' },
  accountName: { type: String, default: 'Afeez Salaudeen' },
  telegramLink: { type: String, default: 'https://t.me/boostnaija1' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
