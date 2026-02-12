const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Welcome/Documentation endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Mini E-Commerce API',
    version: '1.0.0',
    documentation: {
      baseURL: 'http://localhost:3000',
      endpoints: {
        health: {
          url: '/api/health',
          method: 'GET',
          description: 'Check if API is running',
          auth: false
        },
        auth: {
          register: {
            url: '/api/auth/register',
            method: 'POST',
            description: 'Register a new user',
            auth: false,
            body: {
              name: 'string',
              email: 'string',
              password: 'string',
              confirm_password: 'string'
            }
          },
          login: {
            url: '/api/auth/login',
            method: 'POST',
            description: 'Login user and get JWT token',
            auth: false,
            body: {
              email: 'string',
              password: 'string'
            }
          },
          profile: {
            url: '/api/auth/profile',
            method: 'GET',
            description: 'Get current user profile',
            auth: true,
            role: 'customer/admin'
          },
          getAllUsers: {
            url: '/api/auth/users',
            method: 'GET',
            description: 'Get all users (Admin only)',
            auth: true,
            role: 'admin'
          }
        },
        products: {
          getAll: {
            url: '/api/products',
            method: 'GET',
            description: 'Get all products',
            auth: false
          },
          getById: {
            url: '/api/products/:id',
            method: 'GET',
            description: 'Get single product by ID',
            auth: false
          },
          create: {
            url: '/api/products',
            method: 'POST',
            description: 'Create new product (Admin only)',
            auth: true,
            role: 'admin',
            body: {
              name: 'string',
              description: 'string',
              price: 'number',
              stock: 'number'
            }
          },
          update: {
            url: '/api/products/:id',
            method: 'PUT',
            description: 'Update product (Admin only)',
            auth: true,
            role: 'admin',
            body: {
              name: 'string (optional)',
              description: 'string (optional)',
              price: 'number (optional)',
              stock: 'number (optional)'
            }
          },
          delete: {
            url: '/api/products/:id',
            method: 'DELETE',
            description: 'Delete product (Admin only)',
            auth: true,
            role: 'admin'
          }
        },
        cart: {
          addItem: {
            url: '/api/cart/add',
            method: 'POST',
            description: 'Add product to cart',
            auth: true,
            body: {
              product_id: 'number',
              quantity: 'number'
            }
          },
          getCart: {
            url: '/api/cart',
            method: 'GET',
            description: 'View shopping cart',
            auth: true
          },
          updateItem: {
            url: '/api/cart/:cartItemId',
            method: 'PUT',
            description: 'Update cart item quantity',
            auth: true,
            body: {
              quantity: 'number'
            }
          },
          removeItem: {
            url: '/api/cart/:cartItemId',
            method: 'DELETE',
            description: 'Remove item from cart',
            auth: true
          },
          clearCart: {
            url: '/api/cart',
            method: 'DELETE',
            description: 'Clear entire cart',
            auth: true
          }
        },
        orders: {
          placeOrder: {
            url: '/api/orders',
            method: 'POST',
            description: 'Place a new order',
            auth: true,
            body: {
              items: [
                {
                  product_id: 'number',
                  quantity: 'number'
                }
              ]
            }
          },
          getMyOrders: {
            url: '/api/orders/my-orders',
            method: 'GET',
            description: 'Get current user orders',
            auth: true
          },
          getOrder: {
            url: '/api/orders/:id',
            method: 'GET',
            description: 'Get single order by ID',
            auth: true
          },
          getAllOrders: {
            url: '/api/orders',
            method: 'GET',
            description: 'Get all orders (Admin only)',
            auth: true,
            role: 'admin'
          },
          updateStatus: {
            url: '/api/orders/:id/status',
            method: 'PUT',
            description: 'Update order status (Admin only)',
            auth: true,
            role: 'admin',
            body: {
              status: 'pending | shipped | delivered | cancelled'
            }
          }
        }
      },
      authentication: {
        type: 'Bearer Token (JWT)',
        headerFormat: 'Authorization: Bearer YOUR_TOKEN',
        exampleToken: 'Get token from /api/auth/login endpoint'
      },
      sampleCredentials: {
        admin: {
          email: 'admin@example.com',
          password: 'admin123'
        }
      },
      statusCodes: {
        200: 'Success',
        201: 'Created',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        500: 'Server Error'
      }
    }
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
    availableEndpoints: 'Visit http://localhost:3000 for full documentation'
  });
});

module.exports = app;