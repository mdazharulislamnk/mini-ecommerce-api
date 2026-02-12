const User = require('../models/User');
const jwtHelper = require('../utils/jwtHelper');
const validators = require('../utils/validators');
const { HTTP_STATUS, ERROR_MESSAGES, ROLES } = require('../utils/constants');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { error, value } = validators.validate(
        req.body,
        validators.registerSchema
      );

      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message,
          })),
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(value.email);
      if (existingUser) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: ERROR_MESSAGES.USER_EXISTS,
        });
      }

      // Create user
      await User.create(value.name, value.email, value.password, ROLES.CUSTOMER);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'User registered successfully',
        data: {
          email: value.email,
          name: value.name,
          role: ROLES.CUSTOMER,
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { error, value } = validators.validate(req.body, validators.loginSchema);

      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message,
          })),
        });
      }

      // Find user
      const user = await User.findByEmail(value.email);
      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
      }

      // Verify password
      const isPasswordValid = await User.comparePassword(
        value.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
      }

      // Generate token
      const token = jwtHelper.generateToken(user.id, user.email, user.role);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAllUsers();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        total: users.length,
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },
};

module.exports = authController;