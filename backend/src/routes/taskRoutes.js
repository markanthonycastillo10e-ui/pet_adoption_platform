const express = require('express');
const taskController = require('../controller/taskController');

const router = express.Router();

router.get('/', (req, res) => taskController.getAll(req, res));
router.get('/:id', (req, res) => taskController.getById(req, res));
router.post('/', (req, res) => taskController.create(req, res));
router.put('/:id', (req, res) => taskController.update(req, res));
router.delete('/:id', (req, res) => taskController.delete(req, res));

module.exports = router;