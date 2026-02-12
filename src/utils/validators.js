const Joi = require('joi');

const validators = {
  // User validation schemas
  registerSchema: Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(100),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
  }),

  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Product validation schemas
  productSchema: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10),
    price: Joi.number().required().positive(),
    stock: Joi.number().required().integer().min(0),
  }),

  productUpdateSchema: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().min(10),
    price: Joi.number().positive(),
    stock: Joi.number().integer().min(0),
  }).min(1),

  // Cart validation schemas
  addToCartSchema: Joi.object({
    product_id: Joi.number().required().positive(),
    quantity: Joi.number().required().positive().integer(),
  }),

  updateCartSchema: Joi.object({
    quantity: Joi.number().required().positive().integer(),
  }),

  // Order validation schemas
  placeOrderSchema: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.number().required(),
        quantity: Joi.number().required().positive().integer(),
      })
    ).required().min(1),
  }),

  // Validate input against schema
  validate: (data, schema) => {
    return schema.validate(data, { abortEarly: false });
  },
};

module.exports = validators;