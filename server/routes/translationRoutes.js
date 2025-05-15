const express = require('express');
const { getTranslations, addTranslation } = require('../controllers/translationController');

const router = express.Router();

router.get('/', getTranslations);
router.post('/', addTranslation);

module.exports = router;
