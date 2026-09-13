const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Subscription = require('../models/Subscription');
const Department = require('../models/Department');
const { successResponse, errorResponse } = require('../utils/response');
const { logActivity } = require('../utils/logger');
const { ROLES, HOTEL_STATUS, SUBSCRIPTION_PLANS } = require('../config/constants');
const { generateStarterDataForHotel } = require('../services/starterDataGenerator');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      hotelId: user.hotelId,
      role: user.role
    },
    process.env.JWT_SECRET || 'stayflow_super_secret_key_2024',
    { expiresIn: '30d' }
  );
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, hotelCode } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide email/login ID and password', 400, 'VALIDATION_ERROR');
    }

    const cleanEmail = email.toLowerCase().trim();

    // Support both dot format (e.g. rahul.staff.com, rahul.hotel.com) and standard email format (rahul@staff.com, rahul@hotel.com)
    let emailVariants = [cleanEmail];
    if (cleanEmail.includes('@')) {
      emailVariants.push(cleanEmail.replace('@', '.'));
    } else {
      // If it contains dots, generate @ equivalents
      emailVariants.push(cleanEmail.replace('.', '@'));
      const lastDot = cleanEmail.lastIndexOf('.');
      if (lastDot > 0) {
        const secondLastDot = cleanEmail.lastIndexOf('.', lastDot - 1);
        if (secondLastDot > 0) {
          emailVariants.push(cleanEmail.slice(0, secondLastDot) + '@' + cleanEmail.slice(secondLastDot + 1));
        }
      }
    }
    emailVariants = [...new Set(emailVariants)];

    let query = { email: { $in: emailVariants } };

    // Verify hotel by hotel code if provided
    if (hotelCode && hotelCode.trim()) {
      const hotel = await Hotel.findOne({ hotelCode: hotelCode.toUpperCase().trim() });
      if (!hotel) {
        return errorResponse(res, `Hotel with code "${hotelCode.toUpperCase().trim()}" not found. Please verify your Hotel Code.`, 404, 'HOTEL_NOT_FOUND');
      }
      query.hotelId = hotel._id;
    }

    let users = await User.find(query).populate('hotelId', 'name hotelCode status logo subscription');

    // If no hotelCode was provided but multiple accounts exist, prompt for hotelCode
    if (!hotelCode && users.length > 1) {
      return errorResponse(res, 'Multiple hotel workspaces found with this ID. Please enter your Hotel Code.', 400, 'HOTEL_CODE_REQUIRED');
    }

    if (!users || users.length === 0) {
      return errorResponse(res, hotelCode ? 'Invalid login ID/email, password, or hotel code' : 'Invalid login ID or password', 401, 'INVALID_CREDENTIALS');
    }

    const user = users[0];

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.active) {
      return errorResponse(res, 'Account is deactivated. Please contact hotel administrator.', 403, 'ACCOUNT_DISABLED');
    }

    // Check hotel status
    if (user.hotelId?.status === HOTEL_STATUS.SUSPENDED) {
      return errorResponse(res, 'Hotel subscription suspended. Contact support.', 403, 'HOTEL_SUSPENDED');
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    await logActivity({
      hotelId: user.hotelId?._id || user.hotelId,
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user._id,
      ipAddress: req.ip
    });

    return successResponse(res, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        roomNumber: user.roomNumber,
        preferences: user.preferences
      },
      role: user.role,
      hotelId: user.hotelId?._id || user.hotelId,
      hotelName: user.hotelId?.name || 'StayFlow Hotel',
      hotelCode: user.hotelId?.hotelCode || 'SFGP'
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, error.message, 500);
  }
};

