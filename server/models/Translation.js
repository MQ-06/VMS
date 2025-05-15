const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, lowercase: true },
  en: { type: String, required: true },
  es: { type: String, required: true },
}, { timestamps: true });

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;
