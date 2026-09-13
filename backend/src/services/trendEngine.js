const Request = require('../models/Request');
const Room = require('../models/Room');
const IssueTrend = require('../models/IssueTrend');
const { PRIORITY_LEVELS } = require('../config/constants');

class TrendEngine {
  /**
   * Analyze recent requests and generate/update IssueTrend records
   */
  static async scanHotelTrends(hotelId) {
    const timeWindowHours = 48;
    const windowStart = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);

    // Fetch requests from the last 48 hours
    const requests = await Request.find({
      hotelId,
      createdAt: { $gte: windowStart }
    }).populate('roomId', 'floor');

    // Group by category and floor
    const clusters = {};

    for (const req of requests) {
      // Determine floor from room number or room object (e.g. room "312" -> floor 3)
      let floor = 1;
      if (req.roomId?.floor) {
        floor = req.roomId.floor;
      } else if (req.roomNumber && /^\d+$/.test(req.roomNumber)) {
        floor = parseInt(req.roomNumber[0], 10) || 1;
      }

      const key = `${req.category}::Floor_${floor}`;
      if (!clusters[key]) {
        clusters[key] = {
          category: req.category,
          subcategory: req.subcategory || '',
          floor,
          rooms: new Set(),
          requests: []
        };
      }

      clusters[key].rooms.add(req.roomNumber);
      clusters[key].requests.push(req);
    }

    const detectedTrends = [];

    for (const key of Object.keys(clusters)) {
      const cluster = clusters[key];
      const roomList = Array.from(cluster.rooms);

      // Trigger condition: >= 2 requests across multiple rooms (or >= 3 in same category on that floor)
      if (cluster.requests.length >= 2 && roomList.length >= 2) {
        const insight = `Multiple ${cluster.category}-related requests are concentrated on Floor ${cluster.floor} (${roomList.length} rooms affected: ${roomList.join(', ')}).`;
        const recommendedAction = `Schedule preventive ${cluster.category} inspection for Floor ${cluster.floor} rooms (${roomList.join(', ')}).`;

        // Check if an active trend already exists
        let existingTrend = await IssueTrend.findOne({
          hotelId,
          category: cluster.category,
          floor: cluster.floor,
          status: 'active'
        });

        if (existingTrend) {
          existingTrend.rooms = roomList;
          existingTrend.count = cluster.requests.length;
          existingTrend.insight = insight;
          existingTrend.recommendedAction = recommendedAction;
          await existingTrend.save();
          detectedTrends.push(existingTrend);
        } else {
          const newTrend = await IssueTrend.create({
            hotelId,
            category: cluster.category,
            subcategory: cluster.subcategory,
            floor: cluster.floor,
            rooms: roomList,
            count: cluster.requests.length,
            timeRange: '48 hours',
            severity: cluster.requests.length >= 4 ? PRIORITY_LEVELS.CRITICAL : PRIORITY_LEVELS.HIGH,
            insight,
            recommendedAction,
            status: 'active'
          });
          detectedTrends.push(newTrend);
        }
      }
    }

    return detectedTrends;
  }
}

module.exports = TrendEngine;
