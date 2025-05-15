const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contactPerson: String,
  logo: String,
  phone: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  type: {
    type: String,
    enum: ['mechanic', 'electro mechanic', 'body shop', 'tire center', 'transmissions', 'other'],
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);