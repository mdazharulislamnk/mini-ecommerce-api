const pool = require('../config/database');

class Cart {
  static async addItem(userId, productId, quantity) {
    try {
      // Check if item already exists in cart
      const [existing] = await pool.query(
        'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      if (existing.length > 0) {
        // Update quantity if exists
        const [result] = await pool.query(
          'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
          [quantity, userId, productId]
        );
        return result;
      } else {
        // Insert new item
        const [result] = await pool.query(
          'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [userId, productId, quantity]
        );
        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  static async getCart(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.stock
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async removeItem(userId, cartItemId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
        [cartItemId, userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateItemQuantity(userId, cartItemId, quantity) {
    try {
      const [result] = await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, cartItemId, userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async clearCart(userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM cart_items WHERE user_id = ?',
        [userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getCartItemCount(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?',
        [userId]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cart;