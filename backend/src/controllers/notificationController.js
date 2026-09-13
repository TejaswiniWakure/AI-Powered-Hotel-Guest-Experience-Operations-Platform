const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/response');
const { ROLES } = require('../config/constants');

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const userId = req.user._id;
    const role = req.user.role;

    let filter = { hotelId };

    if (role === ROLES.GUEST) {
      filter.$or = [
        { userId },
        { type: { $in: ['request_created', 'request_accepted', 'request_completed', 'system'] } }
      ];
    } else if (role === ROLES.STAFF) {
      filter.$or = [
        { userId },
        { type: { $in: ['task_assigned', 'task_reassigned', 'sla_warning', 'safety_alert', 'system'] } }
      ];
    }
    // Managers and Admins receive all hotel notifications

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    return successResponse(res, notifications);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, hotelId: req.user.hotelId },
      { read: true },
      { new: true }
    );
    if (!notification) return errorResponse(res, 'Notification not found', 404);
    return successResponse(res, notification, 'Marked as read');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PATCH /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    await Notification.updateMany({ hotelId, read: false }, { read: true });
    return successResponse(res, {}, 'All notifications marked as read');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
