const ActivityLog = require('../models/activityLogModel');

class ActivityLogRepository {
  async create(data) {
    try {
      const activity = new ActivityLog(data);
      return await activity.save();
    } catch (error) {
      throw new Error(`Failed to create activity log: ${error.message}`);
    }
  }

  async findByPetId(petId) {
    try {
      return await ActivityLog.find({ pet_id: petId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to find activity logs: ${error.message}`);
    }
  }
}

module.exports = new ActivityLogRepository();
