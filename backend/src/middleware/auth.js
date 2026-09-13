const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token provided', 401, 'AUTH_REQUIRED');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stayflow_super_secret_key_2024');
    
    // Decoded token contains { userId, hotelId, role }
    const user = await User.findById(decoded.userId || decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User no longer exists', 401, 'USER_NOT_FOUND');
    }

    if (!user.active) {
      return errorResponse(res, 'User account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }

    req.user = user;
    // Guarantee req.user.hotelId is an ObjectId
    req.user.hotelId = user.hotelId;
    req.user.userId = user._id;

    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized, token failed or expired', 401, 'INVALID_TOKEN');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, `Forbidden: Role '${req.user?.role}' cannot access this resource`, 403, 'FORBIDDEN');
    }
    next();
  };
};

module.exports = { protect, authorize };
