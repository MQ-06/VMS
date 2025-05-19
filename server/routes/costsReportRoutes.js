const express = require('express');
const router = express.Router();
const { getCostsReport } = require('../controllers/costsReportController');

// GET /api/costs-reports
router.get('/', getCostsReport);

module.exports = router;
