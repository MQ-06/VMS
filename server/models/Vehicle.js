const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  fleet: { type: mongoose.Schema.Types.ObjectId, ref: 'Fleet', required: true },
  name: { type: String, required: true },
  vin: String,
  licensePlate: String,
  brand: String,
  color: String,
  year: Number,
  mileage: Number,
  purchaseDate: Date,
  cost: Number,
  ownership: { type: String, enum: ['fully_paid', 'lease', 'financed'], required: true },
  amountPaid: Number,
  monthlyPayment: Number,
  paymentDay: String,
  finalPaymentDate: Date,
  notes: String,
  photos: [String],
  documents: [{ filename: String, label: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);