// server/controllers/recurringScheduleController.js
const RecurringSchedule = require('../models/RecurringSchedule');
const RecurringMaintenance = require('../models/RecurringMaintenance');
const Vehicle = require('../models/Vehicle');

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await RecurringSchedule.find()
      .populate('customer')
      .populate('fleet')
      .populate('vehicle')
      .populate('recurringMaintenance');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const {
      customer,
      fleet,
      vehicle,
      recurringRule,
      lastDate,
      lastMileage
    } = req.body;

    const rule = await RecurringMaintenance.findById(recurringRule);
    if (!rule) return res.status(400).json({ error: 'Invalid rule' });

    const nextDate = rule.daysRecurrence ? new Date(new Date(lastDate).getTime() + rule.daysRecurrence * 86400000) : null;
    const nextMileage = rule.mileageRecurrence ? parseInt(lastMileage) + rule.mileageRecurrence : null;

    const newSchedule = new RecurringSchedule({
      customer,
      fleet,
      vehicle,
      recurringMaintenance: recurringRule,
      lastDate,
      lastMileage,
      nextDate,
      nextMileage
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const {
      customer,
      fleet,
      vehicle,
      recurringRule,
      lastDate,
      lastMileage
    } = req.body;

    const rule = await RecurringMaintenance.findById(recurringRule);
    if (!rule) return res.status(400).json({ error: 'Invalid rule' });

    const nextDate = rule.daysRecurrence ? new Date(new Date(lastDate).getTime() + rule.daysRecurrence * 86400000) : null;
    const nextMileage = rule.mileageRecurrence ? parseInt(lastMileage) + rule.mileageRecurrence : null;

    const updated = await RecurringSchedule.findByIdAndUpdate(
      req.params.id,
      {
        customer,
        fleet,
        vehicle,
        recurringMaintenance: recurringRule,
        lastDate,
        lastMileage,
        nextDate,
        nextMileage
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

exports.getRecurringRules = async (req, res) => {
  try {
    const { customer_id } = req.query;
    const rules = await RecurringMaintenance.find({ customer: customer_id, active: true });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
};

exports.toggleScheduleStatus = async (req, res) => {
  try {
    const schedule = await RecurringSchedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    schedule.active = !schedule.active;
    await schedule.save();

    res.json({ success: true, schedule });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle schedule status' });
  }
};
