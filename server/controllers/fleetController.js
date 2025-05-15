const Fleet = require('../models/Fleet');

exports.getFleets = async (req, res) => {
  try {
    const { customer } = req.query;
    const filter = customer ? { customer } : {};
    const fleets = await Fleet.find(filter).populate('customer');
    res.json(fleets);
  } catch (error) {
    console.error('Error fetching fleets:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createFleet = async (req, res) => {
  try {
    const { customer, name, supervisor, active } = req.body;
    const fleet = new Fleet({ customer, name, supervisor, active });
    await fleet.save();
    res.status(201).json(fleet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFleet = async (req, res) => {
  try {
    const updated = await Fleet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Fleet not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
