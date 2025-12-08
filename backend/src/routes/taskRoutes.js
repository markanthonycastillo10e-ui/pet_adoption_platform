const express = require('express');
const taskController = require('../controller/taskController');
const staffTaskController = require('../controller/staffTaskController');

const router = express.Router();

// POST route - check if it's a staff task or pet task
router.post('/', (req, res) => {
  // If there's no pet_id, it's a staff task
  if (!req.body.pet_id) {
    return staffTaskController.create(req, res);
  }
  // Otherwise, it's a pet task
  return taskController.create(req, res);
});

// For now, return staff tasks for GET requests since that's what the form page expects
router.get('/', (req, res) => staffTaskController.getAll(req, res));
router.get('/:id', (req, res) => staffTaskController.getById(req, res));
router.put('/:id', (req, res) => staffTaskController.update(req, res));
router.put('/:id/assign', (req, res) => staffTaskController.assignVolunteer(req, res));
router.delete('/:id', (req, res) => staffTaskController.delete(req, res));

module.exports = router;