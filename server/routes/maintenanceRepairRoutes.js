const express = require('express');
const router = express.Router();
const controller = require('../controllers/maintenanceRepairController');
const multer = require('multer');

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/repairs/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});

const upload = multer({ storage });

router.get('/', controller.getAll);

router.post(
  '/',
  upload.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'invoice', maxCount: 1 }
  ]),
  controller.create
);

router.patch(
  '/:id',
  upload.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'invoice', maxCount: 1 }
  ]),
  controller.update
);


router.patch('/:id/status', controller.toggleStatus);

router.delete('/:id', controller.remove);

module.exports = router;
