const MaintenanceRepair = require('../models/MaintenanceRepair');
const fs = require('fs');
const path = require('path');

// GET all
exports.getAll = async (req, res) => {
  try {
    const data = await MaintenanceRepair.find()
      .populate('customer fleet vehicle supplier category user parts.part');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create
exports.create = async (req, res) => {
  try {
    const { tags, parts } = req.body;

    const data = {
      ...req.body,
      tags: JSON.parse(tags || '[]'),
      parts: JSON.parse(parts || '[]'),
      photos: req.files['photos']?.map(f => f.filename) || [],
      invoice: req.files['invoice']?.[0]?.filename || null,
    };

    const record = new MaintenanceRepair(data);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update
exports.update = async (req, res) => {
  try {
    const { tags, parts } = req.body;

    const data = {
      ...req.body,
      tags: JSON.parse(tags || '[]'),
      parts: JSON.parse(parts || '[]'),
    };

    if (req.files['photos']) {
      data.photos = req.files['photos'].map(f => f.filename);
    }

    if (req.files['invoice']) {
      data.invoice = req.files['invoice'][0].filename;
    }

    const updated = await MaintenanceRepair.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const deleted = await MaintenanceRepair.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
