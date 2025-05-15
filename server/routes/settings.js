const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET settings
router.get('/', async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
});

// POST or UPDATE
router.post('/', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(req.body);
  } else {
    Object.assign(settings, req.body);
  }
  await settings.save();
  res.json(settings);
});

module.exports = router;
