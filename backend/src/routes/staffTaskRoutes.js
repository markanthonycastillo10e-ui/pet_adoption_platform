const express = require('express');
const router = express.Router();
const staffTaskController = require('../controller/staffTaskController');

// GET - Retrieve all staff tasks
router.get('/', staffTaskController.getAll);

// POST - Create a new staff task
router.post('/', staffTaskController.create);

// GET - Retrieve a specific staff task by ID
router.get('/:id', staffTaskController.getById);

// PUT - Update a staff task
router.put('/:id', staffTaskController.update);

// DELETE - Delete a staff task
router.delete('/:id', staffTaskController.delete);

// PUT - Assign a volunteer to a task
router.put('/:id/assign', staffTaskController.assignVolunteer);

module.exports = router;
