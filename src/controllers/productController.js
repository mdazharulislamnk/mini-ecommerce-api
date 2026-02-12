const Product = require('../models/Product');
const validators = require('../utils/validators');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

const productController = {
  // Create product (admin only)
  create: async (req, res) => {
    try {
      const { error, value } = validators.validate(req.body, validators.productSchema);

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

      const result = await Product.create(
        value.name,
        value.description,
        value.price,
        value.stock
      );

      const newProduct = await Product.findById(result.insertId);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct,
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Get all products
  getAll: async (req, res) => {
    try {
      const products = await Product.findAll();

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products,
        total: products.length,
      });
    } catch (error) {
      console.error('Get all products error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Get single product
  getById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Update product (admin only)
  update: async (req, res) => {
    try {
      const { error, value } = validators.validate(req.body, validators.productUpdateSchema);

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

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
        });
      }

      await Product.update(req.params.id, value);
      const updatedProduct = await Product.findById(req.params.id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },

  // Delete product (admin only)
  delete: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND,
        });
      }

      await Product.delete(req.params.id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.DATABASE_ERROR,
      });
    }
  },
};

module.exports = productController;