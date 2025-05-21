// routes/webhooks.js
const express = require('express');
const router = express.Router();
const stripe = require('../utils/stripe');
const Payment = require('../models/payments');

// Stripe requires the raw body to verify the signature
const bodyParser = require('body-parser');
router.post('/stripe', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { customerId, planId } = session.metadata;

    try {
      await Payment.create({
        customerId,
        planId,
        amount: session.amount_total / 100,
        paymentIntent: session.payment_intent,
        status: 'success',
        paidAt: new Date()
      });

      console.log('💰 Payment stored for:', customerId, planId);
    } catch (err) {
      console.error('❌ Failed to store payment:', err);
    }
  }

  res.sendStatus(200);
});

module.exports = router;
