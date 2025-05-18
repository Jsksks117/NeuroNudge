const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authService = {
  async register(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const user = new User(userData);
      await user.save();

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = authService; 