const Request = require('../models/Request');
const Task = require('../models/Task');
const Service = require('../models/Service');
const Department = require('../models/Department');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const Conversation = require('../models/Conversation');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AIService = require('../services/aiService');
const AssignmentEngine = require('../services/assignmentEngine');
const SLAEngine = require('../services/slaEngine');
const RAGService = require('../services/ragService');
const { successResponse, errorResponse } = require('../utils/response');
const { logActivity } = require('../utils/logger');
const { emitHotelEvent, emitUserEvent } = require('../services/socketService');
const { REQUEST_STATUS, TASK_STATUS, PRIORITY_LEVELS } = require('../config/constants');

// GET /api/guest/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const roomNumber = req.user.roomNumber || '312';

    // Fetch active requests for this room or guest
    const activeRequests = await Request.find({
      hotelId,
      $or: [{ guestId: req.user._id }, { roomNumber }],
      status: { $in: [REQUEST_STATUS.NEW, REQUEST_STATUS.ASSIGNED, REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.IN_PROGRESS] }
    }).sort({ createdAt: -1 });

    const activeWithSLA = activeRequests.map(r => {
      const slaInfo = SLAEngine.getSLAStatus(r.slaDeadline, r.slaMinutes);
      return { ...r.toObject(), slaInfo };
    });

    return successResponse(res, {
      roomNumber,
      activeRequests: activeWithSLA
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


// GET /api/guest/problem-categories
exports.getProblemCategories = async (req, res) => {
  try {
    const categories = await require('../models/ProblemCategory').find({
      hotelId: req.user.hotelId,
      active: true,
      guestVisible: true
    }).sort({ displayOrder: 1, name: 1 });
    return successResponse(res, categories);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


// GET /api/guest/services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({
      hotelId: req.user.hotelId,
      active: true,
      guestVisible: true
    })
    .sort({ popular: -1, displayOrder: 1, name: 1 })
    .populate('departmentId', 'name');

    return successResponse(res, services);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/guest/requests/service
exports.requestService = async (req, res) => {
  try {
    const { serviceId, serviceName, description, notes, quantity, requestedTime, location } = req.body;
    const hotelId = req.user.hotelId;
    const roomNumber = req.user.roomNumber || '312';

    let service = null;
    if (serviceId) {
      service = await Service.findById(serviceId).populate('departmentId');
    }

    const category = service?.category || 'Guest Service';
    const reqDescription = description || notes || service?.description || `Request for ${serviceName || service?.name || 'hotel service'}`;

    // AI Request Understanding
    const aiAnalysis = await AIService.understandRequest({
      description: reqDescription,
      serviceName: serviceName || service?.name
    });

    const priority = service?.defaultPriority || aiAnalysis.priority || PRIORITY_LEVELS.MEDIUM;
    const slaMinutes = service?.defaultSLAMinutes || await SLAEngine.getSLAMinutes(hotelId, priority);
    const slaDeadline = SLAEngine.calculateDeadline(slaMinutes);

    // Find Department
    let departmentId = service?.departmentId?._id;
    let departmentName = service?.departmentId?.name || aiAnalysis.recommendedDepartment || 'Housekeeping';
    if (!departmentId) {
      const dept = await Department.findOne({ hotelId, name: new RegExp(departmentName, 'i') });
      if (dept) departmentId = dept._id;
    }

    // Smart Assignment
    const floor = /^\d+$/.test(roomNumber) ? parseInt(roomNumber[0], 10) : 1;
    const assignment = await AssignmentEngine.assignStaff({
      hotelId,
      departmentId,
      departmentName,
      category: service?.name || aiAnalysis.category,
      floor,
      priority
    });

    // Create Request
    const request = await Request.create({
      hotelId,
      guestId: req.user._id,
      roomId: req.user.roomId,
      roomNumber,
      location: location || 'Room',
      requestedTime,
      serviceId,
      quantity,
      type: 'service',
      category: service?.name || aiAnalysis.category,
      subcategory: service?.category || aiAnalysis.subcategory,
      description: reqDescription,
      priority,
      departmentId,
      department: departmentName,
      slaMinutes,
      slaDeadline,
      assignedTo: assignment.assignedStaff?._id || null,
      status: assignment.assignedStaff ? REQUEST_STATUS.ASSIGNED : REQUEST_STATUS.NEW,
      aiAnalysis,
      timeline: [
        { action: 'CREATED', by: req.user.name, note: 'Guest submitted service request' },
        ...(assignment.assignedStaff ? [{
          action: 'ASSIGNED',
          by: 'Smart Assignment Engine',
          note: assignment.assignmentReason
        }] : [])
      ]
    });

    // Create Task
    const task = await Task.create({
      hotelId,
      requestId: request._id,
      assignedTo: assignment.assignedStaff?._id || null,
      departmentId,
      department: departmentName,
      category: request.category,
      priority,
      roomNumber,
      description: reqDescription,
      aiSummary: aiAnalysis.summary,
      assignmentReason: assignment.assignmentReason,
      slaMinutes,
      slaDeadline,
      status: assignment.assignedStaff ? TASK_STATUS.ASSIGNED : TASK_STATUS.NEW
    });

    // Notify assigned staff
    if (assignment.assignedStaff) {
      await Notification.create({
        hotelId,
        userId: assignment.assignedStaff._id,
        type: 'task_assigned',
        title: `New Task: Room ${roomNumber}`,
        message: `${request.category} requested in Room ${roomNumber}. SLA: ${slaMinutes}m.`,
        requestId: request._id,
        taskId: task._id
      });
      emitUserEvent(assignment.assignedStaff._id, 'notification_created', {
        title: `New Task: Room ${roomNumber}`,
        message: `${request.category} requested in Room ${roomNumber}`
      });
    }

    emitHotelEvent(hotelId, 'request_created', request);

    return successResponse(res, {
      request,
      task,
      assignmentReason: assignment.assignmentReason,
      slaRemainingMinutes: slaMinutes
    }, 'Service request submitted successfully', 201);
  } catch (error) {
    console.error('Service request error:', error);
    return errorResponse(res, error.message);
  }
};

// POST /api/guest/requests/food
exports.placeFoodOrder = async (req, res) => {
  try {
    const { items, subtotal, taxes, total, scheduleType, scheduledAt, deliveryPreference, notes } = req.body;
    const hotelId = req.user.hotelId;
    const roomNumber = req.user.roomNumber || '312';
    const FoodOrder = require('../models/FoodOrder');

    const orderNo = 'FO-' + Math.floor(1000 + Math.random() * 9000);

    const order = await FoodOrder.create({
      orderNo,
      hotelId,
      guestId: req.user._id,
      roomId: req.user.roomId,
      roomNumber,
      items,
      subtotal,
      taxes,
      total,
      scheduleType,
      scheduledAt,
      deliveryPreference,
      notes,
      timeline: [{ event: 'placed', label: 'Order placed by guest' }]
    });

    return successResponse(res, order, 'Food order placed successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/guest/requests/issue (Multimodal problem report)
exports.reportIssue = async (req, res) => {
  try {
    const { description, image, category: clientCategory, location, requestedTime } = req.body;
    const hotelId = req.user.hotelId;
    const roomNumber = req.user.roomNumber || '312';

    if (!description) {
      return errorResponse(res, 'Please describe the problem you are experiencing.', 400);
    }

    // Multimodal Issue Analyzer
    const aiAnalysis = await AIService.analyzeIssueWithPhoto({
      description,
      imageBase64OrUrl: image
    });

    const category = clientCategory || aiAnalysis.category;
    const priority = aiAnalysis.priority;
    const slaMinutes = await SLAEngine.getSLAMinutes(hotelId, priority);
    const slaDeadline = SLAEngine.calculateDeadline(slaMinutes);

    // Department lookup
    let departmentName = aiAnalysis.recommendedDepartment || 'Maintenance';
    const dept = await Department.findOne({ hotelId, name: new RegExp(departmentName, 'i') });
    const departmentId = dept?._id;

    // Smart Staff Assignment
    const floor = /^\d+$/.test(roomNumber) ? parseInt(roomNumber[0], 10) : 1;
    const assignment = await AssignmentEngine.assignStaff({
      hotelId,
      departmentId,
      departmentName,
      category,
      floor,
      priority
    });

    // Create Request
    const request = await Request.create({
      hotelId,
      guestId: req.user._id,
      roomNumber,
      type: 'issue',
      category,
      subcategory: aiAnalysis.subcategory,
      description,
      images: image ? [image] : [],
      priority,
      departmentId,
      department: departmentName,
      slaMinutes,
      slaDeadline,
      assignedTo: assignment.assignedStaff?._id || null,
      status: assignment.assignedStaff ? REQUEST_STATUS.ASSIGNED : REQUEST_STATUS.NEW,
      aiAnalysis,
      timeline: [
        { action: 'REPORTED', by: req.user.name, note: 'Guest reported issue with AI diagnosis' },
        ...(assignment.assignedStaff ? [{
          action: 'ASSIGNED',
          by: 'Smart Assignment Engine',
          note: assignment.assignmentReason
        }] : [])
      ]
    });

    // Create Task
    const task = await Task.create({
      hotelId,
      requestId: request._id,
      assignedTo: assignment.assignedStaff?._id || null,
      departmentId,
      department: departmentName,
      category,
      priority,
      roomNumber,
      description,
      aiSummary: aiAnalysis.summary,
      assignmentReason: assignment.assignmentReason,
      slaMinutes,
      slaDeadline,
      status: assignment.assignedStaff ? TASK_STATUS.ASSIGNED : TASK_STATUS.NEW
    });

    if (assignment.assignedStaff) {
      await Notification.create({
        hotelId,
        userId: assignment.assignedStaff._id,
        type: 'task_assigned',
        title: `Urgent Issue: Room ${roomNumber}`,
        message: `${priority} priority ${category} issue in Room ${roomNumber}.`,
        requestId: request._id,
        taskId: task._id
      });
    }

    emitHotelEvent(hotelId, 'request_created', request);

    return successResponse(res, {
      request,
      aiAnalysis,
      assignmentReason: assignment.assignmentReason
    }, 'Problem reported and maintenance team dispatched', 201);
  } catch (error) {
    console.error('Report issue error:', error);
    return errorResponse(res, error.message);
  }
};

// GET /api/guest/requests
exports.getMyRequests = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const roomNumber = req.user.roomNumber || '312';

    const requests = await Request.find({
      hotelId,
      $or: [{ guestId: req.user._id }, { roomNumber }]
    })
    .populate('assignedTo', 'name email department')
    .sort({ createdAt: -1 });

    const requestsWithSLA = requests.map(r => {
      const slaInfo = SLAEngine.getSLAStatus(r.slaDeadline, r.slaMinutes);
      return { ...r.toObject(), slaInfo };
    });

    return successResponse(res, requestsWithSLA);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// GET /api/guest/requests/:id
exports.getRequestDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.user.hotelId;
    const FoodOrder = require('../models/FoodOrder');

    let request = await Request.findOne({ _id: id, hotelId, guestId: req.user._id })
      .populate('serviceId', 'name icon category');

    if (!request) {
      const fo = await FoodOrder.findOne({ _id: id, hotelId, guestId: req.user._id });
      if (!fo) return errorResponse(res, 'Request not found', 404);
      
      const itemDesc = fo.items.map(i => `${i.quantity}x ${i.name}`).join('\n');
      request = {
        _id: fo._id,
        requestNo: fo.orderNo,
        type: 'food_order',
        category: 'Room Service',
        subcategory: 'In-Room Dining',
        status: fo.status,
        createdAt: fo.createdAt,
        total: fo.total,
        items: fo.items,
        description: `Order Details:\n${itemDesc}\n\nTotal: ₹${fo.total}`,
        priority: 'Medium',
        department: 'Room Service',
        timeline: fo.timeline
      };
    }

    return successResponse(res, request);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/guest/requests/:id/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, resolutionSatisfied } = req.body;
    const hotelId = req.user.hotelId;

    const request = await Request.findOne({ _id: id, hotelId });
    if (!request) return errorResponse(res, 'Request not found', 404);

    const feedback = await Feedback.findOneAndUpdate(
      { requestId: request._id, hotelId },
      {
        hotelId,
        requestId: request._id,
        guestId: req.user._id,
        rating: Number(rating) || 5,
        comment: comment || '',
        resolutionSatisfied: resolutionSatisfied !== false
      },
      { upsert: true, new: true }
    );

    request.feedback = {
      rating: feedback.rating,
      comment: feedback.comment,
      resolutionSatisfied: feedback.resolutionSatisfied,
      createdAt: new Date()
    };
    await request.save();

    emitHotelEvent(hotelId, 'feedback_received', feedback);

    return successResponse(res, feedback, 'Thank you for your feedback!');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/guest/feedback
exports.submitGeneralFeedback = async (req, res) => {
  try {
    const { rating, comment, category, resolutionSatisfied } = req.body;
    const hotelId = req.user.hotelId;
    const guestId = req.user._id;
    const guestName = req.user.name || 'Guest';
    const roomNumber = req.user.roomNumber || '';

    const feedback = await Feedback.create({
      hotelId,
      guestId,
      guestName,
      roomNumber,
      category: category || 'Overall Stay Experience',
      rating: Number(rating) || 5,
      comment: comment || '',
      resolutionSatisfied: resolutionSatisfied !== false
    });

    emitHotelEvent(hotelId, 'feedback_received', feedback);

    return successResponse(res, feedback, 'Thank you! Your rating and feedback have been recorded.', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


// GET /api/guest/concierge/suggestions
exports.getConciergeSuggestions = async (req, res) => {
  try {
    const KnowledgeDocument = require('../models/KnowledgeDocument');
    const docs = await KnowledgeDocument.find({ hotelId: req.user.hotelId, status: 'indexed' }).limit(4);
    if (!docs || docs.length === 0) {
      return successResponse(res, [
        'What time is breakfast served?',
        'Where is the swimming pool located?',
        'How do I connect to the guest Wi-Fi?',
        'What is the checkout policy?'
      ]);
    }
    
    const suggestions = docs.map(d => `Tell me about ${d.title.toLowerCase()}`);
    return successResponse(res, suggestions);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


// POST /api/guest/concierge/chat
exports.conciergeChat = async (req, res) => {
  try {
    const { message } = req.body;
    const hotelId = req.user.hotelId;
    const roomNumber = req.user.roomNumber || '312';

    if (!message) return errorResponse(res, 'Message is required', 400);

    const hotel = await Hotel.findById(hotelId);
    const answerData = await RAGService.answerConcierge({
      hotelId,
      question: message,
      guestName: req.user.name,
      roomNumber,
      hotelName: hotel.name
    });

    // Record message into conversation
    await Conversation.findOneAndUpdate(
      { hotelId, userId: req.user._id, channel: 'concierge' },
      {
        hotelId,
        userId: req.user._id,
        roomNumber,
        channel: 'concierge',
        $push: {
          messages: [
            { sender: 'user', text: message },
            { sender: 'assistant', text: answerData.answer, sources: answerData.sources }
          ]
        }
      },
      { upsert: true }
    );

    return successResponse(res, answerData);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// GET /api/guest/notifications
exports.getNotifications = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const notifs = await Notification.find({
      hotelId,
      $or: [{ userId: req.user._id }, { type: { $in: ['request_accepted', 'request_completed'] } }]
    }).sort({ createdAt: -1 }).limit(20);

    return successResponse(res, notifs);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// GET /api/guest/access
exports.getHotelAccess = async (req, res) => {
  try {
    const { hotel } = req.query;
    if (hotel) {
      const h = await Hotel.findOne({
        $or: [
          { hotelCode: hotel.toUpperCase().trim() },
          { subdomain: hotel.toLowerCase().trim() }
        ]
      }).select('name hotelCode logo address facilities status');

      if (!h || h.status === 'suspended') {
        return errorResponse(res, 'Hotel property not found or inactive', 404);
      }
      return successResponse(res, h);
    }

    // Default return active hotels list for selection
    const hotels = await Hotel.find({ status: { $ne: 'suspended' } }).select('name hotelCode logo address');
    return successResponse(res, hotels);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/guest/verify-room
exports.verifyRoom = async (req, res) => {
  try {
    const { hotel: hotelInput, hotelCode, roomNumber, guestName } = req.body;
    const targetCode = (hotelCode || hotelInput || '').toUpperCase().trim();
    const targetRoom = String(roomNumber || '').trim();

    if (!targetCode || !targetRoom) {
      return errorResponse(res, 'Hotel code and room number are required', 400);
    }

    const hotel = await Hotel.findOne({
      $or: [
        { hotelCode: targetCode },
        { subdomain: targetCode.toLowerCase() }
      ]
    });

    if (!hotel || hotel.status === 'suspended') {
      return errorResponse(res, 'Hotel property not found or inactive', 404);
    }

    let room = await Room.findOne({
      hotelId: hotel._id,
      roomNumber: targetRoom,
      status: { $ne: 'inactive' }
    });

    // Auto-provision the room if the hotel exists but the room hasn't been created yet
    // This handles newly registered hotels where the admin hasn't added rooms manually
    if (!room) {
      const floor = /^\d+$/.test(targetRoom) ? Math.max(1, parseInt(targetRoom.charAt(0), 10)) : 1;
      room = await Room.create({
        hotelId: hotel._id,
        roomNumber: targetRoom,
        floor,
        type: 'standard',
        status: 'occupied'
      });
    }

    // Check if there is an active guest registered for this room
    let guestUser = await User.findOne({
      hotelId: hotel._id,
      role: 'guest',
      roomNumber: room.roomNumber
    });

    // If guestName is not provided:
    if (!guestName || !guestName.trim()) {
      // If there is already a named guest for this room, automatically resume session
      if (guestUser && guestUser.name && guestUser.name.trim() && guestUser.name !== 'Guest') {
        const token = jwt.sign(
          {
            userId: guestUser._id,
            hotelId: hotel._id,
            role: 'guest',
            roomNumber: room.roomNumber,
            roomId: room._id,
            name: guestUser.name
          },
          process.env.JWT_SECRET || 'stayflow_super_secret_key_2024',
          { expiresIn: '7d' }
        );

        await logActivity({
          hotelId: hotel._id,
          userId: guestUser._id,
          role: 'guest',
          action: 'GUEST_SESSION_RESUMED',
          resource: 'Room',
          resourceId: room._id,
          metadata: { roomNumber: room.roomNumber, guestName: guestUser.name }
        });

        return successResponse(res, {
          verified: true,
          hasSession: true,
          token,
          hotel: { _id: hotel._id, name: hotel.name, hotelCode: hotel.hotelCode, logo: hotel.logo },
          room: { _id: room._id, roomNumber: room.roomNumber },
          guest: { _id: guestUser._id, name: guestUser.name, roomNumber: room.roomNumber }
        }, 'Guest session restored');
      }

      // No guest name on file yet -> require Step 3 (Name entry)
      return successResponse(res, {
        verified: true,
        hasSession: false,
        hotel: { _id: hotel._id, name: hotel.name, hotelCode: hotel.hotelCode, logo: hotel.logo },
        room: { _id: room._id, roomNumber: room.roomNumber }
      }, 'Room verified. Please enter guest name.');
    }

    // If guestName IS provided, register/update guest and issue token
    const validGuestName = guestName.trim();

    if (!guestUser) {
      const salt = await bcrypt.genSalt(10);
      // generate a random suffix to avoid email collision if multiple guests stay over time
      const suffix = Math.random().toString(36).substring(2, 7);
      const hashedPassword = await bcrypt.hash(`guest-${room.roomNumber}-${suffix}`, salt);
      guestUser = await User.create({
        name: validGuestName,
        email: `guest.r${room.roomNumber}.${suffix}.${hotel.hotelCode.toLowerCase()}@stayflow.internal`,
        password: hashedPassword,
        role: 'guest',
        hotelId: hotel._id,
        roomId: room._id,
        roomNumber: room.roomNumber,
        active: true
      });
    } else {
      // Update the name to the actual guest name (e.g. they checked out and a new guest arrived, or they changed it)
      guestUser.name = validGuestName;
      guestUser.roomId = room._id;
      await guestUser.save();
    }

    // Issue token
    const token = jwt.sign(
      {
        userId: guestUser._id,
        hotelId: hotel._id,
        role: 'guest',
        roomNumber: room.roomNumber,
        roomId: room._id,
        name: guestUser.name
      },
      process.env.JWT_SECRET || 'stayflow_super_secret_key_2024',
      { expiresIn: '7d' }
    );

    await logActivity({
      hotelId: hotel._id,
      userId: guestUser._id,
      role: 'guest',
      action: 'GUEST_LOGIN',
      resource: 'Room',
      resourceId: room._id,
      metadata: { roomNumber: room.roomNumber, guestName: validGuestName }
    });

    return successResponse(res, {
      token,
      hotel: {
        _id: hotel._id,
        name: hotel.name,
        hotelCode: hotel.hotelCode,
        logo: hotel.logo
      },
      room: {
        _id: room._id,
        roomNumber: room.roomNumber,
        floor: room.floor,
        type: room.type
      },
      guest: {
        _id: guestUser._id,
        name: guestUser.name,
        roomNumber: room.roomNumber
      }
    }, 'Access granted successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// GET /api/guest/session
exports.getSession = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId).select('name hotelCode logo address');
    return successResponse(res, {
      user: req.user,
      hotel,
      roomNumber: req.user.roomNumber,
      roomId: req.user.roomId
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/guest/session/logout
exports.logoutSession = async (req, res) => {
  return successResponse(res, {}, 'Guest session ended');
};
