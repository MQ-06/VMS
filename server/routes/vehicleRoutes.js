const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { multiUpload } = require('../middleware/uploadMiddleware');

router.get('/', vehicleController.getVehicles);
router.post('/', multiUpload, vehicleController.createVehicle);
router.put('/:id', multiUpload, vehicleController.updateVehicle);
router.patch('/:id/active', vehicleController.toggleVehicleStatus);


module.exports = router;
