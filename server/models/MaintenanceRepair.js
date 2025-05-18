const mongoose = require('mongoose');

const maintenanceRepairSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  fleet: { type: mongoose.Schema.Types.ObjectId, ref: 'Fleet', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  type: { type: String, enum: ['repair', 'maintenance'], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairCategory' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  mileage: { type: Number },
  cost: { type: Number },
  description: { type: String },
  parts: [{
    part: { type: mongoose.Schema.Types.ObjectId, ref: 'PartService' },
    quantity: Number,
    cost: Number
  }],
  taxes: { type: Number },
  tags: [{ type: String }],
  photos: [{ type: String }],
  invoice: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRepair', maintenanceRepairSchema);
