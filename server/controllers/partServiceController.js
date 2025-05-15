const PartService = require('../models/PartService');

// GET all
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.customer) {
      filter.customer = req.query.customer;
    }
    const items = await PartService.find(filter).populate('customer', 'companyName');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
};

// POST create
exports.create = async (req, res) => {
  try {
    const newItem = new PartService(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create item', error: err.message });
  }
};

// PUT update
exports.update = async (req, res) => {
  try {
    const updated = await PartService.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update item', error: err.message });
  }
};

// DELETE (optional)
exports.remove = async (req, res) => {
  try {
    const deleted = await PartService.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
};
