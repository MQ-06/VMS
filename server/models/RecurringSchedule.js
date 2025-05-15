// server/models/RecurringSchedule.js
const mongoose = require('mongoose');

const RecurringScheduleSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  fleet: { type: mongoose.Schema.Types.ObjectId, ref: 'Fleet' },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  recurringMaintenance: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringMaintenance', required: true },
  lastDate: { type: Date, required: true },
  lastMileage: { type: Number, required: true },
  nextDate: { type: Date },
  nextMileage: { type: Number },
  active: { type: Boolean, default: true } // ✅ Toggle field
}, { timestamps: true });

module.exports = mongoose.model('RecurringSchedule', RecurringScheduleSchema);
