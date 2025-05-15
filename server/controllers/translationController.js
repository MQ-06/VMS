const Translation = require('../models/Translation.js');

const getTranslations = async (req, res) => {
  try {
    const translations = await Translation.find().sort({ key: 1 });
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addTranslation = async (req, res) => {
  const { key, en, es } = req.body;

  if (!key || !en || !es) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const exists = await Translation.findOne({ key });
    if (exists) {
      return res.status(400).json({ message: 'Key already exists' });
    }

    const created = await Translation.create({ key, en, es });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error adding translation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTranslations,
  addTranslation,
};
