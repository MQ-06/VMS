// routes/payments.js
const express = require('express');
const router = express.Router();
const stripe = require('../utils/stripe');

router.post('/create-checkout-session', async (req, res) => {
  const { customerId, planId, amount, successUrl, cancelUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Subscription for Plan ID: ${planId}`
            },
            unit_amount: Math.round(amount * 100), // cents
          },
          quantity: 1,
        }
      ],
      metadata: {
        customerId,
        planId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
