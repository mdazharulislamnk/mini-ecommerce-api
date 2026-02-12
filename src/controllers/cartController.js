const Cart = require('../models/Cart');
const Product = require('../models/Product');
const validators = require('../utils/validators');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

const cartController = {
  // Add item to cart
  addItem: async (req, res) => {
    try {
      const { error, value } = validators.validate(req.body, validators.addToCartSchema);

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

      // Check if product exists
      const product = await Product.findById(value.product_id);
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
        });
      }

      // Check stock
      if (product.stock < value.quantity) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: ERROR_MESSAGES.INSUFFICIENT_STOCK,
          data: {
            requested: value.quantity,
            available: product.stock,
          },
        });
      }

      // Add to cart
      await Cart.addItem(req.user.userId, value.product_id, value.quantity);
      const cart = await Cart.getCart(req.user.userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Item added to cart successfully',
        data: cart,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Get cart
  getCart: async (req, res) => {
    try {
      const cart = await Cart.getCart(req.user.userId);

      if (cart.length === 0) {
        return res.status(HTTP_STATUS.OK).json({
          success: true,
          message: 'Cart is empty',
          data: [],
          total: 0,
          itemCount: 0,
        });
      }

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
        total: parseFloat(total.toFixed(2)),
        itemCount: cart.length,
      });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Update cart item quantity
  updateItem: async (req, res) => {
    try {
      const { error, value } = validators.validate(req.body, validators.updateCartSchema);

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

      // Get cart item to check product
      const cart = await Cart.getCart(req.user.userId);
      const cartItem = cart.find(item => item.id === parseInt(req.params.cartItemId));

      if (!cartItem) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Cart item not found',
        });
      }

      // Check stock
      if (cartItem.stock < value.quantity) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: ERROR_MESSAGES.INSUFFICIENT_STOCK,
          data: {
            requested: value.quantity,
            available: cartItem.stock,
          },
        });
      }

      await Cart.updateItemQuantity(req.user.userId, req.params.cartItemId, value.quantity);
      const updatedCart = await Cart.getCart(req.user.userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Cart item updated successfully',
        data: updatedCart,
      });
    } catch (error) {
      console.error('Update cart item error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Remove item from cart
  removeItem: async (req, res) => {
    try {
      const result = await Cart.removeItem(req.user.userId, req.params.cartItemId);

      if (result.affectedRows === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Cart item not found',
        });
      }

      const cart = await Cart.getCart(req.user.userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: cart,
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Clear cart
  clearCart: async (req, res) => {
    try {
      await Cart.clearCart(req.user.userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Cart cleared successfully',
        data: [],
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },
};

module.exports = cartController;