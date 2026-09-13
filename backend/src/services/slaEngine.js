const Hotel = require('../models/Hotel');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { DEFAULT_SLA_MINUTES, SLA_STATUS, TASK_STATUS } = require('../config/constants');

class SLAEngine {
  /**
   * Get SLA duration in minutes for a given priority and hotel
   */
  static async getSLAMinutes(hotelId, priority = 'Medium') {
    try {
      const hotel = await Hotel.findById(hotelId);
      if (hotel?.slaSettings?.[priority]?.resolution) {
        return hotel.slaSettings[priority].resolution;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_SLA_MINUTES[priority] || 60;
  }

  /**
   * Calculate SLA deadline
   */
  static calculateDeadline(slaMinutes) {
    return new Date(Date.now() + slaMinutes * 60 * 1000);
  }

  /**
   * Compute SLA status given deadline
   */
  static getSLAStatus(slaDeadline, slaMinutes = 60) {
    if (!slaDeadline) return SLA_STATUS.ON_TRACK;
    
    const now = Date.now();
    const deadline = new Date(slaDeadline).getTime();
    const remainingMs = deadline - now;
    const remainingMinutes = Math.round(remainingMs / 60000);

    if (remainingMs <= 0) {
      return {
        status: SLA_STATUS.BREACHED,
        remainingMinutes,
        label: `${Math.abs(remainingMinutes)}m overdue`,
        isBreached: true,
        isAtRisk: false
      };
    }

    const totalMs = (slaMinutes || 60) * 60000;
    const ratioRemaining = remainingMs / totalMs;

    if (ratioRemaining <= 0.25 || remainingMinutes <= 15) {
      return {
        status: SLA_STATUS.AT_RISK,
        remainingMinutes,
        label: `${remainingMinutes}m remaining`,
        isBreached: false,
        isAtRisk: true
      };
    }

    return {
      status: SLA_STATUS.ON_TRACK,
      remainingMinutes,
      label: `${remainingMinutes}m remaining`,
      isBreached: false,
      isAtRisk: false
    };
  }

  /**
   * Check all active tasks in a hotel and trigger notifications if at risk or breached
   */
  static async checkHotelSLAs(hotelId) {
    const activeTasks = await Task.find({
      hotelId,
      status: { $in: [TASK_STATUS.NEW, TASK_STATUS.ASSIGNED, TASK_STATUS.ACCEPTED, TASK_STATUS.IN_PROGRESS] }
    }).populate('assignedTo', 'name email');

    const alerts = [];

    for (const task of activeTasks) {
      const { isBreached, isAtRisk, remainingMinutes } = this.getSLAStatus(task.slaDeadline, task.slaMinutes);

      if (isBreached) {
        alerts.push({
          taskId: task._id,
          type: 'sla_breached',
          title: `SLA Breached: Room ${task.roomNumber}`,
          message: `Task for ${task.category} in Room ${task.roomNumber} is ${Math.abs(remainingMinutes)}m overdue!`
        });
      } else if (isAtRisk) {
        alerts.push({
          taskId: task._id,
          type: 'sla_warning',
          title: `SLA At Risk: Room ${task.roomNumber}`,
          message: `Only ${remainingMinutes}m remaining for ${task.category} task in Room ${task.roomNumber}.`
        });
      }
    }

    return alerts;
  }
}

module.exports = SLAEngine;
