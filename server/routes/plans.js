const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const { updatePlan, togglePlanActive } = require('../controllers/planController');

router.get('/', async (req, res) => {
  const plans = await Plan.find().populate('applicableTaxes', 'name');
  res.json(plans);
});

router.post('/', async (req, res) => {
  const plan = new Plan(req.body);
  await plan.save();
  res.json(plan);
});

router.put('/:id', updatePlan);
router.patch('/:id/active', togglePlanActive); // ✅ added
module.exports = router;
