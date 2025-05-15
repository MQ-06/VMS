const express = require('express');
const router = express.Router();
const fleetController = require('../controllers/fleetController');

router.get('/', fleetController.getFleets);
router.post('/', fleetController.createFleet);
router.put('/:id', fleetController.updateFleet);

module.exports = router;
