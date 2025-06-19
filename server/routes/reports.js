// routes/reports.js
const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber'); // Adjust path as needed
const Customer = require('../models/Customer');
const Plan = require('../models/Plan');

router.get('/subscriptions', async (req, res) => {
  try {
    const subs = await Subscriber.find()
      .populate('customer')
      .populate('initialPlan')
      .populate('currentPlan');

    const data = subs.map(sub => ({
      customer: sub.customer?.companyName || '—',
      initialPlan: sub.initialPlan?.name_en || '—',
      initialDate: sub.subscriptionInitialDate?.toISOString().split('T')[0],
      currentPlan: sub.currentPlan?.name_en || '—',
      planDate: sub.currentSubscriptionPlanDate?.toISOString().split('T')[0],
      fleetAmount: sub.currentPlan?.fleetAmount || '—',
      recurrence: sub.recurrence,
      price: `$${sub.price}`,
      renewalDate: sub.nextRenewalDate?.toISOString().split('T')[0],
      status: sub.status
    }));

    res.json(data);
  } catch (error) {
    console.error('Error fetching subscriptions report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
