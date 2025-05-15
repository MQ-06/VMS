const RecurringMaintenance = require('../models/RecurringMaintenance');

exports.getAllRecurringMaintenance = async (req, res) => {
  try {
    const records = await RecurringMaintenance.find().populate('customer', 'companyName');
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

exports.createRecurringMaintenance = async (req, res) => {
  try {
    const newRecord = new RecurringMaintenance(req.body);
    await newRecord.save();
    const populated = await newRecord.populate('customer', 'companyName');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create record', details: err.message });
  }
};

exports.updateRecurringMaintenance = async (req, res) => {
  try {
    const updated = await RecurringMaintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('customer', 'companyName');

    if (!updated) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update record', details: err.message });
  }
};

exports.toggleRecurringMaintenanceStatus = async (req, res) => {
  try {
    const updated = await RecurringMaintenance.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    ).populate('customer', 'companyName');

    if (!updated) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to toggle status', details: err.message });
  }
};

