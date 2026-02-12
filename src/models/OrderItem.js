const pool = require('../config/database');

class OrderItem {
  static async create(orderId, productId, quantity, price) {
    try {
      const [result] = await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, productId, quantity, price]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findByOrderId(orderId) {
    try {
      const [rows] = await pool.query(
        `SELECT oi.*, p.name, p.description
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async deleteByOrderId(orderId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM order_items WHERE order_id = ?',
        [orderId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderItem;