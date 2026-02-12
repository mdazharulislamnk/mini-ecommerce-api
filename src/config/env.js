require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mini_ecommerce',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_secret_key',
    expiration: process.env.JWT_EXPIRATION || '7d',
  },
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
};