const RepairCategory = require('../models/RepairCategory');

exports.getAll = async (req, res) => {
  try {
    const data = await RepairCategory.find()
      .populate('customer')
      .populate('supplierTypes');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.create = async (req, res) => {
  try {
    const item = new RepairCategory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create category' });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await RepairCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update category' });
  }
};

// ✅ Toggle activation
exports.toggleActive = async (req, res) => {
  try {
    const updated = await RepairCategory.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to toggle category' });
  }
};
