const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recurringMaintenanceSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  performEvery: {
    type: String,
    enum: ['days', 'mileage', 'both'],
    required: true,
  },
  mileageRecurrence: {
    type: Number,
    default: null,
  },
  daysRecurrence: {
    type: Number,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('RecurringMaintenance', recurringMaintenanceSchema);