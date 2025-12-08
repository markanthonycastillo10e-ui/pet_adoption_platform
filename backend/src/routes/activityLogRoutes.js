const express = require('express');
const activityLogController = require('../controller/activityLogController');

const router = express.Router();

router.post('/', (req, res) => activityLogController.create(req, res));
router.get('/pet/:petId', (req, res) => activityLogController.findByPet(req, res));

module.exports = router;
