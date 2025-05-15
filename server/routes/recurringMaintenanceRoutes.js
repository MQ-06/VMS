const express = require('express');
const router = express.Router();
const {
  getAllRecurringMaintenance,
  createRecurringMaintenance,
  updateRecurringMaintenance,
  toggleRecurringMaintenanceStatus
} = require('../controllers/recurringMaintenanceController');

router.get('/', getAllRecurringMaintenance);
router.post('/', createRecurringMaintenance);
router.put('/:id', updateRecurringMaintenance);
router.patch('/:id/status', toggleRecurringMaintenanceStatus);

module.exports = router;
