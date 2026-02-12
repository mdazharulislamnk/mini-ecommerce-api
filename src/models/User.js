const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../utils/constants');

class User {
  static async create(name, email, password, role = ROLES.CUSTOMER) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [userId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAllUsers() {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, role, created_at FROM users'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;