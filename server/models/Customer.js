const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  logo: { type: String },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  currentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  nextRenewalDate: { type: Date },
  vehiclesRegistered: { type: Number, default: 0 },
  active: { type: Boolean, default: true } // ✅ NEW FIELD
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
