const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  logo: String,
  companyName: String,
  email: String,
  phone: String,
  address: String,
  stripeKey: String,
  mapsKey: String,
  socketKey: String
});

module.exports = mongoose.model('Settings', SettingsSchema);
