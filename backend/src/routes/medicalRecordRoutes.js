const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controller/medicalRecordController');

// POST - Create a new medical record
router.post('/', medicalRecordController.create);

// GET - Retrieve all medical records for a specific pet
router.get('/pet/:petId', medicalRecordController.getByPetId);

// PUT - Update a medical record
router.put('/:id', medicalRecordController.update);

// DELETE - Delete a medical record
router.delete('/:id', medicalRecordController.delete);

module.exports = router;
