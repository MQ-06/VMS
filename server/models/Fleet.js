const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  supervisor: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Fleet', fleetSchema);
