const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.warn('❌ Handshake Blocked: No Security Token provided');
    return res.status(401).json({ success: false, message: 'Mission Denied: No Security Token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn('❌ Handshake Blocked: Authorized User not found in DB');
      return res.status(401).json({ success: false, message: 'Mission Denied: User Identity Lost' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.warn('❌ Handshake Blocked: Token Signature Mismatch or Expired:', err.message);
    return res.status(401).json({ success: false, message: `Mission Denied: Signature Mismatch (${err.message})` });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
