const Plan = require('../models/Plan');

exports.updatePlan = async (req, res) => {
  try {
    const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Failed to update plan' });
  }
};

exports.togglePlanActive = async (req, res) => {
  try {
    const updated = await Plan.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Toggle error:', error);
    res.status(500).json({ message: 'Failed to toggle plan status' });
  }
};
