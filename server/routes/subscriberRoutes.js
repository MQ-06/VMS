const express = require('express');
const router = express.Router();
const {
  getAllSubscribers,
  addSubscriber,
  updateSubscriber
} = require('../controllers/subscriberController');

router.get('/', getAllSubscribers);
router.post('/', addSubscriber);
router.put('/:id', updateSubscriber); // ✅ added PUT for editing

module.exports = router;
