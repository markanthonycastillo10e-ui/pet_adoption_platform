const activityLogRepository = require('../repositories/activityLogRepository');
const volunteerRepository = require('../repositories/volunteerRepository');

class ActivityLogController {
  async create(req, res) {
    try {
      const body = req.body || {};

      // Validate volunteer if provided
      if (body.veterinarianId) {
        const vol = await volunteerRepository.findById(body.veterinarianId);
        if (!vol) return res.status(404).json({ message: 'Veterinarian (volunteer) not found' });
      }

      // Build activity data with sensible defaults to satisfy schema
      const activityData = {
        title: body.recordType ? `${body.recordType}` : (body.title || 'Medical Record'),
        description: body.description || body.notes || '',
        type: body.recordType || 'Medical',
        category: 'Medical',
        priority: body.priority || 'Low',
        estimatedHours: Number(body.estimatedHours) || 0,
        points: Number(body.points) || 0,
        dueDate: body.date ? new Date(body.date) : new Date(),
        location: body.veterinarian || 'Unknown',
        status: body.status || 'Unassigned',
        assignedTo: body.veterinarianId || null,
        pet_id: body.pet_id || null
      };

      const created = await activityLogRepository.create(activityData);
      return res.status(201).json({ message: 'ActivityLog created', activity: created });
    } catch (err) {
      console.error('Create activity log error:', err);
      return res.status(500).json({ message: 'Failed to create activity log', error: err.message });
    }
  }

  async findByPet(req, res) {
    try {
      const petId = req.params.petId;
      const logs = await activityLogRepository.findByPetId(petId);
      return res.json({ logs });
    } catch (err) {
      console.error('Get activity logs error:', err);
      return res.status(500).json({ message: 'Failed to get activity logs', error: err.message });
    }
  }
}

module.exports = new ActivityLogController();
