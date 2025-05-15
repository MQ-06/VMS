const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  initialSubscriptionDate: { type: Date, required: true },
  initialPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  currentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  currentPlanDate: { type: Date, required: true },
  currentFleetAmount: { type: Number, required: true },
  recurrence: { type: String, enum: ['monthly', 'yearly'], required: true },
  price: { type: Number, required: true },
  nextRenewalDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
