const express = require('express');
const router = express.Router();
const staffController = require('../controller/staffController');

// GET - Retrieve staff profile by ID
router.get('/:staffId', staffController.getProfile);

// PUT - Update staff profile
router.put('/:staffId', staffController.updateProfile);

// GET - Retrieve staff statistics
router.get('/:staffId/stats', staffController.getStats);

module.exports = router;
