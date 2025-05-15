const express = require('express');
const router = express.Router();
const {
  getSchedules,
  createSchedule,
  updateSchedule,
  getRecurringRules,
  toggleScheduleStatus
} = require('../controllers/recurringScheduleController');

// Routes
router.get('/', getSchedules);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.get('/rules', getRecurringRules);
router.patch('/:id/status', toggleScheduleStatus); 

module.exports = router;