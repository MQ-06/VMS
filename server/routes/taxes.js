const express = require('express');
const router = express.Router();
const Tax = require('../models/Tax');

// GET all taxes
router.get('/', async (req, res) => {
  try {
    const taxes = await Tax.find();
    res.json(taxes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch taxes' });
  }
});

// POST create new tax
router.post('/', async (req, res) => {
  try {
    const tax = new Tax(req.body);
    await tax.save();
    res.json(tax);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create tax' });
  }
});

// PUT update tax
router.put('/:id', async (req, res) => {
  try {
    const updated = await Tax.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Tax not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update tax' });
  }
});

// ✅ PATCH active toggle
router.patch('/:id/active', async (req, res) => {
  try {
    const updated = await Tax.findByIdAndUpdate(req.params.id, { active: req.body.active }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Tax not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to toggle tax status' });
  }
});

// DELETE tax
router.delete('/:id', async (req, res) => {
  try {
    await Tax.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete tax' });
  }
});

module.exports = router;
