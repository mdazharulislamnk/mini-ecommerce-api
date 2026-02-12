const pool = require('../config/database');
const { ORDER_STATUS } = require('../utils/constants');

class Order {
  static async create(userId, totalAmount, status = ORDER_STATUS.PENDING) {
    try {
      const [result] = await pool.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
        [userId, totalAmount, status]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findById(orderId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByIdAndUser(orderId, userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [orderId, userId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT o.*, u.name, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(orderId, status) {
    try {
      const [result] = await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getOrderWithItems(orderId) {
    try {
      const [rows] = await pool.query(
        `SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE o.id = ?`,
        [orderId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order;