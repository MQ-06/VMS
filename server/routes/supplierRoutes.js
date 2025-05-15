const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const supplierController = require('../controllers/supplierController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/supplier-logos');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

router.get('/', supplierController.getSuppliers);
router.post('/', upload.single('logo'), supplierController.createSupplier);
router.put('/:id', upload.single('logo'), supplierController.updateSupplier);

module.exports = router;
