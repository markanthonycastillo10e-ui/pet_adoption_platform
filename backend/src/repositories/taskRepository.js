const Task = require('../models/taskModel');

class TaskRepository {
  async create(taskData) {
    try {
      const task = new Task(taskData);
      return await task.save();
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async findAll(filter = {}) {
    try {
      return await Task.find(filter)
        .populate('pet_id', 'pet_name pet_type')
        .populate('assigned_to', 'first_name last_name')
        .populate('created_by', 'first_name last_name')
        .sort({ scheduled_date: -1 });
    } catch (error) {
      throw new Error(`Failed to find tasks: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Task.findById(id)
        .populate('pet_id')
        .populate('assigned_to')
        .populate('created_by');
    } catch (error) {
      throw new Error(`Failed to find task: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      return await Task.findByIdAndUpdate(id, { $set: { ...updateData, updated_at: Date.now() } }, { new: true });
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      return await Task.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }
}

module.exports = new TaskRepository();
