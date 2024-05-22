const express = require('express');
const router = express.Router();
const controller = require('../controllers/search');

router.post('/', controller.search);

module.exports = router;