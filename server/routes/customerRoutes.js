const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/customers/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('logo'), customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.post('/:id/update', upload.single('logo'), customerController.updateCustomer);
router.post('/:id/toggle-status', customerController.toggleCustomerStatus);

module.exports = router;
