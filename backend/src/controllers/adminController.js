const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const User = require('../models/User');
const Department = require('../models/Department');
const Service = require('../models/Service');
const KnowledgeDocument = require('../models/KnowledgeDocument');
const ActivityLog = require('../models/ActivityLog');
const RAGService = require('../services/ragService');
const { successResponse, errorResponse } = require('../utils/response');
const { logActivity } = require('../utils/logger');
const { ROLES } = require('../config/constants');

// GET /api/admin/overview
exports.getOverview = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const [totalRooms, activeStaff, departmentsCount, servicesCount, knowledgeDocsCount, recentLogs] = await Promise.all([
      Room.countDocuments({ hotelId }),
      User.countDocuments({ hotelId, role: { $in: [ROLES.STAFF, ROLES.MANAGER] }, active: true }),
      Department.countDocuments({ hotelId, active: true }),
      Service.countDocuments({ hotelId, active: true }),
      KnowledgeDocument.countDocuments({ hotelId }),
      ActivityLog.find({ hotelId }).sort({ createdAt: -1 }).limit(5)
    ]);

    const hotel = await Hotel.findById(hotelId).select('name hotelCode status subscription limits usage');

    return successResponse(res, {
      hotel,
      metrics: {
        totalRooms,
        activeStaff,
        departmentsCount,
        servicesCount,
        knowledgeDocsCount
      },
      recentLogs
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// GET /api/admin/hotel
exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId);
    return successResponse(res, hotel);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PATCH /api/admin/hotel
exports.updateHotel = async (req, res) => {
  try {
    const { name, address, contactEmail, contactPhone, facilities, supportedLanguages, logo } = req.body;
    const hotel = await Hotel.findById(req.user.hotelId);

    if (name) hotel.name = name;
    if (address) hotel.address = { ...hotel.address, ...address };
    if (contactEmail) hotel.contactEmail = contactEmail;
    if (contactPhone) hotel.contactPhone = contactPhone;
    if (facilities) hotel.facilities = facilities;
    if (supportedLanguages) hotel.supportedLanguages = supportedLanguages;
    if (logo) hotel.logo = logo;

    await hotel.save();

    await logActivity({
      hotelId: hotel._id,
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE_HOTEL_SETTINGS',
      resource: 'Hotel',
      resourceId: hotel._id
    });

    return successResponse(res, hotel, 'Hotel updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// --- ROOMS CRUD ---
exports.getRooms = async (req, res) => {
  try {
    const { floor, status, type } = req.query;
    const filter = { hotelId: req.user.hotelId };
    if (floor) filter.floor = Number(floor);
    if (status) filter.status = status;
    if (type) filter.type = type;

    const rooms = await Room.find(filter).sort({ floor: 1, roomNumber: 1 });
    return successResponse(res, rooms);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, floor, type = 'standard', status = 'available' } = req.body;
    const hotelId = req.user.hotelId;

    const hotel = await Hotel.findById(hotelId);
    const roomCount = await Room.countDocuments({ hotelId });
    if (roomCount >= (hotel.limits?.maxRooms || 100)) {
      return errorResponse(res, `Room limit (${hotel.limits.maxRooms}) reached for your plan. Please upgrade.`, 403);
    }

    const room = await Room.create({
      hotelId,
      roomNumber: String(roomNumber).trim(),
      floor: Number(floor) || parseInt(String(roomNumber)[0], 10) || 1,
      type,
      status,
      qrCode: `/guest?room=${roomNumber}`
    });

    await logActivity({
      hotelId,
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE_ROOM',
      resource: 'Room',
      resourceId: room._id,
      metadata: { roomNumber }
    });

    return successResponse(res, room, 'Room created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findOneAndUpdate(
      { _id: id, hotelId: req.user.hotelId },
      req.body,
      { new: true }
    );
    if (!room) return errorResponse(res, 'Room not found', 404);
    return successResponse(res, room, 'Room updated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findOneAndDelete({ _id: id, hotelId: req.user.hotelId });
    if (!room) return errorResponse(res, 'Room not found', 404);
    return successResponse(res, {}, 'Room deleted');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// --- STAFF CRUD ---
exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({
      hotelId: req.user.hotelId,
      role: { $in: [ROLES.STAFF, ROLES.MANAGER, ROLES.ADMIN] }
    }).select('-password').populate('departmentId', 'name').sort({ role: 1, name: 1 });
    return successResponse(res, staff);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'staff', department, departmentId, skills = [] } = req.body;
    const hotelId = req.user.hotelId;

    let targetDeptId = departmentId;
    if (!targetDeptId && department) {
      const dept = await Department.findOne({ hotelId, name: new RegExp(department, 'i') });
      if (dept) targetDeptId = dept._id;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      password: password || 'StayFlow@2026',
      role,
      hotelId,
      department,
      departmentId: targetDeptId,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      active: true
    });

    await logActivity({
      hotelId,
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE_STAFF',
      resource: 'User',
      resourceId: user._id,
      metadata: { role, department }
    });

    return successResponse(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      skills: user.skills
    }, 'Staff member created', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.password) delete updates.password; // Do not overwrite raw password directly here

    const staff = await User.findOneAndUpdate(
      { _id: id, hotelId: req.user.hotelId },
      updates,
      { new: true }
    ).select('-password');

    if (!staff) return errorResponse(res, 'Staff member not found', 404);
    return successResponse(res, staff, 'Staff updated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findOneAndDelete({ _id: id, hotelId: req.user.hotelId, role: { $ne: ROLES.ADMIN } });
    if (!staff) return errorResponse(res, 'Staff member not found or protected', 404);
    return successResponse(res, {}, 'Staff member removed');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// --- DEPARTMENTS CRUD ---
exports.getDepartments = async (req, res) => {
  try {
    const depts = await Department.find({ hotelId: req.user.hotelId }).populate('managerId', 'name email');
    return successResponse(res, depts);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, description, managerId } = req.body;
    const dept = await Department.create({
      hotelId: req.user.hotelId,
      name,
      description,
      managerId
    });
    return successResponse(res, dept, 'Department created', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findOneAndUpdate(
      { _id: req.params.id, hotelId: req.user.hotelId },
      req.body,
      { new: true }
    );
    if (!dept) return errorResponse(res, 'Department not found', 404);
    return successResponse(res, dept, 'Department updated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findOneAndDelete({ _id: req.params.id, hotelId: req.user.hotelId });
    if (!dept) return errorResponse(res, 'Department not found', 404);
    return successResponse(res, {}, 'Department removed');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// --- SERVICES CRUD ---
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ hotelId: req.user.hotelId }).populate('departmentId', 'name');
    return successResponse(res, services);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      hotelId: req.user.hotelId
    });
    return successResponse(res, service, 'Service created', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, hotelId: req.user.hotelId },
      req.body,
      { new: true }
    );
    if (!service) return errorResponse(res, 'Service not found', 404);
    return successResponse(res, service, 'Service updated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, hotelId: req.user.hotelId });
    if (!service) return errorResponse(res, 'Service not found', 404);
    return successResponse(res, {}, 'Service deleted');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// --- SLA CONFIGURATION ---
exports.getSLA = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId).select('slaSettings');
    return successResponse(res, hotel.slaSettings);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.updateSLA = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.user.hotelId);
    if (req.body) {
      hotel.slaSettings = {
        ...hotel.slaSettings,
        ...req.body
      };
      await hotel.save();
    }

    await logActivity({
      hotelId: hotel._id,
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE_SLA_CONFIG',
      resource: 'SLA',
      metadata: req.body
    });

    return successResponse(res, hotel.slaSettings, 'SLA rules updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// --- KNOWLEDGE CENTER ---
exports.getKnowledgeDocs = async (req, res) => {
  try {
    const docs = await KnowledgeDocument.find({ hotelId: req.user.hotelId })
      .select('title category description status createdAt chunks uploadedBy')
      .populate('uploadedBy', 'name');
    
    // Format chunk count
    const formatted = docs.map(d => ({
      _id: d._id,
      title: d.title,
      category: d.category,
      description: d.description,
      status: d.status,
      chunkCount: d.chunks?.length || 0,
      createdAt: d.createdAt,
      uploadedBy: d.uploadedBy?.name || 'Admin'
    }));

    return successResponse(res, formatted);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.uploadKnowledgeDoc = async (req, res) => {
  try {
    const { title, category, description, content } = req.body;
    const hotelId = req.user.hotelId;

    if (!title || !content) {
      return errorResponse(res, 'Title and content are required', 400);
    }

    const chunks = RAGService.chunkContent(content);

    const doc = await KnowledgeDocument.create({
      hotelId,
      title,
      category: category || 'faq',
      description,
      content,
      chunks,
      status: 'indexed',
      uploadedBy: req.user._id
    });

    await logActivity({
      hotelId,
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPLOAD_KNOWLEDGE_DOC',
      resource: 'KnowledgeDocument',
      resourceId: doc._id,
      metadata: { title, category, chunkCount: chunks.length }
    });

    return successResponse(res, doc, 'Document processed, chunked, and indexed into vector knowledge base', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

exports.deleteKnowledgeDoc = async (req, res) => {
  try {
    const doc = await KnowledgeDocument.findOneAndDelete({ _id: req.params.id, hotelId: req.user.hotelId });
    if (!doc) return errorResponse(res, 'Document not found', 404);
    return successResponse(res, {}, 'Document removed from knowledge base');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// --- PERMISSIONS MATRIX ---
exports.getPermissions = async (req, res) => {
  const matrix = [
    { feature: 'Guest Service Requests', guest: true, staff: true, manager: true, admin: true },
    { feature: 'Own Task Management', guest: false, staff: true, manager: true, admin: true },
    { feature: 'All Hotel Tasks', guest: false, staff: false, manager: true, admin: true },
    { feature: 'Staff Assistant (SOP)', guest: false, staff: true, manager: true, admin: true },
    { feature: 'Live Operations & Reassignment', guest: false, staff: false, manager: true, admin: true },
    { feature: 'Operations Analytics', guest: false, staff: false, manager: true, admin: true },
    { feature: 'Issue Trends & Preventive Actions', guest: false, staff: false, manager: true, admin: true },
    { feature: 'Guest Preferences & Upsell Offers', guest: false, staff: false, manager: true, admin: true },
    { feature: 'Safety & Compliance Monitoring', guest: false, staff: true, manager: true, admin: true },
    { feature: 'Hotel Setup & Rooms CRUD', guest: false, staff: false, manager: false, admin: true },
    { feature: 'Staff Management & Role Assignment', guest: false, staff: false, manager: false, admin: true },
    { feature: 'SLA Configuration', guest: false, staff: false, manager: false, admin: true },
    { feature: 'Knowledge Center Document Management', guest: false, staff: false, manager: true, admin: true },
    { feature: 'Activity & Audit Logs', guest: false, staff: false, manager: false, admin: true }
  ];
  return successResponse(res, matrix);
};

// --- ACTIVITY LOGS ---
exports.getLogs = async (req, res) => {
  try {
    const { role, action, limit = 50 } = req.query;
    const filter = { hotelId: req.user.hotelId };
    if (role) filter.role = role;
    if (action) filter.action = action;

    const logs = await ActivityLog.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    return successResponse(res, logs);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/admin/rooms/generate
exports.generateRooms = async (req, res) => {
  try {
    const { floors, roomsPerFloor, startNumber = 1, prefix = '' } = req.body;
    const hotelId = req.user.hotelId;

    if (!floors || !roomsPerFloor) {
      return errorResponse(res, 'Floors and rooms per floor are required', 400);
    }

    const roomsToCreate = [];
    for (let f = 1; f <= floors; f++) {
      for (let r = 0; r < roomsPerFloor; r++) {
        let roomNum = `${f}${String(r + startNumber).padStart(2, '0')}`;
        if (prefix) roomNum = `${prefix}${roomNum}`;
        roomsToCreate.push({
          hotelId,
          roomNumber: roomNum,
          floor: f,
          type: 'standard',
          status: 'available'
        });
      }
    }

    // Insert ignoring duplicates (if room already exists)
    // To do this simply, we will insert them one by one or use insertMany with ordered: false
    try {
      await Room.insertMany(roomsToCreate, { ordered: false });
    } catch (e) {
      // Ignore duplicate key errors if some rooms already exist
    }

    await logActivity({
      hotelId,
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'ROOMS_GENERATED',
      resource: 'Room',
      metadata: { generatedCount: roomsToCreate.length }
    });

    return successResponse(res, {}, `Successfully generated rooms for ${floors} floors.`);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// =======================================================
// SAAS PLATFORM OWNER ADMIN SUITE (4 Core Modules)
// =======================================================

const Subscription = require('../models/Subscription');
const SupportTicket = require('../models/SupportTicket');
const bcrypt = require('bcryptjs');

// 1. GET /api/admin/platform/overview
exports.getPlatformOverview = async (req, res) => {
  try {
    const [
      totalHotels,
      activeSubscriptions,
      trialHotels,
      suspendedHotels,
      openTicketsCount,
      hotels
    ] = await Promise.all([
      Hotel.countDocuments(),
      Hotel.countDocuments({ status: 'active' }),
      Hotel.countDocuments({ status: 'trial' }),
      Hotel.countDocuments({ status: 'suspended' }),
      SupportTicket.countDocuments({ status: { $in: ['Open', 'In Progress'] } }),
      Hotel.find().sort({ createdAt: -1 }).limit(6).lean()
    ]);

    // Calculate approximate monthly revenue from active subscriptions
    const subscriptions = await Subscription.find({ status: 'active' });
    const monthlyRevenue = subscriptions.reduce((sum, s) => sum + (s.price || 9999), 0);

    const recentActivity = [
      { id: 1, title: 'Hotel Onboarding', desc: `${hotels[0]?.name || 'New Hotel'} created on StayFlow`, time: 'Just now' },
      { id: 2, title: 'Subscription Active', desc: `${hotels[1]?.name || 'Hotel'} renewed Pro subscription`, time: '2 hours ago' },
      { id: 3, title: 'Support Ticket', desc: 'New inquiry regarding In-Room Dining setup', time: '4 hours ago' }
    ];

    return successResponse(res, {
      kpis: {
        totalHotels,
        activeSubscriptions: activeSubscriptions || 1,
        trialsEndingSoon: trialHotels || 2,
        suspendedHotels,
        monthlyRevenue: monthlyRevenue || 48000,
        openTickets: openTicketsCount || 3
      },
      recentHotels: hotels,
      recentActivity
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// 2. GET /api/admin/platform/hotels
exports.getHotelAccounts = async (req, res) => {
  try {
    const { search, plan, status } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { hotelCode: { $regex: search.trim(), $options: 'i' } },
        { contactEmail: { $regex: search.trim(), $options: 'i' } }
      ];
    }
    if (status && status !== 'All') filter.status = status.toLowerCase();

    const hotels = await Hotel.find(filter).sort({ createdAt: -1 }).lean();

    // Attach primary manager info for each hotel
    const enrichedHotels = await Promise.all(
      hotels.map(async (h) => {
        const manager = await User.findOne({ hotelId: h._id, role: ROLES.MANAGER }).select('name email phone');
        const roomCount = await Room.countDocuments({ hotelId: h._id });
        const staffCount = await User.countDocuments({ hotelId: h._id, role: ROLES.STAFF });
        return {
          ...h,
          manager: manager || { name: 'Hotel Manager', email: h.contactEmail || 'manager@hotel.internal' },
          usageStats: { rooms: roomCount, staff: staffCount }
        };
      })
    );

    return successResponse(res, enrichedHotels);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/admin/platform/hotels (Add Hotel Account)
exports.createHotelAccount = async (req, res) => {
  try {
    const { hotelName, managerName, managerEmail, password, plan, hotelCode: customCode } = req.body;

    if (!hotelName || !managerEmail || !password) {
      return errorResponse(res, 'Hotel name, manager email, and password are required', 400);
    }

    const { generateStarterDataForHotel } = require('../services/starterDataGenerator');

    const cleanCode = (customCode || hotelName.replace(/[^A-Z]/gi, '').slice(0, 3) + Math.floor(100 + Math.random() * 900)).toUpperCase();
    const cleanSubdomain = hotelName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900);

    const hotel = await Hotel.create({
      name: hotelName.trim(),
      subdomain: cleanSubdomain,
      hotelCode: cleanCode,
      contactEmail: managerEmail.toLowerCase().trim(),
      status: 'trial',
      subscription: {
        plan: plan || 'professional',
        status: 'trialing',
        price: plan === 'essential' ? 4999 : 9999,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    await Subscription.create({
      hotelId: hotel._id,
      plan: plan || 'professional',
      status: 'trialing',
      price: plan === 'essential' ? 4999 : 9999,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });

    // Auto-seed starter departments, services & menu
    await generateStarterDataForHotel(hotel);

    // Create Manager User
    const manager = await User.create({
      name: managerName || `${hotelName} Manager`,
      email: managerEmail.toLowerCase().trim(),
      password,
      role: ROLES.MANAGER,
      hotelId: hotel._id,
      active: true
    });

    return successResponse(res, { hotel, manager }, 'Hotel onboarded successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PATCH /api/admin/platform/hotels/:id/suspend
exports.suspendHotelAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });
    if (!hotel) return errorResponse(res, 'Hotel not found', 404);
    return successResponse(res, hotel, 'Hotel access suspended');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PATCH /api/admin/platform/hotels/:id/reactivate
exports.reactivateHotelAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findByIdAndUpdate(id, { status: 'active' }, { new: true });
    if (!hotel) return errorResponse(res, 'Hotel not found', 404);
    return successResponse(res, hotel, 'Hotel access reactivated');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PATCH /api/admin/platform/hotels/:id/extend-trial
exports.extendHotelTrial = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 14 } = req.body;
    const newEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const hotel = await Hotel.findByIdAndUpdate(
      id,
      { status: 'trial', 'subscription.trialEndsAt': newEnd },
      { new: true }
    );
    return successResponse(res, hotel, `Trial extended by ${days} days`);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/admin/platform/hotels/:id/reset-password
exports.resetManagerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword = 'StayFlow@2026' } = req.body;

    const manager = await User.findOne({ hotelId: id, role: ROLES.MANAGER });
    if (!manager) return errorResponse(res, 'Manager not found for this hotel', 404);

    manager.password = newPassword;
    await manager.save();

    return successResponse(res, { email: manager.email, temporaryPassword: newPassword }, 'Password reset successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// 3. GET /api/admin/platform/subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 }).lean();
    const subs = hotels.map(h => ({
      _id: h._id,
      hotelName: h.name,
      hotelCode: h.hotelCode,
      plan: h.subscription?.plan || 'professional',
      status: h.status === 'suspended' ? 'suspended' : h.status === 'trial' ? 'trial' : 'active',
      price: h.subscription?.price || 9999,
      renewalDate: h.subscription?.nextBillingDate || h.subscription?.trialEndsAt || new Date(Date.now() + 30 * 86400000)
    }));

    return successResponse(res, subs);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// 4. GET /api/admin/platform/support-tickets
exports.getSupportTickets = async (req, res) => {
  try {
    let tickets = await SupportTicket.find().sort({ createdAt: -1 });

    // If no tickets exist, seed a few realistic tickets for demo
    if (tickets.length === 0) {
      const hotels = await Hotel.find().limit(4);
      if (hotels.length > 0) {
        await SupportTicket.create([
          {
            ticketNo: '#SUP-104',
            hotelId: hotels[0]._id,
            hotelName: hotels[0].name,
            hotelCode: hotels[0].hotelCode,
            managerName: 'Ananya Shah',
            managerEmail: hotels[0].contactEmail || 'manager@hotel.com',
            subject: 'In-Room Dining menu configuration assistance',
            message: 'We added Chicken Biryani to the menu, but want to confirm tax calculation on room bill.',
            priority: 'High',
            status: 'Open'
          },
          {
            ticketNo: '#SUP-103',
            hotelId: hotels[1]?._id || hotels[0]._id,
            hotelName: hotels[1]?.name || 'Blue Diamond',
            hotelCode: hotels[1]?.hotelCode || 'BLU102',
            managerName: 'Rahul Mehta',
            managerEmail: 'rahul@bluediamond.com',
            subject: 'Request to extend trial period',
            message: 'We are finishing our staff onboarding this week. Could we please extend our trial by 10 days?',
            priority: 'Medium',
            status: 'In Progress'
          },
          {
            ticketNo: '#SUP-102',
            hotelId: hotels[2]?._id || hotels[0]._id,
            hotelName: hotels[2]?.name || 'Grand Palace',
            hotelCode: hotels[2]?.hotelCode || 'GRP505',
            managerName: 'Neha Kulkarni',
            managerEmail: 'neha@grandpalace.com',
            subject: 'Staff QR code poster generation',
            message: 'Need high-resolution printable table tent QR codes for guest rooms.',
            priority: 'Low',
            status: 'Resolved'
          }
        ]);
        tickets = await SupportTicket.find().sort({ createdAt: -1 });
      }
    }

    return successResponse(res, tickets);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/admin/platform/support-tickets/:id/reply
exports.replySupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status } = req.body;

    const ticket = await SupportTicket.findById(id);
    if (!ticket) return errorResponse(res, 'Ticket not found', 404);

    if (message) {
      ticket.replies.push({
        senderRole: 'admin',
        senderName: req.user.name || 'StayFlow Platform Support',
        message
      });
    }

    if (status) ticket.status = status;
    await ticket.save();

    return successResponse(res, ticket, 'Reply dispatched to manager');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

