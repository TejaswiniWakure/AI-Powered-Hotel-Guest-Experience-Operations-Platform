const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ hotelId, userId, userName, role, action, resource, resourceId = '', metadata = {}, ipAddress = '' }) => {
  try {
    if (!hotelId) return;
    await ActivityLog.create({
      hotelId,
      userId,
      userName: userName || 'System',
      role: role || 'system',
      action,
      resource,
      resourceId: String(resourceId),
      metadata,
      ipAddress
    });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = { logActivity };
