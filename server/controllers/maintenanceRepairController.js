const MaintenanceRepair = require('../models/MaintenanceRepair');
const fs = require('fs');

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
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const parts = req.body.parts ? JSON.parse(req.body.parts) : [];

    const data = {
      ...req.body,
      tags,
      parts,
      photos: req.files?.photos?.map(f => f.filename) || [],
      invoice: req.files?.invoice?.[0]?.filename || null,
      active: true
    };

    const record = new MaintenanceRepair(data);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = {};

    const fields = [
      'customer', 'fleet', 'vehicle', 'supplier',
      'type', 'category', 'user', 'date', 'mileage',
      'cost', 'description', 'taxes'
    ];

    // Filter only valid fields
    fields.forEach(field => {
      if (req.body[field] && req.body[field].trim() !== '') {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.tags) {
      updateData.tags = JSON.parse(req.body.tags);
    }

    if (req.body.parts) {
      updateData.parts = JSON.parse(req.body.parts);
    }

    if (req.files?.photos) {
      updateData.photos = req.files.photos.map(f => f.filename);
    }

    if (req.files?.invoice) {
      updateData.invoice = req.files.invoice[0].filename;
    }

    const updated = await MaintenanceRepair.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'MaintenanceRepair not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(400).json({ error: err.message });
  }
};


// PATCH toggle active
exports.toggleStatus = async (req, res) => {
  try {
    const repair = await MaintenanceRepair.findById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Not found' });

    repair.active = !repair.active;
    await repair.save();

    res.json({ message: 'Status updated', repair });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