// @route POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { 
      hotelName, hotelType, rooms, address, city, state, contactNumber, hotelEmail,
      name, email, password, phone, plan = 'professional' 
    } = req.body;

    if (!hotelName || !name || !email || !password) {
      return errorResponse(res, 'Required fields missing', 400, 'VALIDATION_ERROR');
    }

    // Generate unique code and subdomain
    const cleanSubdomain = hotelName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) + Math.floor(100 + Math.random() * 900);
    const hotelCode = (hotelName.replace(/[^A-Z]/gi, '').slice(0, 3) + Math.floor(100 + Math.random() * 900)).toUpperCase();

    // 1. Create Hotel
    const hotel = await Hotel.create({
      name: hotelName,
      hotelType: hotelType || '',
      subdomain: cleanSubdomain,
      hotelCode,
      address: {
        street: address || '',
        city: city || '',
        state: state || '',
        country: 'India'
      },
      contactEmail: hotelEmail || email.toLowerCase(),
      contactPhone: contactNumber || phone || '',
      status: HOTEL_STATUS.TRIAL,
      limits: {
        maxRooms: parseInt(rooms) || 100,
        maxStaff: 50,
        maxRequestsPerMonth: 5000,
        maxAICallsPerMonth: 2000,
        maxStorageGB: 10
      },
      subscription: {
        plan: plan || SUBSCRIPTION_PLANS.PROFESSIONAL,
        status: 'trialing',
        price: plan === 'essential' ? 4999 : 9999
      }
    });

    // 2. Create Subscription record
    await Subscription.create({
      hotelId: hotel._id,
      plan: plan || SUBSCRIPTION_PLANS.PROFESSIONAL,
      status: 'trialing',
      price: plan === 'essential' ? 4999 : 9999
    });

    // 3. Generate Starter Data
    await generateStarterDataForHotel(hotel);

    // 4. Create Manager User
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || contactNumber || '',
      role: ROLES.MANAGER,
      hotelId: hotel._id,
      active: true
    });

    const token = generateToken(user);

    await logActivity({
      hotelId: hotel._id,
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'HOTEL_ONBOARDED',
      resource: 'Hotel',
      resourceId: hotel._id,
      metadata: { hotelCode, plan, rooms }
    });

    return successResponse(res, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      role: user.role,
      hotelId: hotel._id,
      hotelName: hotel.name,
      hotelCode: hotel.hotelCode
    }, 'Hotel and manager account registered successfully', 201);
  } catch (error) {
    console.error('Signup error:', error);
    return errorResponse(res, error.message, 500);
  }
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('hotelId', 'name hotelCode status logo subscription facilities supportedLanguages slaSettings');

    return successResponse(res, {
      user,
      role: user.role,
      hotelId: user.hotelId?._id,
      hotel: user.hotelId
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Demo reset token
  return successResponse(res, {
    message: 'If that email is registered, a password reset link has been dispatched.',
    demoResetToken: 'demo-reset-token-' + Date.now()
  });
};

// @route POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  return successResponse(res, {}, 'Password reset successfully. You can now log in.');
};

// @route GET /api/auth/demo-accounts
exports.getDemoAccounts = async (req, res) => {
  try {
    const defaultHotel = await Hotel.findOne({ hotelCode: 'SFGP' }) || await Hotel.findOne();
    return successResponse(res, {
      hotelCode: defaultHotel?.hotelCode || 'SFGP',
      hotelName: defaultHotel?.name || 'StayFlow Grand Pune',
      accounts: [
        { role: 'admin', email: 'admin@stayflow.demo', label: 'Administrator', desc: 'Hotel setup, rooms, staff & SLA config' },
        { role: 'manager', email: 'manager@stayflow.demo', label: 'Hotel Manager', desc: 'Live operations, analytics, trends & safety' },
        { role: 'staff', email: 'staff@stayflow.demo', label: 'Maintenance Staff', desc: 'Active tasks, SLA countdowns & SOP Assistant' },
        { role: 'guest', email: 'guest@stayflow.demo', roomNumber: '312', label: 'Guest (Room 312)', desc: 'Concierge RAG, service catalog & issue reporting' }
      ],
      password: 'StayFlow@2026'
    });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
