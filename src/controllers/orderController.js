const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const validators = require('../utils/validators');
const { HTTP_STATUS, ERROR_MESSAGES, ORDER_STATUS, ROLES } = require('../utils/constants');

const orderController = {
  // Place order
  placeOrder: async (req, res) => {
    const connection = await require('../config/database').getConnection();

    try {
      await connection.beginTransaction();

      const { error, value } = validators.validate(req.body, validators.placeOrderSchema);

      if (error) {
        await connection.rollback();
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message,
          })),
        });
      }

      let totalAmount = 0;
      const orderItems = [];

      // Validate all items and calculate total
      for (const item of value.items) {
        const product = await Product.findById(item.product_id);

        if (!product) {
          await connection.rollback();
          return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: `Product with ID ${item.product_id} not found`,
          });
        }

        if (product.stock < item.quantity) {
          await connection.rollback();
          return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: ERROR_MESSAGES.INSUFFICIENT_STOCK,
            data: {
              productId: item.product_id,
              requested: item.quantity,
              available: product.stock,
            },
          });
        }

        totalAmount += product.price * item.quantity;
        orderItems.push({
          productId: item.product_id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
        [req.user.userId, totalAmount, ORDER_STATUS.PENDING]
      );

      const orderId = orderResult.insertId;

      // Create order items and update stock
      for (const item of orderItems) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );

        // Deduct stock
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }

      // Clear user's cart
      await connection.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.userId]);

      await connection.commit();

      const order = await Order.findById(orderId);
      const items = await OrderItem.findByOrderId(orderId);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Order placed successfully',
        data: {
          order,
          items,
        },
      });
    } catch (error) {
      await connection.rollback();
      console.error('Place order error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    } finally {
      connection.release();
    }
  },

  // Get user's orders
  getMyOrders: async (req, res) => {
    try {
      const orders = await Order.findByUserId(req.user.userId);

      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.findByOrderId(order.id);
          return {
            ...order,
            items,
          };
        })
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: ordersWithItems,
        total: ordersWithItems.length,
      });
    } catch (error) {
      console.error('Get my orders error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Get single order
  getOrder: async (req, res) => {
    try {
      const order = await Order.findByIdAndUser(req.params.id, req.user.userId);

      if (!order) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.ORDER_NOT_FOUND,
        });
      }

      const items = await OrderItem.findByOrderId(order.id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Order retrieved successfully',
        data: {
          ...order,
          items,
        },
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Get all orders (admin only)
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.findAll();

      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.findByOrderId(order.id);
          return {
            ...order,
            items,
          };
        })
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'All orders retrieved successfully',
        data: ordersWithItems,
        total: ordersWithItems.length,
      });
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Update order status (admin only)
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;

      if (!Object.values(ORDER_STATUS).includes(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Invalid order status',
          validStatuses: Object.values(ORDER_STATUS),
        });
      }

      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.ORDER_NOT_FOUND,
        });
      }

      await Order.updateStatus(req.params.id, status);
      const updatedOrder = await Order.findById(req.params.id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder,
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },
};

module.exports = orderController;