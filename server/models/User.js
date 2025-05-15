const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['super_admin', 'customer_admin', 'customer_user', 'driver'],
    default: 'driver',
  },
  active: {
    type: Boolean,
    default: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
