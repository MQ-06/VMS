const express = require('express');
const router = express.Router();
const controller = require('../controllers/partServiceController');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove); // optional

module.exports = router;
