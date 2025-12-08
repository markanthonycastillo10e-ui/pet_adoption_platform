const MedicalRecord = require('../models/medicalRecordModel');

class MedicalRecordRepository {
  async create(data) {
    const record = new MedicalRecord(data);
    return await record.save();
  }

  async findByPetId(petId) {
    return await MedicalRecord.find({ pet_id: petId }).sort({ date: -1 });
  }

  async findById(id) {
    return await MedicalRecord.findById(id);
  }

  async update(id, data) {
    return await MedicalRecord.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
  }

  async delete(id) {
    return await MedicalRecord.findByIdAndDelete(id);
  }

  async deleteByPetId(petId) {
    return await MedicalRecord.deleteMany({ pet_id: petId });
  }
}

module.exports = new MedicalRecordRepository();
