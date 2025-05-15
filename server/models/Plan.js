const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name_en: { type: String, required: true },
  name_es: { type: String, required: true },
  description_en: { type: String },
  description_es: { type: String },
  recurrence: { type: String, enum: ['monthly', 'yearly'], required: true },
  amount: { type: Number, required: true },
  applicableTaxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tax' }],
  fleetAmount: { type: Number, required: true },
  active: { type: Boolean, default: true } // ✅ added
});

module.exports = mongoose.model('Plan', PlanSchema);
