const pool = require('../config/database');

class Product {
  static async create(name, description, price, stock) {
    try {
      const [result] = await pool.query(
        'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
        [name, description, price, stock]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findById(productId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM products WHERE id = ?',
        [productId]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(productId, updateData) {
    try {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updateData)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }

      values.push(productId);

      const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(productId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM products WHERE id = ?',
        [productId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateStock(productId, quantity) {
    try {
      const [result] = await pool.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [quantity, productId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async restoreStock(productId, quantity) {
    try {
      const [result] = await pool.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [quantity, productId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;