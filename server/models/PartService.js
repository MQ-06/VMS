const mongoose = require('mongoose');

const partServiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  nameEn: {
    type: String,
    required: true
  },
  nameEs: {
    type: String,
    required: true
  },
  averageCost: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['part', 'service'],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PartService', partServiceSchema);
