const express = require('express');
const router = express.Router();
const controller = require('../controllers/repairCategoryController');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/active', controller.toggleActive); // ✅ NEW

module.exports = router;
