const jwt = require('jsonwebtoken');
const config = require('../config/env');

const jwtHelper = {
  generateToken: (userId, email, role) => {
    return jwt.sign(
      { userId, email, role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiration }
    );
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return null;
    }
  },

  decodeToken: (token) => {
    return jwt.decode(token);
  },
};

module.exports = jwtHelper;