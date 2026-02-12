module.exports = {
  ROLES: {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
  },

  ORDER_STATUS: {
    PENDING: 'pending',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  ERROR_MESSAGES: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'User not found',
    PRODUCT_NOT_FOUND: 'Product not found',
    INSUFFICIENT_STOCK: 'Insufficient stock available',
    INVALID_INPUT: 'Invalid input provided',
    CART_EMPTY: 'Cart is empty',
    ORDER_NOT_FOUND: 'Order not found',
    DATABASE_ERROR: 'Database error',
    INVALID_TOKEN: 'Invalid or expired token',
  },
};